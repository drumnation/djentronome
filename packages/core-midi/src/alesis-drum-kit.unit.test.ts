import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AlesisDrumKit, ALESIS_NITRO_KICK_NOTE, ALESIS_NITRO_SNARE_NOTE } from './alesis-drum-kit';
import { MIDIHandler } from './midi-handler';
import { MIDIMessage, MIDIMessageType } from './types';

// Mock the MIDIHandler
vi.mock('./midi-handler');

describe('AlesisDrumKit', () => {
  let drumKit: AlesisDrumKit;
  let mockMidiHandler: MIDIHandler;
  
  beforeEach(() => {
    // Reset mocks
    vi.resetAllMocks();
    
    // Setup mock MIDIHandler
    mockMidiHandler = new MIDIHandler();
    
    // Create the AlesisDrumKit instance with the mock
    drumKit = new AlesisDrumKit(mockMidiHandler);
  });
  
  describe('Device Detection', () => {
    it('should detect Alesis Nitro device by name', () => {
      // Create mock implementation for onConnectionStatusChange
      let connectionCallback: any;
      (mockMidiHandler.onConnectionStatusChange as any).mockImplementation((callback: any) => {
        connectionCallback = callback;
      });
      
      // Initialize the drum kit
      drumKit.initialize();
      
      // Verify onConnectionStatusChange was called
      expect(mockMidiHandler.onConnectionStatusChange).toHaveBeenCalled();
      
      // Simulate a connection status change with devices
      connectionCallback('connected', [
        { id: 'device1', name: 'Some MIDI Device', manufacturer: 'Company', state: 'connected', type: 'input' },
        { id: 'device2', name: 'Alesis Nitro Kit', manufacturer: 'Alesis', state: 'connected', type: 'input' },
        { id: 'device3', name: 'Another Device', manufacturer: 'Other', state: 'connected', type: 'input' }
      ]);
      
      // Verify the device was detected
      expect(drumKit.isDeviceConnected()).toBe(true);
      expect(drumKit.getDeviceInfo()).toEqual({
        id: 'device2',
        name: 'Alesis Nitro Kit',
        manufacturer: 'Alesis',
        state: 'connected',
        type: 'input'
      });
    });
    
    it('should handle case variations in device name', () => {
      // Create mock implementation for onConnectionStatusChange
      let connectionCallback: any;
      (mockMidiHandler.onConnectionStatusChange as any).mockImplementation((callback: any) => {
        connectionCallback = callback;
      });
      
      // Initialize the drum kit
      drumKit.initialize();
      
      // Simulate a connection status change with devices that have different case
      connectionCallback('connected', [
        { id: 'device1', name: 'alesis nitro', manufacturer: 'Alesis', state: 'connected', type: 'input' }
      ]);
      
      // Verify the device was detected despite case differences
      expect(drumKit.isDeviceConnected()).toBe(true);
    });
    
    it('should detect when no Alesis Nitro device is found', () => {
      // Create mock implementation for onConnectionStatusChange
      let connectionCallback: any;
      (mockMidiHandler.onConnectionStatusChange as any).mockImplementation((callback: any) => {
        connectionCallback = callback;
      });
      
      // Initialize the drum kit
      drumKit.initialize();
      
      // Simulate a connection status change with no Alesis device
      connectionCallback('connected', [
        { id: 'device1', name: 'Some MIDI Device', manufacturer: 'Company', state: 'connected', type: 'input' },
        { id: 'device3', name: 'Another Device', manufacturer: 'Other', state: 'connected', type: 'input' }
      ]);
      
      // Verify no device was detected
      expect(drumKit.isDeviceConnected()).toBe(false);
      expect(drumKit.getDeviceInfo()).toBeNull();
    });
  });
  
  describe('Drum Hit Detection', () => {
    it('should detect kick drum hits', () => {
      // Setup mock and callbacks
      let messageCallback: any;
      (mockMidiHandler.onMessage as any).mockImplementation((callback: any) => {
        messageCallback = callback;
      });
      
      const kickCallback = vi.fn();
      
      // Initialize and register callback
      drumKit.initialize();
      drumKit.onKickHit(kickCallback);
      
      // Simulate a kick drum hit (note 36)
      const kickMessage: MIDIMessage = {
        type: MIDIMessageType.NOTE_ON,
        data: new Uint8Array([0x90, ALESIS_NITRO_KICK_NOTE, 100]), // Channel 1, Note 36, Velocity 100
        timestamp: 12345,
        note: ALESIS_NITRO_KICK_NOTE,
        velocity: 100,
        channel: 0
      };
      
      messageCallback(kickMessage);
      
      // Verify callback was called with correct data
      expect(kickCallback).toHaveBeenCalledWith({
        timestamp: 12345,
        velocity: 100
      });
    });
    
    it('should detect snare drum hits', () => {
      // Setup mock and callbacks
      let messageCallback: any;
      (mockMidiHandler.onMessage as any).mockImplementation((callback: any) => {
        messageCallback = callback;
      });
      
      const snareCallback = vi.fn();
      
      // Initialize and register callback
      drumKit.initialize();
      drumKit.onSnareHit(snareCallback);
      
      // Simulate a snare drum hit (note 38)
      const snareMessage: MIDIMessage = {
        type: MIDIMessageType.NOTE_ON,
        data: new Uint8Array([0x90, ALESIS_NITRO_SNARE_NOTE, 120]), // Channel 1, Note 38, Velocity 120
        timestamp: 23456,
        note: ALESIS_NITRO_SNARE_NOTE,
        velocity: 120,
        channel: 0
      };
      
      messageCallback(snareMessage);
      
      // Verify callback was called with correct data
      expect(snareCallback).toHaveBeenCalledWith({
        timestamp: 23456,
        velocity: 120
      });
    });
    
    it('should ignore notes that are not kick or snare', () => {
      // Setup mock and callbacks
      let messageCallback: any;
      (mockMidiHandler.onMessage as any).mockImplementation((callback: any) => {
        messageCallback = callback;
      });
      
      const kickCallback = vi.fn();
      const snareCallback = vi.fn();
      
      // Initialize and register callbacks
      drumKit.initialize();
      drumKit.onKickHit(kickCallback);
      drumKit.onSnareHit(snareCallback);
      
      // Simulate a different drum hit (e.g., tom or cymbal)
      const otherMessage: MIDIMessage = {
        type: MIDIMessageType.NOTE_ON,
        data: new Uint8Array([0x90, 45, 100]), // Some other note
        timestamp: 34567,
        note: 45,
        velocity: 100,
        channel: 0
      };
      
      messageCallback(otherMessage);
      
      // Verify callbacks were not called
      expect(kickCallback).not.toHaveBeenCalled();
      expect(snareCallback).not.toHaveBeenCalled();
    });
    
    it('should ignore Note Off messages', () => {
      // Setup mock and callbacks
      let messageCallback: any;
      (mockMidiHandler.onMessage as any).mockImplementation((callback: any) => {
        messageCallback = callback;
      });
      
      const kickCallback = vi.fn();
      
      // Initialize and register callback
      drumKit.initialize();
      drumKit.onKickHit(kickCallback);
      
      // Simulate a kick drum note off message
      const kickOffMessage: MIDIMessage = {
        type: MIDIMessageType.NOTE_OFF,
        data: new Uint8Array([0x80, ALESIS_NITRO_KICK_NOTE, 0]), // Note Off message
        timestamp: 45678,
        note: ALESIS_NITRO_KICK_NOTE,
        velocity: 0,
        channel: 0
      };
      
      messageCallback(kickOffMessage);
      
      // Verify callback was not called
      expect(kickCallback).not.toHaveBeenCalled();
    });
  });
}); 