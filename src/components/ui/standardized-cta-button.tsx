
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface StandardizedCTAButtonProps extends Omit<ButtonProps, 'onClick'> {
  ctaType?: 'primary' | 'demo';
  text?: string;
  showIcon?: boolean;
  customDestination?: string;
  onCustomClick?: () => void;
}

export function StandardizedCTAButton({ 
  ctaType = 'primary',
  text,
  showIcon = true,
  customDestination,
  onCustomClick,
  className,
  variant,
  ...props 
}: StandardizedCTAButtonProps) {
  const { user, loginDemo } = useAuth();
  const navigate = useNavigate();

  const getButtonText = () => {
    if (text) return text;
    
    if (ctaType === 'demo') {
      return 'Try Demo';
    }
    
    if (user) {
      return 'Go to Dashboard';
    }
    
    return 'Start for Free';
  };

  const getButtonVariant = () => {
    if (variant) return variant;
    if (ctaType === 'demo') return 'outline';
    return 'default';
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
      if (ctaType === 'demo') {
        navigate('/demo');
        return;
      }

      if (user) {
        navigate('/app');
      } else {
        // For "Start for Free", go to demo first
        navigate('/demo');
      }
    } catch (error) {
      console.error('CTA navigation error:', error);
      navigate('/demo');
    }
  };

  return (
    <Button 
      onClick={handleClick}
      variant={getButtonVariant()}
      className={className}
      {...props}
    >
      {getButtonText()}
      {showIcon && <ArrowRight className="ml-2 h-4 w-4" />}
    </Button>
  );
}
