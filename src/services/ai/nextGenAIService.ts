
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
}

export const nextGenAIService = NextGenAIService.getInstance();
