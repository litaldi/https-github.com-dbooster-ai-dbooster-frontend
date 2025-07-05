
import type { Meta, StoryObj } from '@storybook/react';
import { EnhancedFeaturesGrid } from './enhanced-features-grid';
import { 
  Brain, 
  Zap, 
  Shield, 
  Database, 
  BarChart3, 
  Rocket,
  Users,
  Lock
} from 'lucide-react';

/**
 * The EnhancedFeaturesGrid component displays features in a responsive grid layout
 * with rich content support, animations, and flexible styling options.
 * 
 * ## Features:
 * - Responsive grid layout (1-4 columns)
 * - Rich feature content with icons, badges, and CTAs
 * - Staggered animations using Framer Motion
 * - Flexible styling with gradient backgrounds
 * - Full accessibility support
 * - Benefit lists with visual indicators
 * 
 * ## Usage Guidelines:
 * - Use clear, benefit-focused feature titles
 * - Include concrete benefits rather than generic statements
 * - Leverage badges to highlight important features
 * - Use appropriate icons that relate to the feature
 */
const meta: Meta<typeof EnhancedFeaturesGrid> = {
  title: 'Marketing/EnhancedFeaturesGrid',
  component: EnhancedFeaturesGrid,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A flexible features grid that displays feature cards with rich content and animations.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    columns: {
      control: 'select',
      options: [1, 2, 3, 4],
      description: 'Number of columns in the grid layout',
    },
    title: {
      control: 'text',
      description: 'Section title',
    },
    subtitle: {
      control: 'text',
      description: 'Section subtitle/description',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const basicFeatures = [
  {
    icon: <Brain className="h-8 w-8" />,
    title: 'AI-Powered Intelligence',
    description: 'Advanced machine learning algorithms that adapt to your specific use case and improve over time.',
    benefits: [
      'Smart pattern recognition',
      'Continuous learning and improvement',
      'Personalized recommendations',
    ],
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: 'Enterprise Security',
    description: 'Bank-level security with end-to-end encryption and compliance certifications.',
    benefits: [
      'SOC2 Type II compliance',
      'End-to-end encryption',
      'Regular security audits',
    ],
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: 'Lightning Fast',
    description: 'Optimized for performance with sub-second response times and 99.9% uptime.',
    benefits: [
      'Sub-second response times',
      '99.9% uptime guarantee',
      'Global CDN distribution',
    ],
  },
];

export const ThreeColumn: Story = {
  args: {
    title: 'Everything You Need',
    subtitle: 'Comprehensive features designed for modern businesses.',
    features: basicFeatures,
    columns: 3,
  },
};

export const TwoColumn: Story = {
  args: {
    title: 'Core Features',
    features: basicFeatures.slice(0, 2),
    columns: 2,
  },
};

export const WithBadgesAndCTAs: Story = {
  args: {
    title: 'Advanced Feature Set',
    subtitle: 'Professional tools with enterprise-grade capabilities.',
    features: [
      {
        icon: <Database className="h-8 w-8" />,
        title: 'Database Optimization',
        description: 'Intelligent database optimization with real-time monitoring and automatic tuning.',
        benefits: [
          'Automatic query optimization',
          'Real-time performance monitoring',
          'Intelligent indexing suggestions',
          'Cost optimization insights',
        ],
        badge: {
          text: 'Most Popular',
          variant: 'default' as const,
        },
        cta: {
          text: 'Try Database Optimizer',
          onClick: () => console.log('Database optimizer clicked'),
        },
        gradient: 'bg-gradient-to-br from-blue-500/10 to-blue-600/5',
      },
      {
        icon: <BarChart3 className="h-8 w-8" />,
        title: 'Advanced Analytics',
        description: 'Deep insights with predictive analytics and customizable dashboards.',
        benefits: [
          'Predictive performance analytics',
          'Custom dashboard creation',
          'Advanced reporting tools',
          'Data export capabilities',
        ],
        badge: {
          text: 'Enterprise',
          variant: 'outline' as const,
        },
        cta: {
          text: 'View Analytics',
          onClick: () => console.log('Analytics clicked'),
        },
        gradient: 'bg-gradient-to-br from-green-500/10 to-green-600/5',
      },
      {
        icon: <Lock className="h-8 w-8" />,
        title: 'Security & Compliance',
        description: 'Enterprise-grade security with comprehensive audit logging and access controls.',
        benefits: [
          'Role-based access control',
          'Comprehensive audit trails',
          'Multi-factor authentication',
          'Compliance reporting',
        ],
        badge: {
          text: 'SOC2 Certified',
          variant: 'secondary' as const,
        },
        cta: {
          text: 'Security Details',
          onClick: () => console.log('Security clicked'),
        },
        gradient: 'bg-gradient-to-br from-purple-500/10 to-purple-600/5',
      },
    ],
    columns: 3,
  },
};

export const FourColumn: Story = {
  args: {
    title: 'Complete Feature Set',
    features: [
      {
        icon: <Brain className="h-8 w-8" />,
        title: 'AI Intelligence',
        description: 'Advanced AI capabilities.',
        benefits: ['Smart automation', 'Pattern recognition'],
      },
      {
        icon: <Shield className="h-8 w-8" />,
        title: 'Security',
        description: 'Enterprise security.',
        benefits: ['End-to-end encryption', 'Compliance ready'],
      },
      {
        icon: <Rocket className="h-8 w-8" />,
        title: 'Performance',
        description: 'Blazing fast performance.',
        benefits: ['Sub-second response', 'Global CDN'],
      },
      {
        icon: <Users className="h-8 w-8" />,
        title: 'Collaboration',
        description: 'Team collaboration tools.',
        benefits: ['Real-time collaboration', 'Role management'],
      },
    ],
    columns: 4,
  },
};

export const SingleColumn: Story = {
  args: {
    title: 'Detailed Feature Overview',
    features: [basicFeatures[0]],
    columns: 1,
  },
};

export const MobileView: Story = {
  ...ThreeColumn,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile view showing how the grid adapts to smaller screens.',
      },
    },
  },
};
