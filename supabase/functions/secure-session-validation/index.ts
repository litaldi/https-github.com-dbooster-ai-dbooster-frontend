
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { sessionId, deviceFingerprint, ipAddress, userAgent } = await req.json()

    // Get the authenticated user
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate session in database
    const { data: session, error: sessionError } = await supabaseClient
      .from('enhanced_session_tracking')
      .select('*')
      .eq('session_id', sessionId)
      .eq('user_id', user.id)
      .single()

    if (sessionError || !session) {
      return new Response(
        JSON.stringify({ valid: false, reason: 'Session not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if session is expired
    if (new Date(session.expires_at) < new Date()) {
      // Mark session as expired
      await supabaseClient
        .from('enhanced_session_tracking')
        .update({ status: 'expired' })
        .eq('id', session.id)

      return new Response(
        JSON.stringify({ valid: false, reason: 'Session expired' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate device fingerprint
    if (session.device_fingerprint && session.device_fingerprint !== deviceFingerprint) {
      // Log suspicious activity
      await supabaseClient.from('security_audit_log').insert({
        user_id: user.id,
        event_type: 'device_fingerprint_mismatch',
        event_data: {
          session_id: sessionId,
          expected_fingerprint: session.device_fingerprint.substring(0, 8),
          actual_fingerprint: deviceFingerprint.substring(0, 8)
        },
        ip_address: ipAddress
      })

      // Mark session as suspicious
      await supabaseClient
        .from('enhanced_session_tracking')
        .update({ status: 'suspicious' })
        .eq('id', session.id)

      return new Response(
        JSON.stringify({ valid: false, reason: 'Device fingerprint mismatch' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update last activity
    await supabaseClient
      .from('enhanced_session_tracking')
      .update({ 
        last_activity: new Date().toISOString(),
        ip_address: ipAddress,
        user_agent: userAgent
      })
      .eq('id', session.id)

    return new Response(
      JSON.stringify({ valid: true, sessionData: session }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
