
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Zap, 
  Database, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Play,
  Code,
  BarChart3,
  Shield,
  Lightbulb
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AIOptimizationStudio() {
  const [sqlQuery, setSqlQuery] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimize = () => {
    setIsOptimizing(true);
    setTimeout(() => setIsOptimizing(false), 2000);
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms analyze your queries and suggest optimizations based on millions of patterns.",
      color: "text-purple-600"
    },
    {
      icon: Zap,
      title: "Instant Optimization",
      description: "Get optimization recommendations in seconds, not hours. Our AI processes complex queries faster than any human expert.",
      color: "text-yellow-600"
    },
    {
      icon: Database,
      title: "Multi-Database Support",
      description: "Works with PostgreSQL, MySQL, MongoDB, SQL Server, and more. One tool for all your database optimization needs.",
      color: "text-blue-600"
    },
    {
      icon: BarChart3,
      title: "Performance Insights",
      description: "Detailed analytics and performance metrics to understand exactly how your optimizations improve query execution.",
      color: "text-green-600"
    },
    {
      icon: Shield,
      title: "Safe Testing Environment",
      description: "Test optimizations safely with our sandbox environment before applying changes to production databases.",
      color: "text-red-600"
    },
    {
      icon: Code,
      title: "Code Generation",
      description: "Auto-generate optimized queries, indexes, and database schema improvements with explanation and rationale.",
      color: "text-indigo-600"
    }
  ];

  const benefits = [
    { icon: TrendingUp, stat: "73%", label: "Average Performance Improvement" },
    { icon: Clock, stat: "5min", label: "Setup Time" },
    { icon: Database, stat: "10+", label: "Database Types Supported" },
    { icon: CheckCircle2, stat: "99.9%", label: "Accuracy Rate" }
  ];

  const useCases = [
    {
      title: "Slow Query Optimization",
      description: "Identify and fix performance bottlenecks in complex queries",
      example: "SELECT * FROM orders JOIN customers... → Optimized with proper indexes and JOIN order"
    },
    {
      title: "Index Recommendations",
      description: "Get AI-powered suggestions for optimal database indexing strategies",
      example: "CREATE INDEX idx_customer_date ON orders(customer_id, order_date)"
    },
    {
      title: "Schema Optimization",
      description: "Improve table structure and relationships for better performance",
      example: "Normalize tables, optimize data types, and improve foreign key relationships"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 space-y-16">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-6"
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl shadow-lg">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <Badge variant="secondary" className="px-4 py-2 bg-gradient-to-r from-purple-500/10 to-blue-600/10 text-purple-700 border-purple-200">
            AI Studio
          </Badge>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            AI-Powered Database
          </span>
          <br />
          Optimization Studio
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Transform your database performance with cutting-edge AI. Analyze, optimize, and enhance your SQL queries 
          with intelligent recommendations that reduce response times by up to 73%.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Button size="lg" className="min-w-[200px] bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            <Play className="mr-2 h-5 w-5" />
            Try AI Studio Free
          </Button>
          <Button variant="outline" size="lg" className="min-w-[200px]" asChild>
            <Link to="/login">
              View Live Demo
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Interactive Demo Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-gradient-to-br from-muted/30 to-muted/10 p-8 rounded-xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">Try AI Optimization Now</h2>
          <p className="text-muted-foreground">Paste your SQL query below and see how our AI can optimize it</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Your SQL Query
              </CardTitle>
              <CardDescription>
                Enter any SQL query to see AI-powered optimization recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="SELECT * FROM users JOIN orders ON users.id = orders.user_id WHERE users.created_at > '2024-01-01'..."
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                className="min-h-[120px] font-mono"
              />
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-muted-foreground">
                  {sqlQuery.length > 0 ? `${sqlQuery.length} characters` : 'Start typing your query...'}
                </div>
                <Button 
                  onClick={handleOptimize}
                  disabled={!sqlQuery.trim() || isOptimizing}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {isOptimizing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="mr-2"
                      >
                        <Brain className="h-4 w-4" />
                      </motion.div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Lightbulb className="mr-2 h-4 w-4" />
                      Optimize Query
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {sqlQuery.trim() && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-green-200 bg-green-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 className="h-5 w-5" />
                    AI Optimization Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4 text-center">
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-green-600">-67%</div>
                      <div className="text-sm text-muted-foreground">Execution Time</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-blue-600">+3</div>
                      <div className="text-sm text-muted-foreground">Index Suggestions</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-purple-600">A+</div>
                      <div className="text-sm text-muted-foreground">Performance Grade</div>
                    </div>
                  </div>
                  <div className="text-center pt-4">
                    <Button variant="outline" asChild>
                      <Link to="/login">
                        See Full Analysis
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Benefits Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        {benefits.map((benefit, index) => (
          <Card key={index} className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <benefit.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
              <div className="text-3xl font-bold text-primary mb-2">{benefit.stat}</div>
              <div className="text-sm text-muted-foreground">{benefit.label}</div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Features Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="space-y-8"
      >
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Powerful AI Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to optimize, analyze, and enhance your database performance
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <feature.icon className={`h-10 w-10 mb-3 ${feature.color}`} />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Use Cases */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="space-y-8"
      >
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Common Use Cases</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how AI Studio solves real-world database performance challenges
          </p>
        </div>
        
        <div className="space-y-6">
          {useCases.map((useCase, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-6 items-center">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{useCase.title}</h3>
                    <p className="text-muted-foreground">{useCase.description}</p>
                  </div>
                  <div className="md:col-span-2">
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <code className="text-sm">{useCase.example}</code>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-8 rounded-xl text-center space-y-6"
      >
        <Brain className="h-12 w-12 mx-auto text-purple-600" />
        <h2 className="text-3xl font-bold">Ready to Optimize Your Database?</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Join thousands of developers using AI Studio to improve their database performance. 
          Start optimizing your queries today with our free plan.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button size="lg" className="min-w-[200px] bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" asChild>
            <Link to="/login">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="min-w-[200px]" asChild>
            <Link to="/contact">
              Contact Sales
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
