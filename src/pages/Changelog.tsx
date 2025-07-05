
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Wrench, 
  Bug, 
  Shield, 
  Zap,
  Calendar,
  ArrowRight
} from 'lucide-react';

export default function Changelog() {
  const releases = [
    {
      version: '2.1.0',
      date: '2024-01-20',
      type: 'Major Release',
      changes: [
        {
          type: 'feature',
          title: 'AI Query Suggestions Enhanced',
          description: 'Improved AI recommendations with 40% better accuracy and support for complex nested queries.'
        },
        {
          type: 'feature',
          title: 'Real-time Collaboration',
          description: 'Team members can now collaborate on query optimization in real-time with live cursors and comments.'
        },
        {
          type: 'improvement',
          title: 'Dashboard Performance',
          description: 'Dashboard loading time reduced by 60% with improved caching and data fetching strategies.'
        },
        {
          type: 'security',
          title: 'Enhanced Security',
          description: 'Added two-factor authentication and improved session management for enterprise accounts.'
        }
      ]
    },
    {
      version: '2.0.5',
      date: '2024-01-15',
      type: 'Patch Release',
      changes: [
        {
          type: 'fix',
          title: 'Query Parsing Bug',
          description: 'Fixed issue where complex JOIN queries were not being analyzed correctly.'
        },
        {
          type: 'fix',
          title: 'Export Functionality',
          description: 'Resolved CSV export issues for large datasets.'
        },
        {
          type: 'improvement',
          title: 'Mobile Responsiveness',
          description: 'Improved mobile experience for query editor and dashboard views.'
        }
      ]
    },
    {
      version: '2.0.0',
      date: '2024-01-10',
      type: 'Major Release',
      changes: [
        {
          type: 'feature',
          title: 'New AI Studio',
          description: 'Complete redesign of the optimization workspace with interactive query building and testing.'
        },
        {
          type: 'feature',
          title: 'MongoDB Support',
          description: 'Added full support for MongoDB aggregation pipeline optimization and analysis.'
        },
        {
          type: 'feature',
          title: 'Advanced Analytics',
          description: 'New performance analytics dashboard with custom metrics and reporting capabilities.'
        },
        {
          type: 'improvement',
          title: 'API Performance',
          description: 'API response times improved by 50% across all endpoints.'
        }
      ]
    },
    {
      version: '1.9.2',
      date: '2024-01-05',
      type: 'Patch Release',
      changes: [
        {
          type: 'fix',
          title: 'Connection Timeout',
          description: 'Fixed database connection timeout issues for large schemas.'
        },
        {
          type: 'improvement',
          title: 'Error Messages',
          description: 'Improved error messaging throughout the application for better user experience.'
        }
      ]
    }
  ];

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'feature':
        return <Plus className="h-4 w-4 text-green-500" />;
      case 'improvement':
        return <Wrench className="h-4 w-4 text-blue-500" />;
      case 'fix':
        return <Bug className="h-4 w-4 text-orange-500" />;
      case 'security':
        return <Shield className="h-4 w-4 text-purple-500" />;
      default:
        return <Zap className="h-4 w-4 text-gray-500" />;
    }
  };

  const getChangeBadge = (type: string) => {
    const variants: Record<string, string> = {
      feature: 'bg-green-500',
      improvement: 'bg-blue-500',
      fix: 'bg-orange-500',
      security: 'bg-purple-500'
    };

    return (
      <Badge className={`${variants[type] || 'bg-gray-500'} text-white text-xs`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Calendar className="h-4 w-4" />
            Changelog
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            What's New in
            <span className="block bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              DBooster
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay up to date with the latest features, improvements, and bug fixes 
            in DBooster. We're constantly working to make your database optimization 
            experience better.
          </p>
        </div>

        {/* Releases Timeline */}
        <div className="space-y-8">
          {releases.map((release, index) => (
            <Card key={index} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold">v{release.version}</div>
                    <Badge variant="outline">{release.type}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(release.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {release.changes.map((change, changeIndex) => (
                    <div key={changeIndex} className="flex gap-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0 mt-1">
                        {getChangeIcon(change.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium">{change.title}</h3>
                          {getChangeBadge(change.type)}
                        </div>
                        <p className="text-muted-foreground text-sm">{change.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Want to Stay Updated?</h2>
              <p className="text-muted-foreground mb-6">
                Subscribe to our newsletter to get notified about new releases, 
                features, and important updates.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="px-4 py-2 border rounded-lg flex-1 min-w-[200px]"
                  />
                  <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
