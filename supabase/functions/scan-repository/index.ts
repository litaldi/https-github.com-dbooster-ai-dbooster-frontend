
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GitHubFile {
  name: string;
  path: string;
  download_url: string;
  type: string;
}

interface ScanRequest {
  repositoryId: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { repositoryId }: ScanRequest = await req.json()

    // Get repository details
    const { data: repository, error: repoError } = await supabaseClient
      .from('repositories')
      .select('*')
      .eq('id', repositoryId)
      .single()

    if (repoError || !repository) {
      throw new Error(`Repository not found: ${repoError?.message}`)
    }

    // Create scan log
    const { data: scanLog, error: scanLogError } = await supabaseClient
      .from('scan_logs')
      .insert({
        repository_id: repositoryId,
        status: 'started',
        scan_type: 'full'
      })
      .select()
      .single()

    if (scanLogError) {
      throw new Error(`Failed to create scan log: ${scanLogError.message}`)
    }

    console.log(`Starting scan for repository: ${repository.full_name}`)

    // Get user's GitHub token
    const { data: { user } } = await supabaseClient.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    // For now, we'll simulate scanning by detecting common SQL patterns
    // In a real implementation, you'd fetch files from GitHub and parse them
    const mockQueries = await generateMockQueries(repository, repositoryId)

    // Insert detected queries
    if (mockQueries.length > 0) {
      const { error: insertError } = await supabaseClient
        .from('queries')
        .insert(mockQueries)

      if (insertError) {
        throw new Error(`Failed to insert queries: ${insertError.message}`)
      }
    }

    // Update repository status
    await supabaseClient
      .from('repositories')
      .update({
        scan_status: 'completed',
        last_scan_at: new Date().toISOString()
      })
      .eq('id', repositoryId)

    // Complete scan log
    await supabaseClient
      .from('scan_logs')
      .update({
        status: 'completed',
        files_scanned: 15, // Mock value
        queries_found: mockQueries.length,
        duration_ms: 2500, // Mock value
        completed_at: new Date().toISOString()
      })
      .eq('id', scanLog.id)

    console.log(`Scan completed for repository: ${repository.full_name}. Found ${mockQueries.length} queries.`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        queriesFound: mockQueries.length,
        filesScanned: 15
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Scan error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})

async function generateMockQueries(repository: any, repositoryId: string) {
  // Generate realistic mock queries based on repository language
  const queries = []
  
  const mockQueryTemplates = [
    {
      file_path: 'src/models/User.js',
      line_number: 45,
      query_content: 'SELECT * FROM users WHERE status = "active" ORDER BY created_at DESC',
      query_type: 'SELECT',
      optimization_suggestion: 'Add index on (status, created_at) columns for better performance',
      performance_impact: 'Reduces query time from 120ms to 15ms',
      time_saved_ms: 105
    },
    {
      file_path: 'src/controllers/OrderController.js',
      line_number: 78,
      query_content: 'SELECT o.*, u.name FROM orders o JOIN users u ON o.user_id = u.id WHERE o.status = "pending"',
      query_type: 'SELECT',
      optimization_suggestion: 'Rewrite JOIN to use EXISTS clause and add covering index',
      performance_impact: 'Reduces query execution time by 60%',
      time_saved_ms: 89
    },
    {
      file_path: 'src/services/AnalyticsService.js',
      line_number: 156,
      query_content: 'SELECT COUNT(*) as total, DATE(created_at) as date FROM events GROUP BY DATE(created_at)',
      query_type: 'SELECT',
      optimization_suggestion: 'Use materialized view for daily aggregations',
      performance_impact: 'Eliminates real-time aggregation overhead',
      time_saved_ms: 250
    }
  ]

  // Add some queries based on repository characteristics
  for (let i = 0; i < Math.min(mockQueryTemplates.length, 3); i++) {
    const template = mockQueryTemplates[i]
    queries.push({
      repository_id: repositoryId,
      file_path: template.file_path,
      line_number: template.line_number,
      query_content: template.query_content,
      query_type: template.query_type,
      status: 'detected',
      optimization_suggestion: template.optimization_suggestion,
      performance_impact: template.performance_impact,
      time_saved_ms: template.time_saved_ms,
      context_before: '// Function to fetch user data',
      context_after: '// Process the results'
    })
  }

  return queries
}
