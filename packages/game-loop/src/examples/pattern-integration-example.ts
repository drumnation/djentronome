/**
 * Example: Game Loop + Pattern Player Integration
 * 
 * This example demonstrates how to use the GameLoopPatternIntegration class
 * to synchronize rhythm pattern playback with the game loop.
 */

import { GameLoop, GameLoopPatternIntegration } from '../index';
import { PatternLoader, PatternPlayer } from '@djentronome/pattern-loader';

// Path to an example pattern file
const PATTERN_FILE_PATH = '/path/to/example-pattern.json';

/**
 * Initialize the game with pattern integration
 */
async function initGame() {
  console.log('Initializing game...');
  
  // Create a pattern loader
  const patternLoader = new PatternLoader({
    basePath: 'assets/patterns', // Base path for pattern files
    enableCache: true            // Enable caching for better performance
  });
  
  // Create a pattern player
  const patternPlayer = new PatternPlayer(patternLoader, {
    autoStart: false,  // Don't auto-start when pattern is loaded
    loop: true         // Loop the pattern
  });
  
  // Create the game loop
  const gameLoop = new GameLoop({
    fps: 60, // Target 60 FPS
    update: (_deltaTime) => {
      // Game state updates would go here
      // (integration handles pattern player updates)
    },
    render: (_deltaTime, _interpolation) => {
      // Render game state
      // Use interpolation for smooth rendering
    }
  });
  
  // Create the integration between game loop and pattern player
  const integration = new GameLoopPatternIntegration(gameLoop, patternPlayer, {
    autoStartWithLoop: true,  // Start pattern when game loop starts
    lookAheadTime: 500,       // Look ahead 500ms for upcoming notes
    triggerBuffer: 10         // Trigger notes 10ms early for better timing
  });
  
  // Initialize the integration
  integration.initialize();
  
  // Handle note triggers
  integration.onNoteTrigger((note) => {
    console.log(`Note triggered: ${note.type} at ${note.time}ms`);
    
    // Here you would:
    // - Play the corresponding sound
    // - Update visual feedback
    // - Check for player input
    // - Update score, etc.
  });
  
  // Handle section changes
  integration.onSectionChange((section) => {
    console.log(`Section changed to: ${section.name}`);
    
    // Here you would:
    // - Update UI to show current section
    // - Maybe change visuals or effects
  });
  
  // Handle pattern completion
  integration.onPatternComplete(() => {
    console.log('Pattern completed!');
    
    // Here you would:
    // - Move to next pattern
    // - Show score screen
    // - etc.
  });
  
  try {
    // Load a pattern
    console.log('Loading pattern...');
    await integration.loadPatternFromPath(PATTERN_FILE_PATH);
    console.log('Pattern loaded successfully');
    
    // Start the game loop (which will also start the pattern player)
    gameLoop.start();
    console.log('Game started!');
    
    // You can control playback with these commands:
    // gameLoop.pause() - Pauses both the game loop and pattern player
    // gameLoop.resume() - Resumes both
    // gameLoop.stop() - Stops both
    
    // You can also directly control the pattern player if needed:
    // integration.getPatternPlayer().setPlaybackRate(0.5); // Slow down to half speed
    
    // Cleanup when done
    // integration.cleanup();
  } catch (error) {
    console.error('Error initializing game:', error);
  }
}

// Initialize the game when the page loads
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    initGame().catch(error => {
      console.error('Error initializing game:', error);
    });
  });
}

// For modules that support direct execution
if (require.main === module) {
  initGame().catch(error => {
    console.error('Error initializing game:', error);
  });
} 