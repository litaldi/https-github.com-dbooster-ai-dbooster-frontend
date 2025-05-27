
export interface AIAnalysisResult {
  suggestions: QuerySuggestion[];
  securityIssues: SecurityIssue[];
  performancePrediction: PerformancePrediction;
  explanation: string;
}

export interface QuerySuggestion {
  id: string;
  type: 'optimization' | 'security' | 'best-practice' | 'performance';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  originalCode: string;
  suggestedCode: string;
  expectedImprovement: string;
  implementationEffort: 'low' | 'medium' | 'high';
  confidence: number;
}

export interface SecurityIssue {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: 'sql-injection' | 'data-exposure' | 'permissions' | 'encryption';
  description: string;
  recommendation: string;
  codeLocation?: string;
}

export interface PerformancePrediction {
  estimatedExecutionTime: string;
  indexRecommendations: string[];
  bottlenecks: string[];
  scalabilityScore: number;
  optimizationPotential: string;
}

class AIService {
  private async callOpenAI(prompt: string, systemMessage: string): Promise<string> {
    const response = await fetch('/api/ai-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        systemMessage,
      }),
    });

    if (!response.ok) {
      throw new Error('AI analysis failed');
    }

    const data = await response.json();
    return data.result;
  }

  async analyzeQuery(query: string, schema?: string): Promise<AIAnalysisResult> {
    const systemMessage = `You are an expert database performance analyst. Analyze the provided SQL query and return a detailed JSON response with optimization suggestions, security issues, and performance predictions. Consider indexing strategies, query rewriting, potential security vulnerabilities, and scalability concerns.`;
    
    const prompt = `Analyze this SQL query for optimization opportunities, security issues, and performance:

Query: ${query}
${schema ? `Schema context: ${schema}` : ''}

Return a JSON response with:
1. Optimization suggestions with specific code improvements
2. Security vulnerabilities and fixes
3. Performance predictions and bottlenecks
4. Implementation effort estimates
5. Confidence scores for each suggestion`;

    try {
      const result = await this.callOpenAI(prompt, systemMessage);
      return this.parseAIResponse(result);
    } catch (error) {
      console.error('AI analysis error:', error);
      return this.getFallbackAnalysis(query);
    }
  }

  async generateOptimizedQuery(originalQuery: string, requirements: string): Promise<string> {
    const systemMessage = `You are an expert SQL optimizer. Rewrite queries for better performance while maintaining functionality.`;
    
    const prompt = `Optimize this SQL query based on the requirements:

Original Query: ${originalQuery}
Requirements: ${requirements}

Return only the optimized SQL query with comments explaining key improvements.`;

    try {
      return await this.callOpenAI(prompt, systemMessage);
    } catch (error) {
      console.error('Query optimization error:', error);
      return originalQuery; // Fallback to original
    }
  }

  async predictPerformanceImpact(changes: string[], currentMetrics: any): Promise<PerformancePrediction> {
    const systemMessage = `You are a database performance expert. Predict the impact of proposed changes on query performance.`;
    
    const prompt = `Predict performance impact of these changes:

Proposed Changes: ${changes.join(', ')}
Current Metrics: ${JSON.stringify(currentMetrics)}

Provide specific predictions for execution time, resource usage, and scalability.`;

    try {
      const result = await this.callOpenAI(prompt, systemMessage);
      return this.parsePerformancePrediction(result);
    } catch (error) {
      console.error('Performance prediction error:', error);
      return this.getFallbackPrediction();
    }
  }

  async generatePersonalizedRecommendations(userProfile: any, queryHistory: any[]): Promise<QuerySuggestion[]> {
    const systemMessage = `You are a personalized database advisor. Generate recommendations based on user patterns and history.`;
    
    const prompt = `Generate personalized optimization recommendations:

User Profile: ${JSON.stringify(userProfile)}
Query History: ${JSON.stringify(queryHistory.slice(-10))} // Last 10 queries

Focus on patterns, common mistakes, and learning opportunities specific to this user.`;

    try {
      const result = await this.callOpenAI(prompt, systemMessage);
      return this.parseRecommendations(result);
    } catch (error) {
      console.error('Personalized recommendations error:', error);
      return [];
    }
  }

  private parseAIResponse(response: string): AIAnalysisResult {
    try {
      const parsed = JSON.parse(response);
      return {
        suggestions: parsed.suggestions || [],
        securityIssues: parsed.securityIssues || [],
        performancePrediction: parsed.performancePrediction || this.getFallbackPrediction(),
        explanation: parsed.explanation || 'AI analysis completed',
      };
    } catch (error) {
      return this.getFallbackAnalysis('');
    }
  }

  private parsePerformancePrediction(response: string): PerformancePrediction {
    try {
      return JSON.parse(response);
    } catch (error) {
      return this.getFallbackPrediction();
    }
  }

  private parseRecommendations(response: string): QuerySuggestion[] {
    try {
      const parsed = JSON.parse(response);
      return parsed.recommendations || [];
    } catch (error) {
      return [];
    }
  }

  private getFallbackAnalysis(query: string): AIAnalysisResult {
    return {
      suggestions: [
        {
          id: '1',
          type: 'optimization',
          priority: 'medium',
          title: 'Consider adding indexes',
          description: 'This query might benefit from proper indexing',
          originalCode: query,
          suggestedCode: '-- Add appropriate indexes based on WHERE clauses',
          expectedImprovement: '30-50% faster execution',
          implementationEffort: 'low',
          confidence: 0.7,
        },
      ],
      securityIssues: [],
      performancePrediction: this.getFallbackPrediction(),
      explanation: 'Basic analysis completed. Connect AI service for detailed insights.',
    };
  }

  private getFallbackPrediction(): PerformancePrediction {
    return {
      estimatedExecutionTime: 'Unable to predict',
      indexRecommendations: ['Consider adding indexes on frequently queried columns'],
      bottlenecks: ['Analysis requires AI service connection'],
      scalabilityScore: 0.5,
      optimizationPotential: 'Connect AI service for detailed analysis',
    };
  }
}

export const aiService = new AIService();
