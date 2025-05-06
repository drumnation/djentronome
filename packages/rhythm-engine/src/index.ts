/**
 * Rhythm Engine Package
 * 
 * Provides core rhythm game mechanics including hit detection, scoring, and game state management
 * for the Djentronome project.
 * 
 * @module @djentronome/rhythm-engine
 */

// Export the RhythmEngine class
export { RhythmEngine } from './rhythm-engine';

// Export types
export {
  HitAccuracy,
  HitResult,
  GameState,
  GameStats,
  ScoringConfig,
  RhythmEngineOptions,
  InputEvent,
  RhythmEngineEvent,
  RhythmEngineEventType
} from './types'; 