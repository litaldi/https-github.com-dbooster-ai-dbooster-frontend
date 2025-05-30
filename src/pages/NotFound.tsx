
import { useLocation, Link, useNavigate } from "react-router-dom";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, Search, HelpCircle } from "lucide-react";
import { useEffect, useState } from "react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const suggestions = [
    { path: '/', label: 'Dashboard', description: 'Main application dashboard' },
    { path: '/features', label: 'Features', description: 'Explore our features' },
    { path: '/learn', label: 'Learning Hub', description: 'Guides and tutorials' },
    { path: '/pricing', label: 'Pricing', description: 'View our plans' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="mb-8">
            <div className="text-8xl font-bold text-muted-foreground mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              404
            </div>
            <h1 className="text-2xl font-bold mb-2">Oops! Page Not Found</h1>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved. 
              Don't worry, let's get you back on track!
            </p>
            
            <div className="text-sm text-muted-foreground mb-6 p-3 bg-muted/50 rounded-lg">
              <strong>Requested URL:</strong> {location.pathname}
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <EnhancedButton asChild className="h-auto p-4 flex-col">
              <Link to="/" className="text-center">
                <Home className="w-6 h-6 mb-2" />
                <div className="font-semibold">Go Home</div>
                <div className="text-xs opacity-70">Return to Dashboard</div>
              </Link>
            </EnhancedButton>
            
            <EnhancedButton 
              variant="outline" 
              className="h-auto p-4 flex-col"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-6 h-6 mb-2" />
              <div className="font-semibold">Go Back</div>
              <div className="text-xs opacity-70">Previous page</div>
            </EnhancedButton>
          </div>

          {/* Suggested Pages */}
          <div className="text-left mb-8">
            <h3 className="text-lg font-semibold mb-4 text-center">Maybe you're looking for:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {suggestions.map((suggestion) => (
                <Link
                  key={suggestion.path}
                  to={suggestion.path}
                  className="p-3 border rounded-lg hover:bg-accent hover:border-primary/20 transition-all duration-200 group"
                >
                  <div className="font-medium group-hover:text-primary transition-colors">
                    {suggestion.label}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {suggestion.description}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Auto redirect notice */}
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <HelpCircle className="w-5 h-5 mx-auto mb-2 text-blue-600" />
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Automatically redirecting to home in <strong>{countdown}</strong> seconds
            </p>
            <button
              onClick={() => setCountdown(0)}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1"
            >
              Redirect now
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
