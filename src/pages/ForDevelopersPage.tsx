
import React from 'react';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Code, 
  Terminal, 
  Zap, 
  Database, 
  GitBranch,
  Cpu,
  Clock,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Wrench
} from 'lucide-react';
import { Link } from 'react-router-dom';

const developerFeatures = [
  {
    icon: <Code className="h-8 w-8 text-blue-600" />,
    title: "SQL Query Optimizer",
    description: "AI-powered query analysis and optimization suggestions that understand your database schema and usage patterns.",
    benefits: [
      "Automatic slow query detection",
      "Query rewriting recommendations", 
      "Index usage optimization",
      "Execution plan analysis"
    ]
  },
  {
    icon: <Terminal className="h-8 w-8 text-green-600" />,
    title: "Developer-Friendly APIs",
    description: "RESTful APIs and SDKs that integrate seamlessly into your development workflow and CI/CD pipelines.",
    benefits: [
      "RESTful API with OpenAPI spec",
      "Python, Node.js, and Go SDKs",
      "Webhook notifications",
      "CLI tools for automation"
    ]
  },
  {
    icon: <GitBranch className="h-8 w-8 text-purple-600" />,
    title: "Version Control Integration",
    description: "Track database performance across deployments and catch regressions before they hit production.",
    benefits: [
      "GitHub/GitLab integration",
      "Performance regression detection",
      "Automated pull request checks",
      "Deployment impact analysis"
    ]
  },
  {
    icon: <Database className="h-8 w-8 text-orange-600" />,
    title: "Multi-Database Support",
    description: "Works with your entire database stack, from PostgreSQL to MongoDB, with unified monitoring and optimization.",
    benefits: [
      "15+ database engines supported",
      "Cross-database performance insights",
      "Unified query optimization",
      "Multi-environment monitoring"
    ]
  }
];

const codeExamples = [
  {
    title: "Quick Integration",
    language: "bash",
    code: `# Install DBooster CLI
npm install -g @dbooster/cli

# Connect your database
dbooster connect --url postgresql://localhost:5432/mydb

# Start monitoring
dbooster monitor --continuous`
  },
  {
    title: "API Usage",
    language: "javascript",
    code: `// Node.js SDK Example
import { DBooster } from '@dbooster/sdk';

const db = new DBooster({
  apiKey: process.env.DBOOSTER_API_KEY
});

// Analyze a query
const analysis = await db.analyzeQuery(
  'SELECT * FROM users WHERE created_at > ?',
  [new Date('2024-01-01')]
);

console.log(analysis.recommendations);`
  }
];

const useCases = [
  {
    title: "Performance Debugging",
    description: "Quickly identify and fix slow queries during development",
    icon: <Wrench className="h-6 w-6 text-blue-600" />
  },
  {
    title: "Code Review Enhancement",
    description: "Automated database performance checks in pull requests",
    icon: <GitBranch className="h-6 w-6 text-green-600" />
  },
  {
    title: "Production Monitoring",
    description: "Real-time alerts for database performance issues",
    icon: <Cpu className="h-6 w-6 text-purple-600" />
  },
  {
    title: "Learning & Documentation",
    description: "Understand database optimization with AI explanations",
    icon: <BookOpen className="h-6 w-6 text-orange-600" />
  }
];

export default function ForDevelopersPage() {
  return (
    <StandardPageLayout
      title="Built for Developers"
      subtitle="Powerful Tools for Modern Development"
      description="Integrate AI-powered database optimization directly into your development workflow with our developer-first platform."
    >
      <div className="space-y-20">
        {/* Hero Stats */}
        <section className="text-center">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-primary mb-2">5min</div>
              <div className="text-muted-foreground">Setup Time</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-primary mb-2">15+</div>
              <div className="text-muted-foreground">Database Types</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <div className="text-muted-foreground">API Coverage</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Monitoring</div>
            </motion.div>
          </div>
        </section>

        {/* Developer Features */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Powerful features designed specifically for developers who care about database performance
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
                <Card className="h-full hover:shadow-lg transition-shadow border-2 hover:border-primary/20">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-gradient-to-br from-muted to-muted/50 rounded-xl">
                        {feature.icon}
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {feature.description}
                    </p>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Code Examples */}
        <section className="bg-muted/30 p-12 rounded-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Get Started in Minutes</h2>
            <p className="text-xl text-muted-foreground">
              Simple integration that works with your existing development setup
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {codeExamples.map((example, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Terminal className="h-5 w-5" />
                      {example.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                      <pre className="text-sm">
                        <code>{example.code}</code>
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Use Cases */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Popular Use Cases</h2>
            <p className="text-xl text-muted-foreground">
              How developers use DBooster to improve their database workflows
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-gradient-to-br from-muted to-muted/50 rounded-xl">
                        {useCase.icon}
                      </div>
                    </div>
                    <h3 className="font-semibold mb-2">{useCase.title}</h3>
                    <p className="text-sm text-muted-foreground">{useCase.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-r from-primary/5 to-blue-500/5 p-12 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4">Start Optimizing Today</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of developers who've improved their database performance with DBooster's developer-friendly tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="px-8">
              <Link to="/login">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8">
              <Link to="/demo">Try Interactive Demo</Link>
            </Button>
          </div>
        </section>
      </div>
    </StandardPageLayout>
  );
}
