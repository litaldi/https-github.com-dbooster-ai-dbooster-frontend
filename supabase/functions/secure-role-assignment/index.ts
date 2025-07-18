
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RoleAssignmentRequest {
  targetUserId: string;
  newRole: 'admin' | 'moderator' | 'user';
  reason?: string;
}

function validateUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

function validateRole(role: string): role is 'admin' | 'moderator' | 'user' {
  return ['admin', 'moderator', 'user'].includes(role);
}

function sanitizeInput(input: string): string {
  return input.replace(/[<>\"'&]/g, '').trim().substring(0, 1000);
}

async function getUserIP(request: Request): Promise<string> {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'unknown';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Validate request method
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }), 
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    // Verify user authentication
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse and validate request body
    let requestBody: RoleAssignmentRequest;
    try {
      const rawBody = await req.text();
      if (rawBody.length > 10000) { // 10KB limit
        throw new Error('Request body too large');
      }
      requestBody = JSON.parse(rawBody);
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate required fields
    if (!requestBody.targetUserId || !requestBody.newRole) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: targetUserId, newRole' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate UUID format
    if (!validateUUID(requestBody.targetUserId)) {
      return new Response(
        JSON.stringify({ error: 'Invalid UUID format for targetUserId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate role
    if (!validateRole(requestBody.newRole)) {
      return new Response(
        JSON.stringify({ error: 'Invalid role. Must be admin, moderator, or user' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Sanitize reason if provided
    const sanitizedReason = requestBody.reason ? sanitizeInput(requestBody.reason) : null;

    // Get user IP and user agent for security logging
    const userIP = await getUserIP(req);
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Call the secure role assignment function
    const { data, error } = await supabaseClient.rpc('secure_role_assignment_with_monitoring', {
      target_user_id: requestBody.targetUserId,
      new_role: requestBody.newRole,
      change_reason: sanitizedReason,
      requester_ip: userIP,
      user_agent_header: userAgent
    });

    if (error) {
      console.error('Role assignment error:', error);
      return new Response(
        JSON.stringify({ error: 'Role assignment failed' }),
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
