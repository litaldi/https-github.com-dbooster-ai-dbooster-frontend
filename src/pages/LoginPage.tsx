
import React from 'react';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';

export default function LoginPage() {
  return (
    <StandardPageLayout
      title="Login"
      description="Sign in to your account"
    >
      <div className="max-w-md mx-auto">
        <div className="bg-card text-card-foreground p-6 rounded-lg shadow">
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input 
                type="email" 
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input 
                type="password" 
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                placeholder="Enter your password"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </StandardPageLayout>
  );
}
