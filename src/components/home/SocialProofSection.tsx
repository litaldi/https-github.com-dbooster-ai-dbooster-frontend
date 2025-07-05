
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Building, CheckCircle, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar?: string;
  rating: number;
  results: string[];
}

function TestimonialCard({ quote, author, role, company, avatar, rating, results }: TestimonialCardProps) {
  return (
    <Card className="h-full border-2 hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        
        <Quote className="h-8 w-8 text-primary/20 mb-4" />
        
        <blockquote className="text-foreground mb-6 leading-relaxed">
          "{quote}"
        </blockquote>
        
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatar} alt={author} />
            <AvatarFallback>{author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-sm">{author}</div>
            <div className="text-xs text-muted-foreground">{role}</div>
            <div className="text-xs text-muted-foreground font-medium">{company}</div>
          </div>
        </div>
        
        <div className="space-y-2">
          {results.map((result, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="text-muted-foreground">{result}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function SocialProofSection() {
  const testimonials = [
    {
      quote: "DBooster reduced our query response times by 85% in the first week. The AI recommendations were spot-on and saved us months of manual optimization work.",
      author: "Sarah Chen",
      role: "Senior Database Engineer",
      company: "TechCorp Solutions",
      rating: 5,
      results: [
        "85% faster query performance",
        "$75K annual cost savings",
        "3 weeks faster deployment"
      ]
    },
    {
      quote: "The security and compliance features give us confidence to use DBooster in our production environment. SOC2 compliance was crucial for our enterprise needs.",
      author: "Michael Rodriguez",
      role: "CTO",
      company: "FinanceFirst Bank",
      rating: 5,
      results: [
        "SOC2 compliance achieved",
        "Zero security incidents",
        "40% reduction in audit time"
      ]
    },
    {
      quote: "From setup to first optimization took less than 5 minutes. The interface is intuitive and the AI suggestions are incredibly accurate.",
      author: "Emily Johnson",
      role: "Full Stack Developer",
      company: "StartupHub Inc",
      rating: 5,
      results: [
        "5-minute setup time",
        "92% query accuracy",
        "Team productivity +60%"
      ]
    }
  ];

  const companyLogos = [
    { name: "TechCorp", employees: "5,000+" },
    { name: "FinanceFirst", employees: "15,000+" },
    { name: "DataDrive", employees: "2,500+" },
    { name: "CloudScale", employees: "8,000+" },
    { name: "SecureBase", employees: "12,000+" },
    { name: "FastQuery", employees: "3,200+" }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Company Logos */}
        <div className="text-center mb-16">
          <p className="text-sm text-muted-foreground mb-8">
            Trusted by 50,000+ developers at leading companies
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {companyLogos.map((company, index) => (
              <motion.div
                key={company.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-white rounded-lg p-4 shadow-sm border mb-2">
                  <Building className="h-8 w-8 mx-auto text-muted-foreground" />
                </div>
                <div className="text-xs font-medium">{company.name}</div>
                <div className="text-xs text-muted-foreground">{company.employees}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 px-4 py-2">
            <Star className="h-3 w-3 mr-2" />
            Customer Success Stories
          </Badge>
          <h2 className="text-3xl font-bold mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real feedback from database professionals who've transformed their performance with DBooster
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <TestimonialCard {...testimonial} />
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-4 mt-12 pt-12 border-t">
          <Badge variant="outline" className="px-4 py-2">
            <Shield className="h-4 w-4 mr-2" />
            SOC2 Type II Certified
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            <CheckCircle className="h-4 w-4 mr-2" />
            99.9% Uptime SLA
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            <Building className="h-4 w-4 mr-2" />
            Enterprise Ready
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            <Star className="h-4 w-4 mr-2" />
            24/7 Expert Support
          </Badge>
        </div>
      </div>
    </section>
  );
}
