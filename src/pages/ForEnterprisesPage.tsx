
import React from 'react';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Building, 
  Shield, 
  Users, 
  BarChart3, 
  ArrowRight,
  CheckCircle2,
  Lock,
  Globe,
  Headphones,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';

const enterpriseFeatures = [
  {
    title: "Enterprise Security & Compliance",
    description: "SOC2 Type II certified with advanced security controls, audit logging, and compliance features for regulated industries.",
    icon: <Shield className="h-8 w-8 text-red-600" />,
    features: ["SOC2 Type II certified", "GDPR & CCPA compliant", "Advanced audit logging", "Custom security policies"]
  },
  {
    title: "Scalable Architecture",
    description: "Handle thousands of databases and millions of queries with our enterprise-grade infrastructure and optimization engine.",
    icon: <Building className="h-8 w-8 text-blue-600" />,
    features: ["Multi-region deployment", "High availability", "Auto-scaling", "99.9% uptime SLA"]
  },
  {
    title: "Advanced User Management",
    description: "Comprehensive user management with SSO, RBAC, and team organization features for large organizations.",
    icon: <Users className="h-8 w-8 text-green-600" />,
    features: ["SSO integration", "Role-based access", "Team management", "Custom permissions"]
  },
  {
    title: "Enterprise Analytics",
    description: "Advanced reporting and analytics with custom dashboards, API access, and data export capabilities.",
    icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
    features: ["Custom dashboards", "Advanced reporting", "API access", "Data export"]
  }
];

const enterpriseBenefits = [
  "Reduce database infrastructure costs by 60%",
  "Improve application performance by 85%",
  "Scale optimization across entire organization",
  "Ensure compliance with industry regulations",
  "Get dedicated support and custom solutions",
  "Integrate with existing enterprise tools"
];

const complianceStandards = [
  { name: "SOC2 Type II", icon: <Lock className="h-5 w-5" /> },
  { name: "GDPR Compliant", icon: <Globe className="h-5 w-5" /> },
  { name: "CCPA Compliant", icon: <Shield className="h-5 w-5" /> },
  { name: "ISO 27001", icon: <Award className="h-5 w-5" /> }
];

export default function ForEnterprisesPage() {
  return (
    <StandardPageLayout
      title="DBooster for Enterprises - Scale Database Optimization"
      subtitle="Enterprise Solutions"
      description="Enterprise-grade database optimization with advanced security, compliance, and scale. Trusted by Fortune 500 companies worldwide."
    >
      <div className="space-y-20">
        {/* Enterprise Stats */}
        <section className="text-center">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {[
              { metric: "Fortune 500", label: "Companies Trust Us", icon: <Building className="h-6 w-6" /> },
              { metric: "99.9%", label: "Uptime SLA", icon: <BarChart3 className="h-6 w-6" /> },
              { metric: "24/7", label: "Enterprise Support", icon: <Headphones className="h-6 w-6" /> },
              { metric: "SOC2", label: "Type II Certified", icon: <Shield className="h-6 w-6" /> }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-xl flex items-center justify-center">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-primary mb-2">{stat.metric}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Enterprise Features */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Enterprise-Grade Features</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive features designed to meet the complex requirements of large organizations and regulated industries.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {enterpriseFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-gradient-to-br from-muted to-muted/50 rounded-xl">
                        {feature.icon}
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {feature.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {feature.features.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Compliance Section */}
        <section className="bg-gradient-to-r from-primary/5 to-blue-500/5 p-12 rounded-2xl">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Security & Compliance First</h2>
            <p className="text-xl text-muted-foreground mb-12">
              Built to meet the highest security and compliance standards for enterprise customers.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {complianceStandards.map((standard, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center p-6 bg-background rounded-lg border"
                >
                  <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-lg flex items-center justify-center">
                    {standard.icon}
                  </div>
                  <div className="font-semibold text-sm">{standard.name}</div>
                </motion.div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enterpriseBenefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 p-4 bg-background rounded-lg border"
                >
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="font-medium">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Support & Services */}
        <section className="bg-muted/30 p-12 rounded-2xl">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">White-Glove Support & Services</h2>
              <p className="text-xl text-muted-foreground">
                Dedicated support and professional services to ensure your success.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Dedicated Support",
                  description: "24/7 priority support with dedicated account managers and technical specialists.",
                  features: ["24/7 priority support", "Dedicated account manager", "Phone & email support", "Custom SLA agreements"]
                },
                {
                  title: "Professional Services",
                  description: "Expert consulting and implementation services to maximize your optimization results.",
                  features: ["Implementation consulting", "Custom optimization strategies", "Performance audits", "Best practices training"]
                },
                {
                  title: "Custom Solutions",
                  description: "Tailored solutions and integrations designed specifically for your enterprise needs.",
                  features: ["Custom integrations", "Private cloud deployment", "API customization", "Dedicated infrastructure"]
                }
              ].map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="text-lg">{service.title}</CardTitle>
                      <p className="text-muted-foreground text-sm">{service.description}</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary to-blue-600 text-primary-foreground p-12 rounded-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Scale Your Enterprise?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join Fortune 500 companies that trust DBooster for enterprise-grade database optimization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="px-8">
                Schedule Enterprise Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link to="/contact">Talk to Sales</Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </div>
    </StandardPageLayout>
  );
}
