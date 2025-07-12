
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
    href: '/product',
    label: 'Product',
    icon: Zap,
    description: 'AI-powered database optimization solutions',
    children: [
      { 
        href: '/features', 
        label: 'Database Optimizer', 
        icon: Database, 
        description: 'AI-powered database performance optimization',
        badge: 'Popular'
      },
      { 
        href: '/analytics', 
        label: 'Analytics Dashboard', 
        icon: BarChart3, 
        description: 'Real-time performance monitoring and insights'
      },
      { 
        href: '/security', 
        label: 'Security Suite', 
        icon: Shield, 
        description: 'Enterprise-grade database security'
      }
    ]
  },
  {
    href: '/resources',
    label: 'Resources',
    icon: BookOpen,
    description: 'Learn, explore, and get support',
    children: [
      { 
        href: '/docs', 
        label: 'Documentation', 
        icon: FileText, 
        description: 'Complete guides and API reference'
      },
      { 
        href: '/community', 
        label: 'Community', 
        icon: Users, 
        description: 'Connect with other developers'
      },
      { 
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
        href: '/learn',
        label: 'Learn',
        icon: Target,
        description: 'Educational resources and tutorials',
        children: [
          { 
            href: '/learn/getting-started', 
            label: 'Getting Started', 
            icon: BookOpen, 
            description: 'Quick start guide for new users'
          },
          { 
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
