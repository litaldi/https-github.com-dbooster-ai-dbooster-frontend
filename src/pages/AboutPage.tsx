
import React from 'react';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Target, 
  Users, 
  Award, 
  Globe, 
  Heart,
  Lightbulb,
  Shield,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const values = [
  {
    icon: <Lightbulb className="h-8 w-8 text-blue-600" />,
    title: "Innovation First",
    description: "We constantly push the boundaries of what's possible with AI and database optimization, staying ahead of industry trends."
  },
  {
    icon: <Shield className="h-8 w-8 text-green-600" />,
    title: "Security & Trust",
    description: "Your data security is our top priority. We maintain the highest standards of security and compliance across all our operations."
  },
  {
    icon: <Users className="h-8 w-8 text-purple-600" />,
    title: "Developer-Centric",
    description: "Everything we build is designed with developers in mind, focusing on ease of use, powerful features, and seamless integration."
  },
  {
    icon: <Heart className="h-8 w-8 text-red-600" />,
    title: "Customer Success",
    description: "Our success is measured by your success. We're committed to helping every customer achieve their database optimization goals."
  }
];

const stats = [
  { value: "50,000+", label: "Developers Trust Us" },
  { value: "2.5M+", label: "Queries Optimized" },
  { value: "73%", label: "Average Speed Improvement" },
  { value: "60%", label: "Cost Reduction Achieved" }
];

const timeline = [
  {
    year: "2022",
    title: "Company Founded",
    description: "Started with a vision to democratize database optimization using AI technology."
  },
  {
    year: "2023",
    title: "AI Engine Launch",
    description: "Released our first AI-powered query optimization engine, achieving 70%+ performance improvements."
  },
  {
    year: "2024",
    title: "Enterprise Growth",
    description: "Reached 50,000+ developers and launched enterprise features with SOC2 compliance."
  },
  {
    year: "2025",
    title: "Global Expansion",
    description: "Expanding internationally and developing next-generation AI optimization technologies."
  }
];

export default function AboutPage() {
  return (
    <StandardPageLayout
      title="Transforming Database Performance with AI"
      subtitle="Our Mission"
      description="We're on a mission to make database optimization accessible to every developer and organization, regardless of their expertise level."
    >
      <div className="space-y-20">
        {/* Mission Statement */}
        <section className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-6">Empowering Developers Worldwide</h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Database optimization shouldn't require a PhD in computer science. Our AI-powered platform makes it possible for any developer to achieve enterprise-level database performance, reducing costs and improving user experience across millions of applications worldwide.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Our Values */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The principles that guide everything we do at DBooster
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow border-2 hover:border-primary/20">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-gradient-to-br from-muted to-muted/50 rounded-xl">
                        {value.icon}
                      </div>
                      <h3 className="text-xl font-semibold">{value.title}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Company Timeline */}
        <section className="bg-muted/30 p-12 rounded-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
            <p className="text-xl text-muted-foreground">
              From startup to the leading AI database optimization platform
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 transform md:-translate-x-0.5"></div>
              
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative flex items-center mb-12 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-primary rounded-full transform md:-translate-x-2 z-10"></div>
                  
                  {/* Content */}
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                    <Card>
                      <CardContent className="p-6">
                        <Badge variant="outline" className="mb-3">{item.year}</Badge>
                        <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Recognition & Certifications */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Recognition & Trust</h2>
            <p className="text-xl text-muted-foreground">
              Trusted by industry leaders and certified for enterprise use
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 mb-4">
                <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">SOC2 Type II Certified</h3>
                <p className="text-sm text-muted-foreground">Enterprise-grade security and compliance standards</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 mb-4">
                <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Industry Leader</h3>
                <p className="text-sm text-muted-foreground">Recognized as a top database optimization platform</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl border border-purple-200 mb-4">
                <Globe className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Global Presence</h3>
                <p className="text-sm text-muted-foreground">Serving customers across 50+ countries worldwide</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-gradient-to-r from-primary/5 to-blue-500/5 p-12 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Be part of the revolution in database optimization. Whether you're a developer, team lead, or enterprise architect, we have the tools to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="px-8">
              <Link to="/careers">
                Join Our Team
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8">
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>
        </section>
      </div>
    </StandardPageLayout>
  );
}
