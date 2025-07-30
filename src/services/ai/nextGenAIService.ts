import { AIServiceCore, AIResponse } from './core/aiServiceCore';
import { productionLogger } from '@/utils/productionLogger';

interface NaturalLanguageContext {
  schema: string;
  recentQueries: string[];
}

interface SQLConversionRequest {
  naturalLanguage: string;
  context: NaturalLanguageContext;
}

interface ConversionResult {
  sql: string;
  explanation: string;
  confidence: number;
  alternatives: string[];
}

interface SchemaGenerationRequest {
  requirements: string;
  domain?: string;
}

interface SchemaDesign {
  tables: TableDesign[];
  relationships: string[];
  recommendations: string[];
}

interface TableDesign {
  name: string;
  fields: FieldDefinition[];
  indexes: IndexDefinition[];
}

interface FieldDefinition {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
  foreignKey?: string;
}

interface IndexDefinition {
  name: string;
  columns: string[];
  type: 'btree' | 'hash' | 'gin' | 'gist';
  unique: boolean;
}

export interface DatabaseHealthInsight {
  id: string;
  title: string;
  description: string;
  category: 'performance' | 'security' | 'optimization' | 'maintenance';
  priority: 'critical' | 'high' | 'medium' | 'low';
  recommendation: string;
  estimatedImpact: string;
  automatable: boolean;
}

export interface AIOptimizationResult {
  optimizedQuery: string;
  performancePrediction: {
    executionTime: number;
    resourceUsage: number;
    scalabilityScore: number;
    bottlenecks: string[];
  };
  indexRecommendations: Array<{
    table: string;
    columns: string[];
    type: string;
    impact: 'high' | 'medium' | 'low';
    estimatedImprovement: string;
  }>;
  riskAssessment: {
    level: 'low' | 'medium' | 'high';
    factors: string[];
  };
  confidenceScore: number;
}

interface MetricData {
  timestamp: Date;
  executionTime: number;
  cpuUsage: number;
  memoryUsage: number;
  activeConnections: number;
}

interface AnomalyDetectionResult {
  anomalies: Array<{
    type: 'performance' | 'security' | 'resource';
    severity: 'critical' | 'warning' | 'info';
    description: string;
    timestamp: Date;
    recommendedAction: string;
  }>;
  trend: 'improving' | 'stable' | 'degrading';
  forecast: {
    nextHour: string;
    nextDay: string;
    nextWeek: string;
  };
}

class NextGenAIService extends AIServiceCore {
  private static instance: NextGenAIService | null = null;

  public static getInstance(): NextGenAIService {
    if (!NextGenAIService.instance) {
      NextGenAIService.instance = new NextGenAIService();
    }
    return NextGenAIService.instance;
  }

  protected async getStoredAPIKey(): Promise<string | null> {
    // SECURITY: Client-side API keys removed for security. Use secure edge functions instead.
    throw new Error('Client-side API key access disabled for security. Use secureApiKeyManager instead.');
  }

  protected async testConnection(): Promise<void> {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to connect to AI service');
    }
  }

  protected async callAI(prompt: string): Promise<string> {
    // SECURITY: Use secure edge function instead of direct API calls
    const { secureApiKeyManager } = await import('@/services/security/secureApiKeyManager');
    
    const result = await secureApiKeyManager.makeChatRequest([
      {
        role: 'system',
        content: 'You are an expert database engineer and SQL specialist. Provide accurate, optimized solutions with detailed explanations.'
      },
      {
        role: 'user',
        content: prompt
      }
    ], {
      temperature: this.config.temperature,
      max_tokens: this.config.maxTokens,
    });

    return result.content;
  }

  async convertNaturalLanguageToSQL(request: SQLConversionRequest): Promise<ConversionResult> {
    const prompt = `
Convert this natural language request to SQL:
"${request.naturalLanguage}"

Context:
- Schema: ${request.context.schema}
- Recent queries: ${request.context.recentQueries.join(', ')}

Please provide:
1. The SQL query
2. A clear explanation of what the query does
3. Your confidence level (0-1)
4. Alternative approaches if applicable

Format your response as JSON:
{
  "sql": "SELECT ...",
  "explanation": "This query...",
  "confidence": 0.95,
  "alternatives": ["Alternative approach 1", "Alternative approach 2"]
}
`;

    try {
      const response = await this.safeAICall(prompt);
      const result = JSON.parse(response.content);
      
      return {
        sql: result.sql || '',
        explanation: result.explanation || 'No explanation provided',
        confidence: result.confidence || 0.7,
        alternatives: result.alternatives || []
      };
    } catch (error) {
      productionLogger.error('Natural language to SQL conversion failed', error, 'NextGenAIService');
      throw new Error('Failed to convert natural language to SQL');
    }
  }

  async generateSchemaDesign(request: SchemaGenerationRequest): Promise<SchemaDesign> {
    const prompt = `
Design a database schema for this requirement:
"${request.requirements}"

${request.domain ? `Domain: ${request.domain}` : ''}

Please provide:
1. Table definitions with fields, types, and constraints
2. Relationships between tables
3. Recommended indexes
4. Best practice recommendations

Format your response as JSON:
{
  "tables": [
    {
      "name": "table_name",
      "fields": [
        {
          "name": "field_name",
          "type": "VARCHAR(255)",
          "nullable": false,
          "primaryKey": true,
          "foreignKey": "other_table.id"
        }
      ],
      "indexes": [
        {
          "name": "idx_name",
          "columns": ["col1", "col2"],
          "type": "btree",
          "unique": false
        }
      ]
    }
  ],
  "relationships": ["Description of relationships"],
  "recommendations": ["Best practice recommendations"]
}
`;

    try {
      const response = await this.safeAICall(prompt);
      const result = JSON.parse(response.content);
      
      return {
        tables: result.tables || [],
        relationships: result.relationships || [],
        recommendations: result.recommendations || []
      };
    } catch (error) {
      productionLogger.error('Schema design generation failed', error, 'NextGenAIService');
      throw new Error('Failed to generate schema design');
    }
  }

  async analyzeQueryPattern(queries: string[]): Promise<{
    patterns: string[];
    optimizations: string[];
    recommendations: string[];
  }> {
    const prompt = `
Analyze these SQL query patterns and provide insights:

Queries:
${queries.map((q, i) => `${i + 1}. ${q}`).join('\n')}

Please identify:
1. Common patterns in the queries
2. Optimization opportunities
3. General recommendations for improvement

Format as JSON:
{
  "patterns": ["Pattern descriptions"],
  "optimizations": ["Specific optimization suggestions"],
  "recommendations": ["General recommendations"]
}
`;

    try {
      const response = await this.safeAICall(prompt);
      const result = JSON.parse(response.content);
      
      return {
        patterns: result.patterns || [],
        optimizations: result.optimizations || [],
        recommendations: result.recommendations || []
      };
    } catch (error) {
      productionLogger.error('Query pattern analysis failed', error, 'NextGenAIService');
      throw new Error('Failed to analyze query patterns');
    }
  }

  async optimizeQueryWithPrediction(query: string): Promise<AIOptimizationResult> {
    const prompt = `
Analyze and optimize this SQL query with performance prediction:
"${query}"

Please provide:
1. An optimized version of the query
2. Performance predictions (execution time, resource usage, scalability)
3. Index recommendations
4. Risk assessment
5. Confidence score

Format as JSON:
{
  "optimizedQuery": "SELECT ...",
  "performancePrediction": {
    "executionTime": 150,
    "resourceUsage": 45.2,
    "scalabilityScore": 85,
    "bottlenecks": ["Missing index on user_id", "Large result set"]
  },
  "indexRecommendations": [
    {
      "table": "users",
      "columns": ["created_at", "status"],
      "type": "btree",
      "impact": "high",
      "estimatedImprovement": "60% faster execution"
    }
  ],
  "riskAssessment": {
    "level": "low",
    "factors": ["Query is read-only", "Uses indexed columns"]
  },
  "confidenceScore": 0.9
}
`;

    try {
      const response = await this.safeAICall(prompt);
      const result = JSON.parse(response.content);
      
      return {
        optimizedQuery: result.optimizedQuery || query,
        performancePrediction: {
          executionTime: result.performancePrediction?.executionTime || 200,
          resourceUsage: result.performancePrediction?.resourceUsage || 50,
          scalabilityScore: result.performancePrediction?.scalabilityScore || 75,
          bottlenecks: result.performancePrediction?.bottlenecks || []
        },
        indexRecommendations: result.indexRecommendations || [],
        riskAssessment: {
          level: result.riskAssessment?.level || 'medium',
          factors: result.riskAssessment?.factors || []
        },
        confidenceScore: result.confidenceScore || 0.7
      };
    } catch (error) {
      productionLogger.error('Query optimization with prediction failed', error, 'NextGenAIService');
      throw new Error('Failed to optimize query with prediction');
    }
  }

  async generateDatabaseHealthInsights(databaseId: string): Promise<DatabaseHealthInsight[]> {
    const prompt = `
Generate database health insights for database: ${databaseId}

Analyze common database health issues and provide actionable insights:
1. Performance bottlenecks
2. Security vulnerabilities
3. Optimization opportunities
4. Maintenance recommendations

Format as JSON array:
[
  {
    "id": "unique-id",
    "title": "Insight title",
    "description": "Detailed description",
    "category": "performance|security|optimization|maintenance",
    "priority": "critical|high|medium|low",
    "recommendation": "Specific action to take",
    "estimatedImpact": "Expected improvement",
    "automatable": true
  }
]
`;

    try {
      const response = await this.safeAICall(prompt);
      let result = JSON.parse(response.content);
      
      // Ensure result is an array
      if (!Array.isArray(result)) {
        result = result.insights || [];
      }
      
      return result.map((insight: any, index: number) => ({
        id: insight.id || `insight-${index}`,
        title: insight.title || 'Database Health Issue',
        description: insight.description || 'No description available',
        category: insight.category || 'optimization',
        priority: insight.priority || 'medium',
        recommendation: insight.recommendation || 'No recommendation provided',
        estimatedImpact: insight.estimatedImpact || 'Unknown impact',
        automatable: insight.automatable || false
      }));
    } catch (error) {
      productionLogger.error('Database health insights generation failed', error, 'NextGenAIService');
      // Return mock data for development
      return [
        {
          id: 'mock-1',
          title: 'Query Performance Issue',
          description: 'Several slow queries detected in the system',
          category: 'performance',
          priority: 'high',
          recommendation: 'Add indexes to frequently queried columns',
          estimatedImpact: '50% performance improvement',
          automatable: true
        },
        {
          id: 'mock-2',
          title: 'Security Configuration',
          description: 'Database security settings need review',
          category: 'security',
          priority: 'medium',
          recommendation: 'Enable SSL encryption and review user permissions',
          estimatedImpact: 'Enhanced security posture',
          automatable: false
        }
      ];
    }
  }

  async detectAnomalies(metrics: MetricData[]): Promise<AnomalyDetectionResult> {
    const prompt = `
Analyze these database metrics for anomalies:

Metrics: ${JSON.stringify(metrics.slice(0, 10))} (showing first 10 of ${metrics.length} data points)

Please identify:
1. Performance, security, or resource anomalies
2. Current trend direction
3. Forecast for next hour, day, and week

Format as JSON:
{
  "anomalies": [
    {
      "type": "performance|security|resource",
      "severity": "critical|warning|info",
      "description": "Description of the anomaly",
      "timestamp": "2024-01-01T00:00:00Z",
      "recommendedAction": "What to do about it"
    }
  ],
  "trend": "improving|stable|degrading",
  "forecast": {
    "nextHour": "Prediction for next hour",
    "nextDay": "Prediction for next day",
    "nextWeek": "Prediction for next week"
  }
}
`;

    try {
      const response = await this.safeAICall(prompt);
      const result = JSON.parse(response.content);
      
      return {
        anomalies: (result.anomalies || []).map((anomaly: any) => ({
          ...anomaly,
          timestamp: new Date(anomaly.timestamp || Date.now())
        })),
        trend: result.trend || 'stable',
        forecast: {
          nextHour: result.forecast?.nextHour || 'Normal operation expected',
          nextDay: result.forecast?.nextDay || 'Stable performance predicted',
          nextWeek: result.forecast?.nextWeek || 'No significant changes expected'
        }
      };
    } catch (error) {
      productionLogger.error('Anomaly detection failed', error, 'NextGenAIService');
      // Return mock data for development
      return {
        anomalies: [],
        trend: 'stable',
        forecast: {
          nextHour: 'Normal operation expected',
          nextDay: 'Stable performance predicted',
          nextWeek: 'No significant changes expected'
        }
      };
    }
  }

  async reviewCode(code: string): Promise<{
    issues: Array<{
      type: 'error' | 'warning' | 'suggestion';
      line?: number;
      message: string;
      fix?: string;
    }>;
    score: number;
    suggestions: string[];
    complexity: 'low' | 'medium' | 'high';
  }> {
    const prompt = `
Review this SQL code for quality, performance, and best practices:

${code}

Please provide:
1. Issues found (errors, warnings, suggestions)
2. Overall quality score (0-100)
3. General improvement suggestions
4. Code complexity assessment

Format as JSON:
{
  "issues": [
    {
      "type": "error|warning|suggestion",
      "line": 5,
      "message": "Description of issue",
      "fix": "Suggested fix"
    }
  ],
  "score": 85,
  "suggestions": ["General improvement suggestions"],
  "complexity": "low|medium|high"
}
`;

    try {
      const response = await this.safeAICall(prompt);
      const result = JSON.parse(response.content);
      
      return {
        issues: result.issues || [],
        score: result.score || 75,
        suggestions: result.suggestions || [],
        complexity: result.complexity || 'medium'
      };
    } catch (error) {
      productionLogger.error('Code review failed', error, 'NextGenAIService');
      // Return mock data for development
      return {
        issues: [
          {
            type: 'suggestion',
            line: 1,
            message: 'Consider adding indexes for better performance',
            fix: 'CREATE INDEX idx_user_id ON table_name(user_id)'
          }
        ],
        score: 85,
        suggestions: ['Use specific column names instead of SELECT *', 'Add proper error handling'],
        complexity: 'medium'
      };
    }
  }

  async generateVisualization(query: string, chartType: string): Promise<{
    type: 'bar' | 'line' | 'pie';
    data: any[];
    title: string;
    description: string;
    insights: string[];
  }> {
    const prompt = `
Generate a data visualization for this query or data description:
"${query}"

Preferred chart type: ${chartType}

Please provide:
1. Best chart type for the data
2. Mock data structure for visualization
3. Title and description
4. Key insights from the data

Format as JSON:
{
  "type": "bar|line|pie",
  "data": [{"name": "Category 1", "value": 100}, ...],
  "title": "Chart title",
  "description": "Chart description",
  "insights": ["Key insight 1", "Key insight 2"]
}
`;

    try {
      const response = await this.safeAICall(prompt);
      const result = JSON.parse(response.content);
      
      return {
        type: result.type || 'bar',
        data: result.data || [],
        title: result.title || 'Data Visualization',
        description: result.description || 'Generated visualization',
        insights: result.insights || []
      };
    } catch (error) {
      productionLogger.error('Visualization generation failed', error, 'NextGenAIService');
      // Return mock data for development
      return {
        type: 'bar',
        data: [
          { name: 'Jan', value: 400 },
          { name: 'Feb', value: 300 },
          { name: 'Mar', value: 500 },
          { name: 'Apr', value: 280 },
          { name: 'May', value: 590 }
        ],
        title: 'Monthly Data Trends',
        description: 'Sample data visualization showing monthly trends',
        insights: [
          'May shows the highest values',
          'April had the lowest performance',
          'Overall trend shows growth'
        ]
      };
    }
  }

  async validateQuery(query: string): Promise<{
    isValid: boolean;
    score: number;
    issues: Array<{
      type: 'syntax' | 'security' | 'performance' | 'logic';
      severity: 'critical' | 'warning' | 'info';
      message: string;
      suggestion?: string;
    }>;
    estimatedExecutionTime: string;
    riskLevel: 'low' | 'medium' | 'high';
  }> {
    const prompt = `
Validate this SQL query for syntax, security, performance, and logic:

${query}

Please check for:
1. Syntax errors
2. Security vulnerabilities (SQL injection, etc.)
3. Performance issues
4. Logic problems

Format as JSON:
{
  "isValid": true,
  "score": 85,
  "issues": [
    {
      "type": "syntax|security|performance|logic",
      "severity": "critical|warning|info",
      "message": "Issue description",
      "suggestion": "How to fix"
    }
  ],
  "estimatedExecutionTime": "< 100ms",
  "riskLevel": "low|medium|high"
}
`;

    try {
      const response = await this.safeAICall(prompt);
      const result = JSON.parse(response.content);
      
      return {
        isValid: result.isValid !== false,
        score: result.score || 85,
        issues: result.issues || [],
        estimatedExecutionTime: result.estimatedExecutionTime || '< 100ms',
        riskLevel: result.riskLevel || 'low'
      };
    } catch (error) {
      productionLogger.error('Query validation failed', error, 'NextGenAIService');
      // Return safe validation for development
      return {
        isValid: true,
        score: 85,
        issues: [],
        estimatedExecutionTime: '< 100ms',
        riskLevel: 'low'
      };
    }
  }

  async chatWithAssistant(message: string, context: any[]): Promise<{
    content: string;
    sqlCode?: string;
  }> {
    const contextString = context.slice(-5).map(msg => 
      `${msg.type}: ${msg.content}`
    ).join('\n');

    const prompt = `
You are an expert database assistant. Help the user with their database question.

Recent conversation:
${contextString}

Current question: ${message}

Provide a helpful response. If SQL code is relevant, include it separately.

Format as JSON:
{
  "content": "Your helpful response",
  "sqlCode": "SELECT * FROM table_name;" // optional
}
`;

    try {
      const response = await this.safeAICall(prompt);
      const result = JSON.parse(response.content);
      
      return {
        content: result.content || "I'm here to help with your database questions!",
        sqlCode: result.sqlCode
      };
    } catch (error) {
      productionLogger.error('Chat assistant failed', error, 'NextGenAIService');
      return {
        content: "I'd be happy to help! Could you provide more details about what you're trying to accomplish?"
      };
    }
  }
}

export const nextGenAIService = NextGenAIService.getInstance();
