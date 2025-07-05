
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Heart, 
  Zap, 
  Globe, 
  Code, 
  Database,
  Brain,
  Palette,
  ArrowRight,
  MapPin,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Careers() {
  const values = [
    {
      icon: Heart,
      title: 'People First',
      description: 'We believe great products come from great people. We invest in our team\'s growth and well-being.'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We\'re constantly pushing the boundaries of what\'s possible in database optimization.'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'We work together, share knowledge, and celebrate each other\'s successes.'
    },
    {
      icon: Globe,
      title: 'Remote First',
      description: 'We\'re a distributed team that values flexibility and work-life balance.'
    }
  ];

  const openings = [
    {
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'Join our frontend team to build beautiful, performant user interfaces for database optimization tools.',
      requirements: ['React', 'TypeScript', 'Tailwind CSS', '5+ years experience']
    },
    {
      title: 'Database Performance Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'Help us build the next generation of database optimization algorithms and tools.',
      requirements: ['PostgreSQL', 'MySQL', 'Query Optimization', 'Performance Tuning']
    },
    {
      title: 'AI/ML Engineer',
      department: 'AI Research',
      location: 'Remote',
      type: 'Full-time',
      description: 'Develop and improve our AI-powered query optimization and recommendation systems.',
      requirements: ['Python', 'TensorFlow/PyTorch', 'Machine Learning', 'NLP']
    },
    {
      title: 'Product Designer',
      department: 'Design',
      location: 'Remote',
      type: 'Full-time',
      description: 'Design intuitive and delightful experiences for developers working with databases.',
      requirements: ['Figma', 'User Research', 'Prototyping', 'Design Systems']
    },
    {
      title: 'Developer Relations Engineer',
      department: 'Developer Experience',
      location: 'Remote',
      type: 'Full-time',
      description: 'Build relationships with our developer community and create amazing developer experiences.',
      requirements: ['Technical Writing', 'Public Speaking', 'Community Building', 'APIs']
    }
  ];

  const benefits = [
    'Competitive salary and equity',
    'Comprehensive health insurance',
    'Unlimited PTO policy',
    'Remote work stipend',
    'Learning and development budget',
    'Latest equipment and tools',
    'Flexible working hours',
    'Team retreats and events'
  ];

  const getDepartmentIcon = (department: string) => {
    switch (department) {
      case 'Engineering':
        return <Code className="h-4 w-4" />;
      case 'AI Research':
        return <Brain className="h-4 w-4" />;
      case 'Design':
        return <Palette className="h-4 w-4" />;
      case 'Developer Experience':
        return <Users className="h-4 w-4" />;
      default:
        return <Database className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Users className="h-4 w-4" />
            Careers
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Join Our Mission to
            <span className="block bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Optimize the World's Databases
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're building the future of database optimization. Join our team of 
            passionate engineers, designers, and innovators who are making databases 
            faster, more efficient, and easier to manage.
          </p>
        </div>

        {/* Company Values */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {values.map((value, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-8">
                <value.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Open Positions */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Open Positions</h2>
          <div className="space-y-6">
            {openings.map((job, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          {getDepartmentIcon(job.department)}
                          {job.department}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {job.type}
                        </div>
                      </div>
                    </div>
                    <Button className="opacity-0 group-hover:opacity-100 transition-opacity">
                      Apply Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-muted-foreground mb-4">{job.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.map((req, idx) => (
                      <Badge key={idx} variant="outline">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Why Work With Us?</h2>
            <p className="text-muted-foreground mb-6">
              We offer competitive compensation, comprehensive benefits, and most 
              importantly, the opportunity to work on challenging problems that 
              impact millions of developers worldwide.
            </p>
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Heart className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          
          <Card>
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Don't See the Right Role?</h3>
              <p className="text-muted-foreground mb-6">
                We're always looking for talented individuals who share our passion 
                for database optimization. Send us your resume and tell us how you'd 
                like to contribute to our mission.
              </p>
              <Button asChild>
                <Link to="/contact">
                  Get in Touch
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-3xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4">Ready to Join Us?</h2>
              <p className="text-muted-foreground mb-8">
                Take the next step in your career and help us build the future of 
                database optimization. We can't wait to meet you!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">
                  View All Openings
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/about">
                    Learn About Us
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
