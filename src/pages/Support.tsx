
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { HelpCircle, Mail, MessageSquare, Bug, BookOpen, Phone } from 'lucide-react';
import { enhancedToast } from '@/components/ui/enhanced-toast';

export default function Support() {
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    email: '',
    priority: 'medium'
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending contact form
    enhancedToast.success({
      title: "Support request sent",
      description: "We'll get back to you within 24 hours.",
    });
    setContactForm({ subject: '', message: '', email: '', priority: 'medium' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Support & Help</h1>
        <p className="text-muted-foreground">Get help with DBooster or contact our support team</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Live Chat
            </CardTitle>
            <CardDescription>Chat with our support team in real-time</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Start Chat</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email Support
            </CardTitle>
            <CardDescription>Send us a detailed message about your issue</CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full" variant="outline">Send Email</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Contact Support</DialogTitle>
                  <DialogDescription>
                    Describe your issue and we'll help you resolve it quickly.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <Input
                    placeholder="Email address"
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                  <Input
                    placeholder="Subject"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                    required
                  />
                  <Textarea
                    placeholder="Describe your issue or question..."
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    required
                  />
                  <Button type="submit" className="w-full">Send Message</Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Phone Support
            </CardTitle>
            <CardDescription>Call us for urgent issues</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-lg">+1 (555) 123-4567</p>
            <p className="text-sm text-muted-foreground mt-2">Mon-Fri, 9 AM - 6 PM PST</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Documentation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="ghost" className="w-full justify-start">Getting Started Guide</Button>
            <Button variant="ghost" className="w-full justify-start">API Documentation</Button>
            <Button variant="ghost" className="w-full justify-start">Best Practices</Button>
            <Button variant="ghost" className="w-full justify-start">Troubleshooting</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bug className="w-5 h-5" />
              Report a Bug
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Found a bug? Help us improve DBooster by reporting it.
            </p>
            <Button variant="outline" className="w-full">Report Bug</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">How do I connect my database?</h4>
            <p className="text-sm text-muted-foreground">
              Go to the DB Import page and follow the connection wizard to securely connect your database.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">How do I approve query optimizations?</h4>
            <p className="text-sm text-muted-foreground">
              Visit the Approvals page to review and approve pending optimizations. You can see the before/after comparison for each query.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Can I test queries before applying them?</h4>
            <p className="text-sm text-muted-foreground">
              Yes! Use the Sandbox environment to safely test query optimizations before applying them to your production database.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
