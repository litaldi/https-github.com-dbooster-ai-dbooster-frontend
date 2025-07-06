
import React from 'react';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Building, 
  Shield, 
  Globe, 
  BarChart3, 
  Users,
  Lock,
  Headphones,
  ArrowRight,
  CheckCircle2,
  Zap,
  Database,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

const enterpriseFeatures = [
  {
    icon: <Shield className="h-8 w-8 text-blue-600" />,
    title: "Enterprise Security & Compliance",
    description: "SOC2 Type II certified platform with advanced security controls, audit logging, and compliance features for regulated industries.",
    benefits: [
      "SOC2 Type II compliance certification",
      "GDPR, CCPA, and HIPAA compliance",
      "Advanced encryption and key management",
      "Comprehensive audit trails and logging"
    ]
  },
  {
    icon: <Users className="h-8 w-8 text-green-600" />,
    title: "Advanced User Management",
    description: "Sophisticated user management with SSO integration, role-based access control, and centralized administration.",
    benefits: [
      "Single Sign-On (SAML, OIDC)",
      "Active Directory integration",
      "Granular role-based permissions",
      "Centralized user provisioning"
    ]
  },
  {
    icon: <Globe className="h-8 w-8 text-purple-600" />,
    title: "Global Scale & Performance",
    description: "Multi-region deployment options with dedicated infrastructure and guaranteed SLAs for mission-critical applications.",
    benefits: [
      "Multi-region data residency",
      "Dedicated infrastructure options",
      "99.99% uptime SLA guarantee",
      "24/7 priority support"
    ]
  },
  {
    icon: <Database className="h-8 w-8 text-orange-600" />,
    title: "Custom AI Model Training",
    description: "Tailored AI optimization models trained on your specific database patterns and business requirements.",
    benefits: [
      "Custom AI model development",
      "Domain-specific optimization rules",
      "Private model training data",
      "Continuous learning and improvement"
    ]
  }
];

const enterpriseStats = [
  {
    metric: "99.99%",
    label: "Uptime SLA",
    description: "Enterprise-grade reliability"
  },
  {
    metric: "500+",
    label: "Enterprise Customers",
    description: "Trusted by Fortune 500 companies"
  },
  {
    metric: "75%",
    label: "Cost Reduction",
    description: "Average infrastructure savings"
  },
  {
    metric: "24/7",
    label: "Dedicated Support",
    description: "White-glove customer success"
  }
];

const complianceStandards = [
  { name: "SOC2 Type II", icon: "🛡️" },
  { name: "GDPR", icon: "🇪🇺" },
  { name: "CCPA", icon: "🏛️" },
  { name: "HIPAA", icon: "🏥" },
  { name: "ISO 27001", icon: "📋" },
  { name: "FedRAMP", icon: "🇺🇸" }
];

const deploymentOptions = [
  {
    title: "Cloud Multi-Tenant",
    description: "Shared infrastructure with enterprise security",
    features: ["Quick deployment", "Cost-effective", "Automatic updates", "Shared security model"]
  },
  {
    title: "Cloud Dedicated",
    description: "Dedicated cloud infrastructure for your organization",
    features: ["Isolated environment", "Custom configurations", "Enhanced security", "Predictable performance"]
  },
  {
    title: "On-Premises",
    description: "Complete control with on-site deployment",
    features: ["Full data control", "Custom integrations", "Air-gapped security", "Regulatory compliance"]
  },
  {
    title: "Hybrid",
    description: "Best of both cloud and on-premises solutions",
    features: ["Flexible deployment", "Gradual migration", "Multi-environment support", "Custom workflows"]
  }
];

export default function ForEnterprisesPage() {
  return (
    <StandardPageLayout
      title="Enterprise Database Optimization"
      subtitle="Scale with Confidence"
      description="Purpose-built for large organizations with enterprise-grade security, compliance, and performance at global scale."
    >
      <div className="space-y-20">
        {/* Enterprise Stats */}
        <section className="text-center">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {enterpriseStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-primary mb-2">{stat.metric}</div>
                <div className="text-lg font-semibold mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Enterprise Features */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Enterprise-Grade Features</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Advanced capabilities designed for large-scale organizations with complex requirements
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
                <Card className="h-full hover:shadow-lg transition-shadow border-2 hover:border-primary/20">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-gradient-to-br from-muted to-muted/50 rounded-xl">
                        {feature.icon}
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {feature.description}
                    </p>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Compliance & Security */}
        <section className="bg-muted/30 p-12 rounded-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Security & Compliance First</h2>
            <p className="text-xl text-muted-foreground">
              Meet the strictest security and compliance requirements across industries
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
            {complianceStandards.map((standard, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <Card className="p-4">
                  <div className="text-3xl mb-2">{standard.icon}</div>
                  <div className="text-sm font-medium">{standard.name}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Deployment Options */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Flexible Deployment Options</h2>
            <p className="text-xl text-muted-foreground">
              Choose the deployment model that best fits your organization's requirements
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {deploymentOptions.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{option.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {option.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-3 w-3 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Success Story */}
        <section className="bg-gradient-to-r from-primary/5 to-blue-500/5 p-12 rounded-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-8">Trusted by Industry Leaders</h2>
            <div className="max-w-4xl mx-auto">
              <blockquote className="text-xl italic text-muted-foreground mb-6">
                "DBooster's enterprise platform helped us reduce our database infrastructure costs by 75% while improving query performance across our global operations. The security and compliance features were essential for our regulated industry."
              </blockquote>
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Building className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Sarah Johnson</div>
                  <div className="text-sm text-muted-foreground">CTO, Fortune 500 Financial Services</div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready for Enterprise-Scale Optimization?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let's discuss how DBooster can meet your organization's specific requirements and compliance needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="px-8">
              <Link to="/contact">
                Schedule Enterprise Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8">
              <Link to="/pricing">View Enterprise Pricing</Link>
            </Button>
          </div>
        </section>
      </div>
    </StandardPageLayout>
  );
}
