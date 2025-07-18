
import React, { useState } from 'react';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2,
  MessageSquare,
  Users,
  Headphones
} from 'lucide-react';

const contactMethods = [
  {
    icon: <Mail className="h-6 w-6 text-blue-600" />,
    title: "Email Support",
    description: "Get help via email",
    contact: "support@dbooster.ai",
    action: "mailto:support@dbooster.ai",
    availability: "24/7 response within 4 hours"
  },
  {
    icon: <Phone className="h-6 w-6 text-green-600" />,
    title: "Phone Support",
    description: "Speak with our team",
    contact: "+972-54-000-0000",
    action: "tel:+972540000000",
    availability: "Sunday-Thursday, 9AM-6PM IST"
  },
  {
    icon: <MessageSquare className="h-6 w-6 text-purple-600" />,
    title: "Live Chat",
    description: "Instant help when you need it",
    contact: "Available in dashboard",
    action: "/app",
    availability: "24/7 for premium customers"
  },
  {
    icon: <Users className="h-6 w-6 text-orange-600" />,
    title: "Sales Team",
    description: "Enterprise solutions",
    contact: "sales@dbooster.ai",
    action: "mailto:sales@dbooster.ai",
    availability: "Custom demos available"
  }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  return (
    <StandardPageLayout
      title="Contact Us"
      subtitle="We're Here to Help"
      description="Get in touch with our team for support, sales inquiries, or general questions. We're committed to providing excellent service."
    >
      <div className="space-y-16">
        {/* Contact Methods */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Multiple Ways to Reach Us</h2>
            <p className="text-xl text-muted-foreground">
              Choose the method that works best for you
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow text-center">
                  <CardHeader>
                    <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-muted to-muted/50 rounded-xl flex items-center justify-center">
                      {method.icon}
                    </div>
                    <CardTitle className="text-lg">{method.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="font-medium">{method.contact}</p>
                      <p className="text-xs text-muted-foreground mt-1">{method.availability}</p>
                    </div>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <a href={method.action}>Contact Now</a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Form and Info */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-green-500" />
                    <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground">
                      Thank you for contacting us. We'll respond within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        className="mt-1"
                      />
                    </div>
                    
                    <Button type="submit" className="w-full" size="lg">
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Office Location */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-primary" />
                  <CardTitle>Our Office</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">DBooster Technologies Ltd.</p>
                  <p className="text-muted-foreground">Tel Aviv, Israel</p>
                  <p className="text-sm text-muted-foreground">
                    Located in the heart of Israel's tech ecosystem
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Clock className="h-6 w-6 text-primary" />
                  <CardTitle>Business Hours</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Sunday - Thursday</span>
                    <span className="text-muted-foreground">9:00 AM - 6:00 PM IST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Friday</span>
                    <span className="text-muted-foreground">9:00 AM - 2:00 PM IST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="text-muted-foreground">Closed</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Email support available 24/7 with responses within 4 hours
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Support Levels */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Headphones className="h-6 w-6 text-primary" />
                  <CardTitle>Support Levels</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Community Support</h4>
                    <p className="text-sm text-muted-foreground">
                      Documentation, guides, and community forums
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Email Support</h4>
                    <p className="text-sm text-muted-foreground">
                      All customers, 4-hour response time
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Priority Support</h4>
                    <p className="text-sm text-muted-foreground">
                      Team & Enterprise customers, 1-hour response
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>
      </div>
    </StandardPageLayout>
  );
}
