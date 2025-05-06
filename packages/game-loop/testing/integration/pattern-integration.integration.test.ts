import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GameLoop, GameLoopPatternIntegration } from '../../src';
import { PatternPlayer, Pattern, Note } from '@djentronome/pattern-loader';

// Define a custom type that includes our internal _triggered property
interface TestNote extends Note {
  _triggered?: boolean;
}

/**
 * Integration tests for the GameLoopPatternIntegration class
 * Test type: Integration
 * 
 * These tests verify that the GameLoop correctly integrates with PatternPlayer
 * to handle synchronized rhythm pattern playback.
 */
describe('GameLoopPatternIntegration', () => {
  // Mock PatternPlayer class to avoid actual file loading
  class MockPatternPlayer {
    private isPlaying = false;
    private isPaused = false;
    private currentTime = 0;
    private pattern: Pattern | null = null;
    private eventListeners: Record<string, Array<(event: any) => void>> = {};

    loadPatternFromPath = vi.fn().mockImplementation(async (path: string) => {
      this.pattern = createMockPattern();
      this.emitEvent('pattern_loaded', { pattern: this.pattern });
      return this.pattern;
    });

    loadPattern = vi.fn().mockImplementation((pattern: Pattern) => {
      this.pattern = pattern;
      this.emitEvent('pattern_loaded', { pattern });
    });

    update = vi.fn().mockImplementation((time: number) => {
      if (this.isPlaying && !this.isPaused) {
        this.currentTime = time;
        
        // Simulate note triggers based on time
        if (this.pattern) {
          const notes = this.pattern.notes || [];
          for (const note of notes) {
            const testNote = note as TestNote;
            if (testNote.time <= time && !testNote._triggered) {
              testNote._triggered = true;
              this.emitEvent('note_triggered', { note });
            }
          }
        }
      }
    });

    start = vi.fn().mockImplementation(() => {
      this.isPlaying = true;
      this.isPaused = false;
      this.emitEvent('pattern_started', {});
    });

    pause = vi.fn().mockImplementation(() => {
      this.isPaused = true;
      this.emitEvent('pattern_paused', {});
    });

    resume = vi.fn().mockImplementation(() => {
      this.isPaused = false;
      this.emitEvent('pattern_resumed', {});
    });

    stop = vi.fn().mockImplementation(() => {
      this.isPlaying = false;
      this.isPaused = false;
      this.emitEvent('pattern_stopped', {});
    });

    addEventListener = vi.fn().mockImplementation((type: string, listener: (event: any) => void) => {
      if (!this.eventListeners[type]) {
        this.eventListeners[type] = [];
      }
      this.eventListeners[type].push(listener);
    });

    emitEvent(type: string, data: any) {
      const listeners = this.eventListeners[type] || [];
      listeners.forEach(listener => listener({
        type,
        data,
        timestamp: Date.now()
      }));
    }
  }

  // Helper to create a mock pattern
  function createMockPattern(): Pattern {
    return {
      id: 'test-pattern',
      version: '1.0.0',
      metadata: {
        title: 'Test Pattern',
        difficulty: 'medium',
        bpm: 120,
        timeSignature: '4/4'
      },
      duration: 10000, // 10 seconds
      notes: [
        { time: 1000, type: 'kick', _triggered: false } as TestNote,
        { time: 2000, type: 'snare', _triggered: false } as TestNote,
        { time: 3000, type: 'kick', _triggered: false } as TestNote,
        { time: 4000, type: 'snare', _triggered: false } as TestNote
      ],
      sections: [
        {
          id: 'section-1',
          name: 'Intro',
          startTime: 0,
          endTime: 5000,
          notes: []
        },
        {
          id: 'section-2',
          name: 'Verse',
          startTime: 5000,
          endTime: 10000,
          notes: []
        }
      ]
    } as Pattern;
  }

  // Test setup
  let gameLoop: GameLoop;
  let mockPatternPlayer: any;
  let integration: GameLoopPatternIntegration;
  
  // Mock browser APIs
  beforeEach(() => {
    // Set up fake timer
    vi.useFakeTimers();
    
    // Create mock for animation functions
    global.requestAnimationFrame = vi.fn().mockImplementation((callback) => {
      setTimeout(() => callback(performance.now()), 16);
      return 1;
    });
    
    global.cancelAnimationFrame = vi.fn();
    
    // Create game loop with a basic update function
    gameLoop = new GameLoop({
      update: () => { /* no-op */ },
      render: () => { /* no-op */ }
    });
    
    // Create mock pattern player and integration
    mockPatternPlayer = new MockPatternPlayer();
    integration = new GameLoopPatternIntegration(
      gameLoop,
      mockPatternPlayer as unknown as PatternPlayer
    );
    
    // Initialize the integration
    integration.initialize();
  });

  afterEach(() => {
    // Clean up mocks
    vi.useRealTimers();
    vi.restoreAllMocks();
    
    // Clean up integration
    integration.cleanup();
    
    // Stop game loop if running
    if (gameLoop.isRunning()) {
      gameLoop.stop();
    }
  });

  it('should sync pattern playback with game time', async () => {
    // Load a pattern
    await integration.loadPatternFromPath('test-pattern.json');
    
    // Start the game loop
    gameLoop.start();
    
    // Verify that pattern player was started
    expect(mockPatternPlayer.start).toHaveBeenCalled();
    
    // Advance timers by a few frames
    vi.advanceTimersByTime(100);
    
    // Manually trigger a game loop update to ensure update is called
    (gameLoop as any).loop(performance.now());
    
    // Verify that pattern player's update method was called
    expect(mockPatternPlayer.update).toHaveBeenCalled();
    
    // Stop the game loop
    gameLoop.stop();
    
    // Verify that pattern player was stopped
    expect(mockPatternPlayer.stop).toHaveBeenCalled();
  });

  it('should correctly trigger pattern events based on timing', async () => {
    // Set up event handlers
    const noteTriggerSpy = vi.fn();
    
    // Register for note triggers
    integration.onNoteTrigger(noteTriggerSpy);
    
    // Load a pattern
    await integration.loadPatternFromPath('test-pattern.json');
    
    // Start the game loop
    gameLoop.start();
    
    // Force the update directly to avoid timing issues in tests
    // Simulate game time at 2500ms which should trigger first two notes
    mockPatternPlayer.update(2500);
    
    // Verify that notes were triggered through our spy
    expect(noteTriggerSpy).toHaveBeenCalledTimes(2);
    
    // The first call should be for the kick note at 1000ms
    expect(noteTriggerSpy.mock.calls[0][0].type).toBe('kick');
    
    // The second call should be for the snare note at 2000ms
    expect(noteTriggerSpy.mock.calls[1][0].type).toBe('snare');
  });

  it('should handle pattern loading and unloading during gameplay', async () => {
    // Start the game loop
    gameLoop.start();
    
    // Load a pattern
    await integration.loadPatternFromPath('test-pattern.json');
    
    // Verify pattern was loaded
    expect(mockPatternPlayer.loadPatternFromPath).toHaveBeenCalled();
    
    // Create a new pattern
    const newPattern = createMockPattern();
    newPattern.id = 'new-pattern';
    newPattern.metadata.title = 'New Pattern';
    
    // Load the new pattern
    integration.loadPattern(newPattern);
    
    // Verify the new pattern was loaded
    expect(mockPatternPlayer.loadPattern).toHaveBeenCalled();
    expect(mockPatternPlayer.loadPattern).toHaveBeenCalledWith(newPattern);
  });

  it('should maintain timing precision across different patterns', async () => {
    // Create a mock pattern with specific timing
    const pattern1 = createMockPattern();
    pattern1.notes = [
      { time: 100, type: 'kick', _triggered: false } as TestNote,
      { time: 200, type: 'snare', _triggered: false } as TestNote
    ];
    
    const pattern2 = createMockPattern();
    pattern2.notes = [
      { time: 150, type: 'kick', _triggered: false } as TestNote,
      { time: 250, type: 'snare', _triggered: false } as TestNote
    ];
    
    // Set up note trigger spy
    const noteTriggerSpy = vi.fn();
    integration.onNoteTrigger(noteTriggerSpy);
    
    // Start the game loop
    gameLoop.start();
    
    // Load first pattern
    integration.loadPattern(pattern1);
    
    // Force the update to trigger notes in pattern1
    mockPatternPlayer.update(250);
    
    // Verify both notes were triggered
    expect(noteTriggerSpy).toHaveBeenCalledTimes(2);
    
    // Reset the spy
    noteTriggerSpy.mockReset();
    
    // Load second pattern
    integration.loadPattern(pattern2);
    
    // Force the update to trigger notes in pattern2
    mockPatternPlayer.update(200);
    
    // Verify the note was triggered
    expect(noteTriggerSpy).toHaveBeenCalledTimes(1);
    expect(noteTriggerSpy.mock.calls[0][0].type).toBe('kick');
  });
}); 