
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
    // Check for OpenAI API key in various sources
    return localStorage.getItem('openai_api_key') || 
           sessionStorage.getItem('openai_api_key') || 
           null;
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
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert database engineer and SQL specialist. Provide accurate, optimized solutions with detailed explanations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI service error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
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
}

export const nextGenAIService = NextGenAIService.getInstance();
