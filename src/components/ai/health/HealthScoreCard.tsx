
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface HealthScoreCardProps {
  healthScore: number;
  lastCheck: Date | null;
  getHealthScoreColor: (score: number) => string;
  getHealthScoreLabel: (score: number) => string;
}

export function HealthScoreCard({ 
  healthScore, 
  lastCheck, 
  getHealthScoreColor, 
  getHealthScoreLabel 
}: HealthScoreCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-red-500" />
                <h3 className="text-lg font-semibold">Database Health Score</h3>
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-4xl font-bold ${getHealthScoreColor(healthScore)}`}>
                  {healthScore}
                </span>
                <span className="text-2xl text-muted-foreground">/100</span>
              </div>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getHealthScoreColor(healthScore)} bg-opacity-10`}>
                {getHealthScoreLabel(healthScore)}
              </div>
            </div>
            <div className="text-right space-y-1">
              <div className="text-sm text-muted-foreground">Last Check</div>
              <div className="text-sm font-medium">
                {lastCheck ? lastCheck.toLocaleString() : 'Never'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
