import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';

export class SecureApiKeyManager {
  private static instance: SecureApiKeyManager;

  static getInstance(): SecureApiKeyManager {
    if (!SecureApiKeyManager.instance) {
      SecureApiKeyManager.instance = new SecureApiKeyManager();
    }
    return SecureApiKeyManager.instance;
  }

  async makeSecureRequest<T>(
    functionName: string, 
    requestBody: any
  ): Promise<T> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error('Authentication required for AI services');
      }

      const { data, error } = await supabase.functions.invoke(functionName, {
        body: requestBody
      });

      if (error) {
        productionLogger.error(`Secure API request failed: ${functionName}`, error, 'SecureApiKeyManager');
        throw error;
      }

      return data;
    } catch (error) {
      productionLogger.error(`Secure API request error: ${functionName}`, error, 'SecureApiKeyManager');
      throw error;
    }
  }

  async makeChatRequest(messages: any[], options: any = {}): Promise<any> {
    return this.makeSecureRequest('secure-ai-chat', {
      messages,
      ...options
    });
  }

  async makeVisualAnalysisRequest(image: string, prompt: string, analysisType: string): Promise<any> {
    return this.makeSecureRequest('secure-ai-visual', {
      image,
      prompt,
      analysisType
    });
  }
}

export const secureApiKeyManager = SecureApiKeyManager.getInstance();