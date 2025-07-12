
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { input, context, validationType } = await req.json()

    // Server-side input validation and sanitization
    const validationResult = await validateInput(input, validationType, context)
    
    // Log security event
    if (validationResult.hasThreats) {
      await supabase.from('security_audit_log').insert({
        event_type: 'security_validation_threat_detected',
        event_data: {
          validationType,
          threatTypes: validationResult.threatTypes,
          input: input.substring(0, 100), // Only log first 100 chars
          context
        },
        ip_address: req.headers.get('x-forwarded-for') || 'unknown',
        user_agent: req.headers.get('user-agent')
      })
    }

    return new Response(
      JSON.stringify(validationResult),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Security validation error:', error)
    return new Response(
      JSON.stringify({ error: 'Validation failed', hasThreats: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

async function validateInput(input: string, validationType: string, context: string) {
  const threats: string[] = []
  let sanitizedInput = input

  // SQL Injection patterns
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER)\b)/gi,
    /(UNION\s+SELECT)/gi,
    /(\|\||&&|--|\#)/g,
    /(script|javascript|vbscript)/gi
  ]

  // XSS patterns
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<[^>]*>/g
  ]

  // Command injection patterns
  const commandPatterns = [
    /(\||;|&|`|\$\(|\$\{)/g,
    /(rm\s|cat\s|ls\s|ps\s|kill\s|sudo\s)/gi
  ]

  // Check for SQL injection
  if (validationType === 'database' || validationType === 'general') {
    for (const pattern of sqlPatterns) {
      if (pattern.test(input)) {
        threats.push('sql_injection')
        break
      }
    }
  }

  // Check for XSS
  if (validationType === 'html' || validationType === 'general') {
    for (const pattern of xssPatterns) {
      if (pattern.test(input)) {
        threats.push('xss_attempt')
        sanitizedInput = sanitizedInput.replace(pattern, '')
      }
    }
  }

  // Check for command injection
  if (validationType === 'system' || validationType === 'general') {
    for (const pattern of commandPatterns) {
      if (pattern.test(input)) {
        threats.push('command_injection')
        break
      }
    }
  }

  // Path traversal
  if (input.includes('../') || input.includes('..\\')) {
    threats.push('path_traversal')
  }

  return {
    isValid: threats.length === 0,
    hasThreats: threats.length > 0,
    threatTypes: threats,
    sanitizedInput,
    riskLevel: threats.length > 2 ? 'high' : threats.length > 0 ? 'medium' : 'low'
  }
}
