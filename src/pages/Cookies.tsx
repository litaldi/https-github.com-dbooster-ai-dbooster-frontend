
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Cookie, Shield, Settings, Info } from 'lucide-react';

export default function Cookies() {
  const cookieTypes = [
    {
      name: 'Essential Cookies',
      description: 'Required for the website to function properly',
      examples: ['Authentication tokens', 'Security preferences', 'Session management'],
      required: true,
      duration: 'Session or up to 1 year'
    },
    {
      name: 'Analytics Cookies',
      description: 'Help us understand how you use our website',
      examples: ['Page views', 'User interactions', 'Performance metrics'],
      required: false,
      duration: 'Up to 2 years'
    },
    {
      name: 'Marketing Cookies',
      description: 'Used to deliver relevant advertisements and marketing content',
      examples: ['Ad preferences', 'Campaign tracking', 'Social media integration'],
      required: false,
      duration: 'Up to 1 year'
    },
    {
      name: 'Functional Cookies',
      description: 'Enable enhanced functionality and personalization',
      examples: ['User preferences', 'Language settings', 'Theme selection'],
      required: false,
      duration: 'Up to 1 year'
    }
  ];

  const thirdPartyServices = [
    {
      service: 'Google Analytics',
      purpose: 'Website analytics and performance monitoring',
      cookies: '_ga, _gid, _gat',
      privacyPolicy: 'https://policies.google.com/privacy'
    },
    {
      service: 'Stripe',
      purpose: 'Payment processing and fraud prevention',
      cookies: '__stripe_mid, __stripe_sid',
      privacyPolicy: 'https://stripe.com/privacy'
    },
    {
      service: 'Intercom',
      purpose: 'Customer support and communication',
      cookies: 'intercom-*',
      privacyPolicy: 'https://www.intercom.com/legal/privacy'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Cookie className="h-4 w-4" />
            Cookie Policy
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Cookie Policy
          </h1>
          <p className="text-xl text-muted-foreground">
            Last updated: January 20, 2024
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <p className="text-muted-foreground mb-4">
              This Cookie Policy explains how DBooster ("we", "us", or "our") uses cookies 
              and similar technologies when you visit our website at dbooster.com (the "Service"). 
              It explains what these technologies are and why we use them, as well as your rights 
              to control our use of them.
            </p>
            <p className="text-muted-foreground">
              In some cases we may use cookies to collect personal information, or that becomes 
              personal information if we combine it with other information. In such cases our 
              Privacy Policy will apply in addition to this Cookie Policy.
            </p>
          </CardContent>
        </Card>

        {/* What are cookies */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              What are cookies?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Cookies are small data files that are placed on your computer or mobile device 
              when you visit a website. Cookies are widely used by website owners in order 
              to make their websites work, or to work more efficiently, as well as to provide 
              reporting information.
            </p>
            <p className="text-muted-foreground">
              Cookies set by the website owner (in this case, DBooster) are called "first party cookies". 
              Cookies set by parties other than the website owner are called "third party cookies". 
              Third party cookies enable third party features or functionality to be provided on or 
              through the website (e.g., like advertising, interactive content and analytics).
            </p>
          </CardContent>
        </Card>

        {/* Cookie Types */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6">Types of Cookies We Use</h2>
          <div className="space-y-6">
            {cookieTypes.map((type, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{type.name}</CardTitle>
                    <Badge variant={type.required ? "default" : "secondary"}>
                      {type.required ? "Required" : "Optional"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{type.description}</p>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-semibold mb-2">Examples:</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        {type.examples.map((example, idx) => (
                          <li key={idx}>• {example}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Duration:</h4>
                      <p className="text-muted-foreground">{type.duration}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Third Party Services */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Third-Party Services</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              We use various third-party services that may set cookies on your device. 
              Here are the main services we use:
            </p>
            <div className="space-y-4">
              {thirdPartyServices.map((service, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{service.service}</h4>
                    <Button variant="outline" size="sm" asChild>
                      <a href={service.privacyPolicy} target="_blank" rel="noopener noreferrer">
                        Privacy Policy
                      </a>
                    </Button>
                  </div>
                  <p className="text-muted-foreground text-sm mb-2">{service.purpose}</p>
                  <p className="text-xs text-muted-foreground">
                    <strong>Cookies:</strong> {service.cookies}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cookie Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Your Cookie Choices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Browser Settings</h4>
                <p className="text-muted-foreground text-sm">
                  Most web browsers allow you to control cookies through their settings preferences. 
                  However, if you limit the ability of websites to set cookies, you may worsen your 
                  overall user experience, since it will no longer be personalized to you.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Cookie Preferences</h4>
                <p className="text-muted-foreground text-sm mb-4">
                  You can manage your cookie preferences using our cookie consent tool. 
                  Click the button below to review and update your preferences.
                </p>
                <Button>
                  Manage Cookie Preferences
                </Button>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Opt-out Links</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Google Analytics:</strong>{' '}
                    <a 
                      href="https://tools.google.com/dlpage/gaoptout" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Google Analytics Opt-out Browser Add-on
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Updates */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Updates to This Policy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We may update this Cookie Policy from time to time in order to reflect, 
              for example, changes to the cookies we use or for other operational, legal 
              or regulatory reasons. Please therefore re-visit this Cookie Policy regularly 
              to stay informed about our use of cookies and related technologies.
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              If you have any questions about our use of cookies or other technologies, 
              please email us at:
            </p>
            <p className="text-primary font-medium">privacy@dbooster.com</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
