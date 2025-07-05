
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export class AIChatService {
  private static instance: AIChatService;
  
  public static getInstance(): AIChatService {
    if (!AIChatService.instance) {
      AIChatService.instance = new AIChatService();
    }
    return AIChatService.instance;
  }

  async sendMessage(message: string): Promise<string> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    return this.generateResponse(message);
  }

  private generateResponse(userInput: string): string {
    const input = userInput.toLowerCase();
    
    const responses = {
      pricing: "Our pricing starts at $29/month for small teams. You can view detailed pricing plans on our pricing page. Would you like me to help you find the right plan for your needs?",
      demo: "Great! You can try our free demo right now - just click 'Try Free Demo' on the homepage. No signup required! Would you like me to guide you through the key features?",
      support: "I'm here to help! You can also reach our support team at support@dbooster.ai or check our comprehensive documentation. What specific question do you have?",
      database: "DBooster supports PostgreSQL, MySQL, and SQL Server with advanced AI-powered optimization. We can analyze your queries and suggest improvements that typically reduce response times by 60-80%. What database are you working with?",
      features: "DBooster offers AI-powered query optimization, real-time performance monitoring, automated index recommendations, and comprehensive analytics. Which feature would you like to learn more about?",
      setup: "Getting started with DBooster takes just 5 minutes! Simply connect your database, and our AI will begin analyzing your queries immediately. Would you like me to walk you through the setup process?",
      security: "DBooster is SOC2 Type II compliant with end-to-end encryption, role-based access control, and comprehensive audit logging. Your data security is our top priority.",
      default: "Thanks for your message! For detailed assistance, please contact our support team at support@dbooster.ai or check our documentation. Is there anything specific about DBooster I can help explain?"
    };

    for (const [key, response] of Object.entries(responses)) {
      if (key !== 'default' && input.includes(key)) {
        return response;
      }
    }

    return responses.default;
  }
}
