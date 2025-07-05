
import { addons } from '@storybook/manager-api';
import { themes } from '@storybook/theming';

addons.setConfig({
  theme: {
    ...themes.light,
    brandTitle: 'DBooster Design System',
    brandUrl: 'https://dbooster.lovable.app',
    brandImage: undefined,
    brandTarget: '_self',
    
    // Colors
    colorPrimary: 'hsl(221.2 83.2% 53.3%)',
    colorSecondary: 'hsl(210 40% 96%)',
    
    // UI
    appBg: 'hsl(0 0% 100%)',
    appContentBg: 'hsl(0 0% 100%)',
    appBorderColor: 'hsl(214.3 31.8% 91.4%)',
    appBorderRadius: 6,
    
    // Typography
    fontBase: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontCode: '"JetBrains Mono", "SF Mono", Monaco, Inconsolata, "Roboto Mono", "Source Code Pro", monospace',
    
    // Text colors
    textColor: 'hsl(222.2 84% 4.9%)',
    textInverseColor: 'hsl(0 0% 100%)',
    textMutedColor: 'hsl(215.4 16.3% 46.9%)',
    
    // Toolbar default and active colors
    barTextColor: 'hsl(222.2 84% 4.9%)',
    barSelectedColor: 'hsl(221.2 83.2% 53.3%)',
    barBg: 'hsl(0 0% 100%)',
    
    // Form colors
    inputBg: 'hsl(0 0% 100%)',
    inputBorder: 'hsl(214.3 31.8% 91.4%)',
    inputTextColor: 'hsl(222.2 84% 4.9%)',
    inputBorderRadius: 6,
  },
  
  sidebar: {
    showRoots: false,
    collapsedRoots: ['Design System'],
  },
  
  toolbar: {
    title: { hidden: false },
    zoom: { hidden: false },
    eject: { hidden: false },
    copy: { hidden: false },
    fullscreen: { hidden: false },
  },
});
