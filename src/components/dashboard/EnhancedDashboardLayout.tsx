
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/auth-context';
import { ModularWidgetSystem, defaultWidgets } from './ModularWidgetSystem';
import { ProgressiveDataDisclosure, samplePerformanceLayers } from './ProgressiveDataDisclosure';
import { AnimatedMetricCard, EnhancedLoadingState, FeedbackAnimation, sampleMetrics } from './InteractiveElements';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  TrendingUp, 
  Shield, 
  Activity, 
  Eye, 
  Database, 
  Zap, 
  Settings,
  HelpCircle,
  Bell,
  Search
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function EnhancedDashboardLayout() {
  const { user, isDemo } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'info'>('success');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [widgets, setWidgets] = useState(defaultWidgets);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case '1':
            event.preventDefault();
            setActiveTab('overview');
            break;
          case '2':
            event.preventDefault();
            setActiveTab('performance');
            break;
          case '3':
            event.preventDefault();
            setActiveTab('analytics');
            break;
          case 'k':
            event.preventDefault();
            // Focus search (would implement search functionality)
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleWidgetReorder = (newWidgets: typeof defaultWidgets) => {
    setWidgets(newWidgets);
    showSuccessFeedback('Dashboard layout updated successfully');
  };

  const handleWidgetVisibilityToggle = (widgetId: string, isVisible: boolean) => {
    showSuccessFeedback(`Widget ${isVisible ? 'enabled' : 'disabled'}`);
  };

  const showSuccessFeedback = (message: string) => {
    setFeedbackType('success');
    setFeedbackMessage(message);
    setShowFeedback(true);
  };

  const simulateDataLoad = async () => {
    setIsLoading(true);
    setLoadingProgress(0);
    
    for (let i = 0; i <= 100; i += 10) {
      setLoadingProgress(i);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    setIsLoading(false);
    showSuccessFeedback('Dashboard data refreshed');
  };

  return (
    <div className="space-y-8 min-h-screen">
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">
              Enhanced Dashboard
            </h1>
            {isDemo && (
              <Badge variant="secondary" className="animate-pulse">
                <Eye className="h-3 w-3 mr-1" />
                Demo Mode
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-lg">
            {isDemo 
              ? 'Explore enterprise-grade features with interactive demos'
              : 'Real-time insights with AI-powered optimization recommendations'
            }
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span>94% performance score</span>
            </div>
            <div className="flex items-center gap-1">
              <Database className="h-4 w-4 text-blue-600" />
              <span>156 active connections</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="h-4 w-4 text-purple-600" />
              <span>All systems secure</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="animate-pulse">
              <Activity className="h-3 w-3 mr-1" />
              Live monitoring
            </Badge>
            <Button variant="outline" size="sm" onClick={simulateDataLoad}>
              <Activity className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
          <Button asChild size="lg" className="bg-gradient-to-r from-primary to-blue-600">
            <Link to="/ai-studio">
              <Brain className="h-4 w-4 mr-2" />
              AI Studio
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Interactive Metrics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {sampleMetrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <AnimatedMetricCard {...metric} />
          </motion.div>
        ))}
      </motion.div>

      {/* Enhanced Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 h-auto p-1">
          <TabsTrigger value="overview" className="min-h-[44px] flex flex-col gap-1">
            <Activity className="h-4 w-4" />
            <span className="text-xs">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="widgets" className="min-h-[44px] flex flex-col gap-1">
            <Settings className="h-4 w-4" />
            <span className="text-xs">Widgets</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="min-h-[44px] flex flex-col gap-1">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs">Performance</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="min-h-[44px] flex flex-col gap-1">
            <Shield className="h-4 w-4" />
            <span className="text-xs">Security</span>
          </TabsTrigger>
          <TabsTrigger value="help" className="min-h-[44px] flex flex-col gap-1">
            <HelpCircle className="h-4 w-4" />
            <span className="text-xs">Help</span>
          </TabsTrigger>
        </TabsList>

        <EnhancedLoadingState 
          isLoading={isLoading} 
          progress={loadingProgress}
          message="Refreshing dashboard data..."
        >
          <TabsContent value="overview" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <ProgressiveDataDisclosure
                title="System Performance Analysis"
                description="Detailed breakdown of your database performance metrics"
                layers={samplePerformanceLayers}
                initialExpandedLayers={['query-performance']}
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="widgets" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <ModularWidgetSystem
                initialWidgets={widgets}
                onWidgetReorder={handleWidgetReorder}
                onWidgetVisibilityToggle={handleWidgetVisibilityToggle}
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center py-12"
            >
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Advanced Performance Analytics</h3>
              <p className="text-muted-foreground mb-4">
                Detailed performance charts and optimization recommendations
              </p>
              <Button onClick={() => showSuccessFeedback('Performance analysis updated')}>
                <Activity className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </motion.div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center py-12"
            >
              <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Security Dashboard</h3>
              <p className="text-muted-foreground mb-4">
                SOC2 compliant monitoring with real-time threat detection
              </p>
              <div className="flex justify-center gap-2">
                <Badge variant="outline">SOC2 Certified</Badge>
                <Badge variant="outline">99.9% Uptime</Badge>
                <Badge variant="outline">Zero Threats</Badge>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="help" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center py-12"
            >
              <HelpCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Interactive Help Center</h3>
              <p className="text-muted-foreground mb-4">
                Contextual guidance and keyboard shortcuts for efficient navigation
              </p>
              <div className="space-y-2 text-sm text-muted-foreground max-w-md mx-auto">
                <div className="flex justify-between">
                  <span>Switch to Overview:</span>
                  <Badge variant="outline">Ctrl+1</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Switch to Performance:</span>
                  <Badge variant="outline">Ctrl+2</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Search Dashboard:</span>
                  <Badge variant="outline">Ctrl+K</Badge>
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </EnhancedLoadingState>
      </Tabs>

      {/* Feedback Animation */}
      <FeedbackAnimation
        type={feedbackType}
        message={feedbackMessage}
        isVisible={showFeedback}
        onDismiss={() => setShowFeedback(false)}
      />
    </div>
  );
}
