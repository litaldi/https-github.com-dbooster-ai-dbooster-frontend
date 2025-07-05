
import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './label';
import { Input } from './input';
import { Checkbox } from './checkbox';
import { RadioGroup, RadioGroupItem } from './radio-group';

/**
 * Label Component
 * 
 * Provides accessible labels for form controls. Essential for form accessibility
 * and user experience.
 * 
 * ## Accessibility Features:
 * - Automatically associates with form controls
 * - Supports click-to-focus behavior
 * - Screen reader compatible
 * - Required field indicators
 * 
 * ## Usage Guidelines:
 * - Always pair with form controls
 * - Use clear, descriptive text
 * - Indicate required fields appropriately
 */
const meta: Meta<typeof Label> = {
  title: 'UI/Label',
  component: Label,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Accessible label component for form controls with proper association and styling.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    htmlFor: {
      control: 'text',
      description: 'ID of the associated form control',
    },
    children: {
      control: 'text',
      description: 'Label text content',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Label',
  },
};

export const WithInput: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="email">Email Address</Label>
      <Input id="email" type="email" placeholder="Enter your email" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Label properly associated with an input field.',
      },
    },
  },
};

export const RequiredField: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="required-email">
        Email Address <span className="text-red-500">*</span>
      </Label>
      <Input id="required-email" type="email" placeholder="Enter your email" required />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Label with required field indicator.',
      },
    },
  },
};

export const WithCheckbox: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms" className="cursor-pointer">
        Accept terms and conditions
      </Label>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Label used with checkbox - note the cursor pointer for better UX.',
      },
    },
  },
};

export const WithRadioGroup: Story = {
  render: () => (
    <div className="space-y-3">
      <Label className="text-base font-medium">Choose your plan</Label>
      <RadioGroup defaultValue="basic">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="basic" id="basic" />
          <Label htmlFor="basic" className="cursor-pointer">Basic Plan</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="pro" id="pro" />
          <Label htmlFor="pro" className="cursor-pointer">Pro Plan</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="enterprise" id="enterprise" />
          <Label htmlFor="enterprise" className="cursor-pointer">Enterprise Plan</Label>
        </div>
      </RadioGroup>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Labels used in a radio group with proper associations.',
      },
    },
  },
};

export const FormExample: Story = {
  render: () => (
    <form className="space-y-4 w-72">
      <div className="space-y-2">
        <Label htmlFor="firstname">
          First Name <span className="text-red-500">*</span>
        </Label>
        <Input id="firstname" placeholder="John" required />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="lastname">
          Last Name <span className="text-red-500">*</span>
        </Label>
        <Input id="lastname" placeholder="Doe" required />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="form-email">Email</Label>
        <Input id="form-email" type="email" placeholder="john@example.com" />
        <p className="text-xs text-muted-foreground">
          We'll never share your email with anyone else.
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox id="marketing" />
        <Label htmlFor="marketing" className="cursor-pointer text-sm">
          I agree to receive marketing emails
        </Label>
      </div>
    </form>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete form example showing various label usage patterns.',
      },
    },
  },
};

export const LabelSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <Label className="text-xs">Extra Small Label</Label>
      </div>
      <div>
        <Label className="text-sm">Small Label</Label>
      </div>
      <div>
        <Label>Default Label</Label>
      </div>
      <div>
        <Label className="text-lg">Large Label</Label>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different label sizes for various design needs.',
      },
    },
  },
};
