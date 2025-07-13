
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Target, 
  Award, 
  Globe, 
  ArrowRight,
  Heart,
  Zap,
  Building
} from 'lucide-react';

const values = [
  {
    icon: <Target className="h-8 w-8" />,
    title: 'Innovation First',
    description: 'We push the boundaries of what\'s possible with AI and database optimization.'
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: 'Developer-Centric',
    description: 'Built by developers, for developers. We understand your challenges.'
  },
  {
    icon: <Globe className="h-8 w-8" />,
    title: 'Global Impact',
    description: 'Helping teams worldwide build faster, more efficient applications.'
  },
  {
    icon: <Heart className="h-8 w-8" />,
    title: 'Open Source',
    description: 'Contributing back to the community that made us possible.'
  }
];

const stats = [
  { number: '10,000+', label: 'Developers Trust Us' },
  { number: '1M+', label: 'Queries Optimized' },
  { number: '99.9%', label: 'Uptime SLA' },
  { number: '24/7', label: 'Support Available' }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">
            <Building className="h-3 w-3 mr-1" />
            About DBooster
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Empowering Developers Worldwide
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Founded in 2023, DBooster was born from a simple mission: make database optimization 
            accessible to every developer, regardless of their expertise level.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <Card className="shadow-lg">
            <CardContent className="p-12 text-center">
              <Zap className="h-16 w-16 mx-auto mb-6 text-primary" />
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                We believe that every application deserves to perform at its best. Our AI-powered 
                platform democratizes database optimization, turning complex performance tuning 
                into simple, actionable insights that any developer can implement.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardHeader className="text-center">
                    <div className="p-3 bg-primary/10 rounded-lg text-primary w-fit mx-auto mb-4">
                      {value.icon}
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground text-sm lg:text-base">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-16"
        >
          <Card className="shadow-lg">
            <CardContent className="p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Built by Expert Engineers</h2>
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    Our team combines decades of experience in database engineering, 
                    machine learning, and developer tools. We've worked at companies 
                    like Google, Amazon, and Microsoft, solving performance challenges 
                    at massive scale.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-primary" />
                      <span>Former Google, Amazon, Microsoft engineers</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-primary" />
                      <span>PhD-level expertise in database systems</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-primary" />
                      <span>Published research in database optimization</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-primary/10 to-blue-600/10 rounded-2xl p-8 text-center">
                  <Users className="h-16 w-16 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-bold mb-2">Join Our Team</h3>
                  <p className="text-muted-foreground mb-6">
                    We're always looking for talented engineers to join our mission.
                  </p>
                  <Button asChild variant="outline">
                    <Link to="/careers">
                      View Open Positions
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="text-center bg-gradient-to-r from-primary/10 to-blue-600/10 rounded-2xl p-12"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Optimize Your Database?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join the thousands of developers who trust DBooster to make their applications faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/demo">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
