
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Heart, 
  AlertTriangle, 
  CheckCircle, 
  Zap, 
  TrendingUp,
  Database,
  Shield,
  Wrench,
  RefreshCw,
  Bot
} from 'lucide-react';
import { nextGenAIService, type DatabaseHealthInsight } from '@/services/ai/nextGenAIService';
import { enhancedToast } from '@/components/ui/enhanced-toast';
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem } from '@/components/ui/animations';

export function DatabaseHealthAssistant() {
  const [insights, setInsights] = useState<DatabaseHealthInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [healthScore, setHealthScore] = useState(85);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  useEffect(() => {
    // Auto-generate insights on component mount
    generateInsights();
  }, []);

  const generateInsights = async () => {
    setIsAnalyzing(true);
    
    try {
      const healthInsights = await nextGenAIService.generateDatabaseHealthInsights('demo-db');
      setInsights(healthInsights);
      setLastCheck(new Date());
      
      // Calculate health score based on insights
      const criticalCount = healthInsights.filter(i => i.priority === 'critical').length;
      const highCount = healthInsights.filter(i => i.priority === 'high').length;
      const newScore = Math.max(50, 100 - (criticalCount * 20) - (highCount * 10));
      setHealthScore(newScore);

      enhancedToast.success({
        title: "Health Analysis Complete",
        description: `Generated ${healthInsights.length} insights for your database`,
      });
    } catch (error) {
      enhancedToast.error({
        title: "Health Analysis Failed",
        description: "Unable to analyze database health. Please try again.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'medium': return <TrendingUp className="h-4 w-4 text-yellow-600" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-green-600" />;
      default: return <CheckCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'performance': return <Zap className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      case 'optimization': return <TrendingUp className="h-4 w-4" />;
      case 'maintenance': return <Wrench className="h-4 w-4" />;
      default: return <Database className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Fair';
    if (score >= 60) return 'Poor';
    return 'Critical';
  };

  return (
    <div className="space-y-6">
      <FadeIn>
        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-green-600" />
              Database Health Assistant
              <Badge variant="secondary" className="ml-2">
                <Bot className="h-3 w-3 mr-1" />
                AI-Powered
              </Badge>
            </CardTitle>
            <CardDescription>
              AI-powered health monitoring that proactively identifies and resolves database issues
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Health Score */}
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <div className={`text-4xl font-bold ${getHealthScoreColor(healthScore)}`}>
                  {healthScore}%
                </div>
                <div className="text-lg font-medium">
                  Database Health Score - {getHealthScoreLabel(healthScore)}
                </div>
                <Progress value={healthScore} className="w-full h-3" />
              </div>
              
              {lastCheck && (
                <div className="text-sm text-muted-foreground">
                  Last checked: {lastCheck.toLocaleString()}
                </div>
              )}
            </div>

            <Button 
              onClick={generateInsights} 
              disabled={isAnalyzing}
              className="w-full"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Database Health...
                </>
              ) : (
                <>
                  <Heart className="mr-2 h-4 w-4" />
                  Run Health Check
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </FadeIn>

      {insights.length > 0 && (
        <StaggerContainer>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">AI Health Insights</h3>
            
            {insights.map((insight, index) => (
              <StaggerItem key={index} delay={index * 0.1}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 rounded-lg bg-gray-50">
                          {getCategoryIcon(insight.category)}
                        </div>
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{insight.title}</h4>
                            <Badge variant={getPriorityColor(insight.priority)}>
                              {getPriorityIcon(insight.priority)}
                              {insight.priority}
                            </Badge>
                            {insight.automatable && (
                              <Badge variant="outline" className="text-xs">
                                <Bot className="h-3 w-3 mr-1" />
                                Auto-fixable
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {insight.description}
                          </p>
                          <Alert className="mt-2">
                            <CheckCircle className="h-4 w-4" />
                            <AlertDescription>
                              <strong>Recommendation:</strong> {insight.recommendation}
                              <br />
                              <strong>Impact:</strong> {insight.estimatedImpact}
                            </AlertDescription>
                          </Alert>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      {insight.automatable && (
                        <Button size="sm" className="flex-1">
                          <Zap className="mr-2 h-3 w-3" />
                          Auto-Fix
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      )}

      {insights.length === 0 && !isAnalyzing && (
        <Card>
          <CardContent className="text-center py-8">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Health Insights Yet</h3>
            <p className="text-muted-foreground mb-4">
              Run a health check to get AI-powered insights about your database
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
