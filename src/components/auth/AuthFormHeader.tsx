
import { Shield } from 'lucide-react';

interface AuthFormHeaderProps {
  isLogin: boolean;
}

export function AuthFormHeader({ isLogin }: AuthFormHeaderProps) {
  return (
    <div className="text-center space-y-2">
      <div className="flex items-center justify-center gap-2">
        <Shield className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">
          {isLogin ? 'Welcome Back' : 'Get Started'}
        </h1>
      </div>
      <p className="text-muted-foreground">
        {isLogin 
          ? 'Sign in to your account to continue' 
          : 'Create your account to get started'
        }
      </p>
    </div>
  );
}
