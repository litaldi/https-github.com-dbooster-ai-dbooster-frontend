
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
  Star,
  Zap,
  Target
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
    title: 'Product',
    href: '/product',
    label: 'Product',
    icon: Zap,
    description: 'AI-powered database optimization solutions',
    children: [
      { 
        title: 'Database Optimizer',
        href: '/features', 
        label: 'Database Optimizer', 
        icon: Database, 
        description: 'AI-powered database performance optimization',
        badge: 'Popular'
      },
      { 
        title: 'Analytics Dashboard',
        href: '/analytics', 
        label: 'Analytics Dashboard', 
        icon: BarChart3, 
        description: 'Real-time performance monitoring and insights'
      },
      { 
        title: 'Security Suite',
        href: '/security', 
        label: 'Security Suite', 
        icon: Shield, 
        description: 'Enterprise-grade database security'
      }
    ]
  },
  {
    title: 'Resources',
    href: '/resources',
    label: 'Resources',
    icon: BookOpen,
    description: 'Learn, explore, and get support',
    children: [
      { 
        title: 'Documentation',
        href: '/docs', 
        label: 'Documentation', 
        icon: FileText, 
        description: 'Complete guides and API reference'
      },
      { 
        title: 'Community',
        href: '/community', 
        label: 'Community', 
        icon: Users, 
        description: 'Connect with other developers'
      },
      { 
        title: 'Support',
        href: '/support', 
        label: 'Support', 
        icon: Headphones, 
        description: '24/7 expert assistance'
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
        href: '/learn',
        label: 'Learn',
        icon: Target,
        description: 'Educational resources and tutorials',
        children: [
          { 
            title: 'Getting Started',
            href: '/learn/getting-started', 
            label: 'Getting Started', 
            icon: BookOpen, 
            description: 'Quick start guide for new users'
          },
          { 
            title: 'Best Practices',
            href: '/learn/best-practices', 
            label: 'Best Practices', 
            icon: Star, 
            description: 'Expert tips and recommendations'
          }
        ]
      }
    ],
  },
};
