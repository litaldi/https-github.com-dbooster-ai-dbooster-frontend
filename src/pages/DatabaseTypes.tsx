
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, Check, Star } from 'lucide-react';

export default function DatabaseTypes() {
  const databases = [
    {
      name: 'PostgreSQL',
      logo: '🐘',
      status: 'Fully Supported',
      features: ['Advanced query optimization', 'Index recommendations', 'Performance monitoring', 'Query caching'],
      popular: true
    },
    {
      name: 'MySQL',
      logo: '🐬',
      status: 'Fully Supported',
      features: ['Query analysis', 'Performance tuning', 'Index optimization', 'Slow query detection'],
      popular: true
    },
    {
      name: 'MongoDB',
      logo: '🍃',
      status: 'Fully Supported',
      features: ['Aggregation optimization', 'Index analysis', 'Performance insights', 'Schema recommendations'],
      popular: true
    },
    {
      name: 'Redis',
      logo: '🔴',
      status: 'Coming Soon',
      features: ['Memory optimization', 'Key analysis', 'Performance monitoring', 'Cache efficiency'],
      popular: false
    },
    {
      name: 'SQLite',
      logo: '🗄️',
      status: 'Beta',
      features: ['Query optimization', 'Schema analysis', 'Performance tips', 'Index suggestions'],
      popular: false
    },
    {
      name: 'MariaDB',
      logo: '🦭',
      status: 'Fully Supported',
      features: ['Query optimization', 'Performance analysis', 'Index recommendations', 'Monitoring'],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Database className="h-4 w-4" />
            Database Support
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Support for All Major
            <span className="block bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Database Systems
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            DBooster works seamlessly with your existing database infrastructure, 
            providing intelligent optimization across multiple database platforms.
          </p>
        </div>

        {/* Database Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {databases.map((db, index) => (
            <Card key={index} className="relative">
              {db.popular && (
                <div className="absolute -top-2 -right-2">
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">{db.logo}</div>
                <CardTitle className="text-xl">{db.name}</CardTitle>
                <Badge 
                  variant={db.status === 'Fully Supported' ? 'default' : 
                           db.status === 'Beta' ? 'secondary' : 'outline'}
                >
                  {db.status}
                </Badge>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  {db.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
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
              <h2 className="text-2xl font-bold mb-4">Don't See Your Database?</h2>
              <p className="text-muted-foreground mb-6">
                We're constantly adding support for new database systems. 
                Let us know what you need and we'll prioritize it.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/contact" 
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                  Request Database Support
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
