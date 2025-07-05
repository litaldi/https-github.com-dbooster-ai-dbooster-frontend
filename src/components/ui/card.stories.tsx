
import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Heart, MessageCircle, Share } from 'lucide-react';

/**
 * Card Component
 * 
 * A flexible container component for grouping related content and actions.
 * Perfect for product cards, profile cards, content previews, and more.
 * 
 * ## Accessibility Features:
 * - Semantic HTML structure with proper landmarks
 * - Keyboard navigation support
 * - Screen reader friendly content structure
 * 
 * ## Usage Guidelines:
 * - Use CardHeader for titles and metadata
 * - CardContent for main content
 * - CardFooter for actions or additional info
 * - Keep content concise and scannable
 */
const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile card component for displaying grouped content with optional header, content, and footer sections.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes for styling',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the main content of the card.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
};

export const ProductCard: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Premium Plan</CardTitle>
            <CardDescription>Perfect for growing teams</CardDescription>
          </div>
          <Badge>Popular</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">$29/month</div>
        <ul className="mt-4 space-y-2 text-sm">
          <li>✓ Up to 50 team members</li>
          <li>✓ Advanced analytics</li>
          <li>✓ Priority support</li>
          <li>✓ Custom integrations</li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Get Started</Button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of a product/pricing card with features list and CTA button.',
      },
    },
  },
};

export const BlogPostCard: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Getting Started with React</CardTitle>
        <CardDescription>Published on March 15, 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Learn the fundamentals of React and build your first component in this comprehensive guide...
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex space-x-4 text-sm text-muted-foreground">
          <span className="flex items-center">
            <Heart className="mr-1 h-4 w-4" />
            24
          </span>
          <span className="flex items-center">
            <MessageCircle className="mr-1 h-4 w-4" />
            5
          </span>
        </div>
        <Button variant="ghost" size="sm">
          <Share className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const InteractiveCard: Story = {
  render: () => (
    <Card className="w-[350px] transition-all hover:shadow-lg cursor-pointer">
      <CardHeader>
        <CardTitle>Interactive Card</CardTitle>
        <CardDescription>Hover to see the effect</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card has hover effects and can be clicked.</p>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Card with hover effects for interactive use cases.',
      },
    },
  },
};

export const Variations: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Minimal Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Simple card with just header and content.</p>
        </CardContent>
      </Card>
      
      <Card className="w-full">
        <CardContent className="pt-6">
          <p>Content-only card without header or footer.</p>
        </CardContent>
      </Card>
      
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Header + Footer</CardTitle>
        </CardHeader>
        <CardFooter>
          <Button variant="outline">Action</Button>
        </CardFooter>
      </Card>
      
      <Card className="w-full border-dashed">
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">Dashed border variation</p>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different card layouts and styling variations.',
      },
    },
  },
};

export const ResponsiveCards: Story = {
  render: () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <CardTitle>Card {i + 1}</CardTitle>
            <CardDescription>Responsive grid layout</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This demonstrates responsive card layouts.</p>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Cards in a responsive grid layout that adapts to screen size.',
      },
    },
  },
};
