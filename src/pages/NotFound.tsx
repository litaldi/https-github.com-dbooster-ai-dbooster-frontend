
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <h1 className="text-6xl font-bold text-muted-foreground mb-2" aria-label="Error 404">404</h1>
            <h2 className="text-xl font-semibold mb-2">Page Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link to="/" aria-label="Return to Dashboard">
                <Home className="w-4 h-4 mr-2" aria-hidden="true" />
                Return to Dashboard
              </Link>
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.history.back()}
              aria-label="Go back to previous page"
            >
              <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
              Go Back
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-6" aria-label={`Current path: ${location.pathname}`}>
            Path: {location.pathname}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
