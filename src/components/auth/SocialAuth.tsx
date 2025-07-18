
import { Button } from '@/components/ui/button';
import { Github, Chrome } from 'lucide-react';

export function SocialAuth() {
  const handleGoogleAuth = () => {
    console.log('Google auth clicked');
  };

  const handleGithubAuth = () => {
    console.log('GitHub auth clicked');
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <Button variant="outline" onClick={handleGoogleAuth} className="w-full">
        <Chrome className="h-4 w-4 mr-2" />
        Google
      </Button>
      <Button variant="outline" onClick={handleGithubAuth} className="w-full">
        <Github className="h-4 w-4 mr-2" />
        GitHub
      </Button>
    </div>
  );
}
