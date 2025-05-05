/**
 * Core Logic Package
 * 
 * This package provides core game rules and mechanics for the Djentronome project.
 */

/**
 * Represents move data in the game
 */
export interface MoveData {
  type: string;
  [key: string]: any;
}

/**
 * GameRules class for handling game rules and mechanics
 */
export class GameRules {
  /**
   * Validates if a move is legal according to the game rules
   * @param moveData The move data to validate
   * @returns true if the move is valid, false otherwise
   */
  validateMove(moveData: MoveData): boolean {
    // This is a simple placeholder implementation
    // Real implementation would have actual game rules
    return moveData.type === 'valid';
  }
}

// Export all types
export * from './types';
