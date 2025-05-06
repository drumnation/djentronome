import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LatencyCalibrator } from '../../src/latency-calibrator';

/**
 * Integration tests between LatencyCalibrator and RhythmEngine
 * Test type: Integration
 * 
 * These tests verify that latency calibration results are properly applied
 * to the rhythm engine for accurate hit detection.
 */
describe('LatencyCalibrator Integration', () => {
  let latencyCalibrator: LatencyCalibrator;
  
  beforeEach(() => {
    // Create a new LatencyCalibrator
    latencyCalibrator = new LatencyCalibrator();
    
    // Mock storage
    vi.spyOn(localStorage, 'getItem').mockImplementation((key) => {
      if (key === 'latency-calibration') {
        return JSON.stringify({
          audio: 35,
          visual: 25,
          midi: 15,
          lastUpdated: Date.now()
        });
      }
      return null;
    });
    
    vi.spyOn(localStorage, 'setItem').mockImplementation(() => {});
  });
  
  it('should provide latency offset values for the rhythm engine', () => {
    // Get the current latency settings
    const audioOffset = latencyCalibrator.getAudioOffset();
    const midiOffset = latencyCalibrator.getMIDIOffset();
    const visualOffset = latencyCalibrator.getVisualOffset();
    
    // Verify offsets are loaded from storage
    expect(audioOffset).toBe(35);
    expect(midiOffset).toBe(15);
    expect(visualOffset).toBe(25);
    
    // Verify combined offset
    const totalOffset = latencyCalibrator.getCombinedOffset();
    expect(totalOffset).toBe(audioOffset + midiOffset);
  });
  
  it('should update offset values after calibration tests', () => {
    // Simulate calibration test results
    latencyCalibrator.setAudioOffset(50);
    latencyCalibrator.setMIDIOffset(20);
    
    // Verify updated offsets
    expect(latencyCalibrator.getAudioOffset()).toBe(50);
    expect(latencyCalibrator.getMIDIOffset()).toBe(20);
    
    // Verify localStorage was called to save the new values
    expect(localStorage.setItem).toHaveBeenCalled();
  });
  
  it('should apply the calibrated offset to hit detection timing', () => {
    // Mock RhythmEngine for testing purposes
    const mockRhythmEngine = {
      getOptions: vi.fn().mockReturnValue({
        latencyOffset: 0,
        scoringConfig: {
          perfectWindow: 30
        }
      }),
      setOptions: vi.fn(),
      start: vi.fn(),
      stop: vi.fn()
    };
    
    // Set up the latency calibrator with mock rhythm engine
    latencyCalibrator.applyToRhythmEngine(mockRhythmEngine);
    
    // Verify that the rhythm engine options were updated with the combined offset
    expect(mockRhythmEngine.setOptions).toHaveBeenCalledWith(
      expect.objectContaining({
        latencyOffset: latencyCalibrator.getCombinedOffset()
      })
    );
  });
  
  it('should compensate for input timing with the calibrated offsets', () => {
    // Create a timing function that applies latency compensation
    const compensateInputTiming = (timestamp: number) => {
      return timestamp - latencyCalibrator.getCombinedOffset();
    };
    
    // Test input timing compensation
    const originalTimestamp = 1000;
    const compensatedTimestamp = compensateInputTiming(originalTimestamp);
    
    // Verify compensation was applied correctly
    expect(compensatedTimestamp).toBe(originalTimestamp - (35 + 15));
  });
}); 