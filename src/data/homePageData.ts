
import { Brain, Activity, Zap, Shield } from 'lucide-react';

export const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Advanced algorithms analyze your database queries for optimal performance recommendations.",
    highlight: true,
    details: "Our AI continuously learns from your query patterns and provides intelligent suggestions to improve performance, reduce costs, and prevent bottlenecks before they impact your application."
  },
  {
    icon: Activity,
    title: "Real-time Monitoring",
    description: "Monitor your database performance in real-time with comprehensive dashboards and alerts.",
    highlight: false,
    details: "Get instant visibility into query execution times, resource usage, and system health with customizable dashboards and proactive alerting that keeps you informed of critical issues."
  },
  {
    icon: Zap,
    title: "Query Optimization",
    description: "Get specific suggestions to improve slow queries and reduce database load.",
    highlight: true,
    details: "Receive actionable recommendations including index suggestions, query rewrites, and schema optimizations that can dramatically improve your database performance."
  },
  {
    icon: Shield,
    title: "Security Scanning",
    description: "Identify potential security vulnerabilities in your database queries and configurations.",
    highlight: false,
    details: "Comprehensive security analysis that detects SQL injection risks, privilege escalation vulnerabilities, and configuration weaknesses to keep your data safe."
  }
];
