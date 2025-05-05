# Game State Package

State management for the Djentronome rhythm game using Zustand.

## Features

- Centralized game state management
- Score tracking with combo system
- Game pause functionality
- Fully typed state and actions

## Usage

```typescript
import { useGameState } from '@djentronome/game-state';

// Access the current state
const { score, isPaused, combo, actions } = useGameState();

// Or get the state directly in a component
function ScoreDisplay() {
  const score = useGameState(state => state.score);
  return <div>Score: {score}</div>;
}

// Update the state using actions
function GameControls() {
  const { togglePause, addScore, incrementCombo, resetCombo } = useGameState(state => state.actions);
  
  const onHitNote = () => {
    addScore(100); // Add points
    incrementCombo(); // Increase combo multiplier
  };
  
  const onMissNote = () => {
    resetCombo(); // Reset combo on miss
  };
  
  return (
    <button onClick={togglePause}>
      Pause/Resume
    </button>
  );
}
```

## API

### State

- `score: number` - Current player score
- `isPaused: boolean` - Whether the game is paused
- `combo: number` - Current combo multiplier
- `actions` - Object containing all state update functions

### Actions

- `addScore(points: number)` - Add points to score (multiplied by current combo)
- `resetScore()` - Reset score to zero
- `togglePause()` - Toggle paused state
- `setPaused(isPaused: boolean)` - Set paused state directly
- `incrementCombo()` - Increase combo multiplier
- `resetCombo()` - Reset combo multiplier to 1 