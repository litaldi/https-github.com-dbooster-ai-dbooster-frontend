
import React from 'react';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  Users, 
  Heart, 
  Zap, 
  Target,
  ArrowRight,
  Globe,
  Coffee,
  TrendingUp,
  Code,
  Briefcase
} from 'lucide-react';

const openPositions = [
  {
    title: "Senior Full Stack Engineer",
    department: "Engineering",
    location: "Tel Aviv, Israel",
    type: "Full-time",
    level: "Senior",
    description: "Join our core engineering team to build the next generation of database optimization tools.",
    requirements: ["5+ years React/Node.js", "Database expertise", "AI/ML experience preferred"]
  },
  {
    title: "AI/ML Engineer",
    department: "AI Research",
    location: "Remote",
    type: "Full-time", 
    level: "Mid-Senior",
    description: "Develop and improve our machine learning models for database query optimization.",
    requirements: ["Python/TensorFlow", "ML model deployment", "Database query optimization"]
  },
  {
    title: "Product Manager",
    department: "Product",
    location: "Tel Aviv, Israel / Remote",
    type: "Full-time",
    level: "Senior",
    description: "Drive product strategy and roadmap for our database optimization platform.",
    requirements: ["5+ years product management", "B2B SaaS experience", "Technical background"]
  },
  {
    title: "DevOps Engineer",
    department: "Infrastructure",
    location: "Remote",
    type: "Full-time",
    level: "Mid-Level",
    description: "Scale our infrastructure to handle enterprise workloads and ensure 99.9% uptime.",
    requirements: ["AWS/GCP/Azure", "Kubernetes", "CI/CD automation", "Monitoring systems"]
  },
  {
    title: "Customer Success Manager",
    department: "Customer Success",
    location: "Remote",
    type: "Full-time",
    level: "Mid-Level",
    description: "Help our enterprise customers maximize value from DBooster's optimization platform.",
    requirements: ["3+ years customer success", "Technical aptitude", "Database knowledge helpful"]
  }
];

const benefits = [
  {
    title: "Competitive Salary & Equity",
    description: "Above-market compensation with meaningful equity in a fast-growing company",
    icon: <TrendingUp className="h-6 w-6 text-green-600" />
  },
  {
    title: "Remote-First Culture",
    description: "Work from anywhere with flexible hours and a focus on results over location",
    icon: <Globe className="h-6 w-6 text-blue-600" />
  },
  {
    title: "Learning & Development",
    description: "Annual learning budget, conference attendance, and skill development opportunities",
    icon: <Target className="h-6 w-6 text-purple-600" />
  },
  {
    title: "Health & Wellness",
    description: "Comprehensive health insurance, mental health support, and wellness stipend",  
    icon: <Heart className="h-6 w-6 text-red-600" />
  },
  {
    title: "Cutting-Edge Tech",
    description: "Work with the latest tools and technologies in AI, databases, and cloud infrastructure",
    icon: <Zap className="h-6 w-6 text-yellow-600" />
  },
  {
    title: "Team & Culture",
    description: "Collaborative, inclusive environment with regular team events and offsites",
    icon: <Users className="h-6 w-6 text-indigo-600" />
  }
];

const companyValues = [
  {
    title: "Innovation First",
    description: "We push the boundaries of what's possible in database optimization",
    icon: <Zap className="h-8 w-8 text-yellow-600" />
  },
  {
    title: "Customer Obsession", 
    description: "Every decision we make starts with how it benefits our customers",
    icon: <Heart className="h-8 w-8 text-red-600" />
  },
  {
    title: "Excellence & Growth",
    description: "We strive for excellence while embracing continuous learning and improvement",
    icon: <Target className="h-8 w-8 text-blue-600" />
  },
  {
    title: "Transparency",
    description: "Open communication, honest feedback, and transparent decision-making",
    icon: <Users className="h-8 w-8 text-green-600" />
  }
];

export default function CareersPage() {
  return (
    <StandardPageLayout
      title="Join Our Mission"
      subtitle="Careers at DBooster"
      description="Help us revolutionize database optimization with AI. Join a team of passionate engineers, researchers, and innovators building the future of database performance."
    >
      <div className="space-y-20">
        {/* Company Mission */}
        <section className="bg-gradient-to-r from-primary/5 to-blue-500/5 p-12 rounded-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-6">Building the Future of Database Performance</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              At DBooster, we're on a mission to make database optimization accessible to every developer and organization. 
              Join us in building AI-powered tools that transform how people work with data.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold text-primary">45+</div>
                <div className="text-muted-foreground">Team Members</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">$15M</div>
                <div className="text-muted-foreground">Funding Raised</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">10,000+</div>
                <div className="text-muted-foreground">Happy Customers</div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Open Positions */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Open Positions</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're looking for talented individuals who are passionate about technology, innovation, and making a real impact.
            </p>
          </div>
          
          <div className="space-y-6">
            {openPositions.map((position, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl mb-2">{position.title}</CardTitle>
                        <p className="text-muted-foreground mb-4">{position.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {position.requirements.map((req, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {req}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button>
                        Apply Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {position.department}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {position.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {position.type}
                      </div>
                      <Badge variant="secondary">
                        {position.level}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Benefits & Perks */}
        <section className="bg-muted/30 p-12 rounded-2xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Work at DBooster?</h2>
            <p className="text-xl text-muted-foreground">
              We offer comprehensive benefits and a culture that supports your growth and well-being.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="w-12 h-12 mb-4 bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center">
                      {benefit.icon}
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Company Values */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              These principles guide everything we do and shape our culture at DBooster.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {companyValues.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-gradient-to-br from-muted to-muted/50 rounded-xl">
                        {value.icon}
                      </div>
                      <CardTitle className="text-xl">{value.title}</CardTitle>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary to-blue-600 text-primary-foreground p-12 rounded-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Coffee className="h-16 w-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl font-bold mb-4">Ready to Join Us?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Don't see the perfect role? We're always looking for exceptional talent. 
              Send us your resume and let's talk about how you can contribute to our mission.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="px-8">
                <a href="mailto:careers@dbooster.ai">
                  Send Resume
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <a href="mailto:careers@dbooster.ai">General Inquiry</a>
              </Button>
            </div>
          </motion.div>
        </section>
      </div>
    </StandardPageLayout>
  );
}
