import { productionLogger } from '@/utils/productionLogger';
import { supabase } from '@/integrations/supabase/client';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    queryGenerated?: string;
    confidence?: number;
    sqlCode?: string;
    visualizations?: any[];
  };
}

export interface ChatResponse {
  content: string;
  sqlCode?: string;
  confidence: number;
  visualizations?: any[];
  suggestions?: string[];
}

class AdvancedChatService {
  private conversationHistory: ChatMessage[] = [];
  private apiKey: string | null = null;

  async initialize(): Promise<boolean> {
    try {
      // No longer store API keys client-side - use edge function instead
      return true;
    } catch (error) {
      productionLogger.error('Advanced chat service initialization failed', error, 'AdvancedChatService');
      return false;
    }
  }

  private async testConnection(): Promise<void> {
    // Connection testing now handled by edge function
    return;
  }

  async chatWithContext(message: string, context?: any): Promise<ChatResponse> {
    try {
      const systemPrompt = this.buildSystemPrompt(context);
      const messages = [
        { role: 'system', content: systemPrompt },
        ...this.conversationHistory.slice(-10), // Keep last 10 messages for context
        { role: 'user', content: message }
      ];

      // Use secure edge function instead of direct API call
      const { data, error } = await supabase.functions.invoke('secure-ai-chat', {
        body: {
          messages,
          model: 'gpt-4o-mini',
          maxTokens: 2000,
          temperature: 0.7
        }
      });

      if (error) {
        throw new Error(`Secure chat request failed: ${error.message}`);
      }

      const assistantMessage = data.choices[0].message;

      // Handle function calls
      if (assistantMessage.function_call) {
        return await this.handleFunctionCall(assistantMessage.function_call, message);
      }

      // Add to conversation history
      this.addToHistory('user', message);
      this.addToHistory('assistant', assistantMessage.content);

      return {
        content: assistantMessage.content,
        confidence: 0.9,
        suggestions: this.extractSuggestions(assistantMessage.content)
      };

    } catch (error) {
      productionLogger.error('Chat request failed', error, 'AdvancedChatService');
      throw new Error('Failed to process chat request');
    }
  }

  private buildSystemPrompt(context?: any): string {
    return `You are an expert database assistant specializing in SQL optimization, database design, and performance analysis. 

Your capabilities include:
- Writing and optimizing SQL queries
- Explaining database concepts clearly
- Suggesting performance improvements
- Analyzing database schemas
- Generating database documentation
- Creating visualization recommendations

Current context: ${context ? JSON.stringify(context, null, 2) : 'No specific context provided'}

Always provide accurate, helpful responses and include SQL code when relevant. If you generate SQL, make sure it's properly formatted and explained.`;
  }

  private getFunctionDefinitions() {
    return [
      {
        name: 'generate_sql_query',
        description: 'Generate SQL query based on natural language description',
        parameters: {
          type: 'object',
          properties: {
            description: { type: 'string' },
            tables: { type: 'array', items: { type: 'string' } },
            query_type: { type: 'string', enum: ['SELECT', 'INSERT', 'UPDATE', 'DELETE'] }
          },
          required: ['description']
        }
      },
      {
        name: 'explain_query_performance',
        description: 'Analyze and explain SQL query performance',
        parameters: {
          type: 'object',
          properties: {
            sql_query: { type: 'string' },
            database_type: { type: 'string' }
          },
          required: ['sql_query']
        }
      },
      {
        name: 'suggest_optimizations',
        description: 'Suggest database optimizations',
        parameters: {
          type: 'object',
          properties: {
            context: { type: 'string' },
            performance_metrics: { type: 'object' }
          },
          required: ['context']
        }
      }
    ];
  }

  private async handleFunctionCall(functionCall: any, originalMessage: string): Promise<ChatResponse> {
    const { name, arguments: args } = functionCall;
    const parsedArgs = JSON.parse(args);

    switch (name) {
      case 'generate_sql_query':
        return this.generateSQLQuery(parsedArgs, originalMessage);
      case 'explain_query_performance':
        return this.explainQueryPerformance(parsedArgs, originalMessage);
      case 'suggest_optimizations':
        return this.suggestOptimizations(parsedArgs, originalMessage);
      default:
        throw new Error(`Unknown function: ${name}`);
    }
  }

  private async generateSQLQuery(args: any, originalMessage: string): Promise<ChatResponse> {
    // Simulate SQL generation logic
    const sqlCode = this.buildSQLFromDescription(args.description, args.tables);
    
    this.addToHistory('user', originalMessage);
    this.addToHistory('assistant', `I've generated an SQL query for your request: "${args.description}"`);

    return {
      content: `I've generated an SQL query based on your description: "${args.description}"`,
      sqlCode,
      confidence: 0.85,
      suggestions: [
        'Consider adding indexes on frequently queried columns',
        'Use LIMIT clauses for large result sets',
        'Review the WHERE clause for optimization opportunities'
      ]
    };
  }

  private async explainQueryPerformance(args: any, originalMessage: string): Promise<ChatResponse> {
    const analysis = `Performance analysis for your query:

1. **Query Structure**: ${this.analyzeQueryStructure(args.sql_query)}
2. **Potential Bottlenecks**: ${this.identifyBottlenecks(args.sql_query)}
3. **Optimization Suggestions**: ${this.getOptimizationSuggestions(args.sql_query)}

The query appears to be ${this.getPerformanceRating(args.sql_query)} optimized.`;

    this.addToHistory('user', originalMessage);
    this.addToHistory('assistant', analysis);

    return {
      content: analysis,
      confidence: 0.88,
      suggestions: [
        'Add composite indexes',
        'Consider query restructuring',
        'Use query execution plan analysis'
      ]
    };
  }

  private async suggestOptimizations(args: any, originalMessage: string): Promise<ChatResponse> {
    const suggestions = `Based on your database context, here are my optimization recommendations:

🚀 **Performance Optimizations**:
1. Index optimization for frequently accessed columns
2. Query restructuring for complex JOINs
3. Connection pool tuning

📊 **Monitoring Recommendations**:
1. Set up query performance monitoring
2. Track slow query patterns
3. Monitor resource utilization

🔧 **Configuration Tuning**:
1. Adjust buffer pool sizes
2. Optimize cache settings
3. Configure query timeout limits`;

    this.addToHistory('user', originalMessage);
    this.addToHistory('assistant', suggestions);

    return {
      content: suggestions,
      confidence: 0.9,
      suggestions: [
        'Implement query caching',
        'Set up automated performance monitoring',
        'Consider read replicas for scaling'
      ]
    };
  }

  private buildSQLFromDescription(description: string, tables?: string[]): string {
    // Simple SQL generation based on description keywords
    const lowerDesc = description.toLowerCase();
    
    if (lowerDesc.includes('show') || lowerDesc.includes('get') || lowerDesc.includes('find')) {
      return `SELECT *\nFROM ${tables?.[0] || 'table_name'}\nWHERE condition = 'value'\nORDER BY created_at DESC\nLIMIT 10;`;
    } else if (lowerDesc.includes('create') || lowerDesc.includes('add') || lowerDesc.includes('insert')) {
      return `INSERT INTO ${tables?.[0] || 'table_name'} (column1, column2)\nVALUES ('value1', 'value2');`;
    } else if (lowerDesc.includes('update') || lowerDesc.includes('modify')) {
      return `UPDATE ${tables?.[0] || 'table_name'}\nSET column1 = 'new_value'\nWHERE condition = 'value';`;
    } else if (lowerDesc.includes('delete') || lowerDesc.includes('remove')) {
      return `DELETE FROM ${tables?.[0] || 'table_name'}\nWHERE condition = 'value';`;
    }
    
    return `-- Generated SQL for: ${description}\nSELECT *\nFROM ${tables?.[0] || 'your_table'}\nWHERE your_condition = 'your_value';`;
  }

  private analyzeQueryStructure(query: string): string {
    if (query.includes('JOIN')) return 'Complex query with table joins';
    if (query.includes('GROUP BY')) return 'Aggregation query with grouping';
    if (query.includes('ORDER BY')) return 'Query with result ordering';
    return 'Simple query structure';
  }

  private identifyBottlenecks(query: string): string {
    const bottlenecks = [];
    if (!query.includes('WHERE')) bottlenecks.push('Missing WHERE clause');
    if (query.includes('SELECT *')) bottlenecks.push('Using SELECT * instead of specific columns');
    if (!query.includes('LIMIT')) bottlenecks.push('No LIMIT clause for large datasets');
    
    return bottlenecks.length > 0 ? bottlenecks.join(', ') : 'No obvious bottlenecks detected';
  }

  private getOptimizationSuggestions(query: string): string {
    const suggestions = [];
    if (query.includes('JOIN')) suggestions.push('Consider index optimization for JOIN columns');
    if (query.includes('ORDER BY')) suggestions.push('Add indexes on ORDER BY columns');
    if (query.includes('WHERE')) suggestions.push('Ensure WHERE clause columns are indexed');
    
    return suggestions.join(', ') || 'Query structure looks good';
  }

  private getPerformanceRating(query: string): string {
    let score = 0;
    if (query.includes('WHERE')) score += 2;
    if (query.includes('LIMIT')) score += 2;
    if (!query.includes('SELECT *')) score += 2;
    if (query.includes('INDEX')) score += 2;
    
    if (score >= 6) return 'well';
    if (score >= 4) return 'moderately';
    return 'poorly';
  }

  private extractSuggestions(content: string): string[] {
    // Extract actionable suggestions from AI response
    const suggestions = [];
    if (content.includes('index')) suggestions.push('Consider adding database indexes');
    if (content.includes('optimize')) suggestions.push('Run query optimization analysis');
    if (content.includes('performance')) suggestions.push('Monitor query performance metrics');
    
    return suggestions.length > 0 ? suggestions : ['Ask follow-up questions for more specific help'];
  }

  private addToHistory(role: 'user' | 'assistant', content: string): void {
    this.conversationHistory.push({
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date()
    });

    // Keep only last 20 messages to prevent memory issues
    if (this.conversationHistory.length > 20) {
      this.conversationHistory = this.conversationHistory.slice(-20);
    }
  }

  getConversationHistory(): ChatMessage[] {
    return [...this.conversationHistory];
  }

  clearHistory(): void {
    this.conversationHistory = [];
  }

  // API key management removed for security - now handled server-side
}

export const advancedChatService = new AdvancedChatService();
