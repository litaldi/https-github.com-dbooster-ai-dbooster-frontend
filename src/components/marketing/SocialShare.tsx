
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Twitter, 
  Linkedin, 
  Facebook, 
  Link, 
  Mail,
  Share2,
  Check
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface SocialShareProps {
  url?: string;
  title?: string;
  description?: string;
  className?: string;
  compact?: boolean;
}

export function SocialShare({ 
  url = window.location.href,
  title = "DBooster - AI-Powered Database Optimization",
  description = "Transform your database performance with AI intelligence. Reduce query response times by up to 10x and cut infrastructure costs by 60%.",
  className,
  compact = false
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    if (platform === 'email') {
      window.location.href = shareLinks[platform];
    } else {
      window.open(shareLinks[platform], '_blank', 'width=600,height=400');
    }
  };

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <span className="text-sm text-muted-foreground">Share:</span>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleShare('twitter')}
            className="h-8 w-8 p-0"
          >
            <Twitter className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleShare('linkedin')}
            className="h-8 w-8 p-0"
          >
            <Linkedin className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyLink}
            className="h-8 w-8 p-0"
          >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Link className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Share2 className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Share DBooster</h3>
          <Badge variant="secondary">Help others optimize!</Badge>
        </div>
        
        <p className="text-sm text-muted-foreground mb-6">
          Help other developers discover the power of AI-driven database optimization.
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => handleShare('twitter')}
            className="justify-start gap-2"
          >
            <Twitter className="h-4 w-4 text-blue-500" />
            Twitter
          </Button>
          
          <Button
            variant="outline"
            onClick={() => handleShare('linkedin')}
            className="justify-start gap-2"
          >
            <Linkedin className="h-4 w-4 text-blue-700" />
            LinkedIn
          </Button>
          
          <Button
            variant="outline"
            onClick={() => handleShare('facebook')}
            className="justify-start gap-2"
          >
            <Facebook className="h-4 w-4 text-blue-600" />
            Facebook
          </Button>
          
          <Button
            variant="outline"
            onClick={() => handleShare('email')}
            className="justify-start gap-2"
          >
            <Mail className="h-4 w-4 text-gray-600" />
            Email
          </Button>
        </div>
        
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-mono text-muted-foreground truncate">
              {url}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyLink}
              className="flex-shrink-0"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-500 mr-1" />
                  Copied!
                </>
              ) : (
                <>
                  <Link className="h-4 w-4 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
