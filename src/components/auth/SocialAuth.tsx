import React from 'react';
import { Button } from '@/components/ui/button';
import { Github, Mail } from 'lucide-react';

export function SocialAuth() {
  const handleGoogleAuth = async () => {
    // Placeholder for Google auth implementation
    console.log('Google auth clicked');
  };

  const handleGithubAuth = async () => {
    // Placeholder for GitHub auth implementation
    console.log('GitHub auth clicked');
  };

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleAuth}
      >
        <Mail className="h-4 w-4 mr-2" />
        Continue with Google
      </Button>
      
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGithubAuth}
      >
        <Github className="h-4 w-4 mr-2" />
        Continue with GitHub
      </Button>
    </div>
  );
}
