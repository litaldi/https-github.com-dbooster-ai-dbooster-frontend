
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Handshake, 
  Users, 
  TrendingUp, 
  Award, 
  Globe,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Partners() {
  const partnerTiers = [
    {
      name: 'Technology Partner',
      description: 'Integrate DBooster into your platform or service',
      benefits: [
        'API access and documentation',
        'Technical support',
        'Co-marketing opportunities',
        'Revenue sharing program'
      ],
      requirements: [
        'Established technology platform',
        'Developer resources',
        'Commitment to integration'
      ]
    },
    {
      name: 'Reseller Partner',
      description: 'Sell DBooster solutions to your customers',
      benefits: [
        'Competitive margins',
        'Sales training and support',
        'Marketing materials',
        'Lead sharing program'
      ],
      requirements: [
        'Existing customer base',
        'Sales team experience',
        'Market presence'
      ]
    },
    {
      name: 'Consulting Partner',
      description: 'Provide DBooster implementation and optimization services',
      benefits: [
        'Certification program',
        'Technical training',
        'Referral commissions',
        'Partner portal access'
      ],
      requirements: [
        'Database expertise',
        'Consulting experience',
        'Professional certifications'
      ]
    }
  ];

  const currentPartners = [
    {
      name: 'AWS',
      logo: '☁️',
      description: 'Cloud infrastructure and database services integration',
      category: 'Technology'
    },
    {
      name: 'GitHub',
      logo: '🐙',
      description: 'Code repository scanning and CI/CD integration',
      category: 'Technology'
    },
    {
      name: 'Datadog',
      logo: '🐕',
      description: 'Performance monitoring and alerting integration',
      category: 'Technology'
    },
    {
      name: 'HashiCorp',
      logo: '⚡',
      description: 'Infrastructure as Code and security integration',
      category: 'Technology'
    }
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: 'Revenue Growth',
      description: 'Expand your revenue streams with our partner program'
    },
    {
      icon: Users,
      title: 'Customer Value',
      description: 'Provide additional value to your existing customers'
    },
    {
      icon: Award,
      title: 'Market Leadership',
      description: 'Position yourself as a leader in database optimization'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Access our global customer base and market presence'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Handshake className="h-4 w-4" />
            Partners
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Partner With Us to
            <span className="block bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Shape the Future
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join our partner ecosystem and help organizations worldwide optimize 
            their database performance. Together, we can build better solutions 
            and create more value for customers.
          </p>
        </div>

        {/* Partner Benefits */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-8">
                <benefit.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Partner Tiers */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Partnership Programs</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {partnerTiers.map((tier, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <p className="text-muted-foreground">{tier.description}</p>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Benefits</h4>
                      <div className="space-y-2">
                        {tier.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Requirements</h4>
                      <div className="space-y-2">
                        {tier.requirements.map((req, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-blue-500 flex-shrink-0" />
                            <span className="text-sm">{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Button className="w-full">
                      Apply Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Current Partners */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Partners</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentPartners.map((partner, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{partner.logo}</div>
                  <h3 className="text-lg font-bold mb-2">{partner.name}</h3>
                  <Badge variant="outline" className="mb-3">
                    {partner.category}
                  </Badge>
                  <p className="text-sm text-muted-foreground">{partner.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Partner Application */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Ready to Partner?</h2>
            <p className="text-muted-foreground mb-6">
              We're looking for partners who share our vision of making database 
              optimization accessible and effective for organizations of all sizes. 
              Our partner program is designed to be mutually beneficial and support 
              long-term success.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Comprehensive onboarding process</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Dedicated partner success manager</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Regular partner events and training</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Co-marketing and PR opportunities</span>
              </div>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Company Name</label>
                  <input 
                    type="text" 
                    placeholder="Your company name"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Contact Email</label>
                  <input 
                    type="email" 
                    placeholder="your@email.com"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Partnership Type</label>
                  <select className="w-full px-3 py-2 border rounded-lg">
                    <option>Technology Partner</option>
                    <option>Reseller Partner</option>
                    <option>Consulting Partner</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea 
                    placeholder="Tell us about your company and partnership interests"
                    className="w-full px-3 py-2 border rounded-lg h-24"
                  />
                </div>
                <Button className="w-full">
                  Submit Application
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-3xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4">Let's Build Together</h2>
              <p className="text-muted-foreground mb-8">
                Join our partner ecosystem and help shape the future of database 
                optimization. Together, we can create better solutions and deliver 
                more value to customers worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">
                  Become a Partner
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/contact">
                    Contact Sales
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
