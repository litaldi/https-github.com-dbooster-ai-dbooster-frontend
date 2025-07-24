import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SessionValidationRequest {
  sessionId: string;
  deviceFingerprint: string;
  ipAddress?: string;
  userAgent?: string;
  action?: 'validate' | 'rotate' | 'invalidate' | 'check_concurrent';
}

interface SessionSecurityData {
  sessionId: string;
  userId: string;
  deviceFingerprint: string;
  ipAddress: string;
  userAgent: string;
  securityScore: number;
  lastValidation: string;
  expiresAt: string;
  isValid: boolean;
  flags: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { sessionId, deviceFingerprint, ipAddress, userAgent, action = 'validate' } = 
      await req.json() as SessionValidationRequest;

    console.log(`Session security action: ${action} for session: ${sessionId}`);

    switch (action) {
      case 'validate':
        return await validateSession(supabase, sessionId, deviceFingerprint, ipAddress, userAgent);
      
      case 'rotate':
        return await rotateSession(supabase, sessionId, deviceFingerprint, ipAddress, userAgent);
      
      case 'invalidate':
        return await invalidateSession(supabase, sessionId);
      
      case 'check_concurrent':
        return await checkConcurrentSessions(supabase, sessionId);
      
      default:
        throw new Error('Invalid action specified');
    }

  } catch (error) {
    console.error('Session security error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function validateSession(
  supabase: any, 
  sessionId: string, 
  deviceFingerprint: string, 
  ipAddress?: string, 
  userAgent?: string
) {
  // Get session from secure_session_validation table
  const { data: sessionData, error } = await supabase
    .from('secure_session_validation')
    .select('*')
    .eq('session_id', sessionId)
    .single();

  if (error || !sessionData) {
    return new Response(
      JSON.stringify({ 
        valid: false, 
        reason: 'Session not found',
        securityScore: 0
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Check if session is expired
  if (new Date(sessionData.expires_at) < new Date()) {
    return new Response(
      JSON.stringify({ 
        valid: false, 
        reason: 'Session expired',
        securityScore: 0
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Calculate security score
  let securityScore = 60; // Base score
  const flags: string[] = [];

  // Device fingerprint validation
  if (sessionData.device_fingerprint === deviceFingerprint) {
    securityScore += 20;
  } else {
    flags.push('device_fingerprint_mismatch');
    securityScore -= 15;
  }

  // IP address validation
  if (ipAddress && sessionData.ip_address === ipAddress) {
    securityScore += 15;
  } else if (ipAddress) {
    flags.push('ip_address_change');
    securityScore -= 10;
  }

  // User agent validation
  if (userAgent && sessionData.user_agent === userAgent) {
    securityScore += 5;
  } else if (userAgent) {
    flags.push('user_agent_change');
  }

  // Update last validation timestamp
  await supabase
    .from('secure_session_validation')
    .update({ 
      last_validation: new Date().toISOString(),
      security_score: securityScore,
      suspicious_activity_count: flags.length > 0 ? sessionData.suspicious_activity_count + 1 : sessionData.suspicious_activity_count
    })
    .eq('session_id', sessionId);

  // Log security event if suspicious
  if (securityScore < 70 || flags.length > 0) {
    await supabase
      .from('comprehensive_security_log')
      .insert({
        user_id: sessionData.user_id,
        event_type: 'suspicious_session_activity',
        event_category: 'session_security',
        severity: securityScore < 50 ? 'high' : 'medium',
        event_data: {
          session_id: sessionId,
          security_score: securityScore,
          flags: flags,
          device_fingerprint_match: sessionData.device_fingerprint === deviceFingerprint,
          ip_match: sessionData.ip_address === ipAddress
        },
        ip_address: ipAddress,
        user_agent: userAgent,
        risk_score: 100 - securityScore
      });
  }

  const isValid = securityScore >= 60;

  return new Response(
    JSON.stringify({
      valid: isValid,
      securityScore,
      flags,
      reason: isValid ? 'Session validated successfully' : 'Session failed security validation'
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function rotateSession(
  supabase: any,
  oldSessionId: string,
  deviceFingerprint: string,
  ipAddress?: string,
  userAgent?: string
) {
  // Get existing session
  const { data: oldSession, error } = await supabase
    .from('secure_session_validation')
    .select('*')
    .eq('session_id', oldSessionId)
    .single();

  if (error || !oldSession) {
    return new Response(
      JSON.stringify({ error: 'Session not found for rotation' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Generate new session ID
  const newSessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Create new session record
  const { error: insertError } = await supabase
    .from('secure_session_validation')
    .insert({
      session_id: newSessionId,
      user_id: oldSession.user_id,
      device_fingerprint: deviceFingerprint,
      ip_address: ipAddress || oldSession.ip_address,
      user_agent: userAgent || oldSession.user_agent,
      expires_at: expiresAt.toISOString(),
      security_score: 80, // Fresh session gets good score
      last_validation: new Date().toISOString()
    });

  if (insertError) {
    throw insertError;
  }

  // Invalidate old session
  await supabase
    .from('secure_session_validation')
    .delete()
    .eq('session_id', oldSessionId);

  // Log session rotation
  await supabase
    .from('comprehensive_security_log')
    .insert({
      user_id: oldSession.user_id,
      event_type: 'session_rotation',
      event_category: 'session_security',
      severity: 'info',
      event_data: {
        old_session_id: oldSessionId,
        new_session_id: newSessionId,
        rotation_reason: 'security_rotation'
      },
      ip_address: ipAddress,
      user_agent: userAgent
    });

  return new Response(
    JSON.stringify({
      success: true,
      newSessionId,
      expiresAt: expiresAt.toISOString()
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function invalidateSession(supabase: any, sessionId: string) {
  // Get session info before deletion for logging
  const { data: sessionData } = await supabase
    .from('secure_session_validation')
    .select('user_id')
    .eq('session_id', sessionId)
    .single();

  // Delete session
  const { error } = await supabase
    .from('secure_session_validation')
    .delete()
    .eq('session_id', sessionId);

  if (error) {
    throw error;
  }

  // Log session invalidation
  if (sessionData) {
    await supabase
      .from('comprehensive_security_log')
      .insert({
        user_id: sessionData.user_id,
        event_type: 'session_invalidation',
        event_category: 'session_security',
        severity: 'info',
        event_data: {
          session_id: sessionId,
          invalidation_reason: 'explicit_invalidation'
        }
      });
  }

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function checkConcurrentSessions(supabase: any, sessionId: string) {
  // Get user ID from session
  const { data: sessionData, error } = await supabase
    .from('secure_session_validation')
    .select('user_id')
    .eq('session_id', sessionId)
    .single();

  if (error || !sessionData) {
    return new Response(
      JSON.stringify({ error: 'Session not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Count active sessions for user
  const { data: activeSessions, error: countError } = await supabase
    .from('secure_session_validation')
    .select('session_id, ip_address, user_agent, last_validation')
    .eq('user_id', sessionData.user_id)
    .gt('expires_at', new Date().toISOString());

  if (countError) {
    throw countError;
  }

  const sessionCount = activeSessions?.length || 0;
  const maxAllowedSessions = 5; // Configurable limit

  // If too many sessions, invalidate oldest ones
  if (sessionCount > maxAllowedSessions) {
    const sessionsToRemove = activeSessions
      .sort((a, b) => new Date(a.last_validation).getTime() - new Date(b.last_validation).getTime())
      .slice(0, sessionCount - maxAllowedSessions);

    for (const session of sessionsToRemove) {
      await supabase
        .from('secure_session_validation')
        .delete()
        .eq('session_id', session.session_id);
    }

    // Log concurrent session limit enforcement
    await supabase
      .from('comprehensive_security_log')
      .insert({
        user_id: sessionData.user_id,
        event_type: 'concurrent_session_limit_enforced',
        event_category: 'session_security',
        severity: 'warning',
        event_data: {
          total_sessions: sessionCount,
          removed_sessions: sessionsToRemove.length,
          max_allowed: maxAllowedSessions
        }
      });
  }

  return new Response(
    JSON.stringify({
      activeSessions: Math.min(sessionCount, maxAllowedSessions),
      maxAllowed: maxAllowedSessions,
      limitEnforced: sessionCount > maxAllowedSessions
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}