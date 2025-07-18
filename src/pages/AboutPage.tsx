
import React from 'react';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Users, 
  Target, 
  Award, 
  Heart, 
  ArrowRight, 
  MapPin, 
  Mail,
  Linkedin,
  Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';

const values = [
  {
    title: "Innovation First",
    description: "We push the boundaries of what's possible with AI and database optimization.",
    icon: <Target className="h-8 w-8 text-blue-600" />
  },
  {
    title: "Customer Success",
    description: "Your success is our success. We're committed to delivering measurable results.",
    icon: <Award className="h-8 w-8 text-green-600" />
  },
  {
    title: "Transparency",
    description: "Clear pricing, honest communication, and open about how our technology works.",
    icon: <Heart className="h-8 w-8 text-red-600" />
  },
  {
    title: "Security & Trust",
    description: "Your data security is paramount. We earn trust through consistent, secure practices.",
    icon: <Users className="h-8 w-8 text-purple-600" />
  }
];

const teamMembers = [
  {
    name: "David Chen",
    role: "CEO & Co-Founder",
    bio: "Former Principal Engineer at Google. 15+ years optimizing large-scale database systems.",
    location: "Tel Aviv, Israel"
  },
  {
    name: "Sarah Rodriguez",
    role: "CTO & Co-Founder", 
    bio: "PhD in Machine Learning from MIT. Previously led AI initiatives at Amazon Web Services.",
    location: "Tel Aviv, Israel"
  },
  {
    name: "Michael Thompson",
    role: "VP of Engineering",
    bio: "Former Tech Lead at Netflix. Expert in distributed systems and database architecture.",
    location: "Remote, USA"
  },
  {
    name: "Lisa Wang",
    role: "Head of Product",
    bio: "Former Product Manager at MongoDB. Passionate about developer experience and usability.",
    location: "Tel Aviv, Israel"
  }
];

const milestones = [
  { year: "2022", event: "Founded DBooster with mission to democratize database optimization" },
  { year: "2023", event: "Launched beta with 100+ early customers, achieved 70% average performance improvement" },
  { year: "2023", event: "Raised $5M Series A funding led by prominent VCs" },
  { year: "2024", event: "SOC2 Type II certification achieved, enterprise customers onboarded" },
  { year: "2024", event: "10,000+ developers using DBooster, supporting 50+ database types" }
];

export default function AboutPage() {
  return (
    <StandardPageLayout
      title="About DBooster"
      subtitle="Transforming Database Performance"
      description="We're on a mission to make database optimization accessible to every developer and organization, regardless of size or technical expertise."
    >
      <div className="space-y-20">
        {/* Mission Section */}
        <section className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Database performance shouldn't be a barrier to innovation. We believe every developer deserves access to 
              enterprise-grade optimization tools, powered by cutting-edge AI that learns and adapts to your unique needs.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Founded in Tel Aviv in 2022, DBooster was born from the frustration of spending countless hours manually 
              optimizing database queries. Today, we're helping thousands of developers reclaim that time and focus on 
              what they do best: building amazing products.
            </p>
          </motion.div>
        </section>

        {/* Values Section */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-muted to-muted/50 rounded-xl flex items-center justify-center">
                      {value.icon}
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground">
              World-class experts in AI, databases, and developer tools
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {teamMembers.map((member, index) => (
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
                      <div>
                        <CardTitle className="text-xl">{member.name}</CardTitle>
                        <p className="text-primary font-medium">{member.role}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3" />
                          {member.location}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Timeline Section */}
        <section className="bg-muted/30 p-12 rounded-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
            <p className="text-xl text-muted-foreground">
              Key milestones in our mission to optimize databases worldwide
            </p>
          </div>
          
          <div className="space-y-8 max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex gap-4"
              >
                <div className="flex-shrink-0 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">{milestone.year}</span>
                </div>
                <div className="flex-1">
                  <p className="text-muted-foreground">{milestone.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
            <p className="text-xl text-muted-foreground mb-8">
              We'd love to hear from you. Reach out anytime.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <Mail className="h-8 w-8 mx-auto mb-2 text-primary" />
                <CardTitle>Email Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Drop us a line anytime</p>
                <Button asChild variant="outline" size="sm">
                  <a href="mailto:support@dbooster.ai">support@dbooster.ai</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
                <CardTitle>Visit Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Our headquarters</p>
                <p className="text-sm">Tel Aviv, Israel</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Linkedin className="h-8 w-8 mx-auto mb-2 text-primary" />
                <CardTitle>Connect</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Follow our journey</p>
                <Button asChild variant="outline" size="sm">
                  <a href="https://linkedin.com/company/dbooster" target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                </Button>
              </CardContent>
            </Card>
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
            <h2 className="text-3xl font-bold mb-4">Ready to Join Us?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Whether you're looking to optimize your database or join our team, we'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="px-8">
                <Link to="/demo">
                  Try DBooster
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8">
                <Link to="/careers">View Careers</Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </div>
    </StandardPageLayout>
  );
}
