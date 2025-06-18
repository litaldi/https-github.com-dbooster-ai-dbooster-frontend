
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { FadeIn, ScaleIn } from '@/components/ui/animations';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl text-center space-y-8">
        <FadeIn>
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-8xl font-bold text-primary/20 mb-4"
          >
            404
          </motion.div>
        </FadeIn>

        <ScaleIn delay={0.2}>
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">
                Page Not Found
              </CardTitle>
              <CardDescription className="text-lg">
                The page you're looking for seems to have wandered off into the database void.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Don't worry, even the best queries sometimes return empty results. 
                Let's get you back on track to optimizing your database performance.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/">
                    <Home className="mr-2 h-4 w-4" />
                    Back to Home
                  </Link>
                </Button>
                
                <Button asChild variant="outline" size="lg">
                  <Link to="/app/dashboard">
                    <Search className="mr-2 h-4 w-4" />
                    Go to Dashboard
                  </Link>
                </Button>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">
                  Popular destinations:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/features">Features</Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/pricing">Pricing</Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/how-it-works">How it Works</Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/support">Support</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScaleIn>
      </div>
    </div>
  );
}
