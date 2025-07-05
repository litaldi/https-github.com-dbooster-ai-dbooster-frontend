
import { useCallback } from 'react';
import { enhancedToast } from '@/components/ui/enhanced-toast';
import { consolidatedAuthenticationSecurity } from '@/services/security/consolidatedAuthenticationSecurity';
import { consolidatedInputValidation } from '@/services/security/consolidatedInputValidation';
import { supabase } from '@/integrations/supabase/client';

export function useEnhancedAuthOperations() {
  const secureLogin = useCallback(async (email: string, password: string, options: { rememberMe?: boolean } = {}) => {
    try {
      // Use consolidated authentication security
      const result = await consolidatedAuthenticationSecurity.secureLogin(
        email,
        password,
        {
          rememberMe: options.rememberMe,
          deviceFingerprint: consolidatedAuthenticationSecurity.generateDeviceFingerprint()
        }
      );

      if (!result.success) {
        enhancedToast.error({
          title: "Login Failed",
          description: result.error || "Authentication failed",
        });
        return { error: result.error };
      }

      if (result.requiresVerification) {
        enhancedToast.info({
          title: "Verification Required",
          description: "Please check your email to verify your account.",
        });
      } else {
        enhancedToast.success({
          title: "Welcome back!",
          description: "You have been successfully signed in.",
        });
      }
      
      return {};
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      enhancedToast.error({
        title: "Login Failed",
        description: errorMessage,
      });
      return { error: errorMessage };
    }
  }, []);

  const secureSignup = useCallback(async (email: string, password: string, name: string, acceptedTerms: boolean = false) => {
    try {
      // Validate password strength using consolidated security
      const passwordValidation = await consolidatedAuthenticationSecurity.validateStrongPassword(password, email);
      
      if (!passwordValidation.isValid) {
        enhancedToast.error({
          title: "Password Requirements Not Met",
          description: passwordValidation.feedback.join('. '),
        });
        return { error: "Password does not meet security requirements" };
      }

      // Validate and sanitize inputs
      const emailValidation = consolidatedInputValidation.validateAndSanitize(email, 'email');
      const nameValidation = consolidatedInputValidation.validateAndSanitize(name, 'general');
      
      if (!emailValidation.isValid) {
        throw new Error('Invalid email format');
      }
      
      if (!nameValidation.isValid) {
        throw new Error('Invalid name format');
      }

      const result = await consolidatedAuthenticationSecurity.secureSignup(
        emailValidation.sanitizedValue || email,
        password,
        {
          fullName: nameValidation.sanitizedValue || name,
          acceptedTerms
        }
      );

      if (!result.success) {
        enhancedToast.error({
          title: "Signup Failed",
          description: result.error || "Account creation failed",
        });
        return { error: result.error };
      }

      if (result.requiresVerification) {
        enhancedToast.success({
          title: "Account Created!",
          description: "Please check your email to verify your account.",
        });
      } else {
        enhancedToast.success({
          title: "Welcome!",
          description: "Your account has been created successfully.",
        });
      }
      
      return {};
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      enhancedToast.error({
        title: "Signup Failed",
        description: errorMessage,
      });
      return { error: errorMessage };
    }
  }, []);

  const logout = useCallback(async (isDemo: boolean) => {
    if (isDemo) {
      enhancedToast.info({
        title: "Demo session ended",
        description: "Thanks for trying the demo!"
      });
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      enhancedToast.error({
        title: "Logout Failed",
        description: error.message,
      });
      throw error;
    }

    enhancedToast.success({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
  }, []);

  return {
    secureLogin,
    secureSignup,
    logout
  };
}
