
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    '../src/stories/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../src/stories/**/*.mdx',
    '../src/components/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-controls',
    '@storybook/addon-viewport',
    '@storybook/addon-themes',
    {
      name: '@storybook/addon-styling-webpack',
      options: {
        rules: [
          {
            test: /\.css$/,
            use: [
              'style-loader',
              'css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  postcssOptions: {
                    plugins: [require('tailwindcss'), require('autoprefixer')],
                  },
                },
              },
            ],
          },
        ],
      },
    },
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  docs: {
    autodocs: 'tag',
    defaultName: 'Documentation',
  },
  viteFinal: async (config) => {
    // Ensure proper TypeScript and path resolution
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': new URL('../src', import.meta.url).pathname,
      };
    }

    // Optimize build performance
    if (config.build) {
      config.build.sourcemap = false;
    }

    return config;
  },
  
  // Static directory for assets
  staticDirs: ['../public'],
  
  // Feature flags
  features: {
    storyStoreV7: true,
  },
};

export default config;
