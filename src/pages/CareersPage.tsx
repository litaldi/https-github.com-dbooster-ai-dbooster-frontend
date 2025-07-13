
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
  Globe, 
  ArrowRight,
  Coffee,
  Laptop,
  GraduationCap
} from 'lucide-react';
import { Link } from 'react-router-dom';

const openPositions = [
  {
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    location: "Tel Aviv, Israel",
    type: "Full-time",
    experience: "5+ years",
    description: "Build and scale our AI-powered database optimization platform using React, Node.js, and Python."
  },
  {
    title: "AI/ML Engineer",
    department: "AI Research",
    location: "Tel Aviv, Israel / Remote",
    type: "Full-time", 
    experience: "3+ years",
    description: "Develop and improve our machine learning models for database query optimization and performance prediction."
  },
  {
    title: "Product Manager",
    department: "Product",
    location: "Tel Aviv, Israel",
    type: "Full-time",
    experience: "4+ years",
    description: "Drive product strategy and roadmap for our database optimization tools and developer experience."
  },
  {
    title: "DevOps Engineer",
    department: "Infrastructure",
    location: "Remote",
    type: "Full-time",
    experience: "4+ years", 
    description: "Scale our infrastructure and deployment pipelines to support growing customer base and data volumes."
  },
  {
    title: "Customer Success Manager",
    department: "Customer Success",
    location: "Tel Aviv, Israel / Remote",
    type: "Full-time",
    experience: "3+ years",
    description: "Help enterprise customers achieve success with DBooster and drive expansion opportunities."
  }
];

const benefits = [
  {
    icon: <Heart className="h-6 w-6 text-red-500" />,
    title: "Health & Wellness",
    description: "Comprehensive health insurance, mental health support, and wellness stipend"
  },
  {
    icon: <Laptop className="h-6 w-6 text-blue-500" />,
    title: "Equipment & Setup", 
    description: "MacBook Pro, monitor, and $1,000 home office setup budget"
  },
  {
    icon: <Globe className="h-6 w-6 text-green-500" />,
    title: "Remote Flexibility",
    description: "Hybrid work model with remote-first culture and flexible hours"
  },
  {
    icon: <GraduationCap className="h-6 w-6 text-purple-500" />,
    title: "Learning & Growth",
    description: "$2,000 annual learning budget and conference attendance support"
  },
  {
    icon: <Coffee className="h-6 w-6 text-orange-500" />,
    title: "Office Perks",
    description: "Fully stocked kitchen, weekly team meals, and game room in Tel Aviv office"
  },
  {
    icon: <Zap className="h-6 w-6 text-yellow-500" />,
    title: "Equity & Growth",
    description: "Competitive equity package with high growth potential"
  }
];

const values = [
  {
    title: "Innovation",
    description: "Push boundaries and think creatively about complex problems"
  },
  {
    title: "Collaboration",
    description: "Work together, share knowledge, and support each other's growth"
  },
  {
    title: "Excellence",
    description: "Deliver high-quality work and continuously improve our craft"
  },
  {
    title: "Impact",
    description: "Focus on outcomes that matter to our customers and users"
  }
];

export default function CareersPage() {
  return (
    <StandardPageLayout
      title="Join Our Team"
      subtitle="Build the Future of Database Optimization"
      description="Help us democratize database performance optimization with AI. Join a growing team of passionate engineers, designers, and problem solvers."
    >
      <div className="space-y-20">
        {/* Company Culture */}
        <section className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-6">Why DBooster?</h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-12">
              We're building the future of database optimization, making it accessible to developers worldwide. 
              Join us in solving complex technical challenges while maintaining a healthy work-life balance in a 
              supportive, growth-oriented environment.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Open Positions */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Open Positions</h2>
            <p className="text-xl text-muted-foreground">
              Join our growing team and help shape the future of database optimization
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
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{position.department}</Badge>
                          <Badge variant="secondary">{position.type}</Badge>
                        </div>
                        <CardTitle className="text-xl mb-2">{position.title}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {position.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {position.experience}
                          </div>
                        </div>
                        <p className="text-muted-foreground">{position.description}</p>
                      </div>
                      <Button asChild>
                        <Link to="/contact">
                          Apply Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="bg-muted/30 p-12 rounded-2xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Benefits & Perks</h2>
            <p className="text-xl text-muted-foreground">
              We invest in our team's success and well-being
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-muted to-background rounded-xl flex items-center justify-center">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Application Process */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Application Process</h2>
            <p className="text-xl text-muted-foreground">
              Our hiring process is designed to be transparent and respectful of your time
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-primary">1</span>
              </div>
              <h3 className="font-semibold mb-2">Application</h3>
              <p className="text-sm text-muted-foreground">Submit your application and we'll review it within 3 days</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-primary">2</span>
              </div>
              <h3 className="font-semibold mb-2">Initial Call</h3>
              <p className="text-sm text-muted-foreground">30-minute conversation about you, us, and the role</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-primary">3</span>
              </div>
              <h3 className="font-semibold mb-2">Technical</h3>
              <p className="text-sm text-muted-foreground">Technical discussion or take-home project (your choice)</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-primary">4</span>
              </div>
              <h3 className="font-semibold mb-2">Final Round</h3>
              <p className="text-sm text-muted-foreground">Meet the team and discuss how we can grow together</p>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary/5 to-blue-500/5 p-12 rounded-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Users className="h-16 w-16 mx-auto mb-6 text-primary" />
            <h2 className="text-3xl font-bold mb-4">Don't See Your Role?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              We're always looking for talented people who share our passion for solving complex problems. 
              Send us your resume and let's chat!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="px-8">
                <a href="mailto:careers@dbooster.ai">
                  Send Your Resume
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8">
                <Link to="/about">Learn About Us</Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </div>
    </StandardPageLayout>
  );
}
