import React, { useState, useEffect, useCallback } from 'react';
import { Box, Stack, Slider, Group, Button, NumberInput, Switch, Select, Title, useMantineTheme, Text } from '@mantine/core';
import { AudioEngine } from '../../../../../packages/core-audio/src';
import { Metronome as MetronomeService, MetronomeConfig } from '../../../../../packages/sound/src';
import { MetronomeProps } from './Metronome.types';

export const Metronome: React.FC<MetronomeProps> = ({
  initialConfig,
  className,
  onPlayStateChange,
  onConfigChange
}) => {
  const theme = useMantineTheme();
  const [audioEngine, setAudioEngine] = useState<AudioEngine | null>(null);
  const [metronome, setMetronome] = useState<MetronomeService | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [config, setConfig] = useState<MetronomeConfig>({
    tempo: initialConfig?.tempo || 120,
    beatsPerMeasure: initialConfig?.beatsPerMeasure || 4,
    beatUnit: initialConfig?.beatUnit || 4,
    subdivision: initialConfig?.subdivision || 1,
    tripletFeel: initialConfig?.tripletFeel || false,
    volumes: initialConfig?.volumes || {
      downbeat: 1.0,
      quarterNote: 0.8,
      subdivision: 0.6,
      triplet: 0.7,
    }
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioPermission, setAudioPermission] = useState<boolean>(false);

  // Initialize audio engine and metronome
  useEffect(() => {
    const initAudio = async () => {
      try {
        const engine = new AudioEngine({ masterVolume: 0.8 });
        await engine.initialize();
        
        const metronomeInstance = new MetronomeService(engine, config);
        await metronomeInstance.loadSounds();
        
        setAudioEngine(engine);
        setMetronome(metronomeInstance);
        setIsLoaded(true);
        setAudioPermission(true);
      } catch (err) {
        console.error('Failed to initialize audio:', err);
        setError('Failed to initialize audio. Please check your browser permissions.');
      }
    };
    
    initAudio();
    
    return () => {
      if (audioEngine) {
        audioEngine.dispose();
      }
    };
  }, []);

  // Handle play/stop
  const togglePlayback = useCallback(() => {
    if (!metronome) return;
    
    if (isPlaying) {
      metronome.stop();
      setIsPlaying(false);
      onPlayStateChange?.(false);
    } else {
      metronome.start();
      setIsPlaying(true);
      onPlayStateChange?.(true);
    }
  }, [metronome, isPlaying, onPlayStateChange]);

  // Update config when sliders/inputs change
  const updateConfig = useCallback(<T extends keyof MetronomeConfig>(key: T, value: MetronomeConfig[T]) => {
    setConfig(prev => {
      const newConfig = { ...prev, [key]: value };
      
      if (metronome) {
        metronome.updateConfig(newConfig);
      }
      
      onConfigChange?.(newConfig);
      
      return newConfig;
    });
  }, [metronome, onConfigChange]);

  // Update volume for a specific sound
  const updateVolume = useCallback((soundType: string, value: number) => {
    setConfig(prev => {
      const newVolumes = { ...(prev.volumes || {}), [soundType]: value };
      const newConfig = { ...prev, volumes: newVolumes };
      
      if (metronome) {
        metronome.updateConfig(newConfig);
      }
      
      onConfigChange?.(newConfig);
      
      return newConfig;
    });
  }, [metronome, onConfigChange]);

  // This function ensures the AudioContext is resumed (browsers require user interaction)
  const ensureAudioContextStarted = useCallback(() => {
    const context = audioEngine?.getContext();
    if (audioEngine && context && context.state === 'suspended') {
      context.resume().then(() => {
        console.log('AudioContext resumed successfully');
        setAudioPermission(true);
        
        // Try playing a test sound to verify audio is working
        if (metronome) {
          metronome.playTestSound();
        }
      }).catch((err) => {
        console.error('Failed to resume AudioContext:', err);
        setError('Failed to start audio. Please try again or check browser permissions.');
      });
    } else {
      setAudioPermission(true);
    }
  }, [audioEngine, metronome]);

  const containerStyle = {
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    border: `1px solid ${theme.colors.dark[4]}`,
    backgroundColor: theme.colors.dark[6],
  };


  if (error) {
    return (
      <Box 
        style={{...containerStyle, border: '1px solid red'}}
        className={className}
      >
        <Title order={4} style={{ color: 'red' }}>Error</Title>
        <p>{error}</p>
        <Button onClick={() => window.location.reload()} mt="md">
          Reload Page
        </Button>
      </Box>
    );
  }

  if (!isLoaded) {
    return (
      <Box style={containerStyle} className={className}>
        <p>Loading metronome...</p>
      </Box>
    );
  }

  if (!audioPermission) {
    return (
      <Box style={containerStyle} className={className}>
        <Title order={3} c="red.6" fw={700} ff="Orbitron, sans-serif" tt="uppercase" mb="md">DJENTRONOME</Title>
        <Text mb="md">
          Audio requires user interaction to start. Click the button below to enable sound.
        </Text>
        <Button
          size="lg"
          color="blue"
          onClick={ensureAudioContextStarted}
        >
          Enable Audio
        </Button>
      </Box>
    );
  }

  return (
    <Box style={containerStyle} className={className}>
      <Title order={3} c="red.6" fw={700} ff="Orbitron, sans-serif" tt="uppercase" mb="md">DJENTRONOME</Title>
      
      <Stack gap="md">
        {/* Tempo control */}
        <Group align="center" gap="md">
          <Box style={{ flex: 1 }}>
            <Slider
              label={`Tempo: ${config.tempo} BPM`}
              min={40}
              max={300}
              value={config.tempo}
              onChange={(value) => updateConfig('tempo', Number(value))}
              marks={[
                { value: 60, label: '60' },
                { value: 120, label: '120' },
                { value: 180, label: '180' },
                { value: 240, label: '240' },
              ]}
            />
          </Box>
          <NumberInput
            value={config.tempo}
            onChange={(value) => updateConfig('tempo', Number(value))}
            min={40}
            max={300}
            step={1}
            style={{ width: '80px' }}
          />
        </Group>
        
        {/* Time signature */}
        <Group mt="md" mb="md">
          <NumberInput
            label="Beats Per Measure"
            value={config.beatsPerMeasure}
            onChange={(value) => updateConfig('beatsPerMeasure', Number(value))}
            min={1}
            max={16}
            style={{ width: '120px' }}
          />
          <Select
            label="Beat Unit"
            value={config.beatUnit.toString()}
            onChange={(value) => updateConfig('beatUnit', parseInt(value || '4'))}
            data={[
              { value: '2', label: '2 (Half note)' },
              { value: '4', label: '4 (Quarter note)' },
              { value: '8', label: '8 (Eighth note)' },
              { value: '16', label: '16 (Sixteenth note)' },
            ]}
            style={{ width: '160px' }}
          />
        </Group>
        
        {/* Subdivision */}
        <Group mt="md" mb="md">
          <Select
            label="Subdivision"
            value={config.subdivision.toString()}
            onChange={(value) => updateConfig('subdivision', parseInt(value || '1'))}
            data={[
              { value: '1', label: 'Quarter Notes' },
              { value: '2', label: 'Eighth Notes' },
              { value: '4', label: 'Sixteenth Notes' },
            ]}
            style={{ width: '160px' }}
          />
          <Switch
            label="Triplet Feel"
            checked={config.tripletFeel}
            onChange={(event) => updateConfig('tripletFeel', event.currentTarget.checked)}
          />
        </Group>
        
        {/* Volume controls */}
        <Box mt="md">
          <Title order={5} mb="sm">Sound Volumes</Title>
          <Stack gap="xs">
            <Slider
              label="Downbeat"
              min={0}
              max={1}
              step={0.01}
              value={config.volumes?.downbeat || 1.0}
              onChange={(value) => updateVolume('downbeat', value)}
              style={{ marginBottom: theme.spacing.xs }}
            />
            <Slider
              label="Quarter Note"
              min={0}
              max={1}
              step={0.01}
              value={config.volumes?.quarterNote || 0.8}
              onChange={(value) => updateVolume('quarterNote', value)}
              style={{ marginBottom: theme.spacing.xs }}
            />
            <Slider
              label="Subdivision"
              min={0}
              max={1}
              step={0.01}
              value={config.volumes?.subdivision || 0.6}
              onChange={(value) => updateVolume('subdivision', value)}
              style={{ marginBottom: theme.spacing.xs }}
            />
            <Slider
              label="Triplet"
              min={0}
              max={1}
              step={0.01}
              value={config.volumes?.triplet || 0.7}
              onChange={(value) => updateVolume('triplet', value)}
              style={{ marginBottom: theme.spacing.xs }}
            />
          </Stack>
        </Box>
        
        {/* Play/stop button */}
        <Button
          size="lg"
          color={isPlaying ? 'red' : 'green'}
          onClick={togglePlayback}
          style={{ marginTop: theme.spacing.md }}
        >
          {isPlaying ? 'Stop' : 'Start'} Metronome
        </Button>
      </Stack>
    </Box>
  );
};

export default Metronome; 