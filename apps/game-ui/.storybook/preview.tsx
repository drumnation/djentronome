import React from 'react';
import type { Preview } from '@storybook/react';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter } from 'react-router-dom';
import { theme } from '@djentronome/ui';

// Import the same styles as in the main app
import '@mantine/core/styles.css';
import '@fontsource/orbitron/400.css';
import '@fontsource/orbitron/700.css';
import '@fontsource/rajdhani/400.css';
import '@fontsource/rajdhani/500.css';
import '@fontsource/rajdhani/700.css';

// Create the same enhanced theme as in the main app
const darkTheme = {
  ...theme,
  colorScheme: 'dark',
};

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#1A1B1E',
        },
      ],
    },
  },
  // Decorators to wrap all stories with the same providers as the main app
  decorators: [
    (Story) => (
      <MantineProvider theme={darkTheme} forceColorScheme="dark">
        <BrowserRouter>
          <div style={{ padding: '1rem', maxWidth: '100%', margin: '0 auto' }}>
            <Story />
          </div>
        </BrowserRouter>
      </MantineProvider>
    ),
  ],
};

export default preview; 