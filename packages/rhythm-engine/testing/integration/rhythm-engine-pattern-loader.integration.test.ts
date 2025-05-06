import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RhythmEngine } from '../../src/rhythm-engine';
import { PatternLoader } from '@djentronome/pattern-loader';
import { Pattern, DifficultyLevel } from '@djentronome/pattern-loader';
import { HitAccuracy, RhythmEngineEventType } from '../../src/types';

/**
 * Integration tests between RhythmEngine and PatternLoader
 * Test type: Integration
 * 
 * These tests verify that the RhythmEngine can properly load and use patterns
 * from the PatternLoader.
 */
describe('RhythmEngine + PatternLoader Integration', () => {
  let rhythmEngine: RhythmEngine;
  let patternLoader: PatternLoader;
  
  // Sample pattern for testing
  const samplePattern: Pattern = {
    id: 'test-pattern',
    version: '1.0',
    duration: 4000,
    metadata: {
      title: 'Test Pattern',
      artist: 'Test Artist',
      bpm: 120,
      timeSignature: '4/4',
      difficulty: DifficultyLevel.MEDIUM
    },
    notes: [
      { time: 1000, duration: 100, type: 'kick', midiNote: 36 },
      { time: 2000, duration: 100, type: 'snare', midiNote: 38 },
      { time: 3000, duration: 100, type: 'hihat', midiNote: 42 }
    ],
    sections: []
  };
  
  beforeEach(() => {
    // Create a mock for PatternLoader's loadPattern method
    patternLoader = new PatternLoader();
    vi.spyOn(patternLoader, 'loadPattern').mockResolvedValue(samplePattern);
    
    // Create the RhythmEngine with the PatternLoader
    rhythmEngine = new RhythmEngine({ patternLoader });
  });
  
  it('should load a pattern through the PatternLoader', async () => {
    // Load a pattern via the pattern loader
    const pattern = await patternLoader.loadPattern('test-pattern.json');
    rhythmEngine.loadPattern(pattern);
    
    // Verify the pattern was loaded
    expect(patternLoader.loadPattern).toHaveBeenCalledWith('test-pattern.json');
    expect(rhythmEngine.getPattern()).toEqual(samplePattern);
  });
  
  it('should correctly process notes from the loaded pattern', async () => {
    // Set up hit event tracking
    const hitResults: { noteType: string, accuracy: HitAccuracy }[] = [];
    rhythmEngine.addEventListener(RhythmEngineEventType.HIT, (event) => {
      const result = event.data;
      hitResults.push({
        noteType: result.note.type,
        accuracy: result.accuracy
      });
    });
    
    // Load the pattern
    const pattern = await patternLoader.loadPattern('test-pattern.json');
    rhythmEngine.loadPattern(pattern);
    
    // Start the game
    rhythmEngine.start();
    
    // Mock the current time to simulate the game running
    const originalNow = performance.now;
    performance.now = vi.fn().mockReturnValue(1000); // At first note
    
    // Simulate a perfect hit on the first note
    rhythmEngine.processInput({
      type: 'midi',
      value: 36, // kick drum MIDI note
      timestamp: 1000,
      velocity: 100
    });
    
    // Move to second note
    performance.now = vi.fn().mockReturnValue(2000);
    
    // Simulate a good hit on the second note (slightly off timing)
    rhythmEngine.processInput({
      type: 'midi',
      value: 38, // snare drum MIDI note
      timestamp: 2050,
      velocity: 100
    });
    
    // Verify the hit results
    expect(hitResults.length).toBe(2);
    expect(hitResults[0].noteType).toBe('kick');
    expect(hitResults[0].accuracy).toBe(HitAccuracy.PERFECT);
    expect(hitResults[1].noteType).toBe('snare');
    expect(hitResults[1].accuracy).toBe(HitAccuracy.GOOD);
    
    // Restore performance.now
    performance.now = originalNow;
    
    // Clean up
    rhythmEngine.stop();
  });
  
  it('should correctly handle the end of a pattern', async () => {
    // Set up event tracking
    let patternEndFired = false;
    rhythmEngine.addEventListener(RhythmEngineEventType.PATTERN_COMPLETED, () => {
      patternEndFired = true;
    });
    
    // Load the pattern
    const pattern = await patternLoader.loadPattern('test-pattern.json');
    rhythmEngine.loadPattern(pattern);
    
    // Start the game
    rhythmEngine.start();
    
    // Simulate the game running past all notes
    const originalNow = performance.now;
    performance.now = vi.fn().mockReturnValue(4000); // After the last note
    
    // Manually trigger the update cycle
    rhythmEngine['update'](4000); // Access private method for testing
    
    // Verify the pattern end event was fired
    expect(patternEndFired).toBe(true);
    
    // Restore performance.now
    performance.now = originalNow;
    
    // Clean up
    rhythmEngine.stop();
  });
}); 