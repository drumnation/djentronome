import { MIDIConnectionStatus, MIDIDeviceInfo, MIDIMessage, MIDIMessageType } from './types';
import { MIDIHandler } from './midi-handler';

/**
 * Note number for Alesis Nitro kick drum
 */
export const ALESIS_NITRO_KICK_NOTE = 36;

/**
 * Note number for Alesis Nitro snare drum
 */
export const ALESIS_NITRO_SNARE_NOTE = 38;

/**
 * Interface for drum hit event data
 */
export interface DrumHitEvent {
  /**
   * Timestamp when the hit was detected
   */
  timestamp: number;
  
  /**
   * Velocity of the hit (0-127)
   */
  velocity: number;
}

/**
 * Callback type for drum hit events
 */
export type DrumHitCallback = (event: DrumHitEvent) => void;

/**
 * Class for detecting and handling Alesis Nitro drum kit input
 */
export class AlesisDrumKit {
  private midiHandler: MIDIHandler;
  private device: MIDIDeviceInfo | null = null;
  private isInitialized = false;
  private kickCallbacks: Set<DrumHitCallback> = new Set();
  private snareCallbacks: Set<DrumHitCallback> = new Set();
  
  /**
   * Create a new AlesisDrumKit instance
   * @param midiHandler MIDIHandler instance to use for MIDI communication
   */
  constructor(midiHandler: MIDIHandler) {
    this.midiHandler = midiHandler;
  }
  
  /**
   * Initialize the drum kit and start listening for device connections
   */
  initialize(): void {
    if (this.isInitialized) {
      return;
    }
    
    // Listen for connection status changes to detect device
    this.midiHandler.onConnectionStatusChange(this.handleConnectionStatusChange.bind(this));
    
    // Listen for MIDI messages
    this.midiHandler.onMessage(this.handleMIDIMessage.bind(this));
    
    this.isInitialized = true;
  }
  
  /**
   * Handle connection status changes
   * @param status Current connection status
   * @param devices Available devices
   */
  private handleConnectionStatusChange(status: MIDIConnectionStatus, devices: MIDIDeviceInfo[] = []): void {
    // Only proceed if connected
    if (status !== MIDIConnectionStatus.CONNECTED) {
      this.device = null;
      return;
    }
    
    // Look for Alesis Nitro device
    for (const device of devices) {
      // Check for 'alesis' and 'nitro' in the device name (case insensitive)
      if (device.name.toLowerCase().includes('alesis') && 
          device.name.toLowerCase().includes('nitro')) {
        this.device = device;
        return;
      }
    }
    
    // No matching device found
    this.device = null;
  }
  
  /**
   * Handle incoming MIDI messages
   * @param message MIDI message
   */
  private handleMIDIMessage(message: MIDIMessage): void {
    // Only process NOTE_ON messages
    if (message.type !== MIDIMessageType.NOTE_ON) {
      return;
    }
    
    // Extract the note number and velocity
    const { note, velocity, timestamp } = message;
    
    // Only proceed if we have note data
    if (note === undefined || velocity === undefined) {
      return;
    }
    
    // Create drum hit event
    const event: DrumHitEvent = {
      timestamp,
      velocity
    };
    
    // Check for kick drum hit
    if (note === ALESIS_NITRO_KICK_NOTE) {
      this.kickCallbacks.forEach(callback => callback(event));
    }
    // Check for snare drum hit
    else if (note === ALESIS_NITRO_SNARE_NOTE) {
      this.snareCallbacks.forEach(callback => callback(event));
    }
  }
  
  /**
   * Register a callback for kick drum hits
   * @param callback Function to call when kick drum is hit
   */
  onKickHit(callback: DrumHitCallback): void {
    this.kickCallbacks.add(callback);
  }
  
  /**
   * Unregister a callback for kick drum hits
   * @param callback Previously registered callback
   */
  offKickHit(callback: DrumHitCallback): void {
    this.kickCallbacks.delete(callback);
  }
  
  /**
   * Register a callback for snare drum hits
   * @param callback Function to call when snare drum is hit
   */
  onSnareHit(callback: DrumHitCallback): void {
    this.snareCallbacks.add(callback);
  }
  
  /**
   * Unregister a callback for snare drum hits
   * @param callback Previously registered callback
   */
  offSnareHit(callback: DrumHitCallback): void {
    this.snareCallbacks.delete(callback);
  }
  
  /**
   * Check if an Alesis Nitro device is currently connected
   * @returns True if a device is connected, false otherwise
   */
  isDeviceConnected(): boolean {
    return this.device !== null;
  }
  
  /**
   * Get information about the connected Alesis Nitro device
   * @returns Device information or null if no device is connected
   */
  getDeviceInfo(): MIDIDeviceInfo | null {
    return this.device;
  }
  
  /**
   * Clean up resources used by the drum kit
   */
  cleanup(): void {
    // Remove all callbacks
    this.kickCallbacks.clear();
    this.snareCallbacks.clear();
    
    this.isInitialized = false;
  }
} 