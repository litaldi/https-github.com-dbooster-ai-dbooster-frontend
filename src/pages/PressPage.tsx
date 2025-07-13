
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Download, 
  ExternalLink, 
  Calendar, 
  FileText, 
  Image, 
  Users,
  Award,
  TrendingUp
} from 'lucide-react';

const pressReleases = [
  {
    date: "December 2024",
    title: "DBooster Announces $10M Series A Funding Round",
    summary: "Led by prominent VCs to accelerate AI-powered database optimization platform development.",
    category: "Funding"
  },
  {
    date: "November 2024", 
    title: "SOC2 Type II Certification Achieved",
    summary: "Enterprise-grade security certification enables large organization adoption.",
    category: "Security"
  },
  {
    date: "October 2024",
    title: "DBooster Reaches 10,000 Developer Milestone",
    summary: "Platform optimization helps developers achieve 75% average performance improvements.",
    category: "Growth"
  },
  {
    date: "September 2024",
    title: "Multi-Database Support Launch",
    summary: "Added support for MongoDB, Oracle, and SQL Server alongside existing PostgreSQL and MySQL.",
    category: "Product"
  }
];

const mediaKit = [
  {
    title: "Company Logos",
    description: "High-resolution DBooster logos in various formats",
    type: "ZIP File",
    size: "2.4 MB",
    icon: <Image className="h-5 w-5" />
  },
  {
    title: "Product Screenshots",
    description: "Dashboard and feature screenshots for media use",
    type: "ZIP File", 
    size: "8.1 MB",
    icon: <Image className="h-5 w-5" />
  },
  {
    title: "Company Fact Sheet",
    description: "Key facts, figures, and company information",
    type: "PDF",
    size: "245 KB",
    icon: <FileText className="h-5 w-5" />
  },
  {
    title: "Executive Bios",
    description: "Leadership team biographies and headshots",
    type: "ZIP File",
    size: "1.8 MB", 
    icon: <Users className="h-5 w-5" />
  }
];

const awards = [
  {
    title: "Tech Innovator of the Year 2024",
    organization: "Israeli Tech Awards",
    date: "November 2024"
  },
  {
    title: "Best Database Tool 2024",
    organization: "Developer Choice Awards",
    date: "October 2024"
  },
  {
    title: "Rising Star in AI",
    organization: "TechCrunch Disrupt",
    date: "September 2024"
  }
];

const keyFacts = [
  { label: "Founded", value: "2022" },
  { label: "Headquarters", value: "Tel Aviv, Israel" },
  { label: "Employees", value: "45+" },
  { label: "Customers", value: "10,000+" },
  { label: "Funding Raised", value: "$15M" },
  { label: "Performance Improvement", value: "75% avg" }
];

export default function PressPage() {
  return (
    <StandardPageLayout
      title="Press & Media"
      subtitle="DBooster in the News"
      description="Latest news, press releases, and media resources about DBooster's AI-powered database optimization platform."
    >
      <div className="space-y-20">
        {/* Key Facts */}
        <section className="bg-muted/30 p-8 rounded-2xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Company at a Glance</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {keyFacts.map((fact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-2xl font-bold text-primary">{fact.value}</div>
                <div className="text-sm text-muted-foreground">{fact.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Press Releases */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Latest Press Releases</h2>
            <p className="text-xl text-muted-foreground">
              Stay updated with DBooster's latest announcements and milestones
            </p>
          </div>
          
          <div className="space-y-6">
            {pressReleases.map((release, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{release.date}</span>
                          <Badge variant="outline">{release.category}</Badge>
                        </div>
                        <CardTitle className="text-xl mb-2">{release.title}</CardTitle>
                        <p className="text-muted-foreground">{release.summary}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Media Kit */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Media Kit</h2>
            <p className="text-xl text-muted-foreground">
              Download assets and resources for media coverage
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mediaKit.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {item.type} • {item.size}
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Awards & Recognition */}
        <section className="bg-muted/30 p-12 rounded-2xl">
          <div className="text-center mb-12">
            <Award className="h-16 w-16 mx-auto mb-6 text-primary" />
            <h2 className="text-3xl font-bold mb-4">Awards & Recognition</h2>
            <p className="text-xl text-muted-foreground">
              Industry recognition for innovation and excellence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {awards.map((award, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center">
                  <CardHeader>
                    <CardTitle className="text-lg">{award.title}</CardTitle>
                    <p className="text-muted-foreground">{award.organization}</p>
                    <p className="text-sm text-muted-foreground">{award.date}</p>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Media Contact */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Media Inquiries</h2>
            <p className="text-xl text-muted-foreground mb-8">
              For press inquiries, interviews, or additional information
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Press Contact</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div>
                  <p className="font-medium">Sarah Chen</p>
                  <p className="text-muted-foreground">Head of Communications</p>
                </div>
                <div className="space-y-2">
                  <p>
                    <strong>Email:</strong>{" "}
                    <a href="mailto:press@dbooster.ai" className="text-primary hover:underline">
                      press@dbooster.ai
                    </a>
                  </p>
                  <p>
                    <strong>Phone:</strong>{" "}
                    <a href="tel:+972540000000" className="text-primary hover:underline">
                      +972-54-000-0000
                    </a>
                  </p>
                </div>
                <div className="pt-4">
                  <Button asChild>
                    <a href="mailto:press@dbooster.ai">
                      Contact Press Team
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </StandardPageLayout>
  );
}
