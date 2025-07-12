
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  badge?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export function EnhancedNavLink({ to, children, className, badge, icon: Icon }: NavLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "nav-link-enhanced group relative",
        isActive && "active",
        className
      )}
    >
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4" />}
        <span>{children}</span>
        {badge && (
          <Badge variant="secondary" className="ml-auto text-xs">
            {badge}
          </Badge>
        )}
      </div>
      {isActive && (
        <motion.div
          className="absolute inset-0 bg-primary/10 rounded-md -z-10"
          layoutId="activeNavBg"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </Link>
  );
}

interface CTAButtonProps {
  to?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  loading?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

export function EnhancedCTAButton({ 
  to, 
  onClick, 
  children, 
  variant = 'primary', 
  size = 'default',
  className,
  loading,
  icon: Icon 
}: CTAButtonProps) {
  const buttonClass = cn(
    variant === 'primary' && "btn-cta-enhanced",
    variant === 'secondary' && "btn-secondary-enhanced",
    variant === 'outline' && "btn-ghost-enhanced",
    "group",
    className
  );

  const content = (
    <>
      {Icon && <Icon className="h-4 w-4 mr-2" />}
      {children}
    </>
  );

  if (to) {
    return (
      <Button asChild size={size} className={buttonClass} disabled={loading}>
        <Link to={to}>
          {content}
        </Link>
      </Button>
    );
  }

  return (
    <Button 
      onClick={onClick} 
      size={size} 
      className={buttonClass}
      disabled={loading}
      loading={loading}
    >
      {content}
    </Button>
  );
}

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'outline';
  };
  actions?: React.ReactNode;
  className?: string;
}

export function EnhancedPageHeader({ 
  title, 
  description, 
  badge, 
  actions, 
  className 
}: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("space-y-4", className)}
    >
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h1 className="heading-2">{title}</h1>
            {badge && (
              <Badge variant={badge.variant || 'secondary'} className="badge-info-enhanced">
                {badge.text}
              </Badge>
            )}
          </div>
          {description && (
            <p className="body-large max-w-2xl">
              {description}
            </p>
          )}
        </div>
        
        {actions && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface MetricDisplayProps {
  value: string | number;
  label: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

export function EnhancedMetricDisplay({
  value,
  label,
  change,
  trend = 'neutral',
  icon: Icon,
  className
}: MetricDisplayProps) {
  const trendColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-muted-foreground'
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        {Icon && <Icon className={cn("h-5 w-5", trendColors[trend])} />}
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </div>
      <div className="space-y-1">
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {change && (
          <div className={cn("text-xs font-medium", trendColors[trend])}>
            {change}
          </div>
        )}
      </div>
    </div>
  );
}
