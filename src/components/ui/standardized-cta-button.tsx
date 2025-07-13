
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface StandardizedCTAButtonProps extends Omit<ButtonProps, 'onClick'> {
  variant?: 'primary' | 'demo';
  text?: string;
  showIcon?: boolean;
  customDestination?: string;
  onCustomClick?: () => void;
}

export function StandardizedCTAButton({ 
  variant = 'primary',
  text,
  showIcon = true,
  customDestination,
  onCustomClick,
  className,
  ...props 
}: StandardizedCTAButtonProps) {
  const { user, loginDemo } = useAuth();
  const navigate = useNavigate();

  const getButtonText = () => {
    if (text) return text;
    
    if (variant === 'demo') {
      return 'Try Demo';
    }
    
    if (user) {
      return 'Go to Dashboard';
    }
    
    return 'Start for Free';
  };

  const handleClick = async () => {
    if (onCustomClick) {
      onCustomClick();
      return;
    }

    if (customDestination) {
      navigate(customDestination);
      return;
    }

    try {
      if (variant === 'demo') {
        navigate('/demo');
        return;
      }

      if (user) {
        navigate('/app');
      } else {
        // For unauthenticated users, start with demo experience
        await loginDemo();
        navigate('/app');
      }
    } catch (error) {
      console.error('CTA navigation error:', error);
      navigate('/login');
    }
  };

  return (
    <Button 
      onClick={handleClick}
      className={className}
      {...props}
    >
      {getButtonText()}
      {showIcon && <ArrowRight className="ml-2 h-4 w-4" />}
    </Button>
  );
}
