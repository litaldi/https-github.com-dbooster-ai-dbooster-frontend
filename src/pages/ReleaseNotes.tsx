
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Rocket, 
  Search, 
  Calendar, 
  Zap, 
  Bug, 
  Shield, 
  Plus,
  ArrowUpRight,
  Star
} from 'lucide-react';
import { FadeIn, ScaleIn } from '@/components/ui/animations';

const releases = [
  {
    version: '2.1.0',
    date: '2024-01-15',
    type: 'major',
    title: 'AI Query Optimizer 2.0',
    description: 'Major update with enhanced AI algorithms and new optimization techniques.',
    features: [
      { type: 'feature', text: 'Enhanced AI query analysis with 30% better optimization suggestions' },
      { type: 'feature', text: 'New real-time query performance monitoring dashboard' },
      { type: 'feature', text: 'Support for MongoDB and Redis optimization' },
      { type: 'improvement', text: 'Improved user interface with better responsive design' },
      { type: 'security', text: 'Enhanced security with additional encryption layers' }
    ]
  },
  {
    version: '2.0.5',
    date: '2024-01-08',
    type: 'patch',
    title: 'Performance Improvements',
    description: 'Bug fixes and performance optimizations for better user experience.',
    features: [
      { type: 'bug', text: 'Fixed issue with PostgreSQL connection timeout' },
      { type: 'improvement', text: 'Reduced query analysis time by 25%' },
      { type: 'bug', text: 'Fixed memory leak in continuous monitoring mode' },
      { type: 'improvement', text: 'Updated dependencies for better security' }
    ]
  },
  {
    version: '2.0.0',
    date: '2023-12-20',
    type: 'major',
    title: 'DBooster 2.0 - Complete Redesign',
    description: 'Complete platform redesign with new features and improved performance.',
    features: [
      { type: 'feature', text: 'Brand new user interface with modern design' },
      { type: 'feature', text: 'Advanced AI-powered query optimization engine' },
      { type: 'feature', text: 'Team collaboration features and shared workspaces' },
      { type: 'feature', text: 'RESTful API for third-party integrations' },
      { type: 'security', text: 'SOC2 Type II compliance certification' },
      { type: 'improvement', text: 'Performance improvements across all modules' }
    ]
  }
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'feature': return <Plus className="w-4 h-4 text-green-600" />;
    case 'improvement': return <ArrowUpRight className="w-4 h-4 text-blue-600" />;
    case 'bug': return <Bug className="w-4 h-4 text-red-600" />;
    case 'security': return <Shield className="w-4 h-4 text-purple-600" />;
    default: return <Zap className="w-4 h-4 text-gray-600" />;
  }
};

const getVersionBadge = (type: string) => {
  switch (type) {
    case 'major': return { variant: 'default' as const, text: 'Major Release' };
    case 'minor': return { variant: 'secondary' as const, text: 'Minor Release' };
    case 'patch': return { variant: 'outline' as const, text: 'Patch Release' };
    default: return { variant: 'outline' as const, text: 'Release' };
  }
};

export default function ReleaseNotes() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReleases = releases.filter(release =>
    release.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    release.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    release.features.some(feature => feature.text.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-12">
        <FadeIn>
          <div className="text-center mb-12">
            <ScaleIn>
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Rocket className="w-8 h-8 text-primary" />
              </div>
            </ScaleIn>
            <h1 className="text-4xl font-bold mb-4">Release Notes</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stay up to date with the latest features, improvements, and bug fixes in DBooster.
            </p>
          </div>
        </FadeIn>

        <div className="max-w-4xl mx-auto">
          <FadeIn delay={0.2}>
            <Card className="mb-8">
              <CardHeader>
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search release notes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Button className="gap-2">
                    <Star className="w-4 h-4" />
                    Subscribe to Updates
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </FadeIn>

          <div className="space-y-8">
            {filteredReleases.map((release, index) => {
              const badge = getVersionBadge(release.type);
              
              return (
                <FadeIn key={release.version} delay={0.3 + index * 0.1}>
                  <Card className="hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl font-bold">v{release.version}</h2>
                            <Badge {...badge}>
                              {badge.text}
                            </Badge>
                          </div>
                          <CardTitle className="text-xl mb-2">{release.title}</CardTitle>
                          <CardDescription className="text-base">
                            {release.description}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground ml-4">
                          <Calendar className="w-4 h-4" />
                          {new Date(release.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {release.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-start gap-3 p-3 rounded-lg border-l-4 border-l-muted hover:bg-muted/30 transition-colors">
                            {getTypeIcon(feature.type)}
                            <span className="text-sm leading-relaxed">{feature.text}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>
              );
            })}
          </div>

          {filteredReleases.length === 0 && (
            <FadeIn delay={0.4}>
              <Card>
                <CardContent className="py-12 text-center">
                  <Rocket className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No releases found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search terms to find specific releases.
                  </p>
                </CardContent>
              </Card>
            </FadeIn>
          )}
        </div>
      </div>
    </div>
  );
}
