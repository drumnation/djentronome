import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MIDIHandler, MIDIMessage, MIDIMessageType } from '../../src';
import { RhythmEngine } from '@djentronome/rhythm-engine';
import { HitAccuracy } from '@djentronome/rhythm-engine/dist/types';

/**
 * Integration tests between MIDIHandler and RhythmEngine
 * Test type: Integration
 * 
 * These tests verify that the MIDIHandler can properly send MIDI messages
 * to the RhythmEngine for hit detection and scoring.
 */
describe('MIDIHandler + RhythmEngine Integration', () => {
  let midiHandler: MIDIHandler;
  let rhythmEngine: RhythmEngine;
  
  // Mock MIDI message for testing
  const createMockMIDIMessage = (
    type: MIDIMessageType, 
    note: number, 
    velocity: number,
    timestamp: number
  ): MIDIMessage => ({
    type,
    note,
    velocity,
    channel: 0,
    timestamp
  });
  
  // Mock pattern data
  const mockPattern = {
    id: 'test-pattern',
    version: '1.0',
    duration: 4000,
    metadata: {
      title: 'Test Pattern',
      artist: 'Test Artist',
      bpm: 120,
      timeSignature: '4/4',
      difficulty: 'medium'
    },
    notes: [
      { time: 1000, duration: 100, type: 'kick', midiNote: 36 },
      { time: 2000, duration: 100, type: 'snare', midiNote: 38 },
      { time: 3000, duration: 100, type: 'hihat', midiNote: 42 }
    ],
    sections: []
  };
  
  beforeEach(() => {
    // Create a new MIDI handler with mocked initialize method
    midiHandler = new MIDIHandler();
    vi.spyOn(midiHandler, 'initialize').mockResolvedValue();
    
    // Create the RhythmEngine with the MIDIHandler
    rhythmEngine = new RhythmEngine();
    
    // Load mock pattern
    rhythmEngine.loadPattern(mockPattern);
    
    // Mock performance.now so we can control the game time
    vi.spyOn(performance, 'now').mockImplementation(() => Date.now());
  });
  
  it('should process MIDI input in the rhythm engine', async () => {
    // Set up hit tracking in rhythm engine
    const hitEvents: any[] = [];
    rhythmEngine.addEventListener('hit', (event) => {
      hitEvents.push(event.data);
    });
    
    // Start the game
    rhythmEngine.start();
    
    // Mock the current time
    performance.now = vi.fn().mockReturnValue(1000); // At first note
    
    // Process a MIDI input directly in the rhythm engine
    rhythmEngine.processInput({
      type: 'midi',
      value: 36, // kick drum MIDI note
      timestamp: 1000,
      velocity: 100
    });
    
    // Verify that the rhythm engine processed the hit
    expect(hitEvents.length).toBe(1);
    expect(hitEvents[0].note.type).toBe('kick');
    expect(hitEvents[0].accuracy).toBe(HitAccuracy.PERFECT);
    
    // Move to second note
    performance.now = vi.fn().mockReturnValue(2020);
    
    // Process another MIDI input with slightly off timing
    rhythmEngine.processInput({
      type: 'midi',
      value: 38, // snare drum MIDI note
      timestamp: 2020,
      velocity: 100
    });
    
    // Verify the second hit was processed with slightly less accuracy
    expect(hitEvents.length).toBe(2);
    expect(hitEvents[1].note.type).toBe('snare');
    expect(hitEvents[1].accuracy).toBe(HitAccuracy.GREAT);
    
    // Clean up
    rhythmEngine.stop();
  });
  
  it('should be able to handle MIDI messages from the handler', async () => {
    // Initialize and set up a test scenario
    await midiHandler.initialize();
    
    // Start the game
    rhythmEngine.start();
    
    // Set up MIDI message handler that forwards to rhythm engine
    const handleMIDIMessage = (message: MIDIMessage) => {
      if (message.type === MIDIMessageType.NOTE_ON) {
        rhythmEngine.processInput({
          type: 'midi',
          value: message.note,
          timestamp: message.timestamp,
          velocity: message.velocity
        });
      }
    };
    
    // Register the handler
    midiHandler.onMessage(handleMIDIMessage);
    
    // Set up hit tracking in rhythm engine
    const hitEvents: any[] = [];
    rhythmEngine.addEventListener('hit', (event) => {
      hitEvents.push(event.data);
    });
    
    // Mock the current time
    performance.now = vi.fn().mockReturnValue(1000); // At first note
    
    // Create a mock MIDI note-on message for the kick drum
    const midiMessage = createMockMIDIMessage(
      MIDIMessageType.NOTE_ON,
      36, // kick drum
      100, // velocity
      1000 // timestamp
    );
    
    // Manually trigger the message handler
    handleMIDIMessage(midiMessage);
    
    // Verify that the rhythm engine processed the hit
    expect(hitEvents.length).toBe(1);
    
    // Cleanup
    midiHandler.offMessage(handleMIDIMessage);
    midiHandler.cleanup();
    rhythmEngine.stop();
  });
}); 