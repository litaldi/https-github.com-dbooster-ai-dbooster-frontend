
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { Card, CardContent } from '@/components/ui/enhanced-card-system';
import { Users, Target, Award } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: <Target className="h-8 w-8" />,
      title: 'Our Mission',
      description: 'To democratize database optimization and make high-performance databases accessible to every developer and organization.'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Our Team',
      description: 'A diverse team of database experts, AI researchers, and software engineers passionate about solving complex performance challenges.'
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: 'Our Values',
      description: 'We believe in transparency, continuous learning, and empowering developers with the tools they need to succeed.'
    }
  ];

  return (
    <StandardPageLayout
      title="About DBooster"
      subtitle="Transforming database performance with AI"
      description="Founded in 2023, DBooster is on a mission to revolutionize how developers and organizations optimize their database performance."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {values.map((value, index) => (
          <Card key={index} variant="elevated" className="text-center">
            <CardContent className="p-8">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-r from-primary/10 to-blue-600/10 flex items-center justify-center text-primary">
                {value.icon}
              </div>
              <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
              <p className="text-muted-foreground">{value.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="prose prose-lg max-w-4xl mx-auto">
        <h2>Our Story</h2>
        <p>
          DBooster was born out of frustration with traditional database optimization approaches. 
          Our founders, experienced database engineers, recognized that most teams spend countless 
          hours manually analyzing queries and performance bottlenecks.
        </p>
        <p>
          We believe that AI can transform this process, providing instant insights and recommendations 
          that would take human experts hours or days to discover. Our platform combines cutting-edge 
          machine learning with deep database expertise to deliver optimization recommendations that 
          are both actionable and impactful.
        </p>
        
        <h2>Why Choose DBooster?</h2>
        <ul>
          <li><strong>Proven Results:</strong> Our customers see an average performance improvement of 73%</li>
          <li><strong>Expert Team:</strong> Built by database professionals with decades of experience</li>
          <li><strong>Enterprise Ready:</strong> SOC2 compliant with bank-grade security</li>
          <li><strong>Continuous Innovation:</strong> Regular updates with the latest optimization techniques</li>
        </ul>
      </div>
    </StandardPageLayout>
  );
}
