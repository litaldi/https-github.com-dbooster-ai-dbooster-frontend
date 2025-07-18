
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DemoSession {
  id: string;
  token: string;
  device_fingerprint: string;
  created_at: string;
  expires_at: string;
  security_score: number;
  user_agent: string;
  is_active: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, sessionId, deviceFingerprint, token, securityScore, userAgent } = await req.json()

    console.log(`Demo session ${action} request:`, { sessionId: sessionId?.substring(0, 8), action })

    switch (action) {
      case 'create':
        return await createSession(supabase, sessionId, deviceFingerprint, securityScore, userAgent)
      
      case 'validate':
        return await validateSession(supabase, sessionId, token, deviceFingerprint, userAgent)
      
      case 'revoke':
        return await revokeSession(supabase, sessionId)
      
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('Demo session error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function createSession(
  supabase: any,
  sessionId: string,
  deviceFingerprint: string,
  securityScore: number,
  userAgent: string
) {
  try {
    // Generate secure token
    const token = await generateSecureToken()
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours

    // Check for existing sessions from same fingerprint
    const { data: existingSessions } = await supabase
      .from('demo_sessions')
      .select('id')
      .eq('device_fingerprint', deviceFingerprint)
      .eq('is_active', true)

    if (existingSessions && existingSessions.length >= 3) {
      return new Response(
        JSON.stringify({ error: 'Too many active sessions from this device' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create session record
    const { error } = await supabase
      .from('demo_sessions')
      .insert({
        id: sessionId,
        token: await hashToken(token),
        device_fingerprint: deviceFingerprint,
        expires_at: expiresAt.toISOString(),
        security_score: securityScore,
        user_agent: userAgent,
        is_active: true
      })

    if (error) {
      console.error('Failed to create demo session:', error)
      throw error
    }

    console.log(`Demo session created: ${sessionId.substring(0, 8)}`)

    return new Response(
      JSON.stringify({ 
        token,
        expiresAt: expiresAt.getTime(),
        securityLevel: securityScore >= 80 ? 'high' : securityScore >= 60 ? 'medium' : 'low'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Create session error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to create session' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function validateSession(
  supabase: any,
  sessionId: string,
  token: string,
  deviceFingerprint: string,
  userAgent: string
) {
  try {
    const hashedToken = await hashToken(token)

    // Get session
    const { data: session, error } = await supabase
      .from('demo_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('is_active', true)
      .single()

    if (error || !session) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          reason: 'Session not found' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check expiration
    if (new Date() > new Date(session.expires_at)) {
      await supabase
        .from('demo_sessions')
        .update({ is_active: false })
        .eq('id', sessionId)

      return new Response(
        JSON.stringify({ 
          valid: false, 
          reason: 'Session expired' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify token
    if (session.token !== hashedToken) {
      console.log('Token mismatch for session:', sessionId.substring(0, 8))
      return new Response(
        JSON.stringify({ 
          valid: false, 
          reason: 'Invalid token' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify device fingerprint (allow some tolerance)
    const fingerprintMatch = calculateFingerprintSimilarity(session.device_fingerprint, deviceFingerprint)
    if (fingerprintMatch < 0.8) {
      console.log('Fingerprint mismatch for session:', sessionId.substring(0, 8))
      return new Response(
        JSON.stringify({ 
          valid: false, 
          reason: 'Device fingerprint mismatch' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update last activity
    await supabase
      .from('demo_sessions')
      .update({ 
        last_activity: new Date().toISOString(),
        user_agent: userAgent
      })
      .eq('id', sessionId)

    console.log(`Demo session validated: ${sessionId.substring(0, 8)}`)

    return new Response(
      JSON.stringify({ 
        valid: true,
        securityLevel: session.security_score >= 80 ? 'high' : session.security_score >= 60 ? 'medium' : 'low'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Validate session error:', error)
    return new Response(
      JSON.stringify({ 
        valid: false, 
        reason: 'Validation error' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function revokeSession(supabase: any, sessionId: string) {
  try {
    const { error } = await supabase
      .from('demo_sessions')
      .update({ is_active: false })
      .eq('id', sessionId)

    if (error) {
      throw error
    }

    console.log(`Demo session revoked: ${sessionId.substring(0, 8)}`)

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Revoke session error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to revoke session' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function generateSecureToken(): Promise<string> {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(token)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

function calculateFingerprintSimilarity(stored: string, current: string): number {
  if (stored === current) return 1.0
  
  const longer = stored.length > current.length ? stored : current
  const shorter = stored.length > current.length ? current : stored
  
  if (longer.length === 0) return 1.0
  
  const editDistance = levenshteinDistance(longer, shorter)
  return (longer.length - editDistance) / longer.length
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix = []
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }
  
  return matrix[str2.length][str1.length]
}
