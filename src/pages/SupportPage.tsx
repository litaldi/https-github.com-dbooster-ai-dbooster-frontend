
import React, { useState } from 'react';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Mail, 
  Phone, 
  Clock, 
  CheckCircle2,
  Search,
  BookOpen,
  FileText,
  Users,
  AlertCircle,
  ExternalLink,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';

const supportChannels = [
  {
    title: "Live Chat",
    description: "Get instant help from our support team during business hours",
    icon: <MessageCircle className="h-8 w-8 text-blue-600" />,
    availability: "Mon-Fri, 9AM-6PM IST",
    responseTime: "< 5 minutes",
    action: "Start Chat"
  },
  {
    title: "Email Support",
    description: "Send us detailed questions and we'll get back to you promptly",
    icon: <Mail className="h-8 w-8 text-green-600" />,
    availability: "24/7",
    responseTime: "< 4 hours",
    action: "Send Email"
  },
  {
    title: "Phone Support",
    description: "Talk directly with our technical experts for urgent issues",
    icon: <Phone className="h-8 w-8 text-purple-600" />,
    availability: "Enterprise customers only",
    responseTime: "Immediate",
    action: "Schedule Call"
  }
];

const quickHelp = [
  {
    title: "Getting Started Guide",
    description: "Step-by-step instructions to set up your first optimization",
    icon: <BookOpen className="h-6 w-6" />,
    category: "Setup"
  },
  {
    title: "Troubleshooting Common Issues",
    description: "Solutions for the most frequently encountered problems",
    icon: <AlertCircle className="h-6 w-6" />,
    category: "Troubleshooting"
  },
  {
    title: "API Documentation",
    description: "Complete reference for integrating with DBooster's API",
    icon: <FileText className="h-6 w-6" />,
    category: "Development"
  },
  {
    title: "Best Practices",
    description: "Tips and recommendations for optimal database performance",
    icon: <CheckCircle2 className="h-6 w-6" />,
    category: "Optimization"
  }
];

const popularTopics = [
  "How to connect my database?",
  "Understanding optimization recommendations",
  "Setting up monitoring alerts",
  "Integrating with CI/CD pipeline",
  "Configuring team permissions",
  "Enterprise security features"
];

export default function SupportPage() {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'normal'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Support form submitted:', contactForm);
    // Handle form submission
  };

  return (
    <StandardPageLayout
      title="Support Center"
      subtitle="We're Here to Help"
      description="Get the support you need to optimize your database performance. Access documentation, contact our team, or find answers to common questions."
    >
      <div className="space-y-20">
        {/* Quick Search */}
        <section className="bg-gradient-to-r from-primary/5 to-blue-500/5 p-12 rounded-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold mb-6">Search for Help</h2>
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search documentation, guides, and FAQs..."
                className="pl-12 h-12 text-lg"
              />
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {popularTopics.slice(0, 4).map((topic, index) => (
                <Badge key={index} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                  {topic}
                </Badge>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Support Channels */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Contact Our Support Team</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose the best way to reach us based on your needs and urgency level.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {supportChannels.map((channel, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 text-center">
                  <CardHeader>
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-muted to-muted/50 rounded-xl flex items-center justify-center">
                      {channel.icon}
                    </div>
                    <CardTitle className="text-xl">{channel.title}</CardTitle>
                    <p className="text-muted-foreground leading-relaxed">
                      {channel.description}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{channel.availability}</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Activity className="h-4 w-4" />
                        <span>Response: {channel.responseTime}</span>
                      </div>
                    </div>
                    <Button className="w-full">
                      {channel.action}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Quick Help Resources */}
        <section className="bg-muted/30 p-12 rounded-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Quick Help Resources</h2>
            <p className="text-xl text-muted-foreground">
              Find answers instantly with our comprehensive documentation and guides.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickHelp.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        {item.icon}
                      </div>
                      <div>
                        <Badge variant="outline" className="mb-2">
                          {item.category}
                        </Badge>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <p className="text-muted-foreground text-sm">{item.description}</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto" />
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Form */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Send Us a Message</h2>
            <p className="text-xl text-muted-foreground">
              Can't find what you're looking for? Send us a detailed message and we'll help you out.
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name</label>
                      <Input
                        value={contactForm.name}
                        onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <Input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <Input
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                      placeholder="Brief description of your issue"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <Textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      placeholder="Please describe your issue in detail..."
                      rows={6}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Additional Resources */}
        <section className="bg-gradient-to-r from-primary/5 to-blue-500/5 p-12 rounded-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">More Ways to Get Help</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Explore additional resources and connect with our community for support and best practices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="px-8">
                <Link to="/documentation">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Documentation
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8">
                <Link to="/faq">
                  <Users className="mr-2 h-5 w-5" />
                  FAQ
                </Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </div>
    </StandardPageLayout>
  );
}
