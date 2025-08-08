import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const origin = req.headers.get('origin') || '*';
  const corsHeaders = {
    'Access-Control-Allow-Origin': origin,
    'Vary': 'Origin',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid authentication' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let body: any;
    try {
      const raw = await req.text();
      if (raw.length > 5000) {
        return new Response(JSON.stringify({ error: 'Request body too large' }), {
          status: 413,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      body = JSON.parse(raw);
    } catch (_e) {
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const violationReport = body['violationReport'] || body['csp-report'] || body;
    const cspReport = {
      blocked_uri: violationReport['blocked-uri'] || violationReport.blockedURI || '',
      document_uri: violationReport['document-uri'] || violationReport.documentURI || '',
      violated_directive: violationReport['violated-directive'] || violationReport.violatedDirective || '',
      effective_directive: violationReport['effective-directive'] || violationReport.effectiveDirective || '',
      original_policy: violationReport['original-policy'] || violationReport.originalPolicy || '',
      source_file: violationReport['source-file'] || violationReport.source_file || '',
      line_number: violationReport['line-number'] || violationReport.line_number || null,
      column_number: violationReport['column-number'] || violationReport.column_number || null,
    };

    const threatScore = calculateThreatScore(cspReport);
    const severity = threatScore >= 70 ? 'high' : threatScore >= 40 ? 'medium' : 'low';

    await supabase.from('security_events_enhanced').insert({
      event_type: 'csp_violation',
      severity,
      user_id: user.id,
      ip_address: req.headers.get('x-forwarded-for') || null,
      user_agent: req.headers.get('user-agent') || null,
      event_data: cspReport,
      threat_score: threatScore,
      auto_blocked: threatScore >= 70,
    });

    return new Response(null, { status: 204, headers: corsHeaders });
  } catch (error) {
    console.error('Error processing CSP violation report:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function calculateThreatScore(cspReport: any): number {
  let score = 10; // Base score

  if (String(cspReport.violated_directive || '').includes('script-src')) score += 30;
  if (String(cspReport.blocked_uri || '').includes('javascript:')) score += 40;
  if (String(cspReport.blocked_uri || '').includes('data:')) score += 20;
  if (String(cspReport.blocked_uri || '').startsWith('http://')) score += 15;

  return Math.min(score, 100);
}
