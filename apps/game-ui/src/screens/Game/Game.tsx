import React, { useState } from 'react';
import { Box } from '@mantine/core';
import { GameplayAreaWithMetronome } from '../../components/gameplay/GameplayAreaWithMetronome';
import { DjentAnimatedElement } from '../../components/gameplay/NoteHighwayCanvas/components/DjentAnimatedElement/DjentAnimatedElement';

/**
 * Game screen component for rhythm gameplay
 */
export const Game: React.FC = () => {
  const [bpm, setBpm] = useState(120);

  const handleBpmChange = (newBpm: number) => {
    setBpm(newBpm);
  };

  return (
    <Box style={{ width: '100%', height: '100vh' }}>
      <GameplayAreaWithMetronome
        width={window.innerWidth}
        height={window.innerHeight}
        initialBpm={bpm}
        initialBeatsPerMeasure={4}
        initialSubdivision={2}
        metronomePosition="bottom"
        onBpmChange={handleBpmChange}
        canvasChildren={
          <DjentAnimatedElement initialBpm={bpm} />
        }
      />
    </Box>
  );
};

export default Game; 