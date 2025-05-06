import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AlesisDrumKit, ALESIS_NITRO_KICK_NOTE, ALESIS_NITRO_SNARE_NOTE, MIDIHandler, MIDIConnectionStatus, MIDIMessage, MIDIMessageType } from '../../src';

// We'll create a mock rhythm engine to avoid circular dependencies
interface MockRhythmEngineInput {
  type: string;
  value: number;
  timestamp: number;
  velocity: number;
}

/**
 * Integration tests for AlesisDrumKit
 * Test type: Integration
 * 
 * These tests verify that the AlesisDrumKit can properly detect
 * and forward drum hits to external components like a rhythm engine.
 */
describe('AlesisDrumKit Integration', () => {
  let midiHandler: MIDIHandler;
  let alesisDrumKit: AlesisDrumKit;
  
  // Mock connection status callback
  let connectionStatusCallback: any;
  
  // Mock message callback
  let messageCallback: any;
  
  beforeEach(() => {
    // Mock the MIDIHandler
    midiHandler = {
      onConnectionStatusChange: vi.fn().mockImplementation((callback) => {
        connectionStatusCallback = callback;
      }),
      onMessage: vi.fn().mockImplementation((callback) => {
        messageCallback = callback;
      }),
      offMessage: vi.fn(),
      cleanup: vi.fn()
    } as unknown as MIDIHandler;
    
    // Create the AlesisDrumKit instance with the mock handler
    alesisDrumKit = new AlesisDrumKit(midiHandler);
  });
  
  it('should detect Alesis Nitro device and handle drum hits', () => {
    // Initialize the AlesisDrumKit
    alesisDrumKit.initialize();
    
    // Verify onConnectionStatusChange was called
    expect(midiHandler.onConnectionStatusChange).toHaveBeenCalled();
    
    // Simulate connection with Alesis Nitro device
    connectionStatusCallback(MIDIConnectionStatus.CONNECTED, [
      { id: 'device1', name: 'Alesis Nitro Kit', manufacturer: 'Alesis', state: 'connected', type: 'input' }
    ]);
    
    // Verify device was detected
    expect(alesisDrumKit.isDeviceConnected()).toBe(true);
    
    // Create a mock processor to simulate rhythm engine
    const mockInputProcessor = vi.fn();
    
    // Setup kick drum hit callbacks
    alesisDrumKit.onKickHit((event) => {
      mockInputProcessor({
        type: 'midi',
        value: ALESIS_NITRO_KICK_NOTE,
        timestamp: event.timestamp,
        velocity: event.velocity
      });
    });
    
    // Setup snare drum hit callbacks
    alesisDrumKit.onSnareHit((event) => {
      mockInputProcessor({
        type: 'midi',
        value: ALESIS_NITRO_SNARE_NOTE,
        timestamp: event.timestamp,
        velocity: event.velocity
      });
    });
    
    // Simulate a kick drum hit
    const kickMessage: MIDIMessage = {
      type: MIDIMessageType.NOTE_ON,
      data: new Uint8Array([0x90, ALESIS_NITRO_KICK_NOTE, 100]),
      timestamp: 1000,
      note: ALESIS_NITRO_KICK_NOTE,
      velocity: 100,
      channel: 0
    };
    
    // Process the message
    messageCallback(kickMessage);
    
    // Verify that the input processor was called with kick drum data
    expect(mockInputProcessor).toHaveBeenCalledTimes(1);
    expect(mockInputProcessor).toHaveBeenCalledWith({
      type: 'midi',
      value: ALESIS_NITRO_KICK_NOTE,
      timestamp: 1000,
      velocity: 100
    });
    
    // Simulate a snare drum hit
    const snareMessage: MIDIMessage = {
      type: MIDIMessageType.NOTE_ON,
      data: new Uint8Array([0x90, ALESIS_NITRO_SNARE_NOTE, 120]),
      timestamp: 2000,
      note: ALESIS_NITRO_SNARE_NOTE,
      velocity: 120,
      channel: 0
    };
    
    // Process the message
    messageCallback(snareMessage);
    
    // Verify that the input processor was called with snare drum data
    expect(mockInputProcessor).toHaveBeenCalledTimes(2);
    expect(mockInputProcessor).toHaveBeenLastCalledWith({
      type: 'midi',
      value: ALESIS_NITRO_SNARE_NOTE,
      timestamp: 2000,
      velocity: 120
    });
    
    // Cleanup
    alesisDrumKit.cleanup();
  });
  
  it('should handle multiple subscriptions to kick and snare events', () => {
    // Initialize the AlesisDrumKit
    alesisDrumKit.initialize();
    
    // Simulate connection with Alesis Nitro device
    connectionStatusCallback(MIDIConnectionStatus.CONNECTED, [
      { id: 'device1', name: 'Alesis Nitro Kit', manufacturer: 'Alesis', state: 'connected', type: 'input' }
    ]);
    
    // Create multiple callback counters
    const kickCounter1 = vi.fn();
    const kickCounter2 = vi.fn();
    const snareCounter1 = vi.fn();
    const snareCounter2 = vi.fn();
    
    // Register multiple callbacks
    alesisDrumKit.onKickHit(kickCounter1);
    alesisDrumKit.onKickHit(kickCounter2);
    alesisDrumKit.onSnareHit(snareCounter1);
    alesisDrumKit.onSnareHit(snareCounter2);
    
    // Simulate a kick drum hit
    const kickMessage: MIDIMessage = {
      type: MIDIMessageType.NOTE_ON,
      data: new Uint8Array([0x90, ALESIS_NITRO_KICK_NOTE, 100]),
      timestamp: 5000,
      note: ALESIS_NITRO_KICK_NOTE,
      velocity: 100,
      channel: 0
    };
    
    // Process the message
    messageCallback(kickMessage);
    
    // Verify both kick callbacks were triggered
    expect(kickCounter1).toHaveBeenCalledTimes(1);
    expect(kickCounter2).toHaveBeenCalledTimes(1);
    expect(snareCounter1).not.toHaveBeenCalled();
    expect(snareCounter2).not.toHaveBeenCalled();
    
    // Verify the event data structure
    expect(kickCounter1).toHaveBeenCalledWith({
      timestamp: 5000,
      velocity: 100
    });
    
    // Simulate a snare drum hit
    const snareMessage: MIDIMessage = {
      type: MIDIMessageType.NOTE_ON,
      data: new Uint8Array([0x90, ALESIS_NITRO_SNARE_NOTE, 120]),
      timestamp: 6000,
      note: ALESIS_NITRO_SNARE_NOTE,
      velocity: 120,
      channel: 0
    };
    
    // Process the message
    messageCallback(snareMessage);
    
    // Verify both snare callbacks were triggered
    expect(kickCounter1).toHaveBeenCalledTimes(1);
    expect(kickCounter2).toHaveBeenCalledTimes(1);
    expect(snareCounter1).toHaveBeenCalledTimes(1);
    expect(snareCounter2).toHaveBeenCalledTimes(1);
    
    // Verify the event data structure
    expect(snareCounter1).toHaveBeenCalledWith({
      timestamp: 6000,
      velocity: 120
    });
    
    // Unsubscribe one of each
    alesisDrumKit.offKickHit(kickCounter1);
    alesisDrumKit.offSnareHit(snareCounter1);
    
    // Trigger another kick hit
    messageCallback(kickMessage);
    
    // Verify only the subscribed callbacks were triggered
    expect(kickCounter1).toHaveBeenCalledTimes(1); // Still 1, not triggered again
    expect(kickCounter2).toHaveBeenCalledTimes(2); // Increased to 2
    expect(snareCounter1).toHaveBeenCalledTimes(1);
    expect(snareCounter2).toHaveBeenCalledTimes(1);
    
    // Cleanup
    alesisDrumKit.cleanup();
  });
  
  it('should handle non-Alesis devices gracefully', () => {
    // Initialize the AlesisDrumKit
    alesisDrumKit.initialize();
    
    // Simulate connection with non-Alesis devices
    connectionStatusCallback(MIDIConnectionStatus.CONNECTED, [
      { id: 'device1', name: 'Some Other MIDI Device', manufacturer: 'Other', state: 'connected', type: 'input' }
    ]);
    
    // Verify no device was detected
    expect(alesisDrumKit.isDeviceConnected()).toBe(false);
    expect(alesisDrumKit.getDeviceInfo()).toBeNull();
    
    // Create callback counters
    const kickCounter = vi.fn();
    const snareCounter = vi.fn();
    
    // Register callbacks
    alesisDrumKit.onKickHit(kickCounter);
    alesisDrumKit.onSnareHit(snareCounter);
    
    // Simulate a kick drum hit
    const kickMessage: MIDIMessage = {
      type: MIDIMessageType.NOTE_ON,
      data: new Uint8Array([0x90, ALESIS_NITRO_KICK_NOTE, 100]),
      timestamp: 7000,
      note: ALESIS_NITRO_KICK_NOTE,
      velocity: 100,
      channel: 0
    };
    
    // Process the message
    messageCallback(kickMessage);
    
    // Callbacks should still work even if device not detected
    expect(kickCounter).toHaveBeenCalledTimes(1);
    expect(snareCounter).not.toHaveBeenCalled();
    
    // Cleanup
    alesisDrumKit.cleanup();
  });
}); 