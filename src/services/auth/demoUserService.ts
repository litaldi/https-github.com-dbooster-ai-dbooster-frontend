
import { User, Session } from '@supabase/supabase-js';
import { enhancedToast } from '@/components/ui/enhanced-toast';

// Demo user data
const DEMO_USER = {
  id: 'demo-user-id',
  email: 'demo@example.com',
  user_metadata: { full_name: 'Demo User' },
  app_metadata: {},
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  aud: 'authenticated',
  role: 'authenticated'
};

export class DemoUserService {
  static createDemoSession(): { user: User; session: Session } {
    const user = DEMO_USER as User;
    const session = {
      access_token: 'demo-token',
      refresh_token: 'demo-refresh',
      expires_in: 3600,
      token_type: 'bearer',
      user: user
    } as Session;

    return { user, session };
  }

  static showDemoWelcomeMessage(): void {
    enhancedToast.success({
      title: "Demo Mode Activated",
      description: "Welcome to the demo environment!",
    });
  }

  static showDemoEndMessage(): void {
    enhancedToast.info({
      title: "Demo session ended",
      description: "Thanks for trying the demo!"
    });
  }
}
