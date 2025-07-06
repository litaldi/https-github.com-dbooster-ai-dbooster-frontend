
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, ArrowLeft, Search, HelpCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <div className="text-8xl font-bold text-primary/20 mb-4">404</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Page Not Found
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-lg mx-auto">
            Oops! It looks like the page you're looking for has been moved, deleted, or never existed.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-8">
              <div className="grid gap-4 md:grid-cols-2">
                <Button 
                  className="w-full h-12" 
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go Back
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full h-12" 
                  asChild
                >
                  <Link to="/">
                    <Home className="mr-2 h-4 w-4" />
                    Home Page
                  </Link>
                </Button>
              </div>

              <div className="mt-8 pt-8 border-t">
                <h3 className="text-lg font-semibold mb-4">Popular Pages</h3>
                <div className="grid gap-2 text-sm">
                  <Link 
                    to="/features" 
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 p-2 rounded hover:bg-muted/50"
                  >
                    <Search className="h-4 w-4" />
                    Features & Capabilities
                  </Link>
                  <Link 
                    to="/pricing" 
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 p-2 rounded hover:bg-muted/50"
                  >
                    <Search className="h-4 w-4" />
                    Pricing Plans
                  </Link>
                  <Link 
                    to="/support" 
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 p-2 rounded hover:bg-muted/50"
                  >
                    <HelpCircle className="h-4 w-4" />
                    Support Center
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-sm text-muted-foreground"
        >
          Need help? Contact us at{' '}
          <a 
            href="mailto:support@dbooster.ai" 
            className="text-primary hover:underline"
          >
            support@dbooster.ai
          </a>
        </motion.div>
      </div>
    </div>
  );
}
