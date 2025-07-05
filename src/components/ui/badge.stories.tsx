
import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './badge';
import { Star, Shield, Zap } from 'lucide-react';

/**
 * Badge Component
 * 
 * Small status descriptors for UI elements. Perfect for labels, status indicators,
 * categories, and notifications.
 * 
 * ## Accessibility Features:
 * - High contrast colors for readability
 * - Semantic color coding
 * - Screen reader friendly
 * 
 * ## Usage Guidelines:
 * - Use sparingly to avoid visual clutter
 * - Choose variants that match semantic meaning
 * - Keep text concise and descriptive
 */
const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A small status descriptor component for labeling and categorization.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
      description: 'Visual style variant',
    },
    children: {
      control: 'text',
      description: 'Badge content',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Badge',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different badge variants for various use cases.',
      },
    },
  },
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">
        <Star className="w-3 h-3 mr-1" />
        Featured
      </Badge>
      <Badge variant="secondary">
        <Shield className="w-3 h-3 mr-1" />
        Verified
      </Badge>
      <Badge variant="outline">
        <Zap className="w-3 h-3 mr-1" />
        Pro
      </Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badges with icons for enhanced visual communication.',
      },
    },
  },
};

export const StatusBadges: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Order Status</h3>
        <div className="flex gap-2">
          <Badge variant="outline">Pending</Badge>
          <Badge variant="default">Processing</Badge>
          <Badge variant="secondary">Shipped</Badge>
          <Badge>Delivered</Badge>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">User Roles</h3>
        <div className="flex gap-2">
          <Badge variant="outline">Guest</Badge>
          <Badge variant="secondary">Member</Badge>
          <Badge variant="default">Admin</Badge>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Priority Levels</h3>
        <div className="flex gap-2">
          <Badge variant="secondary">Low</Badge>
          <Badge variant="default">Medium</Badge>
          <Badge variant="destructive">High</Badge>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Examples of badges used for different status and category systems.',
      },
    },
  },
};

export const NotificationBadges: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="relative">
        <button className="p-2 border rounded">
          Messages
        </button>
        <Badge className="absolute -top-2 -right-2 px-1 min-w-[1.25rem] h-5 flex items-center justify-center text-xs">
          3
        </Badge>
      </div>
      
      <div className="relative">
        <button className="p-2 border rounded">
          Notifications
        </button>
        <Badge variant="destructive" className="absolute -top-2 -right-2 px-1 min-w-[1.25rem] h-5 flex items-center justify-center text-xs">
          12
        </Badge>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badges used as notification indicators on buttons or icons.',
      },
    },
  },
};

export const InteractiveBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge className="cursor-pointer hover:bg-primary/80 transition-colors">
        Clickable
      </Badge>
      <Badge variant="outline" className="cursor-pointer hover:bg-secondary transition-colors">
        Filter: React
      </Badge>
      <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80 transition-colors">
        Tag: Frontend
      </Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Interactive badges that can be clicked, perfect for filters and tags.',
      },
    },
  },
};
