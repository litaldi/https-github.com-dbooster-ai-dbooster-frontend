
import React from 'react';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Search, 
  Code, 
  Database, 
  ArrowRight,
  ExternalLink,
  Play,
  FileText,
  Terminal,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

const docCategories = [
  {
    title: "Getting Started",
    description: "Quick start guides and basic concepts to get you up and running with DBooster.",
    icon: <Play className="h-8 w-8 text-green-600" />,
    articles: [
      { title: "Quick Start Guide", duration: "5 min", type: "Guide" },
      { title: "Installation & Setup", duration: "10 min", type: "Tutorial" },
      { title: "First Query Optimization", duration: "15 min", type: "Tutorial" },
      { title: "Understanding Results", duration: "8 min", type: "Guide" }
    ]
  },
  {
    title: "API Documentation",
    description: "Complete reference for DBooster's REST API and SDKs.",
    icon: <Code className="h-8 w-8 text-blue-600" />,
    articles: [
      { title: "REST API Reference", duration: "Reference", type: "API" },
      { title: "Python SDK", duration: "Guide", type: "SDK" },
      { title: "Node.js SDK", duration: "Guide", type: "SDK" },
      { title: "Authentication", duration: "10 min", type: "Guide" }
    ]
  },
  {
    title: "Database Integration",
    description: "Learn how to connect and optimize different database systems.",
    icon: <Database className="h-8 w-8 text-purple-600" />,
    articles: [
      { title: "PostgreSQL Integration", duration: "12 min", type: "Guide" },
      { title: "MySQL Setup", duration: "10 min", type: "Guide" },
      { title: "MongoDB Optimization", duration: "15 min", type: "Guide" },
      { title: "SQL Server Connection", duration: "8 min", type: "Guide" }
    ]
  },
  {
    title: "Advanced Features",
    description: "Deep dive into advanced optimization techniques and features.",
    icon: <Zap className="h-8 w-8 text-orange-600" />,
    articles: [
      { title: "Custom Optimization Rules", duration: "20 min", type: "Advanced" },
      { title: "Performance Monitoring", duration: "15 min", type: "Tutorial" },
      { title: "Batch Optimization", duration: "18 min", type: "Guide" },
      { title: "CI/CD Integration", duration: "25 min", type: "Tutorial" }
    ]
  }
];

const quickLinks = [
  { title: "API Reference", icon: <Code className="h-5 w-5" />, href: "/docs/api" },
  { title: "CLI Documentation", icon: <Terminal className="h-5 w-5" />, href: "/docs/cli" },
  { title: "Best Practices", icon: <BookOpen className="h-5 w-5" />, href: "/docs/best-practices" },
  { title: "Troubleshooting", icon: <FileText className="h-5 w-5" />, href: "/docs/troubleshooting" }
];

export default function DocumentationPage() {
  return (
    <StandardPageLayout
      title="Documentation - Everything You Need to Know"
      subtitle="Complete Guide"
      description="Comprehensive documentation, guides, and tutorials to help you master DBooster's database optimization capabilities."
    >
      <div className="space-y-20">
        {/* Search Section */}
        <section className="bg-gradient-to-r from-primary/5 to-blue-500/5 p-12 rounded-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold mb-6">Search Documentation</h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search guides, tutorials, and API docs..."
                className="pl-12 h-12 text-lg"
              />
            </div>
          </motion.div>
        </section>

        {/* Quick Links */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Popular Resources</h2>
            <p className="text-xl text-muted-foreground">
              Quick access to the most commonly used documentation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/20">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-lg flex items-center justify-center">
                      {link.icon}
                    </div>
                    <h3 className="font-semibold">{link.title}</h3>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Documentation Categories */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Documentation Categories</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Organized guides and tutorials to help you learn DBooster at your own pace.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {docCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-gradient-to-br from-muted to-muted/50 rounded-xl">
                        {category.icon}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{category.title}</CardTitle>
                        <p className="text-muted-foreground text-sm mt-1">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {category.articles.map((article, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors">
                          <div>
                            <h4 className="font-medium text-sm">{article.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {article.type}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {article.duration}
                              </span>
                            </div>
                          </div>
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Developer Resources */}
        <section className="bg-muted/30 p-12 rounded-2xl">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Developer Resources</h2>
              <p className="text-xl text-muted-foreground">
                Code examples, SDKs, and tools to integrate DBooster into your workflow.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Code Examples",
                  description: "Ready-to-use code snippets and examples for common use cases.",
                  links: ["Python Examples", "Node.js Examples", "cURL Examples", "Integration Samples"]
                },
                {
                  title: "SDKs & Tools",
                  description: "Official SDKs and command-line tools for different programming languages.",
                  links: ["Python SDK", "Node.js SDK", "CLI Tool", "VS Code Extension"]
                },
                {
                  title: "Community",
                  description: "Connect with other developers and get help from the community.",
                  links: ["GitHub Discussions", "Discord Community", "Stack Overflow", "Developer Forum"]
                }
              ].map((resource, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                      <p className="text-muted-foreground text-sm">{resource.description}</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {resource.links.map((link, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm hover:text-primary cursor-pointer">
                            <ExternalLink className="h-3 w-3" />
                            <span>{link}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
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
            <h2 className="text-3xl font-bold mb-4">Need More Help?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is here to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="px-8">
                Contact Support
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link to="/support">Support Center</Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </div>
    </StandardPageLayout>
  );
}
