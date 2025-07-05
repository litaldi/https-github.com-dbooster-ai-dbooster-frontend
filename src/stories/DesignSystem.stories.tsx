
import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Design System Documentation
 * 
 * This story provides a comprehensive overview of our design system including
 * colors, typography, spacing, and component guidelines.
 */
const meta: Meta = {
  title: 'Design System/Overview',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Complete design system documentation with colors, typography, spacing, and usage guidelines.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ColorPalette: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Color Palette</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Primary Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ColorSwatch name="Primary" className="bg-primary text-primary-foreground" />
              <ColorSwatch name="Primary Foreground" className="bg-primary-foreground text-primary" />
              <ColorSwatch name="Secondary" className="bg-secondary text-secondary-foreground" />
              <ColorSwatch name="Secondary Foreground" className="bg-secondary-foreground text-secondary" />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Semantic Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ColorSwatch name="Destructive" className="bg-destructive text-destructive-foreground" />
              <ColorSwatch name="Muted" className="bg-muted text-muted-foreground" />
              <ColorSwatch name="Accent" className="bg-accent text-accent-foreground" />
              <ColorSwatch name="Card" className="bg-card text-card-foreground border" />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const Typography: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Typography Scale</h2>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold">Heading 1 - 4xl/extrabold</h1>
            <h2 className="text-3xl font-bold">Heading 2 - 3xl/bold</h2>
            <h3 className="text-2xl font-bold">Heading 3 - 2xl/bold</h3>
            <h4 className="text-xl font-semibold">Heading 4 - xl/semibold</h4>
            <h5 className="text-lg font-semibold">Heading 5 - lg/semibold</h5>
            <h6 className="text-base font-semibold">Heading 6 - base/semibold</h6>
          </div>
          
          <div className="space-y-4">
            <p className="text-xl text-muted-foreground">Lead text - xl/normal</p>
            <p className="text-base">Body text - base/normal</p>
            <p className="text-sm text-muted-foreground">Small text - sm/normal</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Caption - xs/uppercase</p>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const SpacingSystem: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Spacing System</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Spacing Scale</h3>
            <div className="space-y-3">
              {[
                { name: '0.5 (2px)', class: 'w-0.5 h-4' },
                { name: '1 (4px)', class: 'w-1 h-4' },
                { name: '2 (8px)', class: 'w-2 h-4' },
                { name: '3 (12px)', class: 'w-3 h-4' },
                { name: '4 (16px)', class: 'w-4 h-4' },
                { name: '6 (24px)', class: 'w-6 h-4' },
                { name: '8 (32px)', class: 'w-8 h-4' },
                { name: '12 (48px)', class: 'w-12 h-4' },
                { name: '16 (64px)', class: 'w-16 h-4' },
                { name: '20 (80px)', class: 'w-20 h-4' },
              ].map((item) => (
                <div key={item.name} className="flex items-center gap-4">
                  <div className={`${item.class} bg-primary`}></div>
                  <span className="text-sm font-mono">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

function ColorSwatch({ name, className }: { name: string; className: string }) {
  return (
    <div className={`p-4 rounded-lg ${className}`}>
      <div className="font-medium">{name}</div>
      <div className="text-sm opacity-80">{className}</div>
    </div>
  );
}
