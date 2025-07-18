
import React from 'react';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Users, 
  GitBranch, 
  BarChart3, 
  Shield, 
  ArrowRight,
  CheckCircle2,
  MessageSquare,
  Target,
  Clock,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

const teamFeatures = [
  {
    title: "Team Collaboration",
    description: "Shared workspaces, query libraries, and collaborative optimization reviews for your entire development team.",
    icon: <Users className="h-8 w-8 text-blue-600" />,
    features: ["Shared query libraries", "Team workspaces", "Collaborative reviews", "Knowledge sharing"]
  },
  {
    title: "Performance Dashboards",
    description: "Team-wide visibility into database performance with customizable dashboards and alerts.",
    icon: <BarChart3 className="h-8 w-8 text-green-600" />,
    features: ["Team dashboards", "Custom metrics", "Performance alerts", "Historical tracking"]
  },
  {
    title: "Code Review Integration",
    description: "Automated performance reviews in your GitHub, GitLab, or Bitbucket pull request workflow.",
    icon: <GitBranch className="h-8 w-8 text-orange-600" />,
    features: ["PR automation", "Performance reviews", "Regression detection", "Quality gates"]
  },
  {
    title: "Access Control",
    description: "Role-based permissions and team management features for enterprise security requirements.",
    icon: <Shield className="h-8 w-8 text-purple-600" />,
    features: ["Role-based access", "Team permissions", "Audit logging", "SSO integration"]
  }
];

const teamBenefits = [
  "Improve team productivity by 40%",
  "Reduce database costs across all projects",
  "Standardize optimization practices",
  "Share knowledge and best practices",
  "Prevent performance regressions",
  "Scale team expertise efficiently"
];

const teamStats = [
  { metric: "40%", label: "Productivity Boost", icon: <TrendingUp className="h-6 w-6" /> },
  { metric: "65%", label: "Faster Reviews", icon: <Clock className="h-6 w-6" /> },
  { metric: "50%", label: "Knowledge Sharing", icon: <MessageSquare className="h-6 w-6" /> },
  { metric: "85%", label: "Team Satisfaction", icon: <Target className="h-6 w-6" /> }
];

export default function ForTeamsPage() {
  return (
    <StandardPageLayout
      title="DBooster for Teams - Optimize Together, Achieve More"
      subtitle="Scale Team Performance"
      description="Empower your development team with collaborative database optimization tools. Share knowledge, standardize practices, and achieve better performance together."
    >
      <div className="space-y-20">
        {/* Team Stats */}
        <section className="text-center">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {teamStats.map((stat, index) => (
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
                <div className="text-3xl font-bold text-primary mb-2">{stat.metric}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Team Features */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Built for Team Success</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Collaborative features that help teams share knowledge, standardize practices, and optimize database performance together.
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

        {/* Benefits Section */}
        <section className="bg-gradient-to-r from-primary/5 to-blue-500/5 p-12 rounded-2xl">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Transform Your Team's Efficiency</h2>
              <p className="text-xl text-muted-foreground">
                See how teams across the industry are improving their database optimization workflows.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teamBenefits.map((benefit, index) => (
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

        {/* Workflow Integration */}
        <section className="bg-muted/30 p-12 rounded-2xl">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Seamless Workflow Integration</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Connect & Analyze",
                  description: "Team members connect their databases and DBooster automatically analyzes all queries."
                },
                {
                  step: "2", 
                  title: "Review & Collaborate",
                  description: "Teams review optimization suggestions together and share insights through collaborative workspaces."
                },
                {
                  step: "3",
                  title: "Deploy & Monitor", 
                  description: "Optimizations are deployed with team approval and performance is monitored continuously."
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-12 h-12 mx-auto mb-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Success Stories */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Teams Love DBooster</h2>
            <p className="text-xl text-muted-foreground">
              Real results from development teams using DBooster for collaborative optimization.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                company: "TechCorp",
                result: "50% faster development cycles",
                description: "Reduced time spent on database performance issues by implementing team-wide optimization practices."
              },
              {
                company: "StartupXYZ",
                result: "60% cost reduction",
                description: "Team collaboration on optimization strategies led to significant infrastructure savings."
              },
              {
                company: "Enterprise Inc",
                result: "90% fewer performance bugs",
                description: "Code review integration caught performance issues before they reached production."
              }
            ].map((story, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-primary mb-2">{story.result}</div>
                    <div className="font-semibold mb-3">{story.company}</div>
                    <p className="text-muted-foreground text-sm">{story.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
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
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Team?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Start optimizing together and see how collaborative database optimization can improve your team's productivity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="px-8">
                Start Team Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link to="/contact">Schedule Team Demo</Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </div>
    </StandardPageLayout>
  );
}
