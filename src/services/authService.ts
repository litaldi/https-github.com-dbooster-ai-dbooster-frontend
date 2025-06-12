
import { loginDemoUser, logoutDemoUser } from '@/services/demo';
import { RateLimiter } from '@/utils/rateLimiting';
import { AuthMethods } from '@/services/authMethods';
import { enhancedToast } from '@/components/ui/enhanced-toast';
import { handleApiError } from '@/utils/errorHandling';

export class AuthService {
  private rateLimiter: RateLimiter;
  private authMethods: AuthMethods;

  constructor() {
    this.rateLimiter = new RateLimiter();
    this.authMethods = new AuthMethods(this.rateLimiter);
  }

  async loginWithOAuth(provider: 'github' | 'google'): Promise<void> {
    try {
      await this.authMethods.loginWithOAuth(provider);
      enhancedToast.success({
        title: 'Signed in successfully',
        description: `Welcome back! You're now signed in with ${provider}.`
      });
    } catch (error) {
      console.error('Login failed:', error);
      enhancedToast.error({
        title: 'Sign in failed',
        description: handleApiError(error)
      });
      throw error;
    }
  }

  async loginWithEmail(email: string, password: string): Promise<void> {
    try {
      await this.authMethods.loginWithEmail(email, password);
      this.rateLimiter.resetAttempts();
      enhancedToast.success({
        title: 'Welcome back!',
        description: 'You have been signed in successfully.'
      });
    } catch (error) {
      console.error('Email login failed:', error);
      enhancedToast.error({
        title: 'Sign in failed',
        description: handleApiError(error)
      });
      throw error;
    }
  }

  async loginWithPhone(phone: string, password: string): Promise<void> {
    try {
      await this.authMethods.loginWithPhone(phone, password);
      this.rateLimiter.resetAttempts();
      enhancedToast.success({
        title: 'Welcome back!',
        description: 'You have been signed in successfully.'
      });
    } catch (error) {
      console.error('Phone login failed:', error);
      enhancedToast.error({
        title: 'Sign in failed',
        description: handleApiError(error)
      });
      throw error;
    }
  }

  async signupWithEmail(email: string, password: string, name: string): Promise<void> {
    try {
      await this.authMethods.signupWithEmail(email, password, name);
      enhancedToast.success({
        title: 'Account created!',
        description: 'Welcome to DBooster! Your account has been created successfully.'
      });
    } catch (error) {
      console.error('Email signup failed:', error);
      enhancedToast.error({
        title: 'Account creation failed',
        description: handleApiError(error)
      });
      throw error;
    }
  }

  async signupWithPhone(phone: string, password: string, name: string): Promise<void> {
    try {
      await this.authMethods.signupWithPhone(phone, password, name);
      enhancedToast.success({
        title: 'Account created!',
        description: 'Welcome to DBooster! Your account has been created successfully.'
      });
    } catch (error) {
      console.error('Phone signup failed:', error);
      enhancedToast.error({
        title: 'Account creation failed',
        description: handleApiError(error)
      });
      throw error;
    }
  }

  async loginDemo(): Promise<{ user: any; session: any }> {
    try {
      const result = await loginDemoUser();
      enhancedToast.success({
        title: 'Demo mode activated',
        description: 'You can now explore DBooster with sample data.'
      });
      console.log('Demo user logged in successfully');
      return result;
    } catch (error) {
      console.error('Demo login failed:', error);
      enhancedToast.error({
        title: 'Demo mode failed',
        description: handleApiError(error)
      });
      throw error;
    }
  }

  async logout(isDemo: boolean): Promise<void> {
    try {
      if (isDemo) {
        logoutDemoUser();
        enhancedToast.info({
          title: 'Demo session ended',
          description: 'Thanks for trying DBooster!'
        });
        console.log('Demo user logged out');
        return;
      }

      await this.authMethods.logout();
      enhancedToast.success({
        title: 'Signed out',
        description: 'You have been signed out successfully.'
      });
    } catch (error) {
      console.error('Logout failed:', error);
      enhancedToast.error({
        title: 'Sign out failed',
        description: handleApiError(error)
      });
      throw error;
    }
  }
}
