# Technical Details: Web MIDI Integration (Alesis Nitro Kick/Snare)

## Overview
This feature implements the Web MIDI integration for the Alesis Nitro electronic drum kit, with a focus on detecting and processing kick and snare drum hits. The implementation uses the Web MIDI API to connect to the drum kit, identify specific MIDI notes for kick (36) and snare (38), and provide an event-based interface for the game to respond to drum hits with accurate timestamps.

## Key Design Decisions & Rationale
* **Separation of Concerns**: We've created a specialized `AlesisDrumKit` class that builds on the generic `MIDIHandler`, isolating drum-specific logic from general MIDI handling. This allows for cleaner code organization and easier testing.
* **Decision 1: Event-Based Architecture**: Using an Observer pattern where drum hits emit events with timestamps and velocity data. Rationale: Provides natural integration with the game loop and rhythm engine, allowing for loose coupling between input and game logic.
* **Decision 2: Fallback Mechanism**: Implemented keyboard fallback (`AlesisDrumKitFallback`) for development and testing without physical hardware. Rationale: Enables testing without dependency on physical MIDI devices and provides accessibility options for users without drums.
* **Decision 3: Device Auto-Detection**: Automatically scanning connected MIDI devices for Alesis Nitro. Rationale: Simplifies setup process for users while maintaining flexibility to handle other devices.

## Implementation Notes
* The `AlesisDrumKit` class automatically detects Alesis Nitro devices by checking for 'alesis' and 'nitro' in device names (case-insensitive).
* Keyboard fallback uses 'D' key for kick and 'F' key for snare, which can be customized via configuration.
* All drum hits include timestamps derived from the Web MIDI API's high-precision timestamps, crucial for accurate rhythm game timing.
* We handle device connection/disconnection events to provide resilience against devices being unplugged or reconnected during gameplay.
* The implementation properly cleans up resources and event listeners when no longer needed to prevent memory leaks.

## Usage / API
The primary classes exposed by this feature are:

```typescript
// Create a MIDI handler
const midiHandler = new MIDIHandler();
await midiHandler.initialize();

// Create an Alesis drum kit detector/processor
const drumKit = new AlesisDrumKit(midiHandler);
drumKit.initialize();

// Register callbacks for kick and snare hits
drumKit.onKickHit((event) => {
  console.log(`Kick hit! Time: ${event.timestamp}, Velocity: ${event.velocity}`);
  // Forward to game logic
  game.processInput({
    type: 'midi',
    value: ALESIS_NITRO_KICK_NOTE,
    timestamp: event.timestamp,
    velocity: event.velocity
  });
});

drumKit.onSnareHit((event) => {
  console.log(`Snare hit! Time: ${event.timestamp}, Velocity: ${event.velocity}`);
  // Forward to game logic
  game.processInput({
    type: 'midi',
    value: ALESIS_NITRO_SNARE_NOTE,
    timestamp: event.timestamp,
    velocity: event.velocity
  });
});

// For development without hardware, use the fallback:
const fallback = new AlesisDrumKitFallback();
fallback.initialize();

// Connect the fallback to the same game logic
fallback.onKickHit((event) => {
  game.processInput({
    type: 'midi',
    value: ALESIS_NITRO_KICK_NOTE,
    timestamp: event.timestamp,
    velocity: event.velocity
  });
});

// Clean up when done
drumKit.cleanup();
fallback.cleanup();
```

## Gotchas / Known Issues
* Browser compatibility: Web MIDI API is only supported in Chrome, Edge, and Opera. Firefox and Safari require extensions.
* User permissions: The Web MIDI API requires explicit user permission, which must be handled properly for good UX.
* Binding issues: When adding/removing event listeners, ensure you use the same function reference (bind or store the bound function).
* Timestamps: Different browsers may have slight variations in how they report MIDI timestamps, which may require calibration.
* Device naming: Some Alesis Nitro models might have slightly different device names. The current detection is flexible but might need adjustments for uncommon variants. 