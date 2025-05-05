/**
 * Skill-Jack: Web MIDI API Integration for Alesis Nitro
 * 
 * Provides guidance for accessing, configuring, and processing MIDI input from an Alesis Nitro drum kit using the Web MIDI API.
 * 
 * @module brain-garden/skill-jack
 * @category tools
 */

/**
 * Skill-Jack on Web MIDI API Integration
 * 
 * This constant provides comprehensive guidance on understanding and applying
 * the Web MIDI API to interact with an Alesis Nitro drum kit in the context of the Djentronome rhythm game.
 */
export const webMidiIntegrationGuide = {
  topic: "Web MIDI API Integration for Alesis Nitro",
  description: "Covers requesting access, identifying the Alesis Nitro kit, listening for MIDI messages (specifically Note On/Off for kick and snare), and handling potential timing or browser issues.",
  corePrinciples: [
    {
      name: "User Permission Required",
      description: "Access to MIDI devices requires explicit user permission granted via a browser prompt, typically triggered by `navigator.requestMIDIAccess()`.",
      examples: ["Handling the Promise returned by `requestMIDIAccess()`.", "Providing user feedback if access is denied."],
    },
    {
      name: "Asynchronous API",
      description: "The Web MIDI API is asynchronous. Operations like requesting access and receiving messages are handled via Promises and event listeners.",
      examples: ["Using `async/await` with `requestMIDIAccess`.", "Attaching `onmidimessage` event handlers."],
    },
    {
      name: "Device Identification",
      description: "MIDI devices are identified by name, manufacturer, and ID. Code must iterate through available inputs to find the target device (Alesis Nitro Kit).",
      examples: ["Iterating through `midiAccess.inputs.values()`.", "Checking `input.name` or `input.manufacturer` strings (may vary slightly)."],
    },
    {
      name: "Message Structure (Note On/Off)",
      description: "Drum hits typically generate Note On (message type 0x90-0x9F) and Note Off (0x80-0x8F) messages. The second byte indicates the note number (pitch), and the third byte indicates velocity.",
      examples: ["Parsing `event.data` array: `[status, note, velocity]`.", "Mapping Alesis Nitro note numbers (e.g., Kick=36, Snare=38) to game actions."],
    },
    {
      name: "Sysex Messages (Configuration/Optional)",
      description: "System Exclusive (Sysex) messages (0xF0 ... 0xF7) can be used for advanced configuration but require specific `sysex: true` permission during `requestMIDIAccess`. Generally not needed for basic note detection.",
    },
    {
      name: "Timestamping and Latency",
      description: "MIDI messages have a `timeStamp` property (DOMHighResTimeStamp) indicating when the event occurred. This is crucial for accurate rhythm game timing, but needs to be considered alongside browser/system latency.",
      examples: ["Using `event.timeStamp` for hit detection logic.", "Implementing calibration steps to adjust for latency."],
    },
  ],
  applicationProcess: {
    description: "Steps for an agent to implement Web MIDI input handling for the Alesis Nitro kit.",
    steps: [
      {
        name: "Request MIDI Access",
        description: "Request permission from the user to access MIDI devices.",
        agentActions: [
          {
            action: "Call `navigator.requestMIDIAccess({ sysex: false })`.",
            explanation: "Request access, typically within a user-initiated event handler (e.g., button click). Set `sysex` to false unless specifically needed.",
          },
          {
            action: "Handle the success (Promise resolve) case.",
            explanation: "Store the resolved `MIDIAccess` object for later use.",
          },
          {
            action: "Handle the failure (Promise reject) case.",
            explanation: "Inform the user that MIDI access was denied or failed.",
          },
        ],
      },
      {
        name: "Identify Alesis Nitro Input",
        description: "Find the specific MIDI input port corresponding to the Alesis Nitro kit.",
        agentActions: [
          {
            action: "Iterate through the `inputs` map from the `MIDIAccess` object (`midiAccess.inputs.values()`).",
            explanation: "Get the list of available MIDI input devices.",
          },
          {
            action: "Check the `name` property of each `MIDIInput` object.",
            explanation: "Look for a string containing 'Alesis Nitro' or similar identifier (exact name may vary). Provide fallback or selection UI if multiple devices match or none are found.",
          },
          {
            action: "Store a reference to the identified `MIDIInput` port.",
            explanation: "Keep the specific input port accessible for attaching listeners.",
          },
        ],
      },
      {
        name: "Attach Message Listener",
        description: "Listen for incoming MIDI messages from the selected Alesis Nitro input port.",
        agentActions: [
          {
            action: "Assign a callback function to the `onmidimessage` property of the selected `MIDIInput` port.",
            explanation: "`alesisNitroInput.onmidimessage = handleMIDIMessage;`",
          },
          {
            action: "Alternatively, use `addEventListener('midimessage', handleMIDIMessage)`.",
            explanation: "Standard event listener approach.",
          },
        ],
      },
      {
        name: "Process MIDI Messages",
        description: "Parse incoming MIDI messages to detect kick and snare hits.",
        agentActions: [
          {
            action: "Inside the `handleMIDIMessage` callback, access the `event.data` Uint8Array.",
            explanation: "Contains the raw MIDI bytes: `[status, data1, data2]`.",
          },
          {
            action: "Check the status byte for Note On messages (typically `0x90` to `0x9F`, often channel 10 for drums, so `0x99`). Ignore Note Off or velocity 0 Note On messages for simple hit detection.",
            explanation: "Focus on the message indicating the start of a note/hit.",
          },
          {
            action: "Check the second byte (`data1`) for the note number.",
            explanation: "Compare against known Alesis Nitro note numbers (Kick=36, Snare=38).",
          },
          {
            action: "Extract the timestamp (`event.timeStamp`).",
            explanation: "Get the precise time the message was received by the browser.",
          },
          {
            action: "Trigger game logic based on detected note and timestamp.",
            explanation: "Pass the note type (kick/snare) and timestamp to the scoring/gameplay system.",
          },
        ],
      },
      {
        name: "Handle Device Connection/Disconnection (Optional but Recommended)",
        description: "Listen for changes in MIDI device connections.",
        agentActions: [
          {
            action: "Attach a listener to `midiAccess.onstatechange`.",
            explanation: "This event fires when devices are connected or disconnected.",
          },
          {
            action: "Inside the handler, re-evaluate available inputs.",
            explanation: "Update the UI or internal state if the target device connects or disconnects.",
          },
        ],
      },
    ],
  },
  examples: {
    description: "Scenarios demonstrating Web MIDI API usage.",
    useCases: [
      {
        scenario: "Initializing MIDI access on application start or button click.",
        implementation: "Call `requestMIDIAccess`. On success, call a function to find the Alesis Nitro input and attach listeners. On failure, show an error message.",
        outcome: "MIDI system is initialized, listening for input if permission granted and device found.",
      },
      {
        scenario: "Mapping a kick drum hit (Note 36) to a game event.",
        implementation: "Inside `onmidimessage`, check if `event.data[0]` indicates Note On (e.g., `0x99`) and `event.data[1]` is `36`. If true, call `game.handleHit('kick', event.timeStamp)`.",
        outcome: "Kick drum hits trigger the corresponding action in the game logic with accurate timing.",
      },
      {
        scenario: "Allowing the user to select from multiple MIDI input devices.",
        implementation: "On `requestMIDIAccess` success, populate a dropdown/select UI element with `input.name` for all `midiAccess.inputs.values()`. Let the user choose, then attach the `onmidimessage` listener to the selected input.",
        outcome: "User can choose their MIDI device if multiple are present or if auto-detection fails.",
      },
    ],
  },
  codeExamples: [
    {
      language: "typescript",
      description: "Requesting MIDI Access and finding the device",
      code: "async function setupMIDI() {\n  try {\n    const midiAccess = await navigator.requestMIDIAccess({ sysex: false });\n    console.log('MIDI Access Granted!');\n\n    let alesisInput: MIDIInput | undefined = undefined;\n    const inputs = midiAccess.inputs.values();\n    for (let input = inputs.next(); input && !input.done; input = inputs.next()) {\n      // Look for a name containing 'Nitro' - adjust string if needed\n      if (input.value.name?.toLowerCase().includes('nitro')) {\n        alesisInput = input.value;\n        console.log(`Found Alesis Nitro: ${alesisInput.name}`);\n        break;\n      }\n    }\n\n    if (alesisInput) {\n      alesisInput.onmidimessage = handleMIDIMessage;\n      console.log('Attached MIDI message listener.');\n    } else {\n      console.warn('Alesis Nitro Kit not found.');\n      // Provide UI for manual selection if needed\n    }\n\n    midiAccess.onstatechange = (event: MIDIConnectionEvent) => {\n      console.log(`MIDI device state changed: ${event.port.name}, State: ${event.port.state}`);\n      // Optionally re-run device detection/setup logic here\n    };\n\n  } catch (error) {\n    console.error('Could not get MIDI access.', error);\n    // Inform user\n  }\n}",
      explanation: "Demonstrates requesting access, iterating inputs to find a device named 'Nitro', attaching a listener if found, and handling state changes.",
    },
    {
      language: "typescript",
      description: "Basic MIDI Message Handler for Kick/Snare",
      code: "const ALESIS_NITRO_KICK_NOTE = 36;\nconst ALESIS_NITRO_SNARE_NOTE = 38;\n\nfunction handleMIDIMessage(event: MIDIMessageEvent) {\n  const command = event.data[0] >> 4; // Extract command (ignore channel)\n  const note = event.data[1];\n  const velocity = event.data.length > 2 ? event.data[2] : 0; // Velocity is often 0 for Note Off\n\n  // Check for Note On command (0x9) and non-zero velocity\n  if (command === 9 && velocity > 0) {\n    const timestamp = event.timeStamp;\n    if (note === ALESIS_NITRO_KICK_NOTE) {\n      console.log(`Kick detected! Time: ${timestamp}, Velocity: ${velocity}`);\n      // Trigger game action: game.handleHit('kick', timestamp, velocity);\n    } else if (note === ALESIS_NITRO_SNARE_NOTE) {\n      console.log(`Snare detected! Time: ${timestamp}, Velocity: ${velocity}`);\n      // Trigger game action: game.handleHit('snare', timestamp, velocity);\n    }\n    // Add other notes if needed (toms, cymbals etc.)\n  } \n  // Note Off (command 8) or Note On with velocity 0 can be ignored for basic hit detection\n}",
      explanation: "Parses incoming MIDI messages, specifically looking for Note On events (command 9 with velocity > 0) for the defined kick and snare note numbers, then logs detection and indicates where game logic would be triggered.",
    },
  ],
  commonPitfalls: [
    {
      name: "Requesting Access Outside User Gesture",
      description: "Calling `requestMIDIAccess` without a preceding user action (like a button click) often fails due to browser security restrictions.",
      solution: "Trigger the `requestMIDIAccess` call from within an event handler tied to a user interaction.",
      preventativeMeasures: ["Always place MIDI initialization logic behind a user-activated control."],
    },
    {
      name: "Incorrect Device Name Matching",
      description: "The exact string for `input.name` can vary slightly between browsers or OS versions, causing device detection to fail.",
      solution: "Use a case-insensitive partial match (e.g., `includes('nitro')`) and consider logging all device names during development to confirm the target string. Provide a manual selection fallback.",
      preventativeMeasures: ["Test on multiple browsers/OS if possible.", "Implement robust fallback mechanisms."],
    },
    {
      name: "Ignoring Timestamps",
      description: "Relying on the time the `onmidimessage` handler executes rather than the `event.timeStamp` leads to inaccurate timing for rhythm games.",
      solution: "Always use `event.timeStamp` (DOMHighResTimeStamp) for correlating MIDI events with game time.",
      preventativeMeasures: ["Ensure game logic responsible for hit detection explicitly uses the provided timestamp."],
    },
    {
      name: "Handling Note Off / Zero Velocity",
      description: "Incorrectly triggering game actions on Note Off messages or Note On messages with velocity 0, which often signify the end of a note rather than the start.",
      solution: "In the message handler, explicitly check for Note On command (`0x9`) AND a velocity greater than 0 before triggering a hit.",
      preventativeMeasures: ["Clear conditional logic in the message handler."],
    },
     {
      name: "Lack of Error Handling/User Feedback",
      description: "Failing to handle rejected `requestMIDIAccess` promises or situations where the device isn't found, leaving the user confused.",
      solution: "Implement `.catch()` blocks for promises and provide clear UI feedback if MIDI access fails or the device cannot be found.",
      preventativeMeasures: ["Always include error handling for async operations.", "Design UI states for different MIDI connection statuses."],
    },
  ],
  resources: [
    {
      type: "documentation",
      name: "MDN Web MIDI API Docs",
      description: "The primary reference for the Web MIDI API.",
      link: "https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API",
    },
    {
      type: "documentation",
      name: "MIDIMessageEvent",
      description: "Details on the event object received by the listener, including the `data` and `timeStamp` properties.",
      link: "https://developer.mozilla.org/en-US/docs/Web/API/MIDIMessageEvent",
    },
    {
      type: "reference",
      name: "MIDI Specification (Note On/Off)",
      description: "Reference for MIDI message structure, status bytes, and note numbers.",
      link: "https://www.midi.org/specifications-old/item/table-1-summary-of-midi-message",
    },
     {
      type: "tutorial",
      name: "Web MIDI API Examples (Web Demos)",
      description: "Practical examples and demos using the Web MIDI API.",
      link: "https://webaudiodemos.appspot.com/input/index.html",
    }
  ],
  conclusion: "The Web MIDI API provides powerful browser-based access to MIDI devices like the Alesis Nitro. Correct implementation requires handling user permissions, asynchronous operations, device identification, message parsing, and careful timestamp management to achieve accurate real-time input for rhythm gameplay.",
}; 