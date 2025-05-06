import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MIDIHandler } from './midi-handler';
import { MIDIConnectionStatus, MIDIMessageType } from './types';

// Mock the Web MIDI API
const mockMIDIInputs = new Map();
const mockMIDIOutputs = new Map();

// Mock MIDIInput
class MockMIDIInput extends EventTarget {
  id: string;
  manufacturer: string;
  name: string;
  state: 'connected' | 'disconnected';
  type: 'input';
  connection: string;
  addEventListener: jest.Mock;
  removeEventListener: jest.Mock;
  
  constructor(id: string, name: string, manufacturer: string) {
    super();
    this.id = id;
    this.name = name;
    this.manufacturer = manufacturer;
    this.state = 'connected';
    this.type = 'input';
    this.connection = 'open';
    this.addEventListener = vi.fn((event, callback) => {
      super.addEventListener(event, callback);
    });
    this.removeEventListener = vi.fn((event, callback) => {
      super.removeEventListener(event, callback);
    });
  }
  
  // Helper to simulate MIDI message events
  sendMIDIMessage(data: number[]) {
    const event = new MessageEvent('midimessage', {
      data: new Uint8Array(data),
    });
    this.dispatchEvent(event);
  }
}

// Mock navigator.requestMIDIAccess
global.navigator.requestMIDIAccess = vi.fn().mockImplementation(() => {
  return Promise.resolve({
    inputs: mockMIDIInputs,
    outputs: mockMIDIOutputs,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  });
});

describe('MIDIHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMIDIInputs.clear();
    mockMIDIOutputs.clear();
    
    // Add a mock MIDI device
    const mockDrumkit = new MockMIDIInput('device1', 'Alesis Nitro', 'Alesis');
    mockMIDIInputs.set('device1', mockDrumkit);
  });
  
  it('should initialize and connect to MIDI devices', async () => {
    const handler = new MIDIHandler();
    await handler.initialize();
    
    expect(navigator.requestMIDIAccess).toHaveBeenCalled();
    expect(handler.getConnectionStatus()).toBe(MIDIConnectionStatus.CONNECTED);
    expect(handler.getDevices()).toHaveLength(1);
    expect(handler.getDevices()[0].name).toBe('Alesis Nitro');
  });
  
  it('should handle permission denied errors', async () => {
    // Mock requestMIDIAccess to throw a permissions error
    global.navigator.requestMIDIAccess = vi.fn().mockImplementation(() => {
      return Promise.reject(new Error('Permission denied'));
    });
    
    const statusCallback = vi.fn();
    const handler = new MIDIHandler();
    handler.onConnectionStatusChange(statusCallback);
    
    try {
      await handler.initialize();
    } catch (e) {
      // Expected error
    }
    
    expect(statusCallback).toHaveBeenCalledWith(MIDIConnectionStatus.PERMISSION_DENIED, []);
    expect(handler.getConnectionStatus()).toBe(MIDIConnectionStatus.PERMISSION_DENIED);
  });
  
  it('should process NOTE_ON MIDI messages correctly', async () => {
    const handler = new MIDIHandler();
    const messageCallback = vi.fn();
    
    handler.onMessage(messageCallback);
    await handler.initialize();
    
    // Get the mockDrumkit
    const mockDrumkit = mockMIDIInputs.get('device1');
    
    // Send a NOTE_ON message (0x90 = Note On, channel 0, note 36, velocity 127)
    mockDrumkit.sendMIDIMessage([0x90, 36, 127]);
    
    expect(messageCallback).toHaveBeenCalledWith(expect.objectContaining({
      type: MIDIMessageType.NOTE_ON,
      note: 36,
      velocity: 127,
      channel: 0,
    }));
  });
  
  it('should process NOTE_OFF MIDI messages correctly', async () => {
    const handler = new MIDIHandler();
    const messageCallback = vi.fn();
    
    handler.onMessage(messageCallback);
    await handler.initialize();
    
    // Get the mockDrumkit
    const mockDrumkit = mockMIDIInputs.get('device1');
    
    // Send a NOTE_OFF message (0x80 = Note Off, channel 0, note 38, velocity 0)
    mockDrumkit.sendMIDIMessage([0x80, 38, 0]);
    
    expect(messageCallback).toHaveBeenCalledWith(expect.objectContaining({
      type: MIDIMessageType.NOTE_OFF,
      note: 38,
      velocity: 0,
      channel: 0,
    }));
  });
  
  it('should handle device connection/disconnection events', async () => {
    const handler = new MIDIHandler();
    const statusCallback = vi.fn();
    
    handler.onConnectionStatusChange(statusCallback);
    await handler.initialize();
    
    // Simulate a device being disconnected
    mockMIDIInputs.get('device1').state = 'disconnected';
    
    // Trigger a statechange event
    mockMIDIInputs.get('device1').dispatchEvent(new Event('statechange'));
    
    expect(statusCallback).toHaveBeenCalledWith(MIDIConnectionStatus.DISCONNECTED, []);
  });
  
  it('should clean up event listeners on cleanup', async () => {
    const handler = new MIDIHandler();
    const messageCallback = vi.fn();
    
    handler.onMessage(messageCallback);
    await handler.initialize();
    
    const mockDrumkit = mockMIDIInputs.get('device1');
    expect(mockDrumkit.addEventListener).toHaveBeenCalled();
    
    handler.cleanup();
    
    expect(mockDrumkit.removeEventListener).toHaveBeenCalled();
  });
}); 