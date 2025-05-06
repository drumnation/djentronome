/**
 * Core MIDI types
 */

/**
 * Represents a MIDI message
 */
export interface MIDIMessage {
  /**
   * Type of MIDI message
   */
  type: MIDIMessageType;
  
  /**
   * Raw MIDI data
   */
  data: Uint8Array;
  
  /**
   * Timestamp when the message was received
   */
  timestamp: number;
  
  /**
   * MIDI note number (if applicable)
   */
  note?: number;
  
  /**
   * MIDI velocity value (0-127)
   */
  velocity?: number;
  
  /**
   * MIDI channel (0-15)
   */
  channel?: number;
  
  /**
   * MIDI controller number (if applicable)
   */
  controller?: number;
  
  /**
   * MIDI value (0-127, for various purposes)
   */
  value?: number;
}

/**
 * Types of MIDI messages
 */
export enum MIDIMessageType {
  NOTE_ON = 'noteOn',
  NOTE_OFF = 'noteOff',
  CONTROL_CHANGE = 'controlChange',
  PROGRAM_CHANGE = 'programChange',
  PITCH_BEND = 'pitchBend',
  AFTERTOUCH = 'aftertouch',
  SYSEX = 'sysex',
  TIMING_CLOCK = 'timingClock',
  UNKNOWN = 'unknown'
}

/**
 * Status of a MIDI connection
 */
export enum MIDIConnectionStatus {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  PERMISSION_DENIED = 'permissionDenied',
  NOT_SUPPORTED = 'notSupported',
  ERROR = 'error'
}

/**
 * Options for the MIDI handler
 */
export interface MIDIHandlerOptions {
  /**
   * Whether to automatically connect to MIDI devices on initialization
   * @default true
   */
  autoConnect?: boolean;
  
  /**
   * MIDI device filters to use when requesting MIDI access
   */
  sysexEnabled?: boolean;
}

/**
 * Interface for MIDI device information
 */
export interface MIDIDeviceInfo {
  /**
   * Unique identifier for the device
   */
  id: string;
  
  /**
   * Manufacturer name
   */
  manufacturer: string;
  
  /**
   * Device name
   */
  name: string;
  
  /**
   * Connection state
   */
  state: 'connected' | 'disconnected';
  
  /**
   * Type of MIDI port
   */
  type: 'input' | 'output';
}

/**
 * Callback for MIDI message events
 */
export type MIDIMessageCallback = (message: MIDIMessage) => void;

/**
 * Callback for MIDI connection status changes
 */
export type MIDIConnectionCallback = (status: MIDIConnectionStatus, devices?: MIDIDeviceInfo[]) => void; 