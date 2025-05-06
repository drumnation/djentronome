import { BrowserRouter, useLocation } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { Layout } from '@djentronome/ui';
import { AppRouter } from './routes';
import { theme } from '@djentronome/ui';
import '@mantine/core/styles.css';
import '@fontsource/orbitron/400.css';
import '@fontsource/orbitron/700.css';
import '@fontsource/rajdhani/400.css';
import '@fontsource/rajdhani/500.css';
import '@fontsource/rajdhani/700.css';

// Wrapper component that has access to the current location
const AppWithLayout = () => {
  const location = useLocation();
  
  // Create nav items for the sidebar
  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Play', path: '/play' },
    { label: 'Songs', path: '/songs' },
    { label: 'Settings', path: '/settings' },
    { label: 'Results', path: '/results' },
  ];

  return (
    <Layout 
      navItems={navItems} 
      version="0.1.0" 
      companyName="Djentronome"
      activePath={location.pathname}
    >
      <AppRouter />
    </Layout>
  );
};

function App() {
  // Create an enhanced theme with dark mode
  const darkTheme = {
    ...theme,
    colorScheme: 'dark',
  };

  return (
    <MantineProvider theme={darkTheme} forceColorScheme="dark">
      <BrowserRouter>
        <AppWithLayout />
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
