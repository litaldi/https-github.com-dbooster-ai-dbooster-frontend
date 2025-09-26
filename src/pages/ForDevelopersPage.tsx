
import React, { useState, useEffect } from 'react';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, useInView } from 'framer-motion';
import { 
  Code, 
  Terminal, 
  GitBranch, 
  Zap, 
  ArrowRight,
  CheckCircle2,
  Cpu,
  Database,
  FileCode,
  Monitor,
  Play,
  Copy,
  Star,
  Users,
  TrendingUp,
  Shield,
  Clock,
  Sparkles,
  ExternalLink,
  Github,
  Download,
  BookOpen,
  MessageCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRef } from 'react';

const developerFeatures = [
  {
    title: "IDE Integration",
    description: "Seamlessly integrate with VS Code, IntelliJ, and other popular IDEs for real-time query optimization.",
    icon: <FileCode className="h-8 w-8" />,
    gradient: "from-blue-500 to-blue-600",
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
    features: ["VS Code extension", "IntelliJ plugin", "Real-time suggestions", "Inline performance hints"],
    comingSoon: false,
    popular: true
  },
  {
    title: "Git Workflow Integration", 
    description: "Automatically scan commits for query changes and provide optimization suggestions in pull requests.",
    icon: <GitBranch className="h-8 w-8" />,
    gradient: "from-orange-500 to-red-500",
    color: "text-orange-600",
    bgColor: "bg-orange-500/10",
    features: ["PR comments", "Commit scanning", "CI/CD integration", "Performance regression detection"],
    comingSoon: false,
    popular: false
  },
  {
    title: "Developer API",
    description: "Comprehensive REST API and SDK for programmatic access to optimization features.",
    icon: <Terminal className="h-8 w-8" />,
    gradient: "from-green-500 to-emerald-600",
    color: "text-green-600",
    bgColor: "bg-green-500/10",
    features: ["REST API", "Python SDK", "Node.js SDK", "CLI tools"],
    comingSoon: false,
    popular: true
  },
  {
    title: "Local Development",
    description: "Test and optimize queries in your local development environment before deployment.",
    icon: <Monitor className="h-8 w-8" />,
    gradient: "from-purple-500 to-violet-600",
    color: "text-purple-600",
    bgColor: "bg-purple-500/10",
    features: ["Local analysis", "Docker support", "Staging integration", "Performance testing"],
    comingSoon: false,
    popular: false
  }
];

const codeExamples = [
  {
    title: "CLI Installation",
    language: "bash",
    code: `# Install DBooster CLI
npm install -g @dbooster/cli

# Connect your database
dbooster connect --db postgresql://localhost:5432/mydb

# Analyze your queries
dbooster analyze --path ./src

✨ Found 12 optimization opportunities
💡 Potential 75% performance improvement`
  },
  {
    title: "VS Code Integration",
    language: "sql",
    code: `-- Real-time optimization suggestions
SELECT u.name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at > '2024-01-01'
GROUP BY u.id, u.name;

-- ⚡ DBooster Suggestion:
-- Add index on users.created_at for 85% faster queries
-- CREATE INDEX idx_users_created_at ON users(created_at);`
  },
  {
    title: "Python SDK",
    language: "python",
    code: `from dbooster import Optimizer

# Initialize optimizer
optimizer = Optimizer(connection_string="postgresql://...")

# Analyze query performance
result = optimizer.analyze_query("""
    SELECT * FROM users 
    WHERE email LIKE '%@example.com'
""")

print(f"Performance Score: {result.score}/100")
print(f"Suggestions: {result.suggestions}")`
  }
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Senior Backend Engineer",
    company: "TechFlow",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b2e8c7e2?w=64&h=64&fit=crop&crop=face",
    quote: "DBooster caught a query that was slowing down our entire application. The IDE integration makes optimization effortless.",
    metric: "85% faster queries"
  },
  {
    name: "Miguel Rodriguez",
    role: "Tech Lead",
    company: "DataSync",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
    quote: "The Git integration is a game-changer. We catch performance issues before they hit production.",
    metric: "60% cost reduction"
  },
  {
    name: "Alex Kim",
    role: "Full Stack Developer",
    company: "StartupXYZ",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
    quote: "Setup took less than 5 minutes. The real-time suggestions in VS Code are incredibly helpful.",
    metric: "<1min setup"
  }
];

const usageStats = [
  { label: "Developers", value: 50000, suffix: "+" },
  { label: "Queries Optimized", value: 2.5, suffix: "M+" },
  { label: "Performance Improvement", value: 85, suffix: "%" },
  { label: "Infrastructure Savings", value: 60, suffix: "%" }
];

const benefits = [
  "Reduce query response time by up to 85%",
  "Cut database infrastructure costs by 60%", 
  "Integrate with existing development workflow",
  "Get optimization suggestions as you code",
  "Prevent performance regressions",
  "Scale applications with confidence"
];

export default function ForDevelopersPage() {
  const [activeTab, setActiveTab] = useState("cli");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);
  const isStatsInView = useInView(statsRef, { once: true });

  const copyToClipboard = async (code: string, title: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(title);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <StandardPageLayout
      title="DBooster for Developers - Code Smarter, Not Harder"
      subtitle="Built for Developers"
      description="Powerful database optimization tools integrated directly into your development workflow. Write better queries, catch performance issues early, and ship faster."
    >
      <div className="space-y-24">
        {/* Trust Bar */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-primary/5 via-blue-500/5 to-primary/5 py-8 rounded-2xl border border-primary/10"
        >
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Trusted by leading development teams</span>
            </div>
            <div className="flex items-center justify-center gap-8 text-2xl font-bold">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <span>4.9/5</span>
              </div>
              <div className="w-px h-6 bg-border"></div>
              <div className="flex items-center gap-2">
                <Github className="h-5 w-5" />
                <span>12K+ Stars</span>
              </div>
              <div className="w-px h-6 bg-border"></div>
              <div className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                <span>2M+ Downloads</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Interactive Hero Stats */}
        <section className="text-center" ref={statsRef}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {usageStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={isStatsInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.15,
                  type: "spring",
                  bounce: 0.4
                }}
                className="group"
              >
                <div className="relative overflow-hidden bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border border-border/40 rounded-2xl p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      {[<Zap className="h-8 w-8 text-primary" />, <TrendingUp className="h-8 w-8 text-green-500" />, <Clock className="h-8 w-8 text-blue-500" />, <Users className="h-8 w-8 text-purple-500" />][index]}
                    </div>
                    <div className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent mb-2">
                      {stat.value}{stat.suffix}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                    {isStatsInView && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.5, delay: index * 0.2 + 0.5 }}
                        className="h-1 bg-gradient-to-r from-primary to-blue-400 rounded-full mt-4"
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Developer Features */}
        <section>
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-2">
                <Sparkles className="h-4 w-4 mr-2" />
                Developer-First Features
              </Badge>
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Built for Your Workflow
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Tools designed to integrate seamlessly into your existing development workflow, making database optimization as natural as writing code.
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {developerFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.15,
                  type: "spring",
                  bounce: 0.3
                }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="relative h-full overflow-hidden bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-2 border-border/60 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-3">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    {feature.popular && (
                      <Badge className="bg-gradient-to-r from-orange-500/10 to-red-500/10 text-orange-600 border-orange-500/20">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Popular
                      </Badge>
                    )}
                    {feature.comingSoon && (
                      <Badge className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 border-blue-500/20">
                        Coming Soon
                      </Badge>
                    )}
                  </div>
                  
                  <CardHeader className="relative">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`p-4 bg-gradient-to-br ${feature.gradient} rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {feature.icon}
                      </div>
                      <div>
                        <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors duration-300">{feature.title}</CardTitle>
                        <div className="w-12 h-1 bg-gradient-to-r from-primary to-blue-400 rounded-full group-hover:w-20 transition-all duration-500"></div>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed text-base">
                      {feature.description}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="relative">
                    <div className="space-y-4">
                      {feature.features.map((item, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: idx * 0.1 }}
                          viewport={{ once: true }}
                          className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/30 hover:border-primary/20 transition-colors duration-200"
                        >
                          <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span className="font-medium">{item}</span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Developer Testimonials */}
        <section className="relative overflow-hidden bg-gradient-to-r from-primary/5 via-blue-500/5 to-primary/5 p-12 rounded-3xl border border-primary/10">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Badge className="mb-4 bg-green-500/10 text-green-600 border-green-500/20 px-4 py-2">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Developer Stories
                </Badge>
                <h2 className="text-4xl font-bold mb-6">Why Developers Choose DBooster</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Join thousands of developers who have transformed their database performance and development workflow.
                </p>
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative p-8 bg-background/80 backdrop-blur-sm rounded-2xl border transition-all duration-500 hover:shadow-xl hover:-translate-y-2 ${currentTestimonial === index ? 'border-primary/40 shadow-lg' : 'border-border/40'}`}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full border-2 border-primary/20"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role} at {testimonial.company}</p>
                    </div>
                  </div>
                  <blockquote className="text-muted-foreground mb-6 italic leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-green-600">{testimonial.metric}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 p-6 bg-background/60 backdrop-blur-sm rounded-xl border border-border/40 hover:border-primary/20 transition-colors duration-300"
                >
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="font-medium">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Code Examples */}
        <section className="relative overflow-hidden bg-gradient-to-br from-muted/30 via-card/20 to-muted/30 p-12 rounded-3xl border border-border/40">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 opacity-50"></div>
          <div className="relative max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Badge className="mb-4 bg-blue-500/10 text-blue-600 border-blue-500/20 px-4 py-2">
                  <Code className="h-4 w-4 mr-2" />
                  Get Started in Minutes
                </Badge>
                <h2 className="text-4xl font-bold mb-6">Simple Setup, Powerful Results</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Choose your preferred integration method and start optimizing your database queries in under 5 minutes.
                </p>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8 bg-background/60 backdrop-blur-sm">
                  <TabsTrigger value="cli" className="flex items-center gap-2">
                    <Terminal className="h-4 w-4" />
                    CLI Setup
                  </TabsTrigger>
                  <TabsTrigger value="vscode" className="flex items-center gap-2">
                    <FileCode className="h-4 w-4" />
                    VS Code
                  </TabsTrigger>
                  <TabsTrigger value="sdk" className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Python SDK
                  </TabsTrigger>
                </TabsList>

                {codeExamples.map((example, index) => (
                  <TabsContent key={example.title} value={["cli", "vscode", "sdk"][index]}>
                    <Card className="relative overflow-hidden bg-gray-950 border-gray-800">
                      <div className="flex items-center justify-between p-4 border-b border-gray-800">
                        <div className="flex items-center gap-3">
                          <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          </div>
                          <span className="text-gray-400 text-sm font-medium">{example.title}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(example.code, example.title)}
                          className="text-gray-400 hover:text-white"
                        >
                          {copiedCode === example.title ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <CardContent className="p-6">
                        <pre className="text-green-400 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                          {example.code}
                        </pre>
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="flex items-center gap-3 p-4 bg-background/60 backdrop-blur-sm rounded-xl border border-border/40">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Download className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Quick Install</h4>
                  <p className="text-xs text-muted-foreground">Single command setup</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-background/60 backdrop-blur-sm rounded-xl border border-border/40">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Instant Analysis</h4>
                  <p className="text-xs text-muted-foreground">Real-time optimization</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-background/60 backdrop-blur-sm rounded-xl border border-border/40">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Full Documentation</h4>
                  <p className="text-xs text-muted-foreground">Comprehensive guides</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-blue-600 to-primary text-primary-foreground p-16 rounded-3xl text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-50"></div>
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Join 50,000+ developers
            </div>
            
            <h2 className="text-5xl font-bold mb-6 text-balance">
              Start Optimizing Today
            </h2>
            <p className="text-xl mb-10 opacity-90 max-w-3xl mx-auto leading-relaxed text-pretty">
              Join the developer community that's already building faster, more efficient applications with DBooster. 
              Get started in minutes with our free trial.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Button 
                size="lg" 
                variant="secondary" 
                className="px-8 py-4 text-lg font-semibold bg-white text-primary hover:bg-white/90 shadow-2xl hover:shadow-white/20 hover:scale-105 transition-all duration-300"
              >
                <Play className="mr-2 h-5 w-5" />
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="px-8 py-4 text-lg font-semibold border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm hover:scale-105 transition-all duration-300"
              >
                <Link to="/demo" className="flex items-center">
                  <ExternalLink className="mr-2 h-5 w-5" />
                  Try Interactive Demo
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2 text-sm opacity-90">
                <CheckCircle2 className="h-4 w-4" />
                No credit card required
              </div>
              <div className="flex items-center justify-center gap-2 text-sm opacity-90">
                <CheckCircle2 className="h-4 w-4" />
                14-day free trial
              </div>
              <div className="flex items-center justify-center gap-2 text-sm opacity-90">
                <CheckCircle2 className="h-4 w-4" />
                Cancel anytime
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </StandardPageLayout>
  );
}
