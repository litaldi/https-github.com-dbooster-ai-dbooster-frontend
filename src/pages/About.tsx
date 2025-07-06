
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Target, Award, Zap } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: Target,
      title: "Performance First",
      description: "We believe every millisecond matters. Our AI-driven optimizations help you achieve the best possible database performance."
    },
    {
      icon: Users,
      title: "Developer-Centric",
      description: "Built by developers, for developers. We understand the challenges you face and create solutions that fit your workflow."
    },
    {
      icon: Award,
      title: "Enterprise Ready",
      description: "From startups to Fortune 500 companies, our platform scales with your needs while maintaining security and reliability."
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "We're constantly pushing the boundaries of what's possible with AI and machine learning in database optimization."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="text-center mb-12">
        <Badge variant="secondary" className="mb-4">About DBooster</Badge>
        <h1 className="text-4xl font-bold mb-4">
          Revolutionizing Database Performance
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          DBooster was founded with a simple mission: make database optimization accessible to every developer, regardless of their SQL expertise.
        </p>
      </div>

      <div className="prose prose-gray dark:prose-invert max-w-none mb-12">
        <h2>Our Story</h2>
        <p>
          After years of working with complex database systems and watching teams struggle with performance issues, 
          we realized there had to be a better way. Traditional database optimization required deep expertise and 
          countless hours of manual analysis.
        </p>
        <p>
          That's when we decided to harness the power of artificial intelligence to democratize database optimization. 
          DBooster was born from the idea that every developer should have access to enterprise-level database 
          optimization tools, without needing a PhD in database administration.
        </p>
        <p>
          Today, DBooster helps thousands of developers and teams optimize their database performance, reduce costs, 
          and ship faster applications.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {values.map((value, index) => (
          <Card key={index}>
            <CardHeader>
              <value.icon className="h-8 w-8 text-primary mb-2" />
              <CardTitle>{value.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                {value.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-muted-foreground mb-6">
          Join thousands of developers who trust DBooster for their database optimization needs.
        </p>
      </div>
    </div>
  );
}
