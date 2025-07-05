
import type { Meta, StoryObj } from '@storybook/react';
import { EnhancedHero } from './enhanced-hero';
import { Shield, Zap, TrendingUp, Star, Clock, Users } from 'lucide-react';

/**
 * The EnhancedHero component is a powerful hero section that supports multiple layouts,
 * badges, metrics, and call-to-action patterns. It's designed to be the primary
 * attention-grabbing element at the top of landing pages.
 * 
 * ## Features:
 * - Animated entrance effects with Framer Motion
 * - Flexible badge system with custom icons
 * - Performance metrics display with colored indicators  
 * - Primary and secondary CTA buttons with loading states
 * - Responsive design with mobile-first approach
 * - Full accessibility support with proper ARIA labels
 * 
 * ## Usage Guidelines:
 * - Use compelling, action-oriented headlines
 * - Keep descriptions concise but informative
 * - Include social proof through metrics when available
 * - Ensure CTAs are clear and action-oriented
 */
const meta: Meta<typeof EnhancedHero> = {
  title: 'Marketing/EnhancedHero',
  component: EnhancedHero,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A comprehensive hero section component with animations, metrics, and flexible content areas.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Main hero title - should be compelling and action-oriented',
    },
    subtitle: {
      control: 'text', 
      description: 'Supporting subtitle text above the main title',
    },
    description: {
      control: 'text',
      description: 'Detailed description below the title',
    },
    badges: {
      control: 'object',
      description: 'Array of badge objects with icons and text',
    },
    metrics: {
      control: 'object',
      description: 'Performance metrics to display with icons and colors',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Transform Your Business with AI',
    subtitle: 'Next-Generation Solutions',
    description: 'Discover how our AI-powered platform can revolutionize your workflow and boost productivity by up to 300%.',
    primaryCTA: {
      text: 'Get Started Free',
      onClick: () => console.log('Primary CTA clicked'),
    },
    secondaryCTA: {
      text: 'Watch Demo',
      onClick: () => console.log('Secondary CTA clicked'),
    },
  },
};

export const WithBadges: Story = {
  args: {
    ...Default.args,
    badges: [
      {
        icon: <Star className="h-3 w-3" />,
        text: 'Award Winning',
        variant: 'default' as const,
      },
      {
        icon: <Shield className="h-3 w-3" />,
        text: 'Enterprise Ready',
        variant: 'secondary' as const,
      },
    ],
  },
};

export const WithMetrics: Story = {
  args: {
    ...Default.args,
    metrics: [
      {
        value: '99.9%',
        label: 'Uptime',
        icon: <Zap className="h-5 w-5 text-white" />,
        color: 'bg-green-500',
      },
      {
        value: '50K+',
        label: 'Users',
        icon: <Users className="h-5 w-5 text-white" />,
        color: 'bg-blue-500',
      },
      {
        value: '<1sec',
        label: 'Response',
        icon: <Clock className="h-5 w-5 text-white" />,
        color: 'bg-purple-500',
      },
    ],
  },
};

export const LoadingState: Story = {
  args: {
    ...Default.args,
    primaryCTA: {
      text: 'Get Started Free',
      onClick: () => console.log('Primary CTA clicked'),
      loading: true,
    },
  },
};

export const FullFeatured: Story = {
  args: {
    title: 'Reduce Query Times by 73% with AI-Powered Optimization',
    subtitle: 'Enterprise Database Optimization',
    description: 'Transform your database performance with enterprise-grade AI optimization. Join thousands of companies automating 80% of performance tuning tasks while cutting database costs by 40-60%.',
    primaryCTA: {
      text: 'Start Free Enterprise Trial',
      onClick: () => console.log('Primary CTA clicked'),
    },
    secondaryCTA: {
      text: 'Watch Demo',
      onClick: () => console.log('Secondary CTA clicked'),
    },
    badges: [
      {
        icon: <Star className="h-3 w-3" />,
        text: 'Enterprise AI-Powered Database Optimization',
        variant: 'secondary' as const,
      }
    ],
    metrics: [
      {
        value: '73%',
        label: 'Faster Queries',
        icon: <Zap className="h-5 w-5 text-white" />,
        color: 'bg-blue-500',
      },
      {
        value: '60%',
        label: 'Cost Reduction', 
        icon: <TrendingUp className="h-5 w-5 text-white" />,
        color: 'bg-green-500',
      },
      {
        value: '5min',
        label: 'Setup Time',
        icon: <Clock className="h-5 w-5 text-white" />,
        color: 'bg-purple-500',
      },
    ],
  },
};

export const MobilePreview: Story = {
  ...FullFeatured,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile-optimized view showing responsive design and stacked layout.',
      },
    },
  },
};
