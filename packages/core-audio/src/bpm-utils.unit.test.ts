import { describe, it, expect } from 'vitest';
import { BpmUtils } from './bpm-utils';

/**
 * Unit tests for BPM utilities
 * Test type: Unit
 */
describe('BpmUtils', () => {
  it('should calculate milliseconds per beat correctly', () => {
    // At 120 BPM, one beat = 500ms
    expect(BpmUtils.msPerBeat(120)).toBe(500);
    
    // At 60 BPM, one beat = 1000ms
    expect(BpmUtils.msPerBeat(60)).toBe(1000);
    
    // At 180 BPM, one beat = 333.33ms
    expect(BpmUtils.msPerBeat(180)).toBeCloseTo(333.33, 1);
  });
  
  it('should calculate seconds per beat correctly', () => {
    // At 120 BPM, one beat = 0.5s
    expect(BpmUtils.secondsPerBeat(120)).toBe(0.5);
    
    // At 60 BPM, one beat = 1s
    expect(BpmUtils.secondsPerBeat(60)).toBe(1);
  });
  
  it('should convert beat to seconds correctly', () => {
    // At 120 BPM:
    // 4 beats = 2 seconds
    expect(BpmUtils.beatToSeconds(4, 120)).toBe(2);
    
    // At 60 BPM:
    // 4 beats = 4 seconds
    expect(BpmUtils.beatToSeconds(4, 60)).toBe(4);
  });
  
  it('should convert seconds to beat correctly', () => {
    // At 120 BPM:
    // 2 seconds = 4 beats
    const result1 = BpmUtils.secondsToBeat(2, 120);
    expect(result1.beat).toBe(4);
    expect(result1.phase).toBeCloseTo(0, 2);
    
    // 2.25 seconds = 4.5 beats
    const result2 = BpmUtils.secondsToBeat(2.25, 120);
    expect(result2.beat).toBe(4);
    expect(result2.phase).toBeCloseTo(0.5, 2);
  });
  
  it('should convert bar:beat to total beats correctly', () => {
    // In 4/4 time:
    // Bar 1, Beat 1 = 0 beats from start
    expect(BpmUtils.barBeatToBeats(1, 1, 0, 4)).toBe(0);
    
    // Bar 2, Beat 1 = 4 beats from start
    expect(BpmUtils.barBeatToBeats(2, 1, 0, 4)).toBe(4);
    
    // Bar 2, Beat 3, 50% through beat = 6.5 beats from start
    expect(BpmUtils.barBeatToBeats(2, 3, 0.5, 4)).toBe(6.5);
    
    // In 3/4 time:
    // Bar 2, Beat 2 = 4 beats from start
    expect(BpmUtils.barBeatToBeats(2, 2, 0, 3)).toBe(4);
  });
  
  it('should convert total beats to bar:beat correctly', () => {
    // In 4/4 time:
    // 0 beats = Bar 1, Beat 1
    const result1 = BpmUtils.beatsToBarBeat(0, 4);
    expect(result1.bar).toBe(1);
    expect(result1.beat).toBe(1);
    expect(result1.phase).toBe(0);
    
    // 4 beats = Bar 2, Beat 1
    const result2 = BpmUtils.beatsToBarBeat(4, 4);
    expect(result2.bar).toBe(2);
    expect(result2.beat).toBe(1);
    expect(result2.phase).toBe(0);
    
    // 6.5 beats = Bar 2, Beat 3, 50% through
    const result3 = BpmUtils.beatsToBarBeat(6.5, 4);
    expect(result3.bar).toBe(2);
    expect(result3.beat).toBe(3);
    expect(result3.phase).toBeCloseTo(0.5, 2);
    
    // In 3/4 time:
    // 4 beats = Bar 2, Beat 2
    const result4 = BpmUtils.beatsToBarBeat(4, 3);
    expect(result4.bar).toBe(2);
    expect(result4.beat).toBe(2);
    expect(result4.phase).toBe(0);
  });
  
  it('should calculate time for bar:beat correctly', () => {
    // At 120 BPM in 4/4 time:
    // Bar 2, Beat 1 = 2 seconds
    expect(BpmUtils.timeForBarBeat(2, 1, 0, 120, 4)).toBe(2);
    
    // Bar 2, Beat 3, 50% through = 3.25 seconds
    expect(BpmUtils.timeForBarBeat(2, 3, 0.5, 120, 4)).toBe(3.25);
    
    // At 60 BPM in 3/4 time:
    // Bar 3, Beat 2 = 7 seconds (2 bars of 3 beats each = 6 beats, plus 1 beat)
    expect(BpmUtils.timeForBarBeat(3, 2, 0, 60, 3)).toBe(7);
  });
  
  it('should get position at time correctly', () => {
    // At 120 BPM in 4/4 time:
    // 2 seconds = Bar 2, Beat 1
    const result1 = BpmUtils.getPositionAtTime(2, 120, 4);
    expect(result1.bar).toBe(2);
    expect(result1.beat).toBe(1);
    
    // 3.25 seconds = Bar 2, Beat 3, 50% through
    const result2 = BpmUtils.getPositionAtTime(3.25, 120, 4);
    expect(result2.bar).toBe(2);
    expect(result2.beat).toBe(3);
    expect(result2.phase).toBeCloseTo(0.5, 2);
  });
  
  it('should calculate next beat time correctly', () => {
    // At 120 BPM:
    // From 2.3 seconds, next beat is at 2.5 seconds
    expect(BpmUtils.getNextBeatTime(2.3, 120)).toBeCloseTo(2.5, 3);
    
    // From 3.7 seconds, next beat is at 4.0 seconds
    expect(BpmUtils.getNextBeatTime(3.7, 120)).toBeCloseTo(4.0, 3);
  });
  
  it('should calculate note frequency correctly', () => {
    // MIDI note 69 = A4 = 440Hz
    expect(BpmUtils.noteToFrequency(69)).toBe(440);
    
    // MIDI note 60 = C4 = ~261.63Hz
    expect(BpmUtils.noteToFrequency(60)).toBeCloseTo(261.63, 1);
  });
  
  it('should generate time signature string correctly', () => {
    expect(BpmUtils.getTimeSignatureString(4, 4)).toBe('4/4');
    expect(BpmUtils.getTimeSignatureString(3, 4)).toBe('3/4');
    expect(BpmUtils.getTimeSignatureString(6, 8)).toBe('6/8');
  });
  
  it('should calculate scroll offset correctly', () => {
    // At 120 BPM, with lane height 100px:
    // 2 seconds = 4 beats = 400px
    expect(BpmUtils.calculateScrollOffset(2, 120, 100)).toBe(400);
    
    // With default lane height (100px):
    expect(BpmUtils.calculateScrollOffset(3, 120)).toBe(600);
  });
  
  it('should calculate note Y position correctly', () => {
    // Note at 3s, current time 2s, 120 BPM, 100px lane height:
    // Difference = 1s = 2 beats = 200px
    expect(BpmUtils.calculateNoteYPosition(3, 2, 120, 100)).toBe(200);
    
    // Note in past (should be negative):
    // Note at 1s, current time 2s, 120 BPM, 100px lane height:
    // Difference = -1s = -2 beats = -200px
    expect(BpmUtils.calculateNoteYPosition(1, 2, 120, 100)).toBe(-200);
  });
}); 