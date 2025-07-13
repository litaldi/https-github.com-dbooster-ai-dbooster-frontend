
import React from 'react';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
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
  Monitor
} from 'lucide-react';
import { Link } from 'react-router-dom';

const developerFeatures = [
  {
    title: "IDE Integration",
    description: "Seamlessly integrate with VS Code, IntelliJ, and other popular IDEs for real-time query optimization.",
    icon: <FileCode className="h-8 w-8 text-blue-600" />,
    features: ["VS Code extension", "IntelliJ plugin", "Real-time suggestions", "Inline performance hints"]
  },
  {
    title: "Git Workflow Integration", 
    description: "Automatically scan commits for query changes and provide optimization suggestions in pull requests.",
    icon: <GitBranch className="h-8 w-8 text-orange-600" />,
    features: ["PR comments", "Commit scanning", "CI/CD integration", "Performance regression detection"]
  },
  {
    title: "Developer API",
    description: "Comprehensive REST API and SDK for programmatic access to optimization features.",
    icon: <Terminal className="h-8 w-8 text-green-600" />,
    features: ["REST API", "Python SDK", "Node.js SDK", "CLI tools"]
  },
  {
    title: "Local Development",
    description: "Test and optimize queries in your local development environment before deployment.",
    icon: <Monitor className="h-8 w-8 text-purple-600" />,
    features: ["Local analysis", "Docker support", "Staging integration", "Performance testing"]
  }
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
  return (
    <StandardPageLayout
      title="DBooster for Developers - Code Smarter, Not Harder"
      subtitle="Built for Developers"
      description="Powerful database optimization tools integrated directly into your development workflow. Write better queries, catch performance issues early, and ship faster."
    >
      <div className="space-y-20">
        {/* Hero Stats */}
        <section className="text-center">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {[
              { metric: "85%", label: "Faster Queries", icon: <Zap className="h-6 w-6" /> },
              { metric: "60%", label: "Cost Reduction", icon: <Cpu className="h-6 w-6" /> },
              { metric: "<1min", label: "Setup Time", icon: <Terminal className="h-6 w-6" /> },
              { metric: "50K+", label: "Developers", icon: <Code className="h-6 w-6" /> }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-xl flex items-center justify-center">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.metric}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Developer Features */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Developer-First Features</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Tools designed to fit seamlessly into your existing development workflow and make database optimization effortless.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {developerFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-gradient-to-br from-muted to-muted/50 rounded-xl">
                        {feature.icon}
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {feature.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {feature.features.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-gradient-to-r from-primary/5 to-blue-500/5 p-12 rounded-2xl">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Developers Choose DBooster</h2>
              <p className="text-xl text-muted-foreground">
                Join thousands of developers who have transformed their database performance.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 p-4 bg-background rounded-lg border"
                >
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="font-medium">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Code Example */}
        <section className="bg-muted/30 p-12 rounded-2xl">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Get Started in Minutes</h2>
              <p className="text-xl text-muted-foreground">
                Simple setup that integrates with your existing development environment.
              </p>
            </div>
            
            <Card className="bg-gray-950 text-green-400 font-mono text-sm">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div><span className="text-gray-500"># Install DBooster CLI</span></div>
                  <div>npm install -g @dbooster/cli</div>
                  <div className="h-4"></div>
                  <div><span className="text-gray-500"># Connect your database</span></div>
                  <div>dbooster connect --db postgresql://localhost:5432/mydb</div>
                  <div className="h-4"></div>
                  <div><span className="text-gray-500"># Analyze your queries</span></div>
                  <div>dbooster analyze --path ./src</div>
                  <div className="h-4"></div>
                  <div><span className="text-yellow-400">✨ Found 12 optimization opportunities</span></div>
                  <div><span className="text-blue-400">💡 Potential 75% performance improvement</span></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary to-blue-600 text-primary-foreground p-12 rounded-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Start Optimizing Today</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join the developer community that's already building faster, more efficient applications with DBooster.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="px-8">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link to="/demo">Try Demo</Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </div>
    </StandardPageLayout>
  );
}
