
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Video, ExternalLink, Search, FileText, HelpCircle, MessageSquare } from 'lucide-react';

export default function DocsHelp() {
  const guides = [
    {
      title: "Getting Started",
      description: "Learn the basics of DBooster and set up your first project",
      duration: "5 min read",
      category: "Beginner"
    },
    {
      title: "Connecting Your Database",
      description: "Step-by-step guide to securely connect your database",
      duration: "10 min read",
      category: "Setup"
    },
    {
      title: "Understanding Query Optimizations",
      description: "How DBooster analyzes and improves your SQL queries",
      duration: "15 min read",
      category: "Advanced"
    },
    {
      title: "Using the Approval Workflow",
      description: "Review and approve optimizations before they're applied",
      duration: "8 min read",
      category: "Workflow"
    }
  ];

  const faqs = [
    {
      question: "How does DBooster ensure my data security?",
      answer: "DBooster uses enterprise-grade encryption and never stores your actual data. We only analyze query patterns and metadata."
    },
    {
      question: "Can I rollback optimizations if needed?",
      answer: "Yes, all optimizations are tracked and can be rolled back through the audit log and version control integration."
    },
    {
      question: "What databases are supported?",
      answer: "DBooster supports PostgreSQL, MySQL, SQL Server, Oracle, and most other SQL-compatible databases."
    },
    {
      question: "How accurate are the performance predictions?",
      answer: "Our ML models achieve 85-95% accuracy in performance predictions, based on query complexity and database statistics."
    }
  ];

  const videos = [
    {
      title: "DBooster Overview",
      description: "5-minute introduction to DBooster's core features",
      duration: "5:32",
      thumbnail: "/placeholder.svg"
    },
    {
      title: "Setting Up Your First Repository",
      description: "Complete walkthrough of repository setup and configuration",
      duration: "12:45",
      thumbnail: "/placeholder.svg"
    },
    {
      title: "Advanced Query Analysis",
      description: "Deep dive into how DBooster analyzes complex queries",
      duration: "18:20",
      thumbnail: "/placeholder.svg"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Documentation & Help</h1>
        <p className="text-muted-foreground">Everything you need to master DBooster</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search documentation..." className="pl-9" />
      </div>

      <Tabs defaultValue="guides" className="space-y-6">
        <TabsList>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="api">API Docs</TabsTrigger>
        </TabsList>

        <TabsContent value="guides" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {guides.map((guide, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      <div>
                        <CardTitle className="text-lg">{guide.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {guide.category}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {guide.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{guide.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="videos" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                    <Video className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{video.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{video.description}</p>
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                      {video.duration}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="faq" className="space-y-6">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <HelpCircle className="w-5 h-5" />
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                API Documentation
              </CardTitle>
              <CardDescription>
                Complete reference for DBooster's REST API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Button variant="outline" className="justify-start h-auto p-4">
                  <div className="text-left">
                    <div className="font-medium">Authentication</div>
                    <div className="text-sm text-muted-foreground">API keys and OAuth setup</div>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto p-4">
                  <div className="text-left">
                    <div className="font-medium">Queries Endpoint</div>
                    <div className="text-sm text-muted-foreground">Manage and analyze queries</div>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto p-4">
                  <div className="text-left">
                    <div className="font-medium">Repositories</div>
                    <div className="text-sm text-muted-foreground">Repository management API</div>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto p-4">
                  <div className="text-left">
                    <div className="font-medium">Webhooks</div>
                    <div className="text-sm text-muted-foreground">Real-time notifications</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Still need help?
          </CardTitle>
          <CardDescription>
            Can't find what you're looking for? Our support team is here to help.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button>Contact Support</Button>
            <Button variant="outline">Join Community</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
