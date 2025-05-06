# Core MIDI Package

A low-level MIDI connectivity and message handling package for the Djentronome rhythm game.

## Features

- Web MIDI API integration
- MIDI device connection management
- MIDI message parsing and event handling
- Support for NOTE_ON, NOTE_OFF and other MIDI message types
- Typed callback system for MIDI events

## Usage

```typescript
import { MIDIHandler, MIDIMessageType, MIDIConnectionStatus } from '@djentronome/core-midi';

// Create a MIDI handler
const midiHandler = new MIDIHandler();

// Listen for MIDI messages
midiHandler.onMessage((message) => {
  // Handle NOTE_ON messages (e.g., drum hits)
  if (message.type === MIDIMessageType.NOTE_ON) {
    console.log(`Note ${message.note} hit with velocity ${message.velocity}`);
    
    // Drum pad mapping example
    switch (message.note) {
      case 36: // Typically kick on Alesis Nitro
        console.log('Kick drum hit');
        break;
      case 38: // Typically snare on Alesis Nitro
        console.log('Snare drum hit');
        break;
    }
  }
});

// Monitor connection status
midiHandler.onConnectionStatusChange((status, devices) => {
  if (status === MIDIConnectionStatus.CONNECTED) {
    console.log('Connected to MIDI devices:', devices);
  } else if (status === MIDIConnectionStatus.PERMISSION_DENIED) {
    console.error('MIDI access denied by user. Please reload and allow MIDI access.');
  }
});

// Initialize MIDI access (automatically called by default, but can be called manually if needed)
midiHandler.initialize().catch(error => {
  console.error('Failed to initialize MIDI:', error);
});

// Clean up when done
function cleanup() {
  midiHandler.cleanup();
}
```

## API

### `MIDIHandler`

The main class for managing MIDI connections and messages.

#### Constructor

```typescript
new MIDIHandler(options?: MIDIHandlerOptions)
```

Options:
- `autoConnect`: Automatically connect on initialization (default: `true`)
- `sysexEnabled`: Enable System Exclusive messages (default: `false`)

#### Methods

- `initialize(): Promise<void>`: Initialize MIDI access and connect to devices
- `onMessage(callback: MIDIMessageCallback): void`: Register a callback for MIDI messages
- `offMessage(callback: MIDIMessageCallback): void`: Unregister a callback
- `onConnectionStatusChange(callback: MIDIConnectionCallback): void`: Register a callback for connection changes
- `offConnectionStatusChange(callback: MIDIConnectionCallback): void`: Unregister a callback
- `getConnectionStatus(): MIDIConnectionStatus`: Get current connection status
- `getDevices(): MIDIDeviceInfo[]`: Get connected MIDI devices information
- `cleanup(): void`: Clean up resources and event listeners

### MIDI Types

```typescript
// Message types
enum MIDIMessageType {
  NOTE_ON,
  NOTE_OFF,
  CONTROL_CHANGE,
  // ... and more
}

// Message structure
interface MIDIMessage {
  type: MIDIMessageType;
  data: Uint8Array;     // Raw MIDI data
  timestamp: number;    // When the message was received
  note?: number;        // MIDI note number (0-127)
  velocity?: number;    // Velocity/pressure (0-127)
  channel?: number;     // MIDI channel (0-15)
  // ... other properties
}

// Connection status
enum MIDIConnectionStatus {
  CONNECTED,
  DISCONNECTED,
  PERMISSION_DENIED,
  NOT_SUPPORTED,
  ERROR
}
```

## Notes

- The Web MIDI API requires HTTPS or localhost for security reasons
- User permission is required to access MIDI devices
- Not all browsers support the Web MIDI API (Chrome and Edge have good support) 