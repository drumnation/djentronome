import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RhythmEngine } from './rhythm-engine';
import { HitAccuracy, GameState } from './types';
import { Pattern, Note, DifficultyLevel } from '@djentronome/pattern-loader';
import { MIDIMessage } from '@djentronome/core-midi';

// Mock the dependencies
vi.mock('@djentronome/core-midi', () => ({
  MIDIHandler: vi.fn().mockImplementation(() => ({
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    connect: vi.fn().mockResolvedValue(true)
  })),
  MIDIMessage: class MockMIDIMessage {
    type: string;
    note: number;
    velocity: number;
    timestamp: number;

    constructor(data: any) {
      this.type = data.type || 'noteon';
      this.note = data.note || 36;
      this.velocity = data.velocity || 0.8;
      this.timestamp = data.timestamp || Date.now();
    }
  }
}));

vi.mock('@djentronome/pattern-loader', () => ({
  PatternLoader: vi.fn().mockImplementation(() => ({
    loadPattern: vi.fn().mockResolvedValue({})
  })),
  DifficultyLevel: {
    MEDIUM: 'medium'
  },
  Pattern: class MockPattern {
    id: string;
    duration: number;
    notes: Note[];
    
    constructor(data: any) {
      this.id = data.id || 'test-pattern';
      this.duration = data.duration || 10000;
      this.notes = data.notes || [];
    }
  },
  Note: class MockNote {
    time: number;
    type: string;
    midiNote: number;
    
    constructor(data: any) {
      this.time = data.time || 0;
      this.type = data.type || 'kick';
      this.midiNote = data.midiNote || 36;
    }
  }
}));

// Sample pattern for testing
const samplePattern: Pattern = {
  id: 'test-pattern',
  version: '1.0',
  metadata: {
    title: 'Test Pattern',
    difficulty: DifficultyLevel.MEDIUM,
    bpm: 120,
    timeSignature: '4/4'
  },
  duration: 10000,
  notes: [
    { time: 1000, type: 'kick', midiNote: 36 } as Note,
    { time: 2000, type: 'snare', midiNote: 38 } as Note,
    { time: 3000, type: 'kick', midiNote: 36 } as Note,
    { time: 4000, type: 'snare', midiNote: 38 } as Note
  ]
};

// Mock current time for testing
let mockNow = 0;
vi.spyOn(Date, 'now').mockImplementation(() => mockNow);

describe('RhythmEngine', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockNow = 0;
  });

  it('should initialize with default options', () => {
    const engine = new RhythmEngine();
    expect(engine).toBeDefined();
    expect(engine.getState()).toBe(GameState.IDLE);
  });

  it('should initialize with custom options', () => {
    const engine = new RhythmEngine({
      latencyOffset: 50,
      autoHandleMisses: true,
      lookAheadTime: 200,
      scoringConfig: {
        perfectWindow: 30
      }
    });
    expect(engine).toBeDefined();
    expect(engine.getOptions().latencyOffset).toBe(50);
    expect(engine.getOptions().autoHandleMisses).toBe(true);
  });

  it('should load a pattern', () => {
    const engine = new RhythmEngine();
    engine.loadPattern(samplePattern);
    
    expect(engine.getPattern()).toEqual(samplePattern);
    expect(engine.getState()).toBe(GameState.IDLE);
  });

  it('should start and stop the game', () => {
    const engine = new RhythmEngine();
    engine.loadPattern(samplePattern);
    
    // Mock game loop
    const startMock = vi.fn();
    const stopMock = vi.fn();
    (engine as any).gameLoop = {
      start: startMock,
      stop: stopMock
    };
    
    engine.start();
    expect(engine.getState()).toBe(GameState.PLAYING);
    expect(startMock).toHaveBeenCalled();
    
    engine.stop();
    expect(engine.getState()).toBe(GameState.PAUSED);
    expect(stopMock).toHaveBeenCalled();
  });

  it('should process input and detect hits', () => {
    const engine = new RhythmEngine({
      // Make the hit window large for testing
      scoringConfig: {
        perfectWindow: 50,
        greatWindow: 100,
        goodWindow: 150,
        okayWindow: 200
      }
    });
    engine.loadPattern(samplePattern);
    
    // Register a callback for hit events
    const hitCallback = vi.fn();
    engine.addEventListener('hit', hitCallback);
    
    // Set current time close to the first note
    mockNow = 990; // 10ms before the note
    
    // Process MIDI input that matches the first note
    const midiMessage = new MIDIMessage({
      type: 'noteon',
      note: 36, // Kick drum
      velocity: 0.8,
      timestamp: mockNow
    });
    
    engine.processInput({
      type: 'midi',
      value: midiMessage.note,
      timestamp: mockNow,
      velocity: midiMessage.velocity,
      originalEvent: midiMessage
    });
    
    // Should detect a hit with PERFECT accuracy
    expect(hitCallback).toHaveBeenCalled();
    const hitResult = hitCallback.mock.calls[0][0].data;
    expect(hitResult.hit).toBe(true);
    expect(hitResult.accuracy).toBe(HitAccuracy.PERFECT);
    expect(hitResult.timeDelta).toBe(-10); // 10ms early
    expect(hitResult.note.midiNote).toBe(36);
  });

  it('should handle misses when autoHandleMisses is true', () => {
    const engine = new RhythmEngine({
      autoHandleMisses: true
    });
    engine.loadPattern(samplePattern);
    
    // Register a callback for miss events
    const missCallback = vi.fn();
    engine.addEventListener('miss', missCallback);
    
    // Mock the update method to trigger miss handling
    (engine as any).update = vi.fn().mockImplementation((currentTime) => {
      (engine as any).handleMisses(currentTime);
    });
    
    // Set current time past the first note
    mockNow = 1500; // 500ms after the first note
    
    // Call update manually (normally called by the game loop)
    (engine as any).update(mockNow);
    
    // Should detect a miss for the first note
    expect(missCallback).toHaveBeenCalled();
    const missResult = missCallback.mock.calls[0][0].data;
    expect(missResult.hit).toBe(false);
    expect(missResult.accuracy).toBe(HitAccuracy.MISS);
    expect(missResult.note.midiNote).toBe(36);
  });

  it('should calculate score correctly', () => {
    const engine = new RhythmEngine();
    engine.loadPattern(samplePattern);
    
    // Mock perfect hits for testing
    const mockHitResult = {
      hit: true,
      accuracy: HitAccuracy.PERFECT,
      timeDelta: 5,
      points: 100,
      note: samplePattern.notes[0],
      timestamp: Date.now()
    };
    
    // Call the internal method to update stats
    (engine as any).updateStats(mockHitResult);
    
    // Check that stats were updated correctly
    const stats = engine.getStats();
    expect(stats.score).toBe(100);
    expect(stats.combo).toBe(1);
    expect(stats.perfectCount).toBe(1);
    expect(stats.totalNotes).toBe(4);
    expect(stats.notesHit).toBe(1);
    expect(stats.accuracy).toBeCloseTo(100); // 100% accuracy
  });

  it('should emit events when state changes', () => {
    const engine = new RhythmEngine();
    
    // Register callbacks for events
    const stateChangedCallback = vi.fn();
    engine.addEventListener('gameStateChanged', stateChangedCallback);
    
    // Change the state
    engine.loadPattern(samplePattern);
    engine.start();
    engine.pause();
    engine.resume();
    engine.stop();
    
    // Should have emitted events for each state change
    expect(stateChangedCallback).toHaveBeenCalledTimes(5); // includes initial load
    
    // Check the final state
    expect(stateChangedCallback.mock.calls[4][0].data).toBe(GameState.PAUSED);
  });
}); 