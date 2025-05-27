
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  Brain, 
  TrendingUp, 
  Star, 
  Clock, 
  Target,
  BookOpen,
  Lightbulb
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { aiService, type QuerySuggestion } from '@/services/aiService';

export function PersonalizedRecommendations() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<QuerySuggestion[]>([]);
  const [userInsights, setUserInsights] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadPersonalizedRecommendations();
    }
  }, [user]);

  const loadPersonalizedRecommendations = async () => {
    setIsLoading(true);
    try {
      // Mock user profile and query history for demo
      const userProfile = {
        experience_level: 'intermediate',
        preferred_databases: ['postgresql', 'mysql'],
        common_patterns: ['user_queries', 'reporting', 'analytics'],
        performance_focus: ['speed', 'scalability']
      };

      const queryHistory = [
        { query: 'SELECT * FROM users', performance: 'slow', issues: ['select_star'] },
        { query: 'SELECT id, name FROM products WHERE category_id = ?', performance: 'good' },
        { query: 'SELECT COUNT(*) FROM orders GROUP BY user_id', performance: 'medium', issues: ['no_index'] }
      ];

      const recommendations = await aiService.generatePersonalizedRecommendations(userProfile, queryHistory);
      setRecommendations(recommendations);

      // Generate user insights
      setUserInsights({
        improvementPotential: 'High',
        strongAreas: ['Query structure', 'Basic optimization'],
        learningOpportunities: ['Advanced indexing', 'Query planning', 'Performance monitoring'],
        weeklyProgress: '+15% query performance',
        skillLevel: 'Intermediate'
      });
    } catch (error) {
      console.error('Failed to load recommendations:', error);
      // Fallback recommendations
      setRecommendations([
        {
          id: '1',
          type: 'best-practice',
          priority: 'medium',
          title: 'Avoid SELECT * in production queries',
          description: 'Based on your query history, you frequently use SELECT *. Consider selecting only needed columns for better performance.',
          originalCode: 'SELECT * FROM users WHERE active = true',
          suggestedCode: 'SELECT id, name, email FROM users WHERE active = true',
          expectedImprovement: '20-40% faster, reduced memory usage',
          implementationEffort: 'low',
          confidence: 0.9
        },
        {
          id: '2',
          type: 'optimization',
          priority: 'high',
          title: 'Add index for frequently filtered columns',
          description: 'Your queries often filter by user_id and created_at. Consider adding a composite index.',
          originalCode: '-- No index on user_id, created_at',
          suggestedCode: 'CREATE INDEX idx_user_activity ON activities(user_id, created_at DESC);',
          expectedImprovement: '60-80% faster query execution',
          implementationEffort: 'low',
          confidence: 0.85
        }
      ]);

      setUserInsights({
        improvementPotential: 'Medium',
        strongAreas: ['Basic SQL syntax'],
        learningOpportunities: ['Query optimization', 'Indexing strategies'],
        weeklyProgress: 'Connect AI service for tracking',
        skillLevel: 'Beginner'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <Target className="h-4 w-4 text-red-500" />;
      case 'high': return <TrendingUp className="h-4 w-4 text-orange-500" />;
      case 'medium': return <Star className="h-4 w-4 text-blue-500" />;
      case 'low': return <Clock className="h-4 w-4 text-gray-500" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Sign in for Personalized Recommendations</h3>
          <p className="text-muted-foreground">
            Get AI-powered suggestions tailored to your query patterns and skill level.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Brain className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Personalized AI Recommendations</h2>
      </div>

      {/* User Insights */}
      {userInsights && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Your Database Skills Profile
            </CardTitle>
            <CardDescription>
              AI-generated insights based on your query patterns and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-lg font-bold">{userInsights.skillLevel}</div>
                <div className="text-sm text-muted-foreground">Skill Level</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-lg font-bold">{userInsights.improvementPotential}</div>
                <div className="text-sm text-muted-foreground">Improvement Potential</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <Star className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-lg font-bold">{userInsights.strongAreas.length}</div>
                <div className="text-sm text-muted-foreground">Strong Areas</div>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                <BookOpen className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-lg font-bold">{userInsights.learningOpportunities.length}</div>
                <div className="text-sm text-muted-foreground">Learning Opportunities</div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <Alert>
                <TrendingUp className="h-4 w-4" />
                <AlertDescription>
                  <strong>This week:</strong> {userInsights.weeklyProgress}
                </AlertDescription>
              </Alert>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2 text-green-600">Strong Areas</h4>
                  <ul className="text-sm space-y-1">
                    {userInsights.strongAreas.map((area: string, index: number) => (
                      <li key={index} className="flex items-center gap-2">
                        <Star className="h-3 w-3 text-green-500" />
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-blue-600">Learning Opportunities</h4>
                  <ul className="text-sm space-y-1">
                    {userInsights.learningOpportunities.map((opportunity: string, index: number) => (
                      <li key={index} className="flex items-center gap-2">
                        <BookOpen className="h-3 w-3 text-blue-500" />
                        {opportunity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Personalized Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Tailored Recommendations
          </CardTitle>
          <CardDescription>
            AI suggestions based on your query patterns and performance history
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <Brain className="h-8 w-8 text-muted-foreground mx-auto mb-4 animate-pulse" />
              <p className="text-muted-foreground">Generating personalized recommendations...</p>
            </div>
          ) : recommendations.length > 0 ? (
            <div className="space-y-4">
              {recommendations.map((recommendation) => (
                <div key={recommendation.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getPriorityIcon(recommendation.priority)}
                      <h4 className="font-medium">{recommendation.title}</h4>
                      <Badge variant="outline">
                        {Math.round(recommendation.confidence * 100)}% match
                      </Badge>
                    </div>
                    <Badge variant="secondary">
                      {recommendation.expectedImprovement}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">{recommendation.description}</p>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h5 className="font-medium mb-2">Current Pattern</h5>
                      <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                        <code>{recommendation.originalCode}</code>
                      </pre>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Recommended Approach</h5>
                      <pre className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 p-3 rounded text-xs overflow-x-auto">
                        <code>{recommendation.suggestedCode}</code>
                      </pre>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <span className="text-sm text-muted-foreground">
                      Effort: <strong>{recommendation.implementationEffort}</strong>
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Learn More
                      </Button>
                      <Button size="sm">
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Recommendations Yet</h3>
              <p className="text-muted-foreground">
                Start analyzing queries to receive personalized recommendations.
              </p>
              <Button className="mt-4" onClick={loadPersonalizedRecommendations}>
                Generate Recommendations
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
