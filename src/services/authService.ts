
import { loginDemoUser, logoutDemoUser } from '@/services/demo';
import { RateLimiter } from '@/utils/rateLimiting';
import { AuthMethods } from '@/services/authMethods';
import { enhancedToast } from '@/components/ui/enhanced-toast';
import { handleApiError } from '@/utils/errorHandling';
import type { OAuthProvider, AuthCredentials } from '@/types/auth';

export class AuthService {
  private rateLimiter: RateLimiter;
  private authMethods: AuthMethods;

  constructor() {
    this.rateLimiter = new RateLimiter();
    this.authMethods = new AuthMethods(this.rateLimiter);
  }

  private showSuccessToast(title: string, description: string): void {
    enhancedToast.success({ title, description });
  }

  private showErrorToast(title: string, error: any): void {
    enhancedToast.error({
      title,
      description: handleApiError(error)
    });
  }

  async loginWithOAuth(provider: OAuthProvider): Promise<void> {
    try {
      await this.authMethods.loginWithOAuth(provider);
      this.showSuccessToast(
        'Signed in successfully',
        `Welcome back! You're now signed in with ${provider}.`
      );
    } catch (error) {
      console.error('Login failed:', error);
      this.showErrorToast('Sign in failed', error);
      throw error;
    }
  }

  async loginWithCredentials(credentials: AuthCredentials): Promise<void> {
    try {
      await this.authMethods.loginWithCredentials(credentials);
      this.rateLimiter.resetAttempts();
      this.showSuccessToast('Welcome back!', 'You have been signed in successfully.');
    } catch (error) {
      console.error('Login failed:', error);
      this.showErrorToast('Sign in failed', error);
      throw error;
    }
  }

  async signupWithCredentials(credentials: AuthCredentials): Promise<void> {
    try {
      await this.authMethods.signupWithCredentials(credentials);
      this.showSuccessToast(
        'Account created!',
        'Welcome to DBooster! Your account has been created successfully.'
      );
    } catch (error) {
      console.error('Signup failed:', error);
      this.showErrorToast('Account creation failed', error);
      throw error;
    }
  }

  async loginDemo(): Promise<{ user: any; session: any }> {
    try {
      const result = await loginDemoUser();
      this.showSuccessToast(
        'Demo mode activated',
        'You can now explore DBooster with sample data.'
      );
      console.log('Demo user logged in successfully');
      return result;
    } catch (error) {
      console.error('Demo login failed:', error);
      this.showErrorToast('Demo mode failed', error);
      throw error;
    }
  }

  async logout(isDemo: boolean = false): Promise<void> {
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
      this.showSuccessToast('Signed out', 'You have been signed out successfully.');
    } catch (error) {
      console.error('Logout failed:', error);
      this.showErrorToast('Sign out failed', error);
      throw error;
    }
  }
}
