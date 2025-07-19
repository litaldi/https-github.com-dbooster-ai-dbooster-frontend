
import React from 'react';
import { Button } from '@/components/ui/button';
import { Github, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SocialAuthButtonsProps {
  isLoading: boolean;
  onLoadingChange: (loading: boolean) => void;
}

export function SocialAuthButtons({ isLoading, onLoadingChange }: SocialAuthButtonsProps) {
  const handleGoogleAuth = async () => {
    try {
      onLoadingChange(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/app`,
        },
      });
      
      if (error) {
        toast.error('Google authentication failed: ' + error.message);
      }
    } catch (error) {
      toast.error('Failed to connect with Google');
    } finally {
      onLoadingChange(false);
    }
  };

  const handleGithubAuth = async () => {
    try {
      onLoadingChange(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/app`,
        },
      });
      
      if (error) {
        toast.error('GitHub authentication failed: ' + error.message);
      }
    } catch (error) {
      toast.error('Failed to connect with GitHub');
    } finally {
      onLoadingChange(false);
    }
  };

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleAuth}
        disabled={isLoading}
      >
        <Mail className="h-4 w-4 mr-2" />
        Continue with Google
      </Button>
      
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGithubAuth}
        disabled={isLoading}
      >
        <Github className="h-4 w-4 mr-2" />
        Continue with GitHub
      </Button>
    </div>
  );
}
