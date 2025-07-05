
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Check, X, AlertTriangle } from 'lucide-react';

/**
 * Component Usage Guidelines
 * 
 * This story documents best practices and usage patterns for our UI components.
 */
const meta: Meta = {
  title: 'Design System/Component Guidelines',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Best practices and usage guidelines for UI components.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ButtonGuidelines: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Button Usage Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-600 flex items-center gap-2">
              <Check className="h-5 w-5" />
              Do
            </h3>
            <div className="space-y-4">
              <GuidelineItem
                title="Use clear, action-oriented text"
                example={<Button>Save Changes</Button>}
                description="Button text should clearly indicate what will happen when clicked."
              />
              <GuidelineItem
                title="Use appropriate variants for context"
                example={
                  <div className="flex gap-2">
                    <Button variant="default">Primary Action</Button>
                    <Button variant="outline">Secondary Action</Button>
                    <Button variant="destructive">Delete</Button>
                  </div>
                }
                description="Use default for primary actions, outline for secondary, destructive for dangerous actions."
              />
              <GuidelineItem
                title="Provide loading states for async actions"
                example={<Button disabled>Processing...</Button>}
                description="Show loading state when performing async operations."
              />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-red-600 flex items-center gap-2">
              <X className="h-5 w-5" />
              Don't
            </h3>
            <div className="space-y-4">
              <GuidelineItem
                title="Don't use vague button text"
                example={<Button variant="outline">Click Here</Button>}
                description="Avoid generic text like 'Click Here' or 'Submit'."
                isNegative
              />
              <GuidelineItem
                title="Don't use too many primary buttons"
                example={
                  <div className="flex gap-2">
                    <Button>Action 1</Button>
                    <Button>Action 2</Button>
                    <Button>Action 3</Button>
                  </div>
                }
                description="Use only one primary button per section to maintain clear hierarchy."
                isNegative
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
};

export const FormGuidelines: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Form Component Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-600 flex items-center gap-2">
              <Check className="h-5 w-5" />
              Best Practices
            </h3>
            <div className="space-y-4">
              <GuidelineItem
                title="Always pair inputs with labels"
                example={
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="john@example.com" />
                  </div>
                }
                description="Every input should have an associated label for accessibility."
              />
              <GuidelineItem
                title="Use appropriate input types"
                example={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-type">Email</Label>
                      <Input id="email-type" type="email" placeholder="Email input type" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-type">Password</Label>
                      <Input id="password-type" type="password" placeholder="Password input type" />
                    </div>
                  </div>
                }
                description="Use specific input types for better UX and validation."
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
};

export const AccessibilityGuidelines: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Accessibility Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              All components should meet WCAG 2.1 AA standards at minimum.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-4">
            <GuidelineItem
              title="Color contrast ratios"
              description="Ensure 4.5:1 contrast ratio for normal text, 3:1 for large text."
            />
            <GuidelineItem
              title="Keyboard navigation"
              description="All interactive elements must be keyboard accessible."
            />
            <GuidelineItem
              title="Screen reader support"
              description="Use proper ARIA labels and semantic HTML."
            />
            <GuidelineItem
              title="Focus indicators"
              description="Provide clear focus indicators for keyboard users."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  ),
};

function GuidelineItem({ 
  title, 
  example, 
  description, 
  isNegative = false 
}: { 
  title: string; 
  example?: React.ReactNode; 
  description: string;
  isNegative?: boolean;
}) {
  return (
    <div className={`p-4 rounded-lg border ${isNegative ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
      <h4 className="font-medium mb-2">{title}</h4>
      {example && <div className="mb-3">{example}</div>}
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
