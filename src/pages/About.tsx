
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Target, Award, Zap, Heart, Globe, Lightbulb, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function About() {
  const values = [
    {
      icon: Target,
      title: "Performance First",
      description: "We believe every millisecond matters. Our AI-driven optimizations help you achieve the best possible database performance, because slow databases hurt user experience and business growth."
    },
    {
      icon: Users,
      title: "Developer-Centric",
      description: "Built by developers, for developers. We understand the daily challenges you face with complex queries, performance bottlenecks, and database scaling issues."
    },
    {
      icon: Award,
      title: "Enterprise Ready",
      description: "From startups to Fortune 500 companies, our platform scales with your needs while maintaining security, reliability, and compliance standards."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We're constantly pushing the boundaries of what's possible with AI and machine learning in database optimization, staying ahead of industry trends."
    }
  ];

  const stats = [
    { number: "2019", label: "Founded", description: "Started our mission to democratize database optimization" },
    { number: "50K+", label: "Developers", description: "Trust DBooster for their database performance needs" },
    { number: "2.5M+", label: "Queries Optimized", description: "Successful optimizations delivered to date" },
    { number: "73%", label: "Avg Performance Boost", description: "Improvement in query response times" }
  ];

  const team = [
    {
      name: "Sarah Chen",
      role: "Co-Founder & CEO",
      background: "Former Principal Engineer at Google, specialized in distributed systems and database architecture."
    },
    {
      name: "Michael Rodriguez",
      role: "Co-Founder & CTO",
      background: "Ex-Senior Staff Engineer at Meta, expert in AI/ML and large-scale database optimization."
    },
    {
      name: "Dr. Emily Watson",
      role: "Head of AI Research",
      background: "PhD in Computer Science from Stanford, former researcher at OpenAI focusing on database intelligence."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-16" dir="ltr">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-6"
      >
        <Badge variant="secondary" className="mb-4 px-4 py-2">About DBooster</Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Revolutionizing Database Performance
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          DBooster was founded with a simple mission: make database optimization accessible to every developer, 
          regardless of their SQL expertise or infrastructure size.
        </p>
      </motion.div>

      {/* Stats Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <div key={index} className="text-center space-y-2">
            <div className="text-3xl md:text-4xl font-bold text-primary">{stat.number}</div>
            <div className="font-semibold">{stat.label}</div>
            <div className="text-sm text-muted-foreground">{stat.description}</div>
          </div>
        ))}
      </motion.div>

      {/* Story Section - Fixed Layout */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="bg-muted/30 p-8 rounded-lg space-y-6">
          <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
          <div className="space-y-6 max-w-4xl mx-auto">
            <p className="text-lg leading-relaxed">
              After years of working with complex database systems at scale, our founders witnessed countless teams 
              struggling with performance issues that could cripple applications and frustrate users.
            </p>
            <p className="text-lg leading-relaxed">
              Traditional database optimization required deep expertise, expensive consultants, and countless hours 
              of manual analysis. We realized there had to be a better way.
            </p>
            <p className="text-lg leading-relaxed">
              That's when we decided to harness the power of artificial intelligence to democratize database optimization. 
              DBooster was born from the idea that every developer should have access to enterprise-level database 
              optimization tools.
            </p>
            <p className="text-lg leading-relaxed">
              Today, we're proud to help thousands of developers and teams optimize their database performance, 
              reduce costs, and ship faster applications.
            </p>
          </div>
          
          <div className="text-center pt-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <Heart className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Made with passion for better software</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Values Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="space-y-8"
      >
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Our Core Values</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            These principles guide everything we do, from product development to customer support
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <value.icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Team Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="space-y-8"
      >
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Meet Our Leadership Team</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Industry veterans with deep expertise in databases, AI, and scaling technology
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {team.map((member, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-lg">{member.name}</CardTitle>
                <CardDescription className="text-primary font-medium">{member.role}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{member.background}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Mission Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="bg-gradient-to-r from-primary/5 to-blue-500/5 p-8 rounded-lg text-center space-y-6"
      >
        <Globe className="h-12 w-12 text-primary mx-auto" />
        <h2 className="text-3xl font-bold">Our Mission</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          To democratize database optimization by making enterprise-grade AI tools accessible to every developer, 
          enabling faster applications, reduced costs, and better user experiences worldwide.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild size="lg">
            <Link to="/contact">
              Get in Touch
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/login">
              Try DBooster Free
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
