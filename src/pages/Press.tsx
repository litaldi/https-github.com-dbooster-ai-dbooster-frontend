
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Newspaper, 
  Download, 
  ExternalLink, 
  Calendar,
  ArrowRight,
  Award,
  Users,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Press() {
  const pressReleases = [
    {
      date: '2024-01-20',
      title: 'DBooster Announces $15M Series A Funding to Accelerate AI-Powered Database Optimization',
      excerpt: 'Leading database optimization platform raises Series A to expand AI capabilities and global market presence.',
      link: '#',
      featured: true
    },
    {
      date: '2024-01-15',
      title: 'DBooster Launches Enterprise AI Studio for Large-Scale Database Optimization',
      excerpt: 'New enterprise features enable organizations to optimize thousands of queries simultaneously with advanced AI.',
      link: '#'
    },
    {
      date: '2024-01-10',
      title: 'DBooster Wins "Best Developer Tool" Award at TechCrunch Disrupt 2024',
      excerpt: 'Recognition for innovative approach to database performance optimization and developer experience.',
      link: '#'
    },
    {
      date: '2024-01-05',
      title: 'DBooster Reaches 50,000+ Active Users Milestone',
      excerpt: 'Platform growth demonstrates strong demand for intelligent database optimization solutions.',
      link: '#'
    }
  ];

  const coverage = [
    {
      outlet: 'TechCrunch',
      title: 'DBooster is revolutionizing how developers optimize database performance',
      date: '2024-01-18',
      author: 'Sarah Johnson',
      link: '#'
    },
    {
      outlet: 'VentureBeat',
      title: 'The future of database optimization is AI-powered, and DBooster is leading the way',
      date: '2024-01-16',
      author: 'Mike Chen',
      link: '#'
    },
    {
      outlet: 'Database Trends',
      title: 'How DBooster is solving the database performance crisis',
      date: '2024-01-12',
      author: 'Alex Rodriguez',
      link: '#'
    },
    {
      outlet: 'DevOps Weekly',
      title: 'DBooster review: A game-changer for database optimization',
      date: '2024-01-08',
      author: 'Lisa Park',
      link: '#'
    }
  ];

  const assets = [
    {
      name: 'DBooster Logo Pack',
      description: 'High-resolution logos in various formats (PNG, SVG, EPS)',
      size: '2.4 MB',
      type: 'ZIP'
    },
    {
      name: 'Product Screenshots',
      description: 'High-quality screenshots of the DBooster platform',
      size: '15.6 MB',
      type: 'ZIP'
    },
    {
      name: 'Executive Headshots',
      description: 'Professional photos of DBooster leadership team',
      size: '8.2 MB',
      type: 'ZIP'
    },
    {
      name: 'Company Fact Sheet',
      description: 'Key facts, figures, and company information',
      size: '1.1 MB',
      type: 'PDF'
    }
  ];

  const stats = [
    {
      icon: Users,
      value: '50,000+',
      label: 'Active Users'
    },
    {
      icon: TrendingUp,
      value: '2.5M+',
      label: 'Queries Optimized'
    },
    {
      icon: Award,
      value: '73%',
      label: 'Avg Performance Improvement'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Newspaper className="h-4 w-4" />
            Press Kit
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Press & Media
            <span className="block bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Resources
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get the latest news, press releases, and media assets about DBooster. 
            For media inquiries, please contact our press team.
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-8">
                <stat.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Press Releases */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Latest News</h2>
          <div className="space-y-6">
            {pressReleases.map((release, index) => (
              <Card key={index} className={`group hover:shadow-lg transition-all duration-300 ${release.featured ? 'border-primary' : ''}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {release.featured && (
                          <Badge className="bg-primary">Featured</Badge>
                        )}
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {new Date(release.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                      <CardTitle className="text-xl mb-2">{release.title}</CardTitle>
                      <p className="text-muted-foreground">{release.excerpt}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Media Coverage */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Media Coverage</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {coverage.map((article, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="mb-3">
                    <Badge variant="outline">{article.outlet}</Badge>
                  </div>
                  <h3 className="font-semibold mb-2">{article.title}</h3>
                  <div className="text-sm text-muted-foreground mb-4">
                    By {article.author} • {new Date(article.date).toLocaleDateString()}
                  </div>
                  <Button variant="ghost" size="sm" className="p-0 h-auto">
                    Read Article
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Media Assets */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Media Assets</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {assets.map((asset, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{asset.name}</h3>
                      <p className="text-muted-foreground text-sm mb-3">{asset.description}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <Badge variant="outline">{asset.type}</Badge>
                        <span>{asset.size}</span>
                      </div>
                    </div>
                    <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid md:grid-cols-2 gap-12">
          <Card>
            <CardHeader>
              <CardTitle>Media Inquiries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">Press Contact</h4>
                  <p className="text-muted-foreground">Sarah Mitchell</p>
                  <p className="text-muted-foreground">Director of Communications</p>
                  <p className="text-primary">press@dbooster.com</p>
                  <p className="text-muted-foreground">+1 (555) 123-4567</p>
                </div>
                <div>
                  <h4 className="font-semibold">Business Inquiries</h4>
                  <p className="text-muted-foreground">partnerships@dbooster.com</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About DBooster</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                DBooster is the leading AI-powered database optimization platform, 
                helping developers and organizations improve database performance 
                by up to 73% on average. Founded in 2023, DBooster serves over 
                50,000 active users worldwide.
              </p>
              <Button asChild>
                <Link to="/about">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
