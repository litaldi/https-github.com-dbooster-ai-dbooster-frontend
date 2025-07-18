
import React from 'react';
import { Link } from 'react-router-dom';

export function SmartHeader() {
  return (
    <header className="bg-background border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-foreground">
            App
          </Link>
          <div className="flex items-center space-x-6">
            <Link to="/features" className="text-foreground hover:text-primary">
              Features
            </Link>
            <Link to="/pricing" className="text-foreground hover:text-primary">
              Pricing
            </Link>
            <Link to="/login" className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
              Login
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
