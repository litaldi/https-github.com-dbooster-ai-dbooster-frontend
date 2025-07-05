
import type { Meta, StoryObj } from '@storybook/react';
import { EnhancedCTASection } from './enhanced-cta-section';
import { Star, Sparkles, Zap } from 'lucide-react';

/**
 * The EnhancedCTASection component is a conversion-focused section designed to drive
 * user action with compelling messaging, trust signals, and prominent call-to-action buttons.
 * 
 * ## Features:
 * - Multiple background variants (gradient, solid, pattern)
 * - Badge support with custom icons
 * - Primary and secondary CTA buttons
 * - Trust signals for credibility
 * - Loading states for form submissions
 * - Animated entrance effects
 * 
 * ## Usage Guidelines:
 * - Use action-oriented, benefit-focused headlines
 * - Include trust signals to reduce friction
 * - Keep descriptions concise but compelling
 * - Use contrasting colors for maximum visibility
 */
const meta: Meta<typeof EnhancedCTASection> = {
  title: 'Marketing/EnhancedCTASection',
  component: EnhancedCTASection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A conversion-focused CTA section with trust signals and flexible styling options.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    backgroundVariant: {
      control: 'select',
      options: ['gradient', 'solid', 'pattern'],
      description: 'Background styling variant',
    },
    title: {
      control: 'text',
      description: 'Main CTA headline - should be action-oriented',
    },
    description: {
      control: 'text',
      description: 'Supporting description text',
    },
    trustSignals: {
      control: 'object',
      description: 'Array of trust signals to display',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Ready to Get Started?',
    description: 'Join thousands of satisfied customers who have transformed their business with our platform.',
    primaryCTA: {
      text: 'Start Free Trial',
      onClick: () => console.log('Primary CTA clicked'),
    },
    secondaryCTA: {
      text: 'Contact Sales',
      onClick: () => console.log('Secondary CTA clicked'),
    },
  },
};

export const WithTrustSignals: Story = {
  args: {
    title: 'Transform Your Business Today',
    description: 'Join over 10,000 companies that trust our platform to power their success.',
    primaryCTA: {
      text: 'Get Started Free',
      onClick: () => console.log('Primary CTA clicked'),
    },
    secondaryCTA: {
      text: 'Book Demo',
      onClick: () => console.log('Secondary CTA clicked'),
    },
    trustSignals: [
      'No credit card required',
      '14-day free trial',
      'Cancel anytime',
      '24/7 support',
      '99.9% uptime',
    ],
  },
};

export const WithBadge: Story = {
  args: {
    ...WithTrustSignals.args,
    badge: {
      text: 'Limited Time: 50% Off First Year',
      icon: <Star className="w-4 h-4" />,
    },
  },
};

export const GradientBackground: Story = {
  args: {
    ...WithBadge.args,
    backgroundVariant: 'gradient',
  },
};

export const SolidBackground: Story = {
  args: {
    ...WithBadge.args,
    backgroundVariant: 'solid',
  },
};

export const PatternBackground: Story = {
  args: {
    ...WithBadge.args,
    backgroundVariant: 'pattern',
  },
};

export const LoadingState: Story = {
  args: {
    ...Default.args,
    primaryCTA: {
      text: 'Creating Account...',
      onClick: () => console.log('Primary CTA clicked'),
      loading: true,
    },
  },
};

export const DatabaseExample: Story = {
  args: {
    title: 'Ready to Transform Your Database Performance?',
    description: 'Join thousands of developers and enterprises who have improved their database performance by up to 10x with DBooster\'s AI-powered optimization recommendations.',
    primaryCTA: {
      text: 'Start Free Analysis',
      onClick: () => console.log('Primary CTA clicked'),
    },
    secondaryCTA: {
      text: 'Explore Features',
      onClick: () => console.log('Secondary CTA clicked'),
    },
    trustSignals: [
      'No credit card required',
      '2-minute setup',
      'Cancel anytime',
      'SOC2 compliant',
      '24/7 support',
    ],
    badge: {
      text: 'Limited Time: Enterprise Trial Free',
      icon: <Star className="w-4 h-4" />,
    },
    backgroundVariant: 'gradient',
  },
};

export const MobileView: Story = {
  ...DatabaseExample,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile-optimized view showing responsive button stacking and text sizing.',
      },
    },
  },
};
