
import type { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertDescription, AlertTitle } from './alert';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

/**
 * Alert Component
 * 
 * Used to display important messages and notifications to users.
 * Supports different variants for various message types.
 * 
 * ## Accessibility Features:
 * - Proper ARIA roles and labels
 * - High contrast colors
 * - Icon support for visual communication
 * - Screen reader friendly structure
 * 
 * ## Usage Guidelines:
 * - Use appropriate variants for message types
 * - Include clear, actionable content
 * - Don't overuse - reserve for important messages
 */
const meta: Meta<typeof Alert> = {
  title: 'UI/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Display important messages and notifications with various styling options.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive'],
      description: 'Visual style variant',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Alert className="max-w-md">
      <Info className="h-4 w-4" />
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>
        This is a default alert with some important information.
      </AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" className="max-w-md">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Something went wrong. Please try again later.
      </AlertDescription>
    </Alert>
  ),
};

export const Success: Story = {
  render: () => (
    <Alert className="max-w-md border-green-200 bg-green-50 text-green-800">
      <CheckCircle className="h-4 w-4" />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>
        Your changes have been saved successfully.
      </AlertDescription>
    </Alert>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Success alert using custom styling for positive feedback.',
      },
    },
  },
};

export const Warning: Story = {
  render: () => (
    <Alert className="max-w-md border-yellow-200 bg-yellow-50 text-yellow-800">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>
        This action cannot be undone. Please proceed with caution.
      </AlertDescription>
    </Alert>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Warning alert using custom styling for cautionary messages.',
      },
    },
  },
};

export const WithoutTitle: Story = {
  render: () => (
    <Alert className="max-w-md">
      <Info className="h-4 w-4" />
      <AlertDescription>
        This alert only has a description without a title.
      </AlertDescription>
    </Alert>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Alert with only description text, useful for simple messages.',
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>Default alert for general information.</AlertDescription>
      </Alert>
      
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Destructive alert for errors and critical issues.</AlertDescription>
      </Alert>
      
      <Alert className="border-green-200 bg-green-50 text-green-800">
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>Custom success alert for positive feedback.</AlertDescription>
      </Alert>
      
      <Alert className="border-yellow-200 bg-yellow-50 text-yellow-800">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>Custom warning alert for cautionary messages.</AlertDescription>
      </Alert>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All alert variants displayed together for comparison.',
      },
    },
  },
};

export const LongContent: Story = {
  render: () => (
    <Alert className="max-w-lg">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>System Maintenance</AlertTitle>
      <AlertDescription>
        We will be performing scheduled maintenance on our servers from 2:00 AM to 4:00 AM EST on Sunday, March 24th. 
        During this time, some services may be temporarily unavailable. We apologize for any inconvenience this may cause 
        and appreciate your patience as we work to improve our system performance.
      </AlertDescription>
    </Alert>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Alert with longer content to demonstrate text wrapping and layout.',
      },
    },
  },
};
