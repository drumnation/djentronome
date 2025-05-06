import React from 'react';
import { 
  Paper, 
  Stack, 
  Text, 
  Slider, 
  Switch, 
  Button,
  Box,
  Group,
  Select,
  Code,
} from '@mantine/core';
import { IconPlayerPlay, IconPlayerStop, IconVolume, IconRefresh } from '@tabler/icons-react';
import { KickPatternVisualizerProps } from './KickPatternVisualizer.types';
import { useKickPatternVisualizer } from './KickPatternVisualizer.hook';
import { KICK_SAMPLES } from './KickPatternVisualizer.constants';
import { styles } from './KickPatternVisualizer.styles';

export const KickPatternVisualizer: React.FC<KickPatternVisualizerProps> = ({
  pattern: initialPattern,
  bpm: initialBpm = 166
}) => {
  const {
    // State
    bpm,
    dominance,
    showComparison,
    isPlaying,
    selectedKickSample,
    currentPlayingIndex,
    audioInitialized,
    loadingSample,
    errorMessage,
    audioContextState,
    pattern,
    footAssignments,
    notesByMeasure,
    measures,
    
    // Actions
    setBpm,
    setDominance,
    setShowComparison,
    setSelectedKickSample,
    initializeAudio,
    playTestSound,
    togglePlayback,
    generateNewPattern,
  } = useKickPatternVisualizer(initialPattern, initialBpm);

  // Destructure footAssignments for cleaner code
  const { improved, alternating } = footAssignments;
  
  return (
    <Paper p="md" shadow="sm">
      <Stack>
        <Text size="xl" fw={700}>Kick Drum Foot Pattern Visualizer</Text>
        
        <Group justify="space-between">
          <Box>
            <Text>BPM: {bpm}</Text>
            <Slider
              value={bpm}
              onChange={setBpm}
              min={80}
              max={220}
              step={1}
              style={{ width: 200 }}
              marks={[
                { value: 100, label: '100' },
                { value: 160, label: '160' },
                { value: 200, label: '200' },
              ]}
            />
          </Box>
          
          <Group>
            <Text>Dominant Foot:</Text>
            <Switch
              checked={dominance === 'right'}
              onChange={() => setDominance(dominance === 'right' ? 'left' : 'right')}
              label={dominance === 'right' ? 'Right' : 'Left'}
            />
          </Group>
          
          <Switch
            checked={showComparison}
            onChange={() => setShowComparison(!showComparison)}
            label="Show Comparison"
          />
        </Group>
        
        <Group>
          <Button
            onClick={initializeAudio}
            leftSection={<IconRefresh size={16} />}
            color="blue"
            loading={loadingSample}
            disabled={audioInitialized && audioContextState === 'running'}
          >
            Initialize Audio
          </Button>
          
          <Button
            onClick={playTestSound}
            leftSection={<IconVolume size={16} />}
            variant="outline"
            disabled={!audioInitialized || audioContextState !== 'running'}
          >
            Test Sound
          </Button>
          
          <Code>Audio state: {audioContextState}</Code>
        </Group>
        
        <Group>
          <Select
            label="Kick Drum Sample"
            data={KICK_SAMPLES.map(sample => ({ value: sample.value, label: sample.label }))}
            value={selectedKickSample}
            onChange={(value) => value && setSelectedKickSample(value)}
            style={{ width: 250 }}
            disabled={!audioInitialized}
          />
          
          <Button 
            onClick={togglePlayback}
            leftSection={isPlaying ? <IconPlayerStop size={16} /> : <IconPlayerPlay size={16} />}
            color={isPlaying ? "red" : "green"}
            style={{ alignSelf: 'flex-end' }}
            disabled={!audioInitialized || audioContextState !== 'running'}
          >
            {isPlaying ? 'Stop' : 'Play Pattern'}
          </Button>
        </Group>
        
        {errorMessage && (
          <Paper p="xs" withBorder color="red">
            <Text c="red" size="sm">{errorMessage}</Text>
          </Paper>
        )}
        
        <Group>
          <Button onClick={() => generateNewPattern('simple')}>Simple Pattern</Button>
          <Button onClick={() => generateNewPattern('moderate')}>Moderate Pattern</Button>
          <Button onClick={() => generateNewPattern('complex')}>Complex Djent Pattern</Button>
        </Group>
        
        {measures.map(measure => (
          <Paper key={measure} p="sm" withBorder>
            <Text fw={600} mb="xs">Measure {measure + 1}</Text>
            
            <Group gap={2} mb="md">
              {[...Array(16)].map((_, i) => {
                // Determine the style for grid cells based on beat position
                const isEndOfBeat = i % 4 === 3;
                const isHalfBeat = i % 2 === 1;
                const isDownBeat = i % 4 === 0;
                
                return (
                  <Box 
                    key={i} 
                    style={{
                      ...styles.gridCell,
                      ...(isEndOfBeat ? styles.beatMarker : 
                          isHalfBeat ? styles.halfBeatMarker : styles.fractionalBeatMarker),
                      ...(isDownBeat ? styles.downBeatCell : {})
                    }}
                  >
                    {isDownBeat ? (i / 4) + 1 : ''}
                  </Box>
                );
              })}
            </Group>
            
            <Stack gap="xs">
              <Group justify="space-between" style={{ width: '100%' }}>
                <Text size="sm" fw={600} c="#0055cc">Smart Algorithm</Text>
                <Text size="xs">({dominance}-foot dominant)</Text>
              </Group>
              
              <Box 
                style={{ 
                  ...styles.visualizerContainer,
                  ...styles.improvedPatternContainer
                }}
              >
                {notesByMeasure[measure] && notesByMeasure[measure].map((note) => {
                  const foot = improved[note.id];
                  const position = (note.beat / 4) * 100;
                  
                  // Determine if this note is currently playing
                  const sortedNotes = [...pattern].sort((a, b) => {
                    return (a.measure * 4 + a.beat) - (b.measure * 4 + b.beat);
                  });
                  const noteIndex = sortedNotes.findIndex(n => n.id === note.id);
                  const isCurrentlyPlaying = currentPlayingIndex === noteIndex;
                  
                  return (
                    <Box
                      key={`improved-${note.id}`}
                      style={{
                        ...styles.kickNote,
                        ...(foot === 'right' ? styles.rightFootNote : styles.leftFootNote),
                        ...(isCurrentlyPlaying ? styles.currentlyPlayingNote : {}),
                        left: `${position}%`,
                      }}
                    >
                      {foot === 'right' ? 'R' : 'L'}
                    </Box>
                  );
                })}
              </Box>
              
              {showComparison && (
                <>
                  <Text size="sm" fw={600} c="#880000" mt="xs">Basic Alternating</Text>
                  
                  <Box 
                    style={{ 
                      ...styles.visualizerContainer,
                      ...styles.alternatingPatternContainer
                    }}
                  >
                    {notesByMeasure[measure] && notesByMeasure[measure].map(note => {
                      const foot = alternating[note.id];
                      const position = (note.beat / 4) * 100;
                      return (
                        <Box
                          key={`alternating-${note.id}`}
                          style={{
                            ...styles.kickNote,
                            ...(foot === 'right' ? styles.rightFootNote : styles.leftFootNote),
                            left: `${position}%`,
                          }}
                        >
                          {foot === 'right' ? 'R' : 'L'}
                        </Box>
                      );
                    })}
                  </Box>
                </>
              )}
            </Stack>
          </Paper>
        ))}
        
        <Paper p="sm" withBorder>
          <Text fw={600} size="sm" mb="xs">Analysis</Text>
          <Text size="sm">
            This visualization demonstrates two different approaches to assigning feet for kick drum patterns. 
            The smart algorithm considers timing, recovery time, and dominant foot preferences, while the basic 
            approach simply alternates feet. Notice how the smart algorithm tends to place your dominant foot ({dominance}) 
            on the strong beats and adjusts for bursts of notes.
          </Text>
        </Paper>
      </Stack>
    </Paper>
  );
};

export default KickPatternVisualizer; 