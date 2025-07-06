
import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'elevated' | 'bordered' | 'glass';
    interactive?: boolean;
    loading?: boolean;
  }
>(({ className, variant = 'default', interactive = false, loading = false, ...props }, ref) => {
  const variants = {
    default: 'bg-card text-card-foreground shadow-soft',
    elevated: 'bg-card text-card-foreground shadow-medium hover:shadow-strong',
    bordered: 'bg-card text-card-foreground border-2 border-border hover:border-primary/50',
    glass: 'bg-background/60 backdrop-blur-xl border border-white/20 text-card-foreground shadow-soft'
  };

  // Separate HTML props from potential Framer Motion props
  const {
    onDrag,
    onDragStart,
    onDragEnd,
    onAnimationStart,
    onAnimationEnd,
    ...htmlProps
  } = props;

  return (
    <motion.div
      ref={ref}
      className={cn(
        'rounded-xl transition-all duration-200',
        variants[variant],
        interactive && 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]',
        loading && 'pointer-events-none opacity-60',
        className
      )}
      whileHover={interactive ? { y: -4 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      {...htmlProps}
    />
  );
});
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    badge?: string;
    badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  }
>(({ className, badge, badgeVariant = 'default', children, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6 pb-4', className)} {...props}>
    {badge && (
      <div className="mb-2">
        <Badge variant={badgeVariant} className="text-xs">
          {badge}
        </Badge>
      </div>
    )}
    {children}
  </div>
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    gradient?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl';
  }
>(({ className, gradient = false, size = 'md', ...props }, ref) => {
  const sizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <h3
      ref={ref}
      className={cn(
        'font-bold leading-none tracking-tight',
        sizes[size],
        gradient && 'bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent',
        className
      )}
      {...props}
    />
  );
});
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & {
    size?: 'sm' | 'md' | 'lg';
  }
>(({ className, size = 'md', ...props }, ref) => {
  const sizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <p
      ref={ref}
      className={cn(
        'text-muted-foreground leading-relaxed',
        sizes[size],
        className
      )}
      {...props}
    />
  );
});
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    noPadding?: boolean;
  }
>(({ className, noPadding = false, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn(
      noPadding ? '' : 'p-6 pt-0',
      className
    )} 
    {...props} 
  />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    separated?: boolean;
  }
>(({ className, separated = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center p-6 pt-0',
      separated && 'border-t pt-6 mt-6',
      className
    )}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

// Specialized card variants
interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatsCard = React.forwardRef<HTMLDivElement, StatsCardProps>(
  ({ title, value, description, icon, trend, className }, ref) => (
    <Card ref={ref} variant="elevated" interactive className={className}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold">{value}</p>
              {trend && (
                <span className={cn(
                  'text-sm font-medium flex items-center gap-1',
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                )}>
                  {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {icon && (
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
);
StatsCard.displayName = 'StatsCard';

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  badge?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const FeatureCard = React.forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ title, description, icon, badge, href, onClick, className, children }, ref) => {
    if (href) {
      return (
        <motion.a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          ref={ref as React.ForwardedRef<HTMLAnchorElement>}
          className={cn(
            'block rounded-xl transition-all duration-200 bg-card text-card-foreground shadow-medium hover:shadow-strong cursor-pointer hover:scale-[1.02] active:scale-[0.98] group',
            className
          )}
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <CardHeader badge={badge}>
            {icon && (
              <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-primary/10 to-blue-600/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform duration-200">
                {icon}
              </div>
            )}
            <CardTitle gradient>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          {children && <CardContent>{children}</CardContent>}
        </motion.a>
      );
    }

    return (
      <Card
        variant="elevated"
        interactive
        className={cn('group', className)}
        onClick={onClick}
        ref={ref}
      >
        <CardHeader badge={badge}>
          {icon && (
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-primary/10 to-blue-600/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform duration-200">
              {icon}
            </div>
          )}
          <CardTitle gradient>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        {children && <CardContent>{children}</CardContent>}
      </Card>
    );
  }
);
FeatureCard.displayName = 'FeatureCard';

interface TestimonialCardProps {
  quote: string;
  author: {
    name: string;
    role: string;
    company?: string;
    avatar?: string;
  };
  rating?: number;
  className?: string;
}

const TestimonialCard = React.forwardRef<HTMLDivElement, TestimonialCardProps>(
  ({ quote, author, rating, className }, ref) => (
    <Card ref={ref} variant="glass" className={className}>
      <CardContent className="p-6">
        {rating && (
          <div className="flex items-center gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  'text-sm',
                  i < rating ? 'text-yellow-500' : 'text-muted-foreground'
                )}
              >
                ★
              </span>
            ))}
          </div>
        )}
        
        <blockquote className="text-sm leading-relaxed mb-4">
          "{quote}"
        </blockquote>
        
        <div className="flex items-center gap-3">
          {author.avatar ? (
            <img
              src={author.avatar}
              alt={author.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center text-white text-sm font-medium">
              {author.name.charAt(0)}
            </div>
          )}
          <div>
            <p className="text-sm font-medium">{author.name}</p>
            <p className="text-xs text-muted-foreground">
              {author.role}
              {author.company && ` at ${author.company}`}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
);
TestimonialCard.displayName = 'TestimonialCard';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  StatsCard,
  FeatureCard,
  TestimonialCard,
};
