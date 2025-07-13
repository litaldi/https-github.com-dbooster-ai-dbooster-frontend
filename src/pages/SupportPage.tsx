
import React from 'react';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  Book, 
  Video, 
  Users, 
  Clock,
  ArrowRight,
  ExternalLink,
  HelpCircle,
  FileText,
  Search
} from 'lucide-react';
import { Link } from 'react-router-dom';

const supportChannels = [
  {
    title: "Email Support",
    description: "Get help via email with detailed responses",
    icon: <Mail className="h-8 w-8 text-blue-600" />,
    contact: "support@dbooster.ai",
    availability: "24/7 - Response within 4 hours",
    action: "mailto:support@dbooster.ai"
  },
  {
    title: "Phone Support",
    description: "Speak directly with our support team",
    icon: <Phone className="h-8 w-8 text-green-600" />,
    contact: "+972-54-000-0000",
    availability: "Sun-Thu: 9AM-6PM IST",
    action: "tel:+972540000000"
  },
  {
    title: "Live Chat",
    description: "Instant help through our chat system",
    icon: <MessageSquare className="h-8 w-8 text-purple-600" />,
    contact: "Available in dashboard",
    availability: "24/7 for premium users",
    action: "/app"
  },
  {
    title: "Community Forum",
    description: "Connect with other DBooster users",
    icon: <Users className="h-8 w-8 text-orange-600" />,
    contact: "community.dbooster.ai",
    availability: "Always available",
    action: "https://community.dbooster.ai"
  }
];

const resourceTypes = [
  {
    title: "Documentation",
    description: "Comprehensive guides and API references",
    icon: <Book className="h-6 w-6 text-blue-500" />,
    items: [
      "Getting Started Guide",
      "API Documentation", 
      "Integration Tutorials",
      "Troubleshooting Guide"
    ]
  },
  {
    title: "Video Tutorials",
    description: "Step-by-step video walkthroughs",
    icon: <Video className="h-6 w-6 text-red-500" />,
    items: [
      "Platform Overview",
      "Database Connection Setup",
      "Reading Optimization Reports",
      "Advanced Configuration"
    ]
  },
  {
    title: "Knowledge Base",
    description: "Searchable articles and FAQs",
    icon: <Search className="h-6 w-6 text-green-500" />,
    items: [
      "Common Questions",
      "Error Code Reference",
      "Performance Optimization Tips",
      "Security Best Practices"
    ]
  },
  {
    title: "Release Notes",
    description: "Latest updates and changes",
    icon: <FileText className="h-6 w-6 text-purple-500" />,
    items: [
      "Feature Announcements",
      "Bug Fixes",
      "Breaking Changes",
      "Migration Guides"
    ]
  }
];

const supportPlans = [
  {
    name: "Community",
    description: "Self-service support for individual developers",
    features: [
      "Documentation access",
      "Community forum",
      "Email support (48h response)",
      "Knowledge base"
    ],
    availability: "Business hours"
  },
  {
    name: "Professional",
    description: "Priority support for teams and businesses",
    features: [
      "Everything in Community",
      "Priority email support (4h response)",
      "Live chat support",
      "Video call support"
    ],
    availability: "Extended hours",
    badge: "Most Popular"
  },
  {
    name: "Enterprise",
    description: "Dedicated support for enterprise customers",
    features: [
      "Everything in Professional", 
      "Dedicated support manager",
      "Phone support (1h response)",
      "Custom SLA agreements"
    ],
    availability: "24/7"
  }
];

export default function SupportPage() {
  return (
    <StandardPageLayout
      title="Support Center"
      subtitle="We're Here to Help"
      description="Get the support you need to optimize your database performance. Multiple channels, comprehensive resources, and expert guidance."
    >
      <div className="space-y-20">
        {/* Contact Information Header */}
        <section className="bg-muted/30 p-8 rounded-2xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
            <p className="text-muted-foreground">Multiple ways to reach our support team</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <Mail className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-1">Email</h3>
              <p className="text-sm text-muted-foreground mb-2">support@dbooster.ai</p>
              <p className="text-xs text-muted-foreground">Response within 4 hours</p>
            </div>
            
            <div className="text-center">
              <Phone className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-1">Phone</h3>
              <p className="text-sm text-muted-foreground mb-2">+972-54-000-0000</p>
              <p className="text-xs text-muted-foreground">Sun-Thu: 9AM-6PM IST</p>
            </div>
            
            <div className="text-center">
              <MapPin className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-1">Office</h3>
              <p className="text-sm text-muted-foreground mb-2">Tel Aviv, Israel</p>
              <p className="text-xs text-muted-foreground">Headquarters</p>
            </div>
          </div>
        </section>

        {/* Support Channels */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Get Help Your Way</h2>
            <p className="text-xl text-muted-foreground">
              Choose the support channel that works best for you
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {supportChannels.map((channel, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-muted to-muted/50 rounded-xl flex items-center justify-center">
                        {channel.icon}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{channel.title}</CardTitle>
                        <p className="text-muted-foreground">{channel.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="font-medium">{channel.contact}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{channel.availability}</span>
                        </div>
                      </div>
                      <Button asChild className="w-full">
                        <a href={channel.action} target={channel.action.startsWith('http') ? '_blank' : undefined}>
                          Get Support
                          {channel.action.startsWith('http') ? (
                            <ExternalLink className="ml-2 h-4 w-4" />
                          ) : (
                            <ArrowRight className="ml-2 h-4 w-4" />
                          )}
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Self-Service Resources */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Self-Service Resources</h2>
            <p className="text-xl text-muted-foreground">
              Find answers quickly with our comprehensive documentation and guides
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {resourceTypes.map((resource, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      {resource.icon}
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                    </div>
                    <p className="text-muted-foreground">{resource.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {resource.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center gap-2 text-sm">
                          <ArrowRight className="h-3 w-3 text-muted-foreground" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Button asChild variant="outline" className="w-full mt-4">
                      <Link to="/learn">
                        Browse {resource.title}
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Support Plans */}
        <section className="bg-muted/30 p-12 rounded-2xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Support Plans</h2>
            <p className="text-xl text-muted-foreground">
              Different levels of support to match your needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {supportPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`h-full relative ${plan.badge ? 'border-2 border-primary' : ''}`}>
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">
                        {plan.badge}
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <p className="text-muted-foreground">{plan.description}</p>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-2">
                          <Clock className="h-4 w-4" />
                          {plan.availability}
                        </div>
                      </div>
                      
                      <ul className="space-y-2">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center gap-2 text-sm">
                            <ArrowRight className="h-3 w-3 text-green-500" />
                            <span>{feature}</span>
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

        {/* FAQ Quick Links */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Quick Help</h2>
            <p className="text-xl text-muted-foreground">
              Common questions and helpful resources
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <HelpCircle className="h-8 w-8 mx-auto mb-2 text-primary" />
                <CardTitle className="text-lg">FAQ</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Frequently asked questions
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link to="/faq">View FAQ</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Book className="h-8 w-8 mx-auto mb-2 text-primary" />
                <CardTitle className="text-lg">Docs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Complete documentation
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link to="/learn">Browse Docs</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Activity className="h-8 w-8 mx-auto mb-2 text-primary" />
                <CardTitle className="text-lg">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  System status & uptime
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link to="/status">Check Status</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <MessageSquare className="h-8 w-8 mx-auto mb-2 text-primary" />
                <CardTitle className="text-lg">Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Get in touch directly
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </StandardPageLayout>
  );
}
