
# DBooster Storybook Documentation

## Overview

This Storybook contains the complete component library for DBooster, our AI-powered database optimization platform. It serves as both documentation and a testing environment for all UI components.

## Getting Started

### Installation & Setup

The project already includes all necessary Storybook dependencies. To start Storybook:

```bash
npm run storybook
```

This will launch Storybook on `http://localhost:6006`

### Building Storybook

To build a static version of Storybook:

```bash
npm run build-storybook
```

## Component Categories

### Core UI Components
- **Button** - Various button styles, sizes, and states
- **Input** - Form inputs with validation states
- **Card** - Content containers and layouts
- **Badge** - Status indicators and labels
- **Progress** - Loading and progress indicators
- **Separator** - Visual content dividers

### Enhanced Components
- **Enhanced CTA Section** - Conversion-focused marketing sections
- **Enhanced Features Grid** - Product feature showcases
- **Enhanced Hero** - Landing page hero sections
- **Enhanced Form** - Advanced form components
- **Smart Search** - Intelligent search functionality

### Navigation Components
- **Enhanced Mega Menu** - Complex navigation structures
- **Enhanced Footer** - Comprehensive footer layouts
- **Breadcrumb** - Navigation breadcrumbs

## Features

### Accessibility Testing
- Built-in accessibility addon (@storybook/addon-a11y)
- WCAG 2.1 AA compliance checking
- Color contrast validation
- Keyboard navigation testing

### Responsive Testing
- Multiple viewport presets (mobile, tablet, desktop)
- Responsive design validation
- Touch-friendly interface testing

### Interactive Documentation
- Live component playground
- Comprehensive prop controls
- Usage examples and guidelines
- Design system documentation

## Writing Stories

### Basic Story Structure

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { YourComponent } from './YourComponent';

const meta: Meta<typeof YourComponent> = {
  title: 'Category/YourComponent',
  component: YourComponent,
  parameters: {
    layout: 'centered', // or 'fullscreen', 'padded'
    docs: {
      description: {
        component: 'Description of your component.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // Define controls for component props
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Default props
  },
};
```

### Best Practices

1. **Comprehensive Coverage**: Include stories for all component variants and states
2. **Accessibility**: Always test with the a11y addon
3. **Documentation**: Provide clear descriptions and usage guidelines
4. **Interactive Examples**: Use controls to make components interactive
5. **Real-world Scenarios**: Show components in realistic contexts

## Addons Included

- **@storybook/addon-essentials** - Core Storybook functionality
- **@storybook/addon-a11y** - Accessibility testing
- **@storybook/addon-docs** - Enhanced documentation
- **@storybook/addon-controls** - Interactive component controls
- **@storybook/addon-viewport** - Responsive testing
- **@storybook/addon-themes** - Theme switching

## Configuration

### Main Configuration (.storybook/main.ts)
- Story file patterns
- Addon configuration
- Build optimizations
- TypeScript and path resolution

### Preview Configuration (.storybook/preview.ts)
- Global parameters and decorators
- Accessibility settings
- Viewport configurations
- Theme definitions

## Deployment

Storybook can be deployed as a static site to share with the team:

1. Build the static version: `npm run build-storybook`
2. Deploy the `storybook-static` folder to your hosting service
3. Share the URL with your team for component review

## Contributing

When adding new components:

1. Create the component with proper TypeScript types
2. Write comprehensive stories covering all variants
3. Test accessibility with the a11y addon
4. Document usage guidelines and best practices
5. Ensure responsive design across all viewports

## Support

For questions about the component library or Storybook setup, please contact the design system team or create an issue in the project repository.
