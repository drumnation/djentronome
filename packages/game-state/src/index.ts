/**
 * Game State management using Zustand
 */
import { create } from 'zustand';

/**
 * Game state interface
 */
export interface GameState {
  /**
   * Current score in the game
   */
  score: number;
  /**
   * Whether the game is currently paused
   */
  isPaused: boolean;
  /**
   * Current combo multiplier
   */
  combo: number;
  /**
   * Actions to update the game state
   */
  actions: {
    /**
     * Increase the score by the given amount
     */
    addScore: (points: number) => void;
    /**
     * Reset the score to zero
     */
    resetScore: () => void;
    /**
     * Toggle the paused state
     */
    togglePause: () => void;
    /**
     * Set whether the game is paused
     */
    setPaused: (isPaused: boolean) => void;
    /**
     * Increment the combo counter
     */
    incrementCombo: () => void;
    /**
     * Reset the combo counter
     */
    resetCombo: () => void;
  };
}

/**
 * Create the game state store
 */
export const useGameState = create<GameState>((set) => ({
  score: 0,
  isPaused: false,
  combo: 0,
  actions: {
    addScore: (points) => set((state) => ({ 
      score: state.score + points * state.combo 
    })),
    resetScore: () => set({ score: 0 }),
    togglePause: () => set((state) => ({ 
      isPaused: !state.isPaused 
    })),
    setPaused: (isPaused) => set({ isPaused }),
    incrementCombo: () => set((state) => ({ 
      combo: state.combo + 1 
    })),
    resetCombo: () => set({ combo: 1 })
  }
}));

export default useGameState;
