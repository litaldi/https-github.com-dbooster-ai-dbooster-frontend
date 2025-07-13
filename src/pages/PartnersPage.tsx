import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Handshake, 
  Users, 
  Building, 
  Award, 
  ArrowRight, 
  CheckCircle2,
  Globe,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';

const partnerTiers = [
  {
    name: "Technology Partners",
    description: "Integrate DBooster into your platform or build complementary solutions",
    icon: <Building className="h-8 w-8 text-blue-600" />,
    benefits: [
      "API access and documentation",
      "Technical integration support",
      "Co-marketing opportunities",
      "Revenue sharing programs"
    ]
  },
  {
    name: "Consulting Partners",
    description: "Help clients optimize their database performance with DBooster",
    icon: <Users className="h-8 w-8 text-green-600" />,
    benefits: [
      "Partner certification program",
      "Sales enablement materials",
      "Technical training resources",
      "Referral incentives"
    ]
  },
  {
    name: "Cloud Partners",
    description: "Offer DBooster as part of your cloud marketplace or platform",
    icon: <Globe className="h-8 w-8 text-purple-600" />,
    benefits: [
      "Marketplace listing support",
      "Joint go-to-market strategy",
      "Technical integration assistance",
      "Co-branded solutions"
    ]
  }
];

const existingPartners = [
  { name: "AWS Marketplace", category: "Cloud Platform" },
  { name: "Google Cloud Partner", category: "Cloud Platform" },
  { name: "Microsoft Azure", category: "Cloud Platform" },
  { name: "DataDog", category: "Monitoring" },
  { name: "New Relic", category: "APM" },
  { name: "Grafana", category: "Visualization" }
];

export default function PartnersPage() {
  return (
    <StandardPageLayout
      title="Partner with DBooster"
      subtitle="Grow Together"
      description="Join our partner ecosystem and help organizations worldwide optimize their database performance while growing your business."
    >
      <div className="space-y-20">
        {/* Partnership Tiers */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Partnership Opportunities</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Whether you're a technology company, consultant, or cloud provider, we have partnership opportunities that create mutual value.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {partnerTiers.map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-muted to-muted/50 rounded-xl flex items-center justify-center">
                      {tier.icon}
                    </div>
                    <CardTitle className="text-xl">{tier.name}</CardTitle>
                    <p className="text-muted-foreground leading-relaxed">
                      {tier.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {tier.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    <Button asChild className="w-full">
                      <Link to="/contact">
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Existing Partners */}
        <section className="bg-muted/30 p-12 rounded-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Current Partners</h2>
            <p className="text-xl text-muted-foreground">
              We're proud to work with industry-leading companies
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {existingPartners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow">
                  <div className="font-medium text-sm mb-1">{partner.name}</div>
                  <Badge variant="secondary" className="text-xs">
                    {partner.category}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Partner Benefits */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Partner with DBooster?</h2>
            <p className="text-xl text-muted-foreground">
              Join a growing ecosystem focused on database optimization
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-xl flex items-center justify-center">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Growing Market</h3>
              <p className="text-sm text-muted-foreground">
                Database optimization is a $50B+ market growing 15% annually
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl flex items-center justify-center">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Proven Solution</h3>
              <p className="text-sm text-muted-foreground">
                75% average performance improvement across customer deployments
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500/10 to-violet-500/10 rounded-xl flex items-center justify-center">
                <Handshake className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Strong Support</h3>
              <p className="text-sm text-muted-foreground">
                Dedicated partner success team and comprehensive resources
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl flex items-center justify-center">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Active Community</h3>
              <p className="text-sm text-muted-foreground">
                Join 10,000+ developers and growing partner network
              </p>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary/5 to-blue-500/5 p-12 rounded-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Handshake className="h-16 w-16 mx-auto mb-6 text-primary" />
            <h2 className="text-3xl font-bold mb-4">Ready to Partner with Us?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Let's discuss how we can work together to help organizations optimize their database performance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="px-8">
                <Link to="/contact">
                  Become a Partner
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8">
                <a href="mailto:partners@dbooster.ai">Email Partners Team</a>
              </Button>
            </div>
          </motion.div>
        </section>
      </div>
    </StandardPageLayout>
  );
}
