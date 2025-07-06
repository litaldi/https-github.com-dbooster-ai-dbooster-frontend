
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { Card, CardContent } from '@/components/ui/enhanced-card-system';
import { Button } from '@/components/ui/button';
import { Construction, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PagePlaceholderProps {
  title: string;
  description: string;
  comingSoon?: boolean;
}

export function PagePlaceholder({ title, description, comingSoon = true }: PagePlaceholderProps) {
  return (
    <StandardPageLayout
      title={title}
      subtitle={comingSoon ? "Coming Soon" : "Under Development"}
      description={description}
      centered
    >
      <Card variant="elevated" className="max-w-2xl mx-auto">
        <CardContent className="p-12 text-center">
          <Construction className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-4">
            {comingSoon ? "Coming Soon!" : "Under Development"}
          </h3>
          <p className="text-muted-foreground mb-8">
            We're working hard to bring you this feature. Stay tuned for updates!
          </p>
          <Button asChild variant="outline">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </StandardPageLayout>
  );
}
