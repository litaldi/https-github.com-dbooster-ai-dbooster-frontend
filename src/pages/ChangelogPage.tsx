
import React from 'react';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Plus, 
  Settings, 
  Bug, 
  ArrowUp,
  Sparkles,
  Shield,
  Database,
  Zap
} from 'lucide-react';

const changelogEntries = [
  {
    version: "v2.4.0",
    date: "December 18, 2024",
    type: "major",
    changes: [
      {
        type: "feature",
        title: "AI Query Rewriter",
        description: "Introduced advanced AI-powered query rewriting that automatically optimizes complex JOIN operations and subqueries."
      },
      {
        type: "feature", 
        title: "Real-time Performance Alerts",
        description: "Added configurable alerts for performance degradation and anomaly detection."
      },
      {
        type: "improvement",
        title: "Enhanced Dashboard",
        description: "Redesigned the main dashboard with improved visualizations and faster loading times."
      },
      {
        type: "security",
        title: "Enhanced Security",
        description: "Implemented additional encryption layers and updated security protocols."
      }
    ]
  },
  {
    version: "v2.3.2",
    date: "December 10, 2024", 
    type: "patch",
    changes: [
      {
        type: "bug",
        title: "Fixed Connection Timeout Issues",
        description: "Resolved intermittent connection timeouts for PostgreSQL databases with large schemas."
      },
      {
        type: "bug",
        title: "Query History Bug Fix",
        description: "Fixed issue where query history wasn't properly displaying for MongoDB connections."
      },
      {
        type: "improvement",
        title: "Performance Improvements",
        description: "Optimized backend processing for faster analysis results."
      }
    ]
  },
  {
    version: "v2.3.1",
    date: "December 5, 2024",
    type: "patch", 
    changes: [
      {
        type: "feature",
        title: "MySQL 8.0 Support",
        description: "Added full support for MySQL 8.0 features including window functions and CTEs."
      },
      {
        type: "improvement",
        title: "API Rate Limiting",
        description: "Improved API rate limiting to ensure fair usage across all customers."
      },
      {
        type: "bug",
        title: "UI Responsiveness Fix",
        description: "Fixed mobile responsiveness issues in the optimization recommendations panel."
      }
    ]
  },
  {
    version: "v2.3.0",
    date: "November 28, 2024",
    type: "minor",
    changes: [
      {
        type: "feature",
        title: "Batch Query Optimization",
        description: "Launch of batch optimization feature allowing users to optimize multiple queries simultaneously."
      },
      {
        type: "feature",
        title: "Custom Optimization Rules",
        description: "Users can now create and apply custom optimization rules based on their specific requirements."
      },
      {
        type: "improvement",
        title: "Enhanced Reporting",
        description: "Added new performance metrics and exportable reports for enterprise customers."
      }
    ]
  },
  {
    version: "v2.2.5",
    date: "November 20, 2024",
    type: "patch",
    changes: [
      {
        type: "security",
        title: "Security Update",
        description: "Updated dependencies and applied security patches."
      },
      {
        type: "bug",
        title: "Index Recommendation Fix",
        description: "Fixed issue where index recommendations weren't showing for certain table structures."
      },
      {
        type: "improvement",
        title: "Documentation Updates",
        description: "Updated API documentation with latest endpoints and examples."
      }
    ]
  }
];

const getChangeIcon = (type: string) => {
  switch (type) {
    case 'feature':
      return <Plus className="h-4 w-4 text-green-600" />;
    case 'improvement':
      return <ArrowUp className="h-4 w-4 text-blue-600" />;
    case 'bug':
      return <Bug className="h-4 w-4 text-red-600" />;
    case 'security':
      return <Shield className="h-4 w-4 text-purple-600" />;
    default:
      return <Settings className="h-4 w-4 text-gray-600" />;
  }
};

const getVersionBadgeVariant = (type: string) => {
  switch (type) {
    case 'major':
      return 'default';
    case 'minor':
      return 'secondary';
    case 'patch':
      return 'outline';
    default:
      return 'outline';
  }
};

export default function ChangelogPage() {
  return (
    <StandardPageLayout
      title="Changelog"
      subtitle="Product Updates & Releases"
      description="Stay up to date with the latest features, improvements, and bug fixes in DBooster."
    >
      <div className="space-y-16">
        {/* Stats */}
        <section className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                <Plus className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-2xl font-bold mb-1">24</div>
              <p className="text-muted-foreground">New Features</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                <ArrowUp className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold mb-1">18</div>
              <p className="text-muted-foreground">Improvements</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center">
                <Bug className="h-8 w-8 text-red-600" />
              </div>
              <div className="text-2xl font-bold mb-1">12</div>
              <p className="text-muted-foreground">Bug Fixes</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-2xl font-bold mb-1">8</div>
              <p className="text-muted-foreground">Security Updates</p>
            </div>
          </motion.div>
        </section>

        {/* Changelog Entries */}
        <section>
          <div className="space-y-8 max-w-4xl mx-auto">
            {changelogEntries.map((entry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <h3 className="text-2xl font-bold">{entry.version}</h3>
                        <Badge variant={getVersionBadgeVariant(entry.type)}>
                          {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)} Release
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{entry.date}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {entry.changes.map((change, changeIndex) => (
                        <div key={changeIndex} className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                          <div className="mt-0.5">
                            {getChangeIcon(change.type)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{change.title}</h4>
                            <p className="text-muted-foreground text-sm">{change.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Subscribe to Updates */}
        <section className="bg-gradient-to-r from-primary/5 to-blue-500/5 p-12 rounded-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Sparkles className="h-16 w-16 mx-auto mb-6 text-primary" />
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get notified about new features, improvements, and important updates as soon as they're released.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                Subscribe
              </button>
            </div>
          </motion.div>
        </section>
      </div>
    </StandardPageLayout>
  );
}
