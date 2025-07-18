
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SessionValidationRequest {
  sessionId: string;
  deviceFingerprint: string;
}

function validateSessionId(sessionId: string): boolean {
  return typeof sessionId === 'string' && sessionId.length >= 10 && sessionId.length <= 200;
}

function sanitizeFingerprint(fingerprint: string): string {
  return fingerprint.replace(/[^a-zA-Z0-9\-_]/g, '').substring(0, 500);
}

async function getUserIP(request: Request): Promise<string> {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'unknown';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }), 
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

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

    let requestBody: SessionValidationRequest;
    try {
      const rawBody = await req.text();
      if (rawBody.length > 5000) {
        throw new Error('Request body too large');
      }
      requestBody = JSON.parse(rawBody);
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!requestBody.sessionId || !requestBody.deviceFingerprint) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!validateSessionId(requestBody.sessionId)) {
      return new Response(
        JSON.stringify({ error: 'Invalid session ID format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const sanitizedFingerprint = sanitizeFingerprint(requestBody.deviceFingerprint);
    const userIP = await getUserIP(req);
    const userAgent = req.headers.get('user-agent') || 'unknown';

    const { data, error } = await supabaseClient.rpc('validate_session_security', {
      p_session_id: requestBody.sessionId,
      p_device_fingerprint: sanitizedFingerprint,
      p_ip_address: userIP,
      p_user_agent: userAgent
    });

    if (error) {
      console.error('Session validation error:', error);
      return new Response(
        JSON.stringify({ error: 'Session validation failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify(data),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
