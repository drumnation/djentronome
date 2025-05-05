/**
 * Core types for game-logic package
 */

/**
 * Additional types can be defined here and exported
 */

// Example of an enum that might be used in the game
export enum GamePhase {
  SETUP = 'setup',
  PLAY = 'play',
  END = 'end',
}

// Example of a type that might be used for game state
export interface GameState {
  phase: GamePhase;
  currentPlayer: number;
  turn: number;
} 