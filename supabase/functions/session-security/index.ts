
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SessionValidationRequest {
  sessionId: string;
  deviceFingerprint: string;
  action: 'validate' | 'rotate' | 'terminate';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const requestBody: SessionValidationRequest = await req.json()
    const userIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const userAgent = req.headers.get('user-agent') || 'unknown'

    // Enhanced device fingerprinting
    const enhancedFingerprint = {
      original: requestBody.deviceFingerprint,
      ip: userIP,
      userAgent: userAgent,
      timestamp: new Date().toISOString(),
      sessionId: requestBody.sessionId
    }

    switch (requestBody.action) {
      case 'validate':
        // Validate session with enhanced security checks
        const { data: sessionData } = await supabaseClient
          .from('secure_session_validation')
          .select('*')
          .eq('session_id', requestBody.sessionId)
          .eq('user_id', user.id)
          .single()

        if (!sessionData) {
          return new Response(
            JSON.stringify({ valid: false, reason: 'Session not found' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Check for session anomalies
        const isAnomalous = sessionData.device_fingerprint !== requestBody.deviceFingerprint ||
                           sessionData.ip_address !== userIP ||
                           new Date(sessionData.expires_at) < new Date()

        if (isAnomalous) {
          // Log security event
          await supabaseClient
            .from('comprehensive_security_log')
            .insert({
              user_id: user.id,
              event_type: 'session_anomaly_detected',
              event_category: 'security_violation',
              severity: 'high',
              event_data: enhancedFingerprint,
              ip_address: userIP,
              user_agent: userAgent,
              risk_score: 85
            })

          return new Response(
            JSON.stringify({ valid: false, reason: 'Session anomaly detected', requiresReauth: true }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Update last validation
        await supabaseClient
          .from('secure_session_validation')
          .update({ last_validation: new Date().toISOString() })
          .eq('id', sessionData.id)

        return new Response(
          JSON.stringify({ valid: true, securityScore: sessionData.security_score }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'rotate':
        // Implement session rotation
        const newSessionId = crypto.randomUUID()
        
        await supabaseClient
          .from('secure_session_validation')
          .update({
            session_id: newSessionId,
            device_fingerprint: requestBody.deviceFingerprint,
            security_score: Math.min((sessionData?.security_score || 50) + 10, 100),
            last_validation: new Date().toISOString()
          })
          .eq('session_id', requestBody.sessionId)
          .eq('user_id', user.id)

        return new Response(
          JSON.stringify({ success: true, newSessionId }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'terminate':
        // Terminate session
        await supabaseClient
          .from('secure_session_validation')
          .delete()
          .eq('session_id', requestBody.sessionId)
          .eq('user_id', user.id)

        await supabaseClient
          .from('comprehensive_security_log')
          .insert({
            user_id: user.id,
            event_type: 'session_terminated',
            event_category: 'authentication',
            severity: 'info',
            event_data: { sessionId: requestBody.sessionId },
            ip_address: userIP,
            user_agent: userAgent
          })

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

  } catch (error) {
    console.error('Session security error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
