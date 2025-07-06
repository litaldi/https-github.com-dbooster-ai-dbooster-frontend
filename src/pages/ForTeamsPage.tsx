
import React from 'react';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Users, 
  Shield, 
  BarChart3, 
  MessageSquare, 
  GitBranch,
  Clock,
  Target,
  ArrowRight,
  CheckCircle2,
  Zap,
  Settings,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const teamFeatures = [
  {
    icon: <Users className="h-8 w-8 text-blue-600" />,
    title: "Team Collaboration",
    description: "Centralized database optimization with role-based access control and team workspaces for seamless collaboration.",
    benefits: [
      "Shared query optimization workspace",
      "Role-based permissions and access",
      "Team performance dashboards",
      "Collaborative query reviews"
    ]
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-green-600" />,
    title: "Unified Analytics",
    description: "Comprehensive performance insights across all team databases with centralized reporting and monitoring.",
    benefits: [
      "Cross-project performance tracking",
      "Team productivity metrics",
      "Consolidated reporting dashboard",
      "Custom KPI monitoring"
    ]
  },
  {
    icon: <Shield className="h-8 w-8 text-purple-600" />,
    title: "Enterprise Security",
    description: "Advanced security features including SSO, audit logs, and compliance controls for enterprise teams.",
    benefits: [
      "Single Sign-On (SSO) integration",
      "Comprehensive audit logging",
      "SOC2 Type II compliance",
      "Data encryption at rest and transit"
    ]
  },
  {
    icon: <GitBranch className="h-8 w-8 text-orange-600" />,
    title: "Workflow Integration",
    description: "Seamless integration with your existing development workflow, CI/CD pipelines, and project management tools.",
    benefits: [
      "GitHub/GitLab integration",
      "Slack/Teams notifications",
      "Jira/Asana project linking",
      "Custom webhook support"
    ]
  }
];

const teamBenefits = [
  {
    title: "Faster Development Cycles",
    description: "Reduce time spent on database performance issues",
    metric: "40% faster",
    icon: <Clock className="h-8 w-8 text-blue-600" />
  },
  {
    title: "Improved Code Quality",
    description: "Catch performance issues before production",
    metric: "85% reduction",
    icon: <Target className="h-8 w-8 text-green-600" />
  },
  {
    title: "Better Team Coordination",
    description: "Shared insights and collaborative optimization",
    metric: "60% improvement",
    icon: <MessageSquare className="h-8 w-8 text-purple-600" />
  }
];

const workflow = [
  {
    step: "1",
    title: "Team Setup",
    description: "Create team workspace and invite members with appropriate roles"
  },
  {
    step: "2", 
    title: "Database Integration",
    description: "Connect team databases with centralized monitoring setup"
  },
  {
    step: "3",
    title: "Collaboration",
    description: "Share insights, review optimizations, and track team performance"
  },
  {
    step: "4",
    title: "Scale & Optimize",
    description: "Continuous improvement with team-wide performance analytics"
  }
];

export default function ForTeamsPage() {
  return (
    <StandardPageLayout
      title="Optimize Together"
      subtitle="Database Performance for Development Teams"
      description="Empower your entire development team with collaborative database optimization tools and centralized performance insights."
    >
      <div className="space-y-20">
        {/* Team Benefits Overview */}
        <section className="text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {teamBenefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <Card>
                  <CardContent className="p-8">
                    <div className="flex justify-center mb-4">
                      {benefit.icon}
                    </div>
                    <div className="text-3xl font-bold text-primary mb-2">{benefit.metric}</div>
                    <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground text-sm">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Team Features */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Built for Team Success</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything your development team needs to collaborate effectively on database optimization
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {teamFeatures.map((feature, index) => (
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

        {/* Team Workflow */}
        <section className="bg-muted/30 p-12 rounded-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Team Optimization Workflow</h2>
            <p className="text-xl text-muted-foreground">
              Simple steps to get your entire team optimizing database performance together
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {workflow.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-2xl font-bold text-primary-foreground mx-auto">
                    {item.step}
                  </div>
                  {index < workflow.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-primary/20"></div>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Team Sizes & Pricing */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Perfect for Teams of Any Size</h2>
            <p className="text-xl text-muted-foreground">
              From small startups to large enterprises, we have the right plan for your team
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Badge variant="outline" className="w-fit mx-auto mb-4">Small Teams</Badge>
                <CardTitle>2-10 Developers</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Team workspace for up to 10 users
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Shared optimization dashboard
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Basic collaboration features
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center border-primary">
              <CardHeader>
                <Badge className="w-fit mx-auto mb-4">Most Popular</Badge>
                <CardTitle>10-50 Developers</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Advanced team collaboration
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Role-based access control
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Integration with dev tools
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Badge variant="outline" className="w-fit mx-auto mb-4">Enterprise</Badge>
                <CardTitle>50+ Developers</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Unlimited team members
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    SSO and advanced security
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Dedicated success manager
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-r from-primary/5 to-blue-500/5 p-12 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Optimize as a Team?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start your team's database optimization journey today with our collaborative platform designed for development teams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="px-8">
              <Link to="/login">
                Start Team Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8">
              <Link to="/contact">Contact Sales</Link>
            </Button>
          </div>
        </section>
      </div>
    </StandardPageLayout>
  );
}
