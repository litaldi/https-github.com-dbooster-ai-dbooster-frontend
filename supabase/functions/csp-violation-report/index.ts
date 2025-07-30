import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const violationReport = await req.json();

    // Extract relevant information from CSP violation report
    const cspReport = violationReport['csp-report'] || violationReport;
    
    // Log CSP violation for security monitoring
    await supabase.from('security_events_enhanced').insert({
      event_type: 'csp_violation',
      severity: 'medium',
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
      user_agent: req.headers.get('user-agent') || 'unknown',
      event_data: {
        blocked_uri: cspReport['blocked-uri'],
        document_uri: cspReport['document-uri'],
        violated_directive: cspReport['violated-directive'],
        effective_directive: cspReport['effective-directive'],
        original_policy: cspReport['original-policy'],
        source_file: cspReport['source-file'],
        line_number: cspReport['line-number'],
        column_number: cspReport['column-number']
      },
      threat_score: calculateThreatScore(cspReport),
      auto_blocked: true
    });

    // Check if this is a high-risk violation
    const isHighRisk = isHighRiskViolation(cspReport);
    if (isHighRisk) {
      console.warn('High-risk CSP violation detected:', cspReport);
      
      // Could implement additional alerting here
      // e.g., send to security team, trigger incident response
    }

    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });

  } catch (error) {
    console.error('Error processing CSP violation report:', error);
    return new Response(null, {
      status: 500,
      headers: corsHeaders
    });
  }
});

function calculateThreatScore(cspReport: any): number {
  let score = 10; // Base score

  // Increase score based on violation type
  if (cspReport['violated-directive']?.includes('script-src')) {
    score += 30; // Script violations are high risk
  }
  
  if (cspReport['blocked-uri']?.includes('javascript:')) {
    score += 40; // Inline JavaScript execution attempts
  }
  
  if (cspReport['blocked-uri']?.includes('data:')) {
    score += 20; // Data URIs can be suspicious
  }
  
  if (cspReport['blocked-uri']?.startsWith('http://')) {
    score += 15; // Insecure HTTP resources
  }

  return Math.min(score, 100);
}

function isHighRiskViolation(cspReport: any): boolean {
  // Check for patterns that indicate potential attacks
  const highRiskPatterns = [
    'javascript:',
    'data:text/html',
    'vbscript:',
    'about:blank',
    'chrome-extension://',
    'moz-extension://'
  ];

  const blockedUri = cspReport['blocked-uri'] || '';
  return highRiskPatterns.some(pattern => blockedUri.includes(pattern));
}