
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, Users, Zap } from 'lucide-react';

interface EnhancedCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  badge?: string;
  stats?: { label: string; value: string }[];
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'gradient' | 'minimal';
  className?: string;
}

export function EnhancedCard({
  title,
  description,
  icon = <Zap className="h-6 w-6" />,
  badge,
  stats,
  action,
  variant = 'default',
  className = ''
}: EnhancedCardProps) {
  const baseClasses = "shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105";
  const variantClasses = {
    default: "",
    gradient: "bg-gradient-to-br from-primary/5 to-blue-600/5 border-primary/20",
    minimal: "border-none shadow-none hover:shadow-md"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={className}
    >
      <Card className={`${baseClasses} ${variantClasses[variant]} h-full`}>
        <CardHeader>
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-primary/10 rounded-lg text-primary">
              {icon}
            </div>
            {badge && (
              <Badge variant="secondary" className="text-xs">
                {badge}
              </Badge>
            )}
          </div>
          <CardTitle className="text-xl mb-2">{title}</CardTitle>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {description}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {stats && (
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
          
          {action && (
            <Button 
              onClick={action.onClick}
              variant="outline"
              size="sm"
              className="w-full group"
            >
              {action.label}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Pre-configured card variants for common use cases
export function MetricCard({ metric, value, trend, description }: {
  metric: string;
  value: string;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
}) {
  const trendIcon = trend === 'up' ? <TrendingUp className="h-4 w-4 text-green-600" /> : null;
  
  return (
    <EnhancedCard
      title={metric}
      description={description || 'Performance metric'}
      icon={trendIcon || <TrendingUp className="h-6 w-6" />}
      stats={[{ label: 'Current', value }]}
      variant="gradient"
    />
  );
}

export function TeamCard({ teamName, memberCount, role, onViewTeam }: {
  teamName: string;
  memberCount: number;
  role: string;
  onViewTeam: () => void;
}) {
  return (
    <EnhancedCard
      title={teamName}
      description={`${role} • ${memberCount} members`}
      icon={<Users className="h-6 w-6" />}
      action={{
        label: 'View Team',
        onClick: onViewTeam
      }}
    />
  );
}
