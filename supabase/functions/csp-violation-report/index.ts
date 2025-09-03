import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'

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
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const violationData = await req.json()
    
    // Extract client IP from headers
    const clientIP = req.headers.get('cf-connecting-ip') || 
                     req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     '0.0.0.0'

    // Add client IP and user agent to violation data
    const enrichedData = {
      ...violationData,
      client_ip: clientIP,
      user_agent: req.headers.get('user-agent') || 'unknown',
      timestamp: new Date().toISOString()
    }

    console.log('CSP Violation Report:', {
      ip: clientIP,
      userAgent: req.headers.get('user-agent'),
      violation: violationData
    })

    // Use the secure function to report violation
    const { data, error } = await supabase.rpc('report_csp_violation', {
      violation_data: enrichedData
    })

    if (error) {
      console.error('Failed to store CSP violation:', error)
      
      // Check if it's a rate limit error
      if (error.message?.includes('Rate limit exceeded')) {
        return new Response(
          JSON.stringify({ success: false, error: 'Rate limit exceeded' }),
          { 
            status: 429, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }
      
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to store violation' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('CSP violation handler error:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})