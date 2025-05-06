import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { AppRouter } from './AppRouter';
import { theme } from '../theme';

// Helper to render the component with required providers
const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <MantineProvider theme={theme}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </MantineProvider>
  );
};

describe('AppRouter', () => {
  it('renders the home route by default', () => {
    renderWithProviders(<AppRouter />);
    
    // Since we're rendering a placeholder for now, we check for the text
    expect(screen.getByText('Home Screen')).toBeInTheDocument();
  });
}); 