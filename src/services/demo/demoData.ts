
export interface DemoData {
  repositories: Array<{
    id: string;
    name: string;
    full_name: string;
    description: string;
    language: string;
    stars: number;
    forks: number;
    updated_at: string;
    status: 'connected' | 'analyzing' | 'optimized';
    queries_found: number;
    optimizations_applied: number;
  }>;
  queries: Array<{
    id: number;
    file_path: string;
    line_number: number;
    query_content: string;
    status: 'optimized' | 'pending' | 'review' | 'error';
    time_saved_ms: number;
    improvement: string;
  }>;
  improvements: Array<{
    id: string;
    query_id: number;
    type: 'index' | 'query_rewrite' | 'schema_change';
    severity: 'critical' | 'high' | 'medium' | 'low';
    description: string;
    estimated_improvement: string;
    created_at: string;
  }>;
  alerts: Array<{
    id: string;
    type: 'security' | 'performance' | 'maintenance';
    severity: 'critical' | 'high' | 'medium' | 'low';
    title: string;
    description: string;
    created_at: string;
  }>;
}

export const demoData: DemoData = {
  repositories: [
    {
      id: 'demo-repo-1',
      name: 'e-commerce-api',
      full_name: 'demo-user/e-commerce-api',
      description: 'A scalable e-commerce API built with Node.js and PostgreSQL',
      language: 'TypeScript',
      stars: 234,
      forks: 45,
      updated_at: '2024-01-15T10:30:00Z',
      status: 'optimized',
      queries_found: 23,
      optimizations_applied: 18
    },
    {
      id: 'demo-repo-2',
      name: 'user-management-service',
      full_name: 'demo-user/user-management-service',
      description: 'Microservice for user authentication and profile management',
      language: 'Python',
      stars: 156,
      forks: 28,
      updated_at: '2024-01-12T14:20:00Z',
      status: 'analyzing',
      queries_found: 15,
      optimizations_applied: 8
    },
    {
      id: 'demo-repo-3',
      name: 'analytics-dashboard',
      full_name: 'demo-user/analytics-dashboard',
      description: 'Real-time analytics dashboard with complex queries',
      language: 'JavaScript',
      stars: 89,
      forks: 12,
      updated_at: '2024-01-10T09:15:00Z',
      status: 'connected',
      queries_found: 0,
      optimizations_applied: 0
    }
  ],
  queries: [
    {
      id: 1,
      file_path: 'src/services/user-service.ts',
      line_number: 45,
      query_content: 'SELECT * FROM users WHERE status = ? AND created_at > ?',
      status: 'optimized',
      time_saved_ms: 2300,
      improvement: 'Added composite index on (status, created_at)'
    },
    {
      id: 2,
      file_path: 'src/controllers/order-controller.js',
      line_number: 123,
      query_content: 'SELECT o.*, u.name, u.email FROM orders o JOIN users u ON o.user_id = u.id WHERE o.status = ?',
      status: 'pending',
      time_saved_ms: 1800,
      improvement: 'Optimize JOIN order and add covering index'
    },
    {
      id: 3,
      file_path: 'src/analytics/reports.py',
      line_number: 67,
      query_content: 'SELECT COUNT(*), DATE(created_at) FROM events GROUP BY DATE(created_at) ORDER BY DATE(created_at)',
      status: 'review',
      time_saved_ms: 4100,
      improvement: 'Add covering index on (created_at, event_type)'
    },
    {
      id: 4,
      file_path: 'src/services/product-service.ts',
      line_number: 89,
      query_content: 'SELECT * FROM products WHERE category IN (SELECT id FROM categories WHERE active = true)',
      status: 'error',
      time_saved_ms: 0,
      improvement: 'Query analysis failed - subquery too complex'
    },
    {
      id: 5,
      file_path: 'src/models/inventory.js',
      line_number: 156,
      query_content: 'UPDATE inventory SET quantity = quantity - ? WHERE product_id = ? AND quantity >= ?',
      status: 'optimized',
      time_saved_ms: 950,
      improvement: 'Added partial index for active inventory'
    }
  ],
  improvements: [
    {
      id: 'imp-1',
      query_id: 1,
      type: 'index',
      severity: 'high',
      description: 'Missing index on frequently queried columns',
      estimated_improvement: '85% query time reduction',
      created_at: '2024-01-15T08:30:00Z'
    },
    {
      id: 'imp-2',
      query_id: 2,
      type: 'query_rewrite',
      severity: 'medium',
      description: 'JOIN order can be optimized for better performance',
      estimated_improvement: '45% query time reduction',
      created_at: '2024-01-14T16:45:00Z'
    },
    {
      id: 'imp-3',
      query_id: 3,
      type: 'index',
      severity: 'critical',
      description: 'Table scan on large events table',
      estimated_improvement: '92% query time reduction',
      created_at: '2024-01-13T11:20:00Z'
    }
  ],
  alerts: [
    {
      id: 'alert-1',
      type: 'security',
      severity: 'critical',
      title: 'SQL Injection Vulnerability Detected',
      description: 'Potential SQL injection in user-service.ts line 67. String concatenation used instead of parameterized queries.',
      created_at: '2024-01-15T09:15:00Z'
    },
    {
      id: 'alert-2',
      type: 'performance',
      severity: 'high',
      title: 'Slow Query Performance',
      description: 'Query in analytics/reports.py taking over 5 seconds to execute during peak hours.',
      created_at: '2024-01-14T14:30:00Z'
    },
    {
      id: 'alert-3',
      type: 'maintenance',
      severity: 'medium',
      title: 'Unused Index Detected',
      description: 'Index idx_products_legacy is no longer used and can be dropped to save storage.',
      created_at: '2024-01-12T10:45:00Z'
    },
    {
      id: 'alert-4',
      type: 'security',
      severity: 'high',
      title: 'Excessive Permissions',
      description: 'Database user has unnecessary DELETE permissions on audit_logs table.',
      created_at: '2024-01-11T16:20:00Z'
    }
  ]
};
