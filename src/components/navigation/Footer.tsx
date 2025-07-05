
import { Link } from 'react-router-dom';
import { Database } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Database className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                DBooster
              </span>
            </div>
            <p className="text-muted-foreground text-sm max-w-md">
              AI-powered database optimization platform trusted by thousands of developers worldwide.
              Reduce costs by 60% and improve performance by 73%.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/features" className="text-sm text-muted-foreground hover:text-primary">Features</Link></li>
              <li><Link to="/pricing" className="text-sm text-muted-foreground hover:text-primary">Pricing</Link></li>
              <li><Link to="/how-it-works" className="text-sm text-muted-foreground hover:text-primary">How it Works</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary">About</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact</Link></li>
              <li><Link to="/support" className="text-sm text-muted-foreground hover:text-primary">Support</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 DBooster. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary">Privacy</Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary">Terms</Link>
              <Link to="/accessibility" className="text-sm text-muted-foreground hover:text-primary">Accessibility</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
