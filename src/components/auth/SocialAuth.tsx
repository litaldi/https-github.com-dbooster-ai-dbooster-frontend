
import { Button } from '@/components/ui/button';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { Github, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function SocialAuth() {
  const { toast } = useToast();

  const handleGoogleAuth = async () => {
    toast({
      title: "Coming Soon",
      description: "Google authentication will be available soon.",
    });
  };

  const handleGithubAuth = async () => {
    toast({
      title: "Coming Soon",
      description: "GitHub authentication will be available soon.",
    });
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        variant="outline"
        onClick={handleGoogleAuth}
        className="w-full"
      >
        <Mail className="mr-2 h-4 w-4" />
        Google
      </Button>
      <Button
        variant="outline"
        onClick={handleGithubAuth}
        className="w-full"
      >
        <Github className="mr-2 h-4 w-4" />
        GitHub
      </Button>
    </div>
  );
}
