
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
  Activity,
  Send,
  Loader2,
  Star,
  ThumbsUp,
  ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { enhancedToast } from '@/components/ui/enhanced-toast';

const supportChannels = [
  {
    title: "Live Chat",
    description: "Get instant help from our support team during business hours",
    icon: <MessageCircle className="h-8 w-8 text-blue-600" />,
    availability: "Mon-Fri, 9AM-6PM IST",
    responseTime: "< 5 minutes",
    action: "Start Chat",
    status: "online"
  },
  {
    title: "Email Support",
    description: "Send us detailed questions and we'll get back to you promptly",
    icon: <Mail className="h-8 w-8 text-green-600" />,
    availability: "24/7",
    responseTime: "< 4 hours",
    action: "Send Email",
    status: "available"
  },
  {
    title: "Phone Support",
    description: "Talk directly with our technical experts for urgent issues",
    icon: <Phone className="h-8 w-8 text-purple-600" />,
    availability: "Enterprise customers only",
    responseTime: "Immediate",
    action: "Schedule Call",
    status: "premium"
  }
];

const quickHelp = [
  {
    title: "Getting Started Guide",
    description: "Step-by-step instructions to set up your first optimization",
    icon: <BookOpen className="h-6 w-6" />,
    category: "Setup",
    readTime: "5 min read"
  },
  {
    title: "Troubleshooting Common Issues",
    description: "Solutions for the most frequently encountered problems",
    icon: <AlertCircle className="h-6 w-6" />,
    category: "Troubleshooting",
    readTime: "8 min read"
  },
  {
    title: "API Documentation",
    description: "Complete reference for integrating with DBooster's API",
    icon: <FileText className="h-6 w-6" />,
    category: "Development",
    readTime: "15 min read"
  },
  {
    title: "Best Practices",
    description: "Tips and recommendations for optimal database performance",
    icon: <CheckCircle2 className="h-6 w-6" />,
    category: "Optimization",
    readTime: "12 min read"
  }
];

const faqCategories = [
  {
    title: "Getting Started",
    questions: [
      {
        q: "How do I connect my database?",
        a: "Navigate to the DB Import page and follow our secure connection wizard. We support PostgreSQL, MySQL, and MongoDB with enterprise-grade security."
      },
      {
        q: "What databases are supported?",
        a: "We currently support PostgreSQL, MySQL, MongoDB, and Redis. More database types are being added regularly based on user feedback."
      }
    ]
  },
  {
    title: "Optimization",
    questions: [
      {
        q: "How do I approve query optimizations?",
        a: "Visit the Approvals page to review pending optimizations. Each suggestion includes a detailed before/after comparison with performance metrics."
      },
      {
        q: "Can I test queries before applying them?",
        a: "Absolutely! Use our Sandbox environment to safely test all optimizations before applying them to your production database."
      }
    ]
  }
];

export default function SupportPage() {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'normal'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      enhancedToast.success({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });
      
      setContactForm({
        name: '',
        email: '',
        subject: '',
        message: '',
        priority: 'normal'
      });
    } catch (error) {
      enhancedToast.error({
        title: "Failed to send message",
        description: "Please try again or contact us directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredHelp = quickHelp.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <StandardPageLayout
      title="Support Center"
      subtitle="We're Here to Help"
      description="Get the support you need to optimize your database performance. Access documentation, contact our team, or find answers to common questions."
    >
      <div className="space-y-20">
        {/* Enhanced Search Section */}
        <section className="bg-gradient-to-r from-primary/5 to-blue-500/5 p-12 rounded-2xl border border-border/50">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold mb-6">How can we help you today?</h2>
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search documentation, guides, and FAQs..."
                className="pl-12 h-12 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search support documentation"
              />
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {["Database connection", "Query optimization", "API integration", "Troubleshooting"].map((topic, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => setSearchQuery(topic)}
                >
                  {topic}
                </Badge>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Enhanced Support Channels */}
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
                <Card className="h-full hover:shadow-lg transition-all duration-300 text-center group relative overflow-hidden">
                  {channel.status === 'online' && (
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-600 font-medium">Online</span>
                      </div>
                    </div>
                  )}
                  
                  <CardHeader>
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-muted to-muted/50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
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
                    <Button className="w-full group-hover:scale-105 transition-transform">
                      {channel.action}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Enhanced FAQ Section */}
        <section className="bg-muted/30 p-12 rounded-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">
              Quick answers to common questions about DBooster.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-8">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  {category.title}
                </h3>
                <div className="space-y-4">
                  {category.questions.map((faq, faqIndex) => {
                    const faqId = `${categoryIndex}-${faqIndex}`;
                    const isExpanded = expandedFaq === faqId;
                    
                    return (
                      <Card key={faqIndex} className="hover:shadow-md transition-shadow">
                        <CardHeader 
                          className="cursor-pointer"
                          onClick={() => setExpandedFaq(isExpanded ? null : faqId)}
                        >
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium text-left">{faq.q}</h4>
                            <motion.div
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown className="h-4 w-4" />
                            </motion.div>
                          </div>
                        </CardHeader>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <CardContent className="pt-0">
                              <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                            </CardContent>
                          </motion.div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Enhanced Quick Help Resources */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Quick Help Resources</h2>
            <p className="text-xl text-muted-foreground">
              Find answers instantly with our comprehensive documentation and guides.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredHelp.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{item.readTime}</span>
                        </div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {item.title}
                        </CardTitle>
                        <p className="text-muted-foreground text-sm mt-1">{item.description}</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Enhanced Contact Form */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Send Us a Message</h2>
            <p className="text-xl text-muted-foreground">
              Can't find what you're looking for? Send us a detailed message and we'll help you out.
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contact Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" htmlFor="name">
                        Name *
                      </label>
                      <Input
                        id="name"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                        placeholder="Your full name"
                        required
                        aria-describedby="name-help"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" htmlFor="email">
                        Email *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                        placeholder="your@email.com"
                        required
                        aria-describedby="email-help"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="subject">
                      Subject *
                    </label>
                    <Input
                      id="subject"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                      placeholder="Brief description of your issue"
                      required
                      aria-describedby="subject-help"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="message">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      placeholder="Please describe your issue in detail..."
                      rows={6}
                      required
                      aria-describedby="message-help"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                    aria-describedby="submit-help"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Enhanced Additional Resources */}
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
              <Button asChild size="lg" className="px-8 group">
                <Link to="/documentation">
                  <BookOpen className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Documentation
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8 group">
                <Link to="/faq">
                  <Users className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Community FAQ
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8 group">
                <Link to="/status">
                  <Activity className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  System Status
                </Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </div>
    </StandardPageLayout>
  );
}
