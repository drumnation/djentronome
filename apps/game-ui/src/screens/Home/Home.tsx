import { Stack, Text, Title, Box, Container, Group, Card as MantineCard } from '@mantine/core';
import { Button } from '@djentronome/ui';
import { FiPlay, FiMusic, FiChevronRight } from 'react-icons/fi';

export const Home = () => {
  const handleButtonClick = () => {
    console.log('Button clicked!');
  };

  return (
    <Container size="md" px="md">
      <Stack gap="xl" mt="xl">
        {/* Main Heading Section */}
        <Box>
          <Title order={1} size="h1" ff="Orbitron" className="cyber-glow" 
            style={{ letterSpacing: '1px', textTransform: 'uppercase' }}>
            Unleash Your Rhythm
          </Title>
          <Text c="dimmed" size="lg" mt="xs" ff="Rajdhani">
            Master complex metal rhythms and polymeters.
          </Text>
        </Box>
        
        {/* Getting Started Card */}
        <MantineCard shadow="sm" radius="md" withBorder p="lg" 
          className="noise-overlay"
          style={{ borderColor: '#2a2a2a', background: '#111111' }}>
          <Stack gap="md">
            <Title order={4} size="h4" ff="Orbitron" c="#e60000" 
              style={{ letterSpacing: '0.5px' }}>
              Getting Started
            </Title>
            
            <Text ff="Rajdhani" size="lg">
              Welcome to Djentronome, a brutal rhythm training experience for modern metal musicians.
              Select a song to start playing or customize your practice to match your skill level.
            </Text>
            
            <Group justify="flex-end" mt="md">
              <Button 
                customVariant="primary" 
                onClick={handleButtonClick}
                leftSection={<FiPlay />}
                className="metal-pulse"
              >
                Crush It
              </Button>
            </Group>
          </Stack>
        </MantineCard>
        
        {/* UI Components Example Section */}
        <Box mt="xl" className="noise-overlay" style={{ padding: '1.5rem', background: '#111111', borderRadius: '0.5rem' }}>
          <Title order={3} size="h3" fw={600} mb="md" ff="Orbitron" data-glitch="Brutal UI"
            style={{ letterSpacing: '0.5px' }}>
            Brutal UI
          </Title>
          
          <Stack gap="md" align="flex-start">
            <Button 
              customVariant="primary" 
              onClick={handleButtonClick}
              leftSection={<FiPlay />}
            >
              Primary Button
            </Button>
            <Button 
              customVariant="secondary" 
              onClick={handleButtonClick}
              leftSection={<FiMusic />}
            >
              Secondary Button
            </Button>
            <Button 
              customVariant="tertiary" 
              onClick={handleButtonClick}
              rightSection={<FiChevronRight />}
            >
              Tertiary Button
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}; 