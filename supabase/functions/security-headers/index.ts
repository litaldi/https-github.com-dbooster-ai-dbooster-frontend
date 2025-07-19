
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const SECURITY_HEADERS = {
  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com",
    "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co https://api.ipify.org wss://*.supabase.co",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; '),
  
  // Security headers
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'interest-cohort=()',
    'payment=()',
    'usb=()'
  ].join(', '),
  
  // CORS headers for secure API access
  'Access-Control-Allow-Origin': '*', // Will be restricted in production
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400',
  
  // Additional security headers
  'X-Permitted-Cross-Domain-Policies': 'none',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'cross-origin'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: SECURITY_HEADERS
    })
  }

  try {
    const { action, data } = await req.json()
    
    let response: any = { success: false }

    switch (action) {
      case 'validate_headers':
        response = {
          success: true,
          headers: SECURITY_HEADERS,
          timestamp: new Date().toISOString()
        }
        break
        
      case 'check_security':
        const userAgent = req.headers.get('user-agent') || ''
        const origin = req.headers.get('origin') || ''
        
        response = {
          success: true,
          security_check: {
            user_agent: userAgent,
            origin: origin,
            secure_connection: req.headers.get('x-forwarded-proto') === 'https',
            headers_present: Object.keys(SECURITY_HEADERS).length
          }
        }
        break
        
      default:
        response = {
          success: false,
          error: 'Unknown action'
        }
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...SECURITY_HEADERS
      }
    })
    
  } catch (error) {
    console.error('Security headers function error:', error)
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...SECURITY_HEADERS
      }
    })
  }
})
