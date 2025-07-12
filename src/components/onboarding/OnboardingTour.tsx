
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb, 
  Zap, 
  Shield, 
  BarChart3,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";

const tourSteps = [
  {
    title: "Dashboard Overview",
    description: "Monitor your database performance metrics and system health in real-time.",
    icon: BarChart3,
    link: "/app",
    status: "active"
  },
  {
    title: "Query Optimization",
    description: "Use AI-powered tools to analyze and optimize your SQL queries automatically.",
    icon: Zap,
    link: "/app/queries",
    status: "available"
  },
  {
    title: "Security Monitoring",
    description: "Keep your database secure with continuous monitoring and threat detection.",
    icon: Shield,
    link: "/app/monitoring",
    status: "available"
  },
  {
    title: "Performance Reports",
    description: "Generate detailed reports on performance improvements and cost savings.",
    icon: Lightbulb,
    link: "/app/reports",
    status: "available"
  }
];

interface OnboardingTourProps {
  className?: string;
}

export function OnboardingTour({ className }: OnboardingTourProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          Getting Started Guide
        </CardTitle>
        <CardDescription>
          Explore key features to optimize your database performance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {tourSteps.map((step, index) => (
          <div key={step.title} className="flex items-center gap-4 p-3 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                <step.icon className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-sm">{step.title}</h4>
                {step.status === "active" && (
                  <Badge variant="secondary" className="text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Current
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to={step.link}>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
