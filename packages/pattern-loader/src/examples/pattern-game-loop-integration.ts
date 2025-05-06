/**
 * Example: Pattern Player Integration with Game Loop
 * 
 * This example demonstrates how to integrate the PatternPlayer with
 * the GameLoop to synchronize rhythm pattern playback with game timing.
 */

import { GameLoop, GameLoopEventType } from '../../../game-loop/src';
import { PatternLoader, PatternPlayer, PatternPlayerEventType } from '@djentronome/pattern-loader';

// Example pattern file path
const PATTERN_FILE_PATH = '/patterns/example-pattern.json';

/**
 * Initialize the game and pattern playback
 */
async function initializeGame() {
  // Create a pattern loader and player
  const patternLoader = new PatternLoader({
    basePath: 'assets', // Base path for pattern files
    enableCache: true   // Enable caching for better performance
  });
  
  const patternPlayer = new PatternPlayer(patternLoader, {
    lookAheadTime: 500, // Look ahead 500ms for upcoming notes
    triggerBuffer: 10   // Trigger notes 10ms early for better timing
  });
  
  // Set up event listeners for pattern events
  patternPlayer.addEventListener(PatternPlayerEventType.NOTE_TRIGGERED, (event) => {
    const note = event.data.note;
    console.log(`Note triggered: ${note.type} at ${note.time}ms`);
    
    // Here you would:
    // - Play the corresponding sound
    // - Update visual feedback
    // - Trigger haptic feedback, etc.
  });
  
  patternPlayer.addEventListener(PatternPlayerEventType.SECTION_CHANGED, (event) => {
    const section = event.data.section;
    console.log(`Section changed to: ${section.name}`);
    
    // Here you would:
    // - Update UI to show current section
    // - Maybe change visuals or effects
  });
  
  // Create the game loop
  const gameLoop = new GameLoop({
    fps: 60, // Target 60 FPS
    update: (deltaTime: number) => {
      // Update pattern player with current game time
      patternPlayer.update(gameLoop.getTimeProvider().getTime());
      
      // Example: Use deltaTime for framerate-independent physics or animations
      console.log(`Update with deltaTime: ${deltaTime}ms`);
    },
    render: (_deltaTime: number, interpolation: number) => {
      // Render game state
      // Example: Use interpolation for smooth rendering between updates
      console.log(`Render with interpolation: ${interpolation}`);
    }
  });
  
  // Add event listeners for game loop events
  gameLoop.on(GameLoopEventType.UPDATE, () => {
    // Additional update logic if needed
  });
  
  // Load a pattern
  try {
    console.log('Loading pattern...');
    await patternPlayer.loadPatternFromPath(PATTERN_FILE_PATH);
    console.log('Pattern loaded successfully');
    
    // Start the game loop and pattern playback
    gameLoop.start();
    patternPlayer.start();
    
    console.log('Game started!');
  } catch (error) {
    console.error('Failed to load pattern:', error);
  }
}

// Initialize the game when the page loads
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    initializeGame().catch(error => {
      console.error('Error initializing game:', error);
    });
  });
} 