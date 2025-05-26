
import { supabase } from '@/integrations/supabase/client';

export interface DemoData {
  repositories: Array<{
    id: string;
    name: string;
    full_name: string;
    description: string;
    language: string;
    queries_count: number;
    optimizations_count: number;
    scan_status: 'completed' | 'pending' | 'error';
    last_scan: string;
  }>;
  queries: Array<{
    id: string;
    file_path: string;
    line_number: number;
    query_content: string;
    status: 'optimized' | 'pending' | 'review' | 'error';
    optimization_suggestion: string;
    performance_impact: string;
    time_saved_ms: number;
  }>;
  improvements: Array<{
    id: string;
    title: string;
    description: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    status: 'pending' | 'approved' | 'rejected';
    estimated_savings: string;
    created_at: string;
  }>;
  alerts: Array<{
    id: string;
    type: 'security' | 'performance' | 'maintenance';
    title: string;
    description: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    created_at: string;
  }>;
  teamMembers: Array<{
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'developer' | 'viewer';
    avatar: string;
    last_active: string;
  }>;
}

export const demoData: DemoData = {
  repositories: [
    {
      id: 'demo-repo-1',
      name: 'user-service-api',
      full_name: 'dbooster-demo/user-service-api',
      description: 'Main user authentication and profile service',
      language: 'TypeScript',
      queries_count: 24,
      optimizations_count: 8,
      scan_status: 'completed',
      last_scan: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'demo-repo-2',
      name: 'order-processing',
      full_name: 'dbooster-demo/order-processing',
      description: 'E-commerce order processing and inventory management',
      language: 'Python',
      queries_count: 31,
      optimizations_count: 12,
      scan_status: 'completed',
      last_scan: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'demo-repo-3',
      name: 'analytics-dashboard',
      full_name: 'dbooster-demo/analytics-dashboard',
      description: 'Real-time analytics and reporting dashboard',
      language: 'JavaScript',
      queries_count: 18,
      optimizations_count: 5,
      scan_status: 'pending',
      last_scan: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'demo-repo-4',
      name: 'payment-gateway',
      full_name: 'dbooster-demo/payment-gateway',
      description: 'Payment processing and transaction management',
      language: 'Java',
      queries_count: 15,
      optimizations_count: 3,
      scan_status: 'error',
      last_scan: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'demo-repo-5',
      name: 'notification-service',
      full_name: 'dbooster-demo/notification-service',
      description: 'Email and push notification delivery service',
      language: 'Go',
      queries_count: 9,
      optimizations_count: 2,
      scan_status: 'completed',
      last_scan: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
  ],
  queries: [
    {
      id: 'demo-query-1',
      file_path: 'src/services/user.ts',
      line_number: 45,
      query_content: 'SELECT * FROM users WHERE email = ? AND status = ?',
      status: 'optimized',
      optimization_suggestion: 'Added composite index on (email, status) columns',
      performance_impact: 'Query execution time reduced by 85%',
      time_saved_ms: 2300,
    },
    {
      id: 'demo-query-2',
      file_path: 'src/controllers/order.js',
      line_number: 123,
      query_content: 'SELECT o.*, u.name FROM orders o JOIN users u ON o.user_id = u.id WHERE o.status IN (?)',
      status: 'pending',
      optimization_suggestion: 'Optimize JOIN order and add covering index',
      performance_impact: 'Estimated 70% performance improvement',
      time_saved_ms: 1800,
    },
    {
      id: 'demo-query-3',
      file_path: 'src/analytics/reports.py',
      line_number: 67,
      query_content: 'SELECT COUNT(*) FROM events WHERE date >= ? GROUP BY user_id',
      status: 'review',
      optimization_suggestion: 'Add covering index on (date, user_id) with COUNT optimization',
      performance_impact: 'Significant reduction in full table scans',
      time_saved_ms: 4100,
    },
    {
      id: 'demo-query-4',
      file_path: 'src/services/payment.java',
      line_number: 89,
      query_content: 'SELECT * FROM transactions WHERE amount > ? AND status = ?',
      status: 'error',
      optimization_suggestion: 'Query analysis failed due to missing schema information',
      performance_impact: 'Unable to determine',
      time_saved_ms: 0,
    },
  ],
  improvements: [
    {
      id: 'demo-improvement-1',
      title: 'Optimize User Login Query',
      description: 'The user authentication query can be optimized by adding a composite index on email and password_hash columns.',
      severity: 'high',
      status: 'pending',
      estimated_savings: '2.3s per query',
      created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'demo-improvement-2',
      title: 'Database Connection Pooling',
      description: 'Implement connection pooling to reduce database connection overhead and improve overall performance.',
      severity: 'medium',
      status: 'approved',
      estimated_savings: '15% overall performance',
      created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'demo-improvement-3',
      title: 'Critical Index Missing',
      description: 'Orders table is missing a critical index on the created_at column, causing slow dashboard queries.',
      severity: 'critical',
      status: 'pending',
      estimated_savings: '5.2s per dashboard load',
      created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
  ],
  alerts: [
    {
      id: 'demo-alert-1',
      type: 'security',
      title: 'Potential SQL Injection Risk',
      description: 'Found queries with string concatenation instead of parameterized queries in payment-gateway repository.',
      severity: 'critical',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'demo-alert-2',
      type: 'performance',
      title: 'Slow Query Detected',
      description: 'Query in analytics dashboard taking over 10 seconds to execute during peak hours.',
      severity: 'high',
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'demo-alert-3',
      type: 'maintenance',
      title: 'Database Statistics Outdated',
      description: 'Table statistics haven\'t been updated in over 30 days, affecting query optimizer performance.',
      severity: 'medium',
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  teamMembers: [
    {
      id: 'demo-user-1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@dbooster-demo.com',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
      last_active: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
    {
      id: 'demo-user-2',
      name: 'Michael Chen',
      email: 'michael.chen@dbooster-demo.com',
      role: 'developer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      last_active: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
  ],
};

export const isDemoMode = () => {
  const user = JSON.parse(localStorage.getItem('demo_user') || 'null');
  return user?.email === 'demo@dbooster.ai';
};

export const getDemoUser = () => {
  return {
    id: 'demo-user-id',
    email: 'demo@dbooster.ai',
    user_metadata: {
      full_name: 'Demo User',
      name: 'Demo User',
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
    }
  };
};

export const loginDemoUser = async () => {
  const demoUser = getDemoUser();
  localStorage.setItem('demo_user', JSON.stringify(demoUser));
  localStorage.setItem('demo_session', JSON.stringify({
    user: demoUser,
    access_token: 'demo-token',
    expires_at: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  }));
  return { user: demoUser, session: { user: demoUser } };
};

export const logoutDemoUser = () => {
  localStorage.removeItem('demo_user');
  localStorage.removeItem('demo_session');
};

export const getDemoSession = () => {
  const session = JSON.parse(localStorage.getItem('demo_session') || 'null');
  if (session && session.expires_at > Date.now()) {
    return session;
  }
  return null;
};
