
import React from 'react';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  Users, 
  Heart, 
  Coffee, 
  Laptop, 
  Globe,
  Zap,
  ArrowRight,
  Building,
  DollarSign
} from 'lucide-react';
import { Link } from 'react-router-dom';

const jobOpenings = [
  {
    title: "Senior AI/ML Engineer",
    department: "Engineering",
    location: "Tel Aviv, Israel / Remote",
    type: "Full-time",
    description: "Lead the development of our AI-powered query optimization algorithms and machine learning models.",
    requirements: [
      "5+ years in AI/ML development",
      "Experience with Python, TensorFlow/PyTorch",
      "Database and SQL expertise",
      "PhD/MS in Computer Science preferred"
    ]
  },
  {
    title: "Senior Full-Stack Developer",
    department: "Engineering",
    location: "Remote / Tel Aviv",
    type: "Full-time",
    description: "Build and scale our React/TypeScript frontend and Node.js backend systems.",
    requirements: [
      "5+ years full-stack development",
      "React, TypeScript, Node.js expertise",
      "Database optimization knowledge",
      "Experience with cloud platforms"
    ]
  },
  {
    title: "DevOps Engineer",
    department: "Infrastructure",
    location: "Remote",
    type: "Full-time",
    description: "Manage our cloud infrastructure and deployment pipelines for global scale.",
    requirements: [
      "4+ years DevOps experience",
      "AWS/GCP/Azure expertise",
      "Kubernetes and Docker",
      "CI/CD pipeline experience"
    ]
  },
  {
    title: "Product Manager",
    department: "Product",
    location: "Tel Aviv, Israel",
    type: "Full-time",
    description: "Drive product strategy and roadmap for our database optimization platform.",
    requirements: [
      "3+ years product management",
      "Technical background preferred",
      "B2B SaaS experience",
      "Strong analytical skills"
    ]
  },
  {
    title: "Database Solutions Architect",
    department: "Customer Success",
    location: "Remote / US East Coast",
    type: "Full-time",
    description: "Help enterprise customers optimize their database architectures and achieve success.",
    requirements: [
      "7+ years database experience",
      "Multiple database platforms",
      "Customer-facing experience",
      "Solutions architecture background"
    ]
  }
];

const benefits = [
  {
    icon: <DollarSign className="h-6 w-6 text-green-600" />,
    title: "Competitive Compensation",
    description: "Top-tier salary, equity, and performance bonuses"
  },
  {
    icon: <Heart className="h-6 w-6 text-red-600" />,
    title: "Health & Wellness",
    description: "Comprehensive health, dental, and vision insurance"
  },
  {
    icon: <Globe className="h-6 w-6 text-blue-600" />,
    title: "Remote-First Culture",
    description: "Work from anywhere with flexible hours and collaboration tools"
  },
  {
    icon: <Laptop className="h-6 w-6 text-purple-600" />,
    title: "Top Equipment",
    description: "Latest MacBook Pro, monitors, and any tools you need"
  },
  {
    icon: <Coffee className="h-6 w-6 text-orange-600" />,
    title: "Learning & Development",
    description: "Conference budget, courses, and continuous learning opportunities"
  },
  {
    icon: <Users className="h-6 w-6 text-indigo-600" />,
    title: "Amazing Team",
    description: "Work with world-class engineers and industry experts"
  }
];

const values = [
  {
    title: "Innovation First",
    description: "We push the boundaries of what's possible with AI and database technology"
  },
  {
    title: "Customer Obsession",
    description: "Every decision is made with our customers' success in mind"
  },
  {
    title: "Continuous Learning",
    description: "We encourage experimentation and learning from both successes and failures"
  },
  {
    title: "Transparency",
    description: "Open communication, honest feedback, and transparent decision-making"
  }
];

export default function CareersPage() {
  return (
    <StandardPageLayout
      title="Join the Future of Database Optimization"
      subtitle="Careers at DBooster"
      description="Help us build the next generation of AI-powered database optimization tools and transform how developers work with data."
    >
      <div className="space-y-20">
        {/* Company Culture */}
        <section className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-6">Why Work at DBooster?</h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12">
              We're a fast-growing startup with a mission to democratize database optimization. 
              Join a team of world-class engineers and help millions of developers build better, faster applications.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Benefits */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Benefits & Perks</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We believe in taking care of our team so they can do their best work
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
                <Card className="h-full hover:shadow-lg transition-shadow border-2 hover:border-primary/20">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-gradient-to-br from-muted to-muted/50 rounded-xl">
                        {benefit.icon}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground text-sm">{benefit.description}</p>
                  </CardContent>
                </Card>
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
            {jobOpenings.map((job, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="hover:shadow-lg transition-shadow border-2 hover:border-primary/20">
                  <CardHeader>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div>
                        <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">{job.department}</Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {job.location}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {job.type}
                          </Badge>
                        </div>
                      </div>
                      <Button asChild>
                        <Link to="/contact">
                          Apply Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{job.description}</p>
                    <div>
                      <h4 className="font-semibold mb-2">Requirements:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {job.requirements.map((req, reqIndex) => (
                          <li key={reqIndex} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Don't see your role? */}
        <section className="bg-gradient-to-r from-primary/5 to-blue-500/5 p-12 rounded-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Don't See Your Role?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              We're always looking for exceptional talent. If you're passionate about database optimization 
              and AI, we'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="px-8">
                <Link to="/contact">
                  Send Us Your Resume
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8">
                <Link to="/about">Learn More About Us</Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </div>
    </StandardPageLayout>
  );
}
