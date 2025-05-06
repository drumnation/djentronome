import {
  MIDIConnectionStatus,
  MIDIDeviceInfo,
  MIDIMessage,
  MIDIMessageType,
  MIDIConnectionCallback,
  MIDIMessageCallback,
  MIDIHandlerOptions
} from './types';

/**
 * Default options for MIDIHandler
 */
const DEFAULT_OPTIONS: MIDIHandlerOptions = {
  autoConnect: true,
  sysexEnabled: false
};

/**
 * Core class for handling MIDI device connections and messages
 */
export class MIDIHandler {
  private midiAccess: WebMidi.MIDIAccess | null = null;
  private connectionStatus: MIDIConnectionStatus = MIDIConnectionStatus.DISCONNECTED;
  private messageCallbacks: Set<MIDIMessageCallback> = new Set();
  private connectionCallbacks: Set<MIDIConnectionCallback> = new Set();
  private devices: MIDIDeviceInfo[] = [];
  private options: MIDIHandlerOptions;

  /**
   * Create a new MIDIHandler
   */
  constructor(options: MIDIHandlerOptions = DEFAULT_OPTIONS) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    
    // Auto-connect if enabled
    if (this.options.autoConnect) {
      this.initialize().catch(error => {
        console.error('Error initializing MIDI:', error);
      });
    }
  }

  /**
   * Initialize MIDI access and connect to devices
   */
  async initialize(): Promise<void> {
    if (!navigator.requestMIDIAccess) {
      this.updateConnectionStatus(MIDIConnectionStatus.NOT_SUPPORTED);
      throw new Error('Web MIDI API is not supported in this browser');
    }

    try {
      this.midiAccess = await navigator.requestMIDIAccess({
        sysex: this.options.sysexEnabled
      });
      
      // Listen for connection state changes
      this.midiAccess.addEventListener('statechange', this.handleStateChange.bind(this));
      
      // Connect to all available input devices
      this.connectToDevices();
      
      this.updateConnectionStatus(MIDIConnectionStatus.CONNECTED);
    } catch (error) {
      // Handle permission errors
      if (error instanceof Error && error.message.includes('Permission')) {
        this.updateConnectionStatus(MIDIConnectionStatus.PERMISSION_DENIED);
      } else {
        this.updateConnectionStatus(MIDIConnectionStatus.ERROR);
      }
      
      throw error;
    }
  }

  /**
   * Connect to all available MIDI input devices
   */
  private connectToDevices(): void {
    if (!this.midiAccess) return;
    
    // Clear previous devices
    this.devices = [];
    
    // Connect to all inputs
    this.midiAccess.inputs.forEach(input => {
      // Store device info
      this.devices.push({
        id: input.id,
        manufacturer: input.manufacturer,
        name: input.name,
        state: input.state,
        type: 'input'
      });
      
      // Listen for MIDI messages
      input.addEventListener('midimessage', this.handleMIDIMessage.bind(this));
    });
  }

  /**
   * Handle MIDI state change events (connection/disconnection)
   */
  private handleStateChange(event: WebMidi.MIDIConnectionEvent): void {
    // Reconnect to devices
    this.connectToDevices();
    
    // Update connection status based on available devices
    if (this.devices.length === 0) {
      this.updateConnectionStatus(MIDIConnectionStatus.DISCONNECTED);
    } else {
      this.updateConnectionStatus(MIDIConnectionStatus.CONNECTED);
    }
  }

  /**
   * Handle incoming MIDI messages
   */
  private handleMIDIMessage(event: WebMidi.MIDIMessageEvent): void {
    const data = event.data;
    const message = this.parseMIDIMessage(data, event.timeStamp);
    
    // Notify all registered callbacks
    this.messageCallbacks.forEach(callback => {
      callback(message);
    });
  }

  /**
   * Parse raw MIDI data into a structured MIDIMessage
   */
  private parseMIDIMessage(data: Uint8Array, timestamp: number): MIDIMessage {
    // Basic message structure
    const message: MIDIMessage = {
      data,
      timestamp,
      type: MIDIMessageType.UNKNOWN
    };
    
    // Status byte determines the message type
    const statusByte = data[0];
    
    // Extract MIDI channel (lower 4 bits of status byte)
    const channel = statusByte & 0x0F;
    
    // Determine message type based on upper 4 bits of status byte
    const messageType = statusByte & 0xF0;
    
    // Handle different message types
    switch (messageType) {
      case 0x80: // Note Off
        message.type = MIDIMessageType.NOTE_OFF;
        message.note = data[1];
        message.velocity = data[2];
        message.channel = channel;
        break;
        
      case 0x90: // Note On
        // Note On with velocity 0 is equivalent to Note Off
        if (data[2] === 0) {
          message.type = MIDIMessageType.NOTE_OFF;
        } else {
          message.type = MIDIMessageType.NOTE_ON;
        }
        message.note = data[1];
        message.velocity = data[2];
        message.channel = channel;
        break;
        
      case 0xA0: // Aftertouch
        message.type = MIDIMessageType.AFTERTOUCH;
        message.note = data[1];
        message.value = data[2];
        message.channel = channel;
        break;
        
      case 0xB0: // Control Change
        message.type = MIDIMessageType.CONTROL_CHANGE;
        message.controller = data[1];
        message.value = data[2];
        message.channel = channel;
        break;
        
      case 0xC0: // Program Change
        message.type = MIDIMessageType.PROGRAM_CHANGE;
        message.value = data[1];
        message.channel = channel;
        break;
        
      case 0xE0: // Pitch Bend
        message.type = MIDIMessageType.PITCH_BEND;
        message.value = (data[2] << 7) + data[1]; // Combine MSB and LSB
        message.channel = channel;
        break;
        
      case 0xF0: // System messages
        if (data[0] === 0xF0) {
          message.type = MIDIMessageType.SYSEX;
        } else if (data[0] === 0xF8) {
          message.type = MIDIMessageType.TIMING_CLOCK;
        }
        break;
        
      default:
        message.type = MIDIMessageType.UNKNOWN;
    }
    
    return message;
  }

  /**
   * Update the connection status and notify callbacks
   */
  private updateConnectionStatus(status: MIDIConnectionStatus): void {
    this.connectionStatus = status;
    
    // Notify all registered callbacks
    this.connectionCallbacks.forEach(callback => {
      callback(status, this.devices);
    });
  }

  /**
   * Register a callback for MIDI messages
   */
  onMessage(callback: MIDIMessageCallback): void {
    this.messageCallbacks.add(callback);
  }

  /**
   * Unregister a callback for MIDI messages
   */
  offMessage(callback: MIDIMessageCallback): void {
    this.messageCallbacks.delete(callback);
  }

  /**
   * Register a callback for connection status changes
   */
  onConnectionStatusChange(callback: MIDIConnectionCallback): void {
    this.connectionCallbacks.add(callback);
    
    // Immediately invoke with current status
    callback(this.connectionStatus, this.devices);
  }

  /**
   * Unregister a callback for connection status changes
   */
  offConnectionStatusChange(callback: MIDIConnectionCallback): void {
    this.connectionCallbacks.delete(callback);
  }

  /**
   * Get the current connection status
   */
  getConnectionStatus(): MIDIConnectionStatus {
    return this.connectionStatus;
  }

  /**
   * Get information about all connected MIDI devices
   */
  getDevices(): MIDIDeviceInfo[] {
    return [...this.devices];
  }

  /**
   * Clean up resources and event listeners
   */
  cleanup(): void {
    if (this.midiAccess) {
      // Remove event listeners from all inputs
      this.midiAccess.inputs.forEach(input => {
        input.removeEventListener('midimessage', this.handleMIDIMessage.bind(this));
      });
      
      // Remove state change listener
      this.midiAccess.removeEventListener('statechange', this.handleStateChange.bind(this));
    }
    
    // Clear all callbacks
    this.messageCallbacks.clear();
    this.connectionCallbacks.clear();
    
    // Reset connection status
    this.connectionStatus = MIDIConnectionStatus.DISCONNECTED;
  }
} 