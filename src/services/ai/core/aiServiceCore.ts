
import { productionLogger } from '@/utils/productionLogger';

export interface AIServiceConfig {
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIResponse {
  content: string;
  confidence: number;
  reasoning?: string;
  metadata?: Record<string, any>;
}

export abstract class AIServiceCore {
  protected apiKey: string | null = null;
  protected config: AIServiceConfig;

  constructor(config: AIServiceConfig = {}) {
    this.config = {
      temperature: 0.7,
      maxTokens: 2000,
      ...config
    };
  }

  async initialize(apiKey?: string): Promise<boolean> {
    try {
      this.apiKey = apiKey || await this.getStoredAPIKey();
      
      if (!this.apiKey) {
        throw new Error('No AI API key available');
      }

      await this.testConnection();
      return true;
    } catch (error) {
      productionLogger.error('AI service initialization failed', error, 'AIServiceCore');
      return false;
    }
  }

  protected abstract getStoredAPIKey(): Promise<string | null>;
  protected abstract testConnection(): Promise<void>;
  protected abstract callAI(prompt: string): Promise<string>;

  protected async safeAICall(prompt: string): Promise<AIResponse> {
    if (!this.apiKey) {
      throw new Error('AI service not initialized');
    }

    try {
      const response = await this.callAI(prompt);
      return this.parseResponse(response);
    } catch (error) {
      productionLogger.error('AI call failed', error, 'AIServiceCore');
      throw new Error('AI service unavailable');
    }
  }

  private parseResponse(response: string): AIResponse {
    try {
      const parsed = JSON.parse(response);
      return {
        content: parsed.response || response,
        confidence: parsed.confidence || 0.8,
        reasoning: parsed.reasoning,
        metadata: parsed.metadata
      };
    } catch {
      return {
        content: response,
        confidence: 0.7
      };
    }
  }
}
