
import React from 'react';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  MapPin,
  FileText,
  HelpCircle,
  BookOpen,
  Users,
  Activity,
  ExternalLink,
  ArrowRight,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const supportChannels = [
  {
    title: "Help Center",
    description: "Browse our comprehensive documentation, tutorials, and frequently asked questions.",
    icon: <HelpCircle className="h-8 w-8 text-blue-600" />,
    href: "/faq",
    features: [
      "Searchable knowledge base",
      "Step-by-step tutorials",
      "Video guides",
      "API documentation"
    ],
    availability: "24/7 Self-Service"
  },
  {
    title: "Email Support", 
    description: "Get personalized help from our technical support team via email.",
    icon: <Mail className="h-8 w-8 text-green-600" />,
    href: "mailto:support@dbooster.ai",
    features: [
      "Technical troubleshooting",
      "Account assistance",
      "Feature requests",
      "Integration support"
    ],
    availability: "24-48 hour response"
  },
  {
    title: "Live Chat",
    description: "Chat directly with our support team for immediate assistance during business hours.",
    icon: <MessageSquare className="h-8 w-8 text-purple-600" />,
    href: "#chat",
    features: [
      "Real-time assistance",
      "Screen sharing support",
      "Immediate issue resolution",
      "Product demonstrations"
    ],
    availability: "Mon-Fri, 9AM-6PM PST"
  },
  {
    title: "Phone Support",
    description: "Direct phone support for Enterprise customers with mission-critical issues.",
    icon: <Phone className="h-8 w-8 text-orange-600" />,
    href: "tel:+972-54-000-0000",
    features: [
      "Priority support queue",
      "Emergency escalation",
      "Dedicated account manager",
      "Custom onboarding"
    ],
    availability: "Enterprise Only",
    badge: "Enterprise"
  }
];

const quickLinks = [
  {
    title: "Getting Started Guide",
    description: "New to DBooster? Start here for a complete walkthrough.",
    icon: <BookOpen className="h-5 w-5" />,
    href: "/learn"
  },
  {
    title: "API Documentation", 
    description: "Complete reference for integrating with DBooster APIs.",
    icon: <FileText className="h-5 w-5" />,
    href: "/learn"
  },
  {
    title: "System Status",
    description: "Real-time status of all DBooster services and infrastructure.",
    icon: <Activity className="h-5 w-5" />,
    href: "/status"
  },
  {
    title: "Community Forum",
    description: "Connect with other developers and share optimization tips.",
    icon: <Users className="h-5 w-5" />,
    href: "/blog"
  }
];

const contactInfo = {
  email: "support@dbooster.ai",
  phone: "+972-54-000-0000", 
  address: "Tel Aviv, Israel",
  hours: "Mon-Fri, 9AM-6PM PST"
};

export default function SupportPage() {
  return (
    <StandardPageLayout
      title="Help & Support Center"
      subtitle="We're Here to Help"
      description="Get the support you need to optimize your database performance. From self-service resources to dedicated support channels."
    >
      <div className="space-y-20">
        {/* Contact Information Banner */}
        <section className="bg-gradient-to-r from-primary/5 to-blue-500/5 p-8 rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-lg">Email</div>
                <div className="text-muted-foreground">{contactInfo.email}</div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-lg">Phone</div>
                <div className="text-muted-foreground">{contactInfo.phone}</div>
                <div className="text-xs text-muted-foreground">Enterprise Only</div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-lg">Location</div>
                <div className="text-muted-foreground">{contactInfo.address}</div>
                <div className="text-xs text-muted-foreground">{contactInfo.hours}</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Support Channels */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Choose Your Support Channel</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Multiple ways to get help, from self-service resources to dedicated support teams.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {supportChannels.map((channel, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 group">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-muted to-muted/50 rounded-xl group-hover:scale-105 transition-transform">
                          {channel.icon}
                        </div>
                        <div>
                          <CardTitle className="text-xl">{channel.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{channel.availability}</span>
                            {channel.badge && (
                              <Badge variant="secondary">{channel.badge}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {channel.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {channel.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button asChild className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {channel.href.startsWith('http') || channel.href.startsWith('mailto') || channel.href.startsWith('tel') ? (
                        <a href={channel.href} target={channel.href.startsWith('http') ? '_blank' : undefined} rel={channel.href.startsWith('http') ? 'noopener noreferrer' : undefined}>
                          Get Support
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      ) : (
                        <Link to={channel.href}>
                          Get Support
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Quick Links */}
        <section className="bg-muted/30 p-12 rounded-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Quick Links</h2>
            <p className="text-xl text-muted-foreground">
              Jump straight to the most popular resources
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center hover:shadow-md transition-shadow group cursor-pointer">
                  <Link to={link.href} className="block p-6">
                    <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      {link.icon}
                    </div>
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                      {link.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {link.description}
                    </p>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </StandardPageLayout>
  );
}
