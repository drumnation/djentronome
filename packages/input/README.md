# Input Handler Package

A flexible input handler for keyboard, MIDI, and gamepad inputs in the Djentronome rhythm game.

## Features

- Unified event system for different input devices
- Callback-based event handling
- Support for keyboard, MIDI, and gamepad input
- Simple enable/disable system for each input type

## Usage

```typescript
import { InputHandler, InputDeviceType, InputEvent } from '@djentronome/input';

// Create a new input handler
const inputHandler = new InputHandler();

// Enable keyboard input
inputHandler.enableKeyboard();

// Register a callback for input events
const handleInput = (event: InputEvent) => {
  console.log(`Input received: ${event.deviceType}, Key: ${event.code}, Pressed: ${event.pressed}`);
  
  // Handle game controls
  if (event.code === 'KeyA' && event.pressed) {
    // Handle A key press
  }
};

// Register for all device types
inputHandler.registerCallback(handleInput);

// Or register for a specific device type
inputHandler.registerCallback(handleInput, InputDeviceType.Keyboard);

// Later, unregister when no longer needed
inputHandler.unregisterCallback(handleInput);

// When done with the handler, clean up
inputHandler.cleanup();
```

## API

### `InputHandler`

The main class for handling input events.

#### Methods

- `enableKeyboard()`: Start listening for keyboard events
- `disableKeyboard()`: Stop listening for keyboard events
- `registerCallback(callback, deviceType?)`: Register a callback for input events
- `unregisterCallback(callback, deviceType?)`: Unregister a callback
- `cleanup()`: Remove all event listeners

### `InputEvent`

Interface representing an input event.

```typescript
interface InputEvent {
  deviceType: InputDeviceType;  // Type of input device
  code: string | number;        // Key/note/button code
  pressed: boolean;             // Whether pressed or released
  velocity?: number;            // Pressure (0-1, for MIDI)
  timestamp: number;            // When the event occurred
}
```

### `InputDeviceType`

Enum of supported input devices.

```typescript
enum InputDeviceType {
  Keyboard = 'keyboard',
  MIDI = 'midi',
  Gamepad = 'gamepad'
}
```
