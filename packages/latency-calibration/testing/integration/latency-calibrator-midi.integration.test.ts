import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LatencyCalibrator, InputMethod, CalibrationStatus } from '../../src';

// Mock the MIDI input that would come from core-midi
const mockMidiInput = {
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
  id: 'test-midi-device',
  name: 'Test MIDI Device',
  manufacturer: 'Test Manufacturer',
  state: 'connected',
  type: 'input',
  version: '1.0.0'
};

// Mock MIDI event
const createMidiEvent = (note = 36, velocity = 100, timestamp = Date.now()) => {
  return {
    data: new Uint8Array([0x90, note, velocity]), // Note on, note, velocity
    timestamp,
    target: mockMidiInput
  };
};

describe('LatencyCalibrator MIDI Integration', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should handle MIDI input for calibration', async () => {
    // Create a calibrator with MIDI as input method
    const calibrator = new LatencyCalibrator({
      defaultTestConfig: {
        inputMethod: InputMethod.MIDI,
        sampleCount: 3,
        useAudio: true,
        useVisual: false,
        interval: 500,
        intervalVariation: 0 // No variation for predictable testing
      }
    });
    
    // Mock the collectSample method to avoid timing issues
    vi.spyOn(calibrator as any, 'collectSample').mockResolvedValue({
      signalTime: 1000,
      responseTime: 1050,
      latency: 50,
      signalId: 'midi-test'
    });

    // Set up a status listener
    const statusListener = vi.fn();
    calibrator.addStatusListener(statusListener);
    
    // Run the calibration
    const result = await calibrator.calibrate(
      mockMidiInput.id, 
      mockMidiInput.name
    );
    
    // Check results
    expect(result).toBeDefined();
    expect(result.latency).toBe(50); // Our mocked delay
    
    // Check status updates
    expect(statusListener).toHaveBeenCalledWith(expect.objectContaining({
      status: CalibrationStatus.IN_PROGRESS,
      progress: 0
    }));
    
    expect(statusListener).toHaveBeenCalledWith(expect.objectContaining({
      status: CalibrationStatus.CALIBRATED,
      progress: 1
    }));
    
    // Check saved settings
    const deviceSettings = calibrator.getDeviceSettings(mockMidiInput.id);
    expect(deviceSettings).toBeDefined();
    expect(deviceSettings?.latencyOffset).toBe(50);
    expect(deviceSettings?.inputMethod).toBe(InputMethod.MIDI);
  }, 10000); // Increase timeout to 10 seconds
  
  it('should apply latency compensation to incoming MIDI events', () => {
    // Create a calibrator
    const calibrator = new LatencyCalibrator();
    
    // Manually set device settings
    (calibrator as any).deviceSettings = {
      'test-midi-device': {
        deviceId: 'test-midi-device',
        deviceName: 'Test MIDI Device',
        inputMethod: InputMethod.MIDI,
        latencyOffset: 30, // 30ms offset
        lastCalibrated: Date.now(),
        confidence: 0.95
      }
    };
    
    // Create a MIDI event at current time
    const now = Date.now();
    const midiEvent = createMidiEvent(36, 100, now);
    
    // Get the offset for the device
    const offset = calibrator.getOffset(mockMidiInput.id);
    
    // Apply compensation
    const compensatedTime = midiEvent.timestamp - offset;
    
    // The compensated time should be 30ms earlier than the event timestamp
    expect(offset).toBe(30);
    expect(compensatedTime).toBe(now - 30);
  });
}); 