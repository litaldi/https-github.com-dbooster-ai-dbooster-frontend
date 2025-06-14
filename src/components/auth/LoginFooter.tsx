
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function LoginFooter() {
  return (
    <>
      <section className="text-center pt-2">
        <p className="text-xs text-muted-foreground mb-3">
          Want to browse without signing up?
        </p>
        <Link to="/home">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-blue-600 hover:text-blue-700 story-link focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Continue as Guest
          </Button>
        </Link>
      </section>

      <footer className="text-center space-y-4 pt-4">
        <nav aria-label="Legal links">
          <div className="flex justify-center space-x-4 text-sm">
            <Link 
              to="/terms" 
              className="text-muted-foreground hover:text-foreground transition-colors story-link focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
            >
              Terms of Service
            </Link>
            <span className="text-muted-foreground" aria-hidden="true">•</span>
            <Link 
              to="/privacy" 
              className="text-muted-foreground hover:text-foreground transition-colors story-link focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
            >
              Privacy Policy
            </Link>
          </div>
        </nav>
        <p className="text-xs text-muted-foreground">
          © 2024 DBooster. All rights reserved.
        </p>
      </footer>
    </>
  );
}
