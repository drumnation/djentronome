import React, { useState, useEffect, useCallback } from 'react';
import { Box, Group, Button, useMantineTheme } from '@mantine/core';
import { NoteHighwayCanvas } from '../NoteHighwayCanvas';
import { Metronome } from '../../Metronome';
import { AudioEngine } from '../../../../../../packages/core-audio/src';
import { Metronome as MetronomeService, MetronomeConfig } from '../../../../../../packages/sound/src';
import { GameplayAreaWithMetronomeProps } from './GameplayAreaWithMetronome.types';

/**
 * GameplayAreaWithMetronome combines the NoteHighwayCanvas with Metronome control
 * for synchronized gameplay with audio
 */
export const GameplayAreaWithMetronome: React.FC<GameplayAreaWithMetronomeProps> = ({
  width = window.innerWidth,
  height = window.innerHeight * 0.8,
  initialBpm = 120,
  initialBeatsPerMeasure = 4,
  initialSubdivision = 1,
  initialTripletFeel = false,
  canvasChildren,
  metronomePosition = 'bottom',
  hideMetronome = false,
  onBpmChange,
}) => {
  const theme = useMantineTheme();
  const [bpm, setBpm] = useState(initialBpm);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioEngine, setAudioEngine] = useState<AudioEngine | null>(null);
  const [metronomeService, setMetronomeService] = useState<MetronomeService | null>(null);

  // Initialize audio engine and metronome service
  useEffect(() => {
    const initAudio = async () => {
      try {
        const engine = new AudioEngine({ masterVolume: 0.8 });
        await engine.initialize();
        
        const metronome = new MetronomeService(engine, {
          tempo: initialBpm,
          beatsPerMeasure: initialBeatsPerMeasure,
          beatUnit: 4,
          subdivision: initialSubdivision,
          tripletFeel: initialTripletFeel,
        });
        
        await metronome.loadSounds();
        
        setAudioEngine(engine);
        setMetronomeService(metronome);
      } catch (error) {
        console.error('Failed to initialize audio:', error);
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
    if (!metronomeService) return;
    
    if (isPlaying) {
      metronomeService.stop();
      setIsPlaying(false);
    } else {
      metronomeService.start();
      setIsPlaying(true);
    }
  }, [metronomeService, isPlaying]);

  // Handle BPM change from metronome component
  const handleMetronomeConfigChange = useCallback((config: MetronomeConfig) => {
    setBpm(config.tempo);
    
    // Call onBpmChange if provided
    if (onBpmChange) {
      onBpmChange(config.tempo);
    }
  }, [onBpmChange]);

  return (
    <Box
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column' as const,
        overflow: 'hidden',
        backgroundColor: '#070707',
      }}
    >
      {/* Note Highway Canvas */}
      <Box
        style={{
          flex: 1,
          position: 'relative' as const,
          width: '100%',
        }}
      >
        <NoteHighwayCanvas 
          width={width}
          height={metronomePosition === 'side' ? height : height * 0.8}
          bpm={bpm}
        >
          {canvasChildren}
        </NoteHighwayCanvas>
      </Box>
      
      {/* Metronome Component - positioned based on metronomePosition prop */}
      {!hideMetronome && (
        <Box
          style={
            metronomePosition === 'bottom'
              ? {
                  position: 'relative' as const,
                  zIndex: 10,
                  backdropFilter: 'blur(8px)',
                  backgroundColor: 'rgba(10, 10, 10, 0.7)',
                  borderTop: `1px solid ${theme.colors.dark[6]}`,
                  borderBottom: `1px solid ${theme.colors.dark[8]}`,
                  boxShadow: '0 -5px 15px rgba(0,0,0,0.5)',
                  width: '100%',
                  maxHeight: '300px',
                  overflowY: 'auto' as const,
                }
              : {
                  position: 'absolute' as const,
                  top: '20px',
                  right: '20px',
                  width: '350px',
                  maxWidth: 'calc(100% - 40px)',
                  borderRadius: theme.radius.md,
                  boxShadow: '0 0 20px rgba(0,0,0,0.7)',
                  zIndex: 10,
                  backdropFilter: 'blur(8px)',
                  backgroundColor: 'rgba(10, 10, 10, 0.7)',
                  borderTop: `1px solid ${theme.colors.dark[6]}`,
                  borderBottom: `1px solid ${theme.colors.dark[8]}`,
                }
          }
        >
          <Metronome 
            initialConfig={{
              tempo: bpm,
              beatsPerMeasure: initialBeatsPerMeasure,
              beatUnit: 4,
              subdivision: initialSubdivision,
              tripletFeel: initialTripletFeel,
            }}
            onConfigChange={handleMetronomeConfigChange}
            onPlayStateChange={setIsPlaying}
          />
        </Box>
      )}
      
      {/* Quick controls - always visible for gameplay */}
      <Box
        style={{
          position: 'absolute' as const,
          top: '20px',
          left: '20px',
          zIndex: 20,
          padding: theme.spacing.md,
          backgroundColor: 'rgba(10, 10, 10, 0.7)',
          backdropFilter: 'blur(8px)',
          borderRadius: theme.radius.md,
          boxShadow: '0 0 15px rgba(0,0,0,0.5)',
        }}
      >
        <Group>
          <Button
            color={isPlaying ? 'red' : 'green'}
            onClick={togglePlayback}
            size="md"
            radius="md"
          >
            {isPlaying ? 'Stop' : 'Start'}
          </Button>
        </Group>
      </Box>
    </Box>
  );
};

export default GameplayAreaWithMetronome; 