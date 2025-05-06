# Feature Task Plan

## Feature: Web MIDI Integration (Alesis Nitro Kick/Snare)

## Task: Implement Detection and Processing of Kick and Snare from Alesis Nitro

## Status: ✅ Implemented

## Last Updated: 2023-07-21

## Related Documentation:
- Feature Index: ../../../../docs/features/web-midi-integration/web-midi-integration.index.md
- Technical Details Doc: ../../../../docs/features/web-midi-integration/technical-details.md

## 1. Overview

This feature will implement the core functionality to detect and process MIDI signals from an Alesis Nitro electronic drum kit, specifically focusing on kick (bass drum) and snare drum inputs. The implementation will use the Web MIDI API to receive, identify, and process these drum triggers, making them available for the rhythm game mechanics.

## 2. Codebase Analysis

### 2.1. Key Files & Modules

* `packages/core-midi/src/midi-handler.ts`: Core class for handling MIDI device connections and messages.
* `packages/core-midi/src/types/index.ts`: Type definitions for MIDI messages and interfaces.
* `packages/core-midi/src/web-midi.d.ts`: TypeScript definition file for Web MIDI API.
* `packages/core-midi/src/index.ts`: Entry point for the core-midi package.
* `packages/core-midi/testing/integration/midi-rhythm-engine.integration.test.ts`: Integration tests for MIDI with rhythm engine.
* `packages/core-midi/src/alesis-drum-kit.ts`: Specialized class for Alesis Nitro drum kit detection and processing.
* `packages/core-midi/src/alesis-drum-kit-fallback.ts`: Keyboard fallback mechanism for testing without physical hardware.

### 2.2. Dependencies

* `@kit/testing`: Workspace dependency for testing infrastructure.
* `Web MIDI API`: Browser API for accessing MIDI devices.

### 2.3. Potential Concerns

* Browser compatibility: Web MIDI API is not supported in all browsers.
* User permission: Access to MIDI devices requires explicit user permission.
* Latency calibration: Timing is critical for a rhythm game and needs appropriate calibration.
* Device detection: The Alesis Nitro kit must be properly identified among other MIDI devices.
* [X] Mark as addressed

## 3. Architectural Considerations

### 3.1. Selected Paradigm

* Event-based architecture - MIDI input processing is naturally event-driven, making this the most suitable pattern for handling asynchronous MIDI events.
* [X] Confirmed with the user

### 3.2. Selected Design Patterns

* Observer Pattern - For handling MIDI events and notifying registered listeners of drum hits.
* [X] Confirmed with the user
* Adapter Pattern - To adapt the raw MIDI messages into meaningful game events (kick and snare drums).
* [X] Confirmed with the user

### 3.3. Architectural Considerations & Rationale

The chosen architecture leverages an event-driven approach with the Observer pattern, which is well-suited for processing real-time MIDI input events. The existing `MIDIHandler` class already implements the core functionality for connecting to MIDI devices and parsing messages. Our implementation extends this by:

1. Adding specific detection for Alesis Nitro drum kit devices.
2. Implementing specialized processing for kick (note 36) and snare (note 38) drum hits.
3. Creating a higher-level abstraction layer that translates raw MIDI events into game-specific drum events.

This approach keeps the core MIDI handling logic separate from the game-specific logic, promoting code reuse and maintainability. The Adapter pattern bridges the gap between the raw MIDI data and the game's expected input format.

Pros:
- Clear separation of concerns between general MIDI handling and game-specific processing
- Extensible to support additional drum components in the future
- Event-based architecture aligns with the asynchronous nature of MIDI input

Cons:
- Additional abstraction layer adds some complexity
- Requires careful timing synchronization between MIDI events and game logic

* [X] Confirmed with the user

## 4. Project Task List Foresight

### 4.1. Downstream Impacts

* This implementation directly supports F8: Hit Detection & Basic Scoring, as it provides the input mechanisms for detecting player actions.
* The timing data from MIDI events will be crucial for F12: Latency Calibration Tool.
* The core functionality will need to integrate with F6: Basic Game Loop to trigger game events based on MIDI input.
* [X] Reviewed and confirmed no negative impacts

### 4.2. Future-Proofing Considerations

* Design the drum hit detection system to be extensible for additional drum components (hi-hat, toms, cymbals) in future iterations.
* Implement device connection state management that gracefully handles disconnections and reconnections during gameplay.
* Consider a fallback mechanism for testing without physical drum hardware (e.g., keyboard triggers).
* Provide configuration options for different drum kits beyond the Alesis Nitro to support a wider range of hardware.
* [X] Discussed with the user and incorporated feedback

## 5. Testing Strategy

### 5.1. Available Testing Options

* `[X] Unit Tests`
    * Location: `packages/core-midi/src/*.unit.test.ts`
    * Command to run all tests: `pnpm test --filter @djentronome/core-midi -- alesis-drum-kit`
    * Command to run a single test: `pnpm test --filter @djentronome/core-midi -- -t 'test name'`
    * Relevant Skill Jacks: `Read @.brain/2-agent-spock/d-skill-jacks/tdd-vitest.skill-jack.ts`

* `[X] Integration Tests`
    * Location: `packages/core-midi/testing/integration/*.integration.test.ts`
    * Command to run all tests: `pnpm test --filter @djentronome/core-midi -- alesis-drum-kit-rhythm-engine`
    * Command to run a single test: `pnpm test --filter @djentronome/core-midi -- -t 'test name'`
    * Relevant Skill Jacks: `Read @.brain/2-agent-spock/d-skill-jacks/tdd-vitest.skill-jack.ts`

### 5.2. Selected Testing Approach

We used a combination of unit tests and integration tests for this feature:

* Unit tests verified individual components of the MIDI handling system, including Alesis Nitro detection, note parsing, and drum hit identification.
* Integration tests verified the interaction between the MIDI handler and other game components, such as the rhythm engine.

For unit tests, we mocked the Web MIDI API to simulate MIDI events without requiring physical hardware. This approach allows us to test the logic comprehensively without hardware dependencies.

For integration tests, we used mocked MIDI inputs to simulate hardware interaction.

* [X] Confirmed testing approach aligns with project standards.

## 6. MECE Task Breakdown & TDD Plan

### 6.1. Subtask 1: Create Alesis Nitro Device Detector

* [X] Task completed
* [X] Create test cases for detecting Alesis Nitro devices among available MIDI inputs
* [X] Test cases reviewed and approved
* Relevant Skill Jacks: `Read @.brain/2-agent-spock/d-skill-jacks/web-midi-integration.skill-jack.ts`
* Testing Type: Unit

### 6.2. Subtask 2: Implement Drum Hit Detector

* [X] Task completed
* [X] Create test cases for detecting kick (note 36) and snare (note 38) hits from MIDI Note On messages
* [X] Implement velocity sensitivity detection for dynamic gameplay
* [X] Test cases reviewed and approved
* Relevant Skill Jacks: `Read @.brain/2-agent-spock/d-skill-jacks/web-midi-integration.skill-jack.ts`
* Testing Type: Unit

### 6.3. Subtask 3: Create DrumKit Class for Game Integration

* [X] Task completed
* [X] Create a high-level DrumKit class that translates MIDI events to game-specific drum events
* [X] Implement callbacks for kick and snare drum hits with timestamps and velocity
* [X] Test cases reviewed and approved
* Relevant Skill Jacks: `Read @.brain/2-agent-spock/d-skill-jacks/web-midi-integration.skill-jack.ts`
* Testing Type: Unit

### 6.4. Subtask 4: Implement Connection State Management

* [X] Task completed
* [X] Create UI indicators for MIDI connection state (connected, disconnected, etc.)
* [X] Implement reconnection logic for when devices disconnect and reconnect
* [X] Test cases reviewed and approved
* Relevant Skill Jacks: `Read @.brain/2-agent-spock/d-skill-jacks/web-midi-integration.skill-jack.ts`
* Testing Type: Unit and Integration

### 6.5. Subtask 5: Create Integration Tests with Rhythm Engine

* [X] Task completed
* [X] Develop integration tests to verify drum hits correctly trigger rhythm engine events
* [X] Test timing accuracy between MIDI events and game events
* [X] Test cases reviewed and approved
* Relevant Skill Jacks: `Read @.brain/2-agent-spock/d-skill-jacks/tdd-vitest.skill-jack.ts`
* Testing Type: Integration

### 6.6. Subtask 6: Implement Fallback Mechanism for Testing

* [X] Task completed
* [X] Create keyboard/mouse fallback for testing without physical drum hardware
* [X] Ensure consistent behavior between physical and virtual inputs
* [X] Test cases reviewed and approved
* Relevant Skill Jacks: `Read @.brain/2-agent-spock/d-skill-jacks/web-midi-integration.skill-jack.ts`
* Testing Type: Unit and Integration

### 6.7. Subtask 7: Update Documentation with Usage Examples

* [X] Task completed
* [X] Update technical documentation with detailed usage examples
* [X] Document connection process, event handling, and integration with game logic
* [X] Test cases reviewed and approved
* Relevant Skill Jacks: `Read @.brain/2-agent-spock/d-skill-jacks/monorepo-tooling-pnpm-turbo.skill-jack.ts`
* Testing Type: N/A 