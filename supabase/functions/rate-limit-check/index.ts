
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RateLimitRecord {
  identifier: string;
  action: string;
  attempts: number;
  window_start: string;
  last_attempt: string;
  blocked_until?: string;
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

    const { identifier, action, config } = await req.json()
    const now = new Date()
    const windowStart = new Date(now.getTime() - config.windowMs)

    console.log(`Rate limit check for ${action}:${identifier.substring(0, 8)}`)

    // Get or create rate limit record
    let { data: record, error } = await supabase
      .from('rate_limit_records')
      .select('*')
      .eq('identifier', identifier)
      .eq('action', action)
      .single()

    if (error && error.code !== 'PGRST116') { // Not found error
      throw error
    }

    if (!record) {
      // Create new record
      const { data: newRecord, error: insertError } = await supabase
        .from('rate_limit_records')
        .insert({
          identifier,
          action,
          attempts: 1,
          window_start: now.toISOString(),
          last_attempt: now.toISOString()
        })
        .select()
        .single()

      if (insertError) {
        throw insertError
      }

      return new Response(
        JSON.stringify({
          allowed: true,
          remaining: config.maxAttempts - 1,
          resetTime: now.getTime() + config.windowMs
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if currently blocked
    if (record.blocked_until && new Date(record.blocked_until) > now) {
      console.log(`Request blocked until ${record.blocked_until}`)
      return new Response(
        JSON.stringify({
          allowed: false,
          remaining: 0,
          resetTime: new Date(record.blocked_until).getTime(),
          reason: 'Rate limit exceeded - temporarily blocked'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if window has expired
    if (new Date(record.window_start) < windowStart) {
      // Reset the window
      const { error: updateError } = await supabase
        .from('rate_limit_records')
        .update({
          attempts: 1,
          window_start: now.toISOString(),
          last_attempt: now.toISOString(),
          blocked_until: null
        })
        .eq('identifier', identifier)
        .eq('action', action)

      if (updateError) {
        throw updateError
      }

      return new Response(
        JSON.stringify({
          allowed: true,
          remaining: config.maxAttempts - 1,
          resetTime: now.getTime() + config.windowMs
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Increment attempts
    const newAttempts = record.attempts + 1
    let blockedUntil = null

    // Check if limit exceeded
    if (newAttempts > config.maxAttempts) {
      blockedUntil = new Date(now.getTime() + config.blockDurationMs).toISOString()
      
      console.log(`Rate limit exceeded for ${action}:${identifier.substring(0, 8)}, blocking until ${blockedUntil}`)

      // Log violation
      await supabase
        .from('security_events_enhanced')
        .insert({
          event_type: 'rate_limit_violation',
          severity: 'medium',
          event_data: {
            identifier: identifier.substring(0, 8),
            action,
            attempts: newAttempts,
            max_attempts: config.maxAttempts,
            blocked: true
          }
        })
    }

    // Update record
    const { error: updateError } = await supabase
      .from('rate_limit_records')
      .update({
        attempts: newAttempts,
        last_attempt: now.toISOString(),
        blocked_until: blockedUntil
      })
      .eq('identifier', identifier)
      .eq('action', action)

    if (updateError) {
      throw updateError
    }

    const allowed = newAttempts <= config.maxAttempts
    const remaining = Math.max(0, config.maxAttempts - newAttempts)
    const resetTime = blockedUntil ? 
      new Date(blockedUntil).getTime() : 
      new Date(record.window_start).getTime() + config.windowMs

    return new Response(
      JSON.stringify({
        allowed,
        remaining,
        resetTime,
        reason: allowed ? undefined : 'Rate limit exceeded'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Rate limit check error:', error)
    
    // Fail secure - deny request if rate limiting fails
    return new Response(
      JSON.stringify({
        allowed: false,
        remaining: 0,
        resetTime: Date.now() + 60000, // 1 minute
        reason: 'Rate limiting service error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
