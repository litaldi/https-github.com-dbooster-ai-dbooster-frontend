
import type { Meta, StoryObj } from '@storybook/react';
import { EnhancedMegaMenu } from './EnhancedMegaMenu';
import { 
  Database, 
  BarChart3, 
  Shield, 
  FileText,
  Users,
  Headphones,
  BookOpen,
  Star
} from 'lucide-react';

/**
 * EnhancedMegaMenu provides a comprehensive navigation solution with
 * multi-level menu structures, icons, and descriptions.
 * 
 * ## Features:
 * - Multi-level navigation with icons and descriptions
 * - Hover and keyboard navigation support
 * - Responsive design
 * - Accessibility compliant
 * 
 * ## Usage Guidelines:
 * - Use for complex site navigation
 * - Group related items logically
 * - Provide clear descriptions for menu items
 */
const meta: Meta<typeof EnhancedMegaMenu> = {
  title: 'Navigation/EnhancedMegaMenu',
  component: EnhancedMegaMenu,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A comprehensive mega menu component for complex navigation structures.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleMenuItems = [
  {
    title: 'Products',
    items: [
      {
        title: 'Database Optimizer',
        description: 'AI-powered database performance optimization',
        href: '/products/optimizer',
        icon: <Database className="h-5 w-5" />,
        badge: 'Popular'
      },
      {
        title: 'Analytics Dashboard',
        description: 'Real-time performance monitoring and insights',
        href: '/products/analytics',
        icon: <BarChart3 className="h-5 w-5" />
      },
      {
        title: 'Security Suite',
        description: 'Enterprise-grade database security',
        href: '/products/security',
        icon: <Shield className="h-5 w-5" />
      }
    ]
  },
  {
    title: 'Resources',
    items: [
      {
        title: 'Documentation',
        description: 'Complete guides and API reference',
        href: '/docs',
        icon: <FileText className="h-5 w-5" />
      },
      {
        title: 'Community',
        description: 'Connect with other developers',
        href: '/community',
        icon: <Users className="h-5 w-5" />
      },
      {
        title: 'Support',
        description: '24/7 expert assistance',
        href: '/support',
        icon: <Headphones className="h-5 w-5" />
      }
    ]
  }
];

export const Default: Story = {
  args: {
    items: sampleMenuItems,
  },
};

export const WithManyItems: Story = {
  args: {
    items: [
      ...sampleMenuItems,
      {
        title: 'Learn',
        items: [
          {
            title: 'Getting Started',
            description: 'Quick start guide for new users',
            href: '/learn/getting-started',
            icon: <BookOpen className="h-5 w-5" />
          },
          {
            title: 'Best Practices',
            description: 'Expert tips and recommendations',
            href: '/learn/best-practices',
            icon: <Star className="h-5 w-5" />
          }
        ]
      }
    ],
  },
};
