/**
 * Skill-Jack: Web Audio API for Game Synchronization
 * 
 * Provides guidance on using the Web Audio API for precise audio playback synchronized with game loops and visuals.
 * 
 * @module brain-garden/skill-jack
 * @category tools
 */

/**
 * Skill-Jack on Web Audio API Synchronization
 * 
 * This constant provides comprehensive guidance on understanding and applying
 * the Web Audio API for loading, playing, and accurately synchronizing audio with game events in Djentronome.
 */
export const webAudioSynchronizationGuide = {
  topic: "Web Audio API for Game Synchronization",
  description: "Covers creating an AudioContext, decoding audio data, scheduling playback using AudioBufferSourceNode, and synchronizing audio events with the game loop (requestAnimationFrame) considering latency.",
  corePrinciples: [
    {
      name: "AudioContext is the Core",
      description: "All Web Audio operations happen within an AudioContext. It represents the audio processing graph. It should ideally be created once, often after a user interaction.",
      examples: ["`const audioCtx = new (window.AudioContext || window.webkitAudioContext)();`", "Resuming context after user gesture: `audioCtx.resume()`"],
    },
    {
      name: "Asynchronous Decoding",
      description: "Audio file data (fetched via `fetch` or from `FileReader`) needs to be decoded into an AudioBuffer asynchronously using `audioCtx.decodeAudioData()`.",
      examples: ["Fetching an audio file, getting ArrayBuffer response.", "Passing ArrayBuffer to `decodeAudioData` and handling the Promise/callback."],
    },
    {
      name: "AudioBufferSourceNode for Playback",
      description: "Playback of decoded AudioBuffer data is handled by creating an AudioBufferSourceNode, connecting it to the context's destination (or other nodes), and calling its `start()` method.",
      examples: ["`const source = audioCtx.createBufferSource();`", "`source.buffer = decodedAudioBuffer;`", "`source.connect(audioCtx.destination);`", "`source.start(when, offset, duration);`"],
    },
    {
      name: "Precise Scheduling with `start()`",
      description: "The `start(when, offset)` method allows precise scheduling. `when` uses the `audioCtx.currentTime` clock. Playback starts at `when` seconds on the context clock, playing from `offset` seconds within the buffer.",
      examples: ["`source.start(audioCtx.currentTime + 0.1);` // Start in 100ms", "`source.start(0, 30);` // Start immediately, playing from 30s into the audio buffer."],
    },
    {
      name: "AudioContext Clock (`currentTime`) vs. Game Loop Clock (`performance.now()`) ",
      description: "The AudioContext has its own high-precision clock (`audioCtx.currentTime`) which advances independently. Game logic typically uses `performance.now()` or `requestAnimationFrame` timestamps. Synchronization requires relating these two clocks.",
      examples: ["Storing `performance.now()` when `audioCtx.resume()` is called.", "Calculating expected audio position based on elapsed game time."],
    },
    {
      name: "Latency Considerations",
      description: "There's inherent latency in audio processing (`audioCtx.baseLatency` or `outputLatency`). For rhythm games, this latency needs to be accounted for, often via user calibration, shifting visual cues or hit windows accordingly.",
      examples: ["Adding calibrated offset to visual note positions.", "Adjusting hit detection timing windows based on measured latency."],
    },
  ],
  applicationProcess: {
    description: "Steps for an agent to implement synchronized audio playback.",
    steps: [
      {
        name: "Initialize AudioContext",
        description: "Create and potentially resume the AudioContext.",
        agentActions: [
          {
            action: "Create a single AudioContext instance.",
            explanation: "`const audioCtx = new AudioContext();` Store it globally or in a state manager.",
          },
          {
            action: "Resume context on user interaction.",
            explanation: "Browsers often require `audioCtx.resume()` within a user gesture (e.g., click handler) to start audio playback due to autoplay policies.",
          },
        ],
      },
      {
        name: "Load and Decode Audio",
        description: "Fetch audio file data and decode it into an AudioBuffer.",
        agentActions: [
          {
            action: "Fetch the audio file (e.g., using `fetch API`).",
            explanation: "Get the response as an ArrayBuffer: `response.arrayBuffer()`.",
          },
          {
            action: "Call `audioCtx.decodeAudioData(arrayBuffer)`.",
            explanation: "Handle the Promise resolve (returns decoded AudioBuffer) and reject (error handling).",
          },
          {
            action: "Store the decoded AudioBuffer.",
            explanation: "Keep the buffer accessible for playback.",
          },
        ],
      },
      {
        name: "Implement Playback Logic",
        description: "Create functions to start and stop audio playback using an AudioBufferSourceNode.",
        agentActions: [
          {
            action: "Create a function `playAudio(audioBuffer, startTime)`.",
            explanation: "This function will handle creating and starting the source node.",
          },
          {
            action: "Inside `playAudio`, create an `AudioBufferSourceNode` (`audioCtx.createBufferSource()`).",
            explanation: "Create a new source node each time playback starts.",
          },
          {
            action: "Assign the stored `AudioBuffer` to `source.buffer`.",
            explanation: "Link the decoded data to the source node.",
          },
          {
            action: "Connect the source node: `source.connect(audioCtx.destination)`.",
            explanation: "Route the audio output to the speakers.",
          },
          {
            action: "Call `source.start(startTime)`. `startTime` should be based on `audioCtx.currentTime`.",
            explanation: "Schedule playback precisely. Store reference to the source node if stopping is needed.",
          },
          {
            action: "Implement a `stopAudio()` function using `sourceNode.stop()`.",
            explanation: "Allow stopping playback. Note that source nodes are single-use.",
          },
        ],
      },
      {
        name: "Synchronize with Game Loop",
        description: "Relate `audioCtx.currentTime` to the game loop's timing mechanism (e.g., `requestAnimationFrame`).",
        agentActions: [
          {
            action: "Record the relationship between `performance.now()` and `audioCtx.currentTime` when audio starts.",
            explanation: "E.g., `const audioStartPerfTime = performance.now(); const audioStartCtxTime = audioCtx.currentTime;` when `playAudio` is effectively called.",
          },
          {
            action: "In the game loop (`requestAnimationFrame` callback), calculate the current expected audio time.",
            explanation: "`const elapsedPerfTime = currentTimeStamp - audioStartPerfTime; const expectedAudioTime = audioStartCtxTime + elapsedPerfTime / 1000;`",
          },
          {
            action: "Use `expectedAudioTime` to position visual elements (notes on highway).",
            explanation: "Determine which notes should be visible based on the calculated current audio time.",
          },
          {
            action: "Use `expectedAudioTime` and calibration offset for hit detection timing.",
            explanation: "Compare MIDI `event.timeStamp` (converted to context time if needed) against the note's target time, adjusted by `expectedAudioTime` and calibration values.",
          },
        ],
      },
      {
        name: "Handle Latency and Calibration",
        description: "Implement mechanisms to measure and compensate for audio/visual/input latency.",
        agentActions: [
          {
            action: "Query `audioCtx.baseLatency` or `outputLatency` (may not be fully reliable or universally supported).",
            explanation: "Get an estimate of the inherent audio output latency.",
          },
          {
            action: "Implement a calibration routine.",
            explanation: "E.g., play a sound and flash a visual simultaneously, have user hit a pad, measure the difference between MIDI timestamp and expected audio/visual event time.",
          },
          {
            action: "Store the calibration offset.",
            explanation: "Persist the user's calibration value.",
          },
          {
            action: "Apply the calibration offset to visual timing or hit window logic.",
            explanation: "Adjust game elements to compensate for the measured latency.",
          },
        ],
      },
    ],
  },
  examples: {
    description: "Scenarios demonstrating Web Audio API usage for synchronization.",
    useCases: [
      {
        scenario: "Starting a song playback exactly 500ms after the user clicks 'Play'.",
        implementation: "In the click handler, after getting the AudioBuffer: `const startTime = audioCtx.currentTime + 0.5; playAudio(buffer, startTime);`",
        outcome: "Audio playback begins precisely 500ms after the click, synchronized with the AudioContext clock.",
      },
      {
        scenario: "Determining which notes should be currently visible on the note highway.",
        implementation: "In the `requestAnimationFrame` loop, calculate `expectedAudioTime`. Filter the song's note data to find notes whose time falls within the visible range (e.g., `expectedAudioTime` to `expectedAudioTime + visibleTimeSpan`).",
        outcome: "The correct notes are displayed scrolling towards the player based on synchronized audio time.",
      },
      {
        scenario: "Implementing a simple audio-visual latency calibration test.",
        implementation: "On button press: record `t0 = audioCtx.currentTime`, schedule a sound `source.start(t0 + 0.1)`, record `t1 = performance.now()`. In `requestAnimationFrame`, calculate elapsed time `delta = (perfNow - t1) / 1000`. Display a visual marker when `delta` is close to `0.1`. When user hits pad, record MIDI timestamp `midiTime`. Calculate offset based on `midiTime` vs the expected time.",
        outcome: "A numerical offset representing the user's perceived latency is obtained.",
      },
    ],
  },
  codeExamples: [
    {
      language: "typescript",
      description: "Loading and Decoding Audio Data",
      code: "async function loadAudio(audioCtx: AudioContext, url: string): Promise<AudioBuffer> {\n  try {\n    const response = await fetch(url);\n    if (!response.ok) {\n      throw new Error(`HTTP error! status: ${response.status}`);\n    }\n    const arrayBuffer = await response.arrayBuffer();\n    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);\n    console.log('Audio decoded successfully!');\n    return audioBuffer;\n  } catch (error) {\n    console.error('Error loading or decoding audio:', error);\n    throw error; // Re-throw for caller handling\n  }\n}",
      explanation: "Demonstrates fetching an audio file, converting the response to an ArrayBuffer, and using `audioCtx.decodeAudioData` to get an AudioBuffer, including basic error handling.",
    },
    {
      language: "typescript",
      description: "Starting Playback with AudioBufferSourceNode",
      code: "let currentSourceNode: AudioBufferSourceNode | null = null;\n\nfunction playAudio(audioCtx: AudioContext, audioBuffer: AudioBuffer, when: number = 0) {\n  // Stop previous source if it exists\n  if (currentSourceNode) {\n    try { currentSourceNode.stop(); } catch (e) { /* Ignore error if already stopped */ }\n  }\n\n  currentSourceNode = audioCtx.createBufferSource();\n  currentSourceNode.buffer = audioBuffer;\n  currentSourceNode.connect(audioCtx.destination);\n  \n  const startTime = when <= 0 ? audioCtx.currentTime : when; // Ensure start time is valid\n  currentSourceNode.start(startTime);\n  console.log(`Audio scheduled to start at: ${startTime}`);\n\n  // Clean up reference when playback ends\n  currentSourceNode.onended = () => {\n    currentSourceNode = null;\n    console.log('Audio playback finished.');\n  };\n}\n\nfunction stopAudio() {\n  if (currentSourceNode) {\n     try { \n        currentSourceNode.stop(); \n        console.log('Audio stopped.');\n     } catch (e) { \n        console.warn('Could not stop audio, possibly already stopped.');\n     } \n     currentSourceNode = null;\n  }\n}",
      explanation: "Provides functions to play (scheduling with `start`) and stop audio using a reusable `currentSourceNode` reference. Creates a new node each time play is called and includes basic cleanup.",
    },
  ],
  commonPitfalls: [
    {
      name: "AudioContext Not Resumed",
      description: "Calling `playAudio` before the AudioContext is resumed (usually via user interaction) results in silent failure or errors related to the context state.",
      solution: "Ensure `audioCtx.resume()` is called successfully within a user gesture handler before attempting playback.",
      preventativeMeasures: ["Check `audioCtx.state` before calling `start()`.", "Gate playback functionality behind a user action that also resumes the context."],
    },
    {
      name: "Reusing AudioBufferSourceNode",
      description: "Attempting to call `start()` multiple times on the same AudioBufferSourceNode instance. Source nodes are single-use.",
      solution: "Create a new AudioBufferSourceNode instance every time playback needs to start.",
      preventativeMeasures: ["Structure playback logic to always create a new source node."],
    },
    {
      name: "Incorrect Clock Synchronization",
      description: "Mixing `performance.now()`/`requestAnimationFrame` time directly with `audioCtx.currentTime` without establishing a proper reference point, leading to drift or inaccurate timing.",
      solution: "Establish a clear relationship between the two clocks when audio starts and calculate expected audio time based on elapsed performance time relative to that start point.",
      preventativeMeasures: ["Implement a dedicated time synchronization mechanism.", "Carefully manage time calculations in the game loop."],
    },
    {
      name: "Ignoring Latency",
      description: "Not accounting for inherent audio output latency, resulting in perceived timing mismatches in rhythm games.",
      solution: "Implement a user calibration feature to measure and store latency offset. Apply this offset to visual cues or hit detection windows.",
      preventativeMeasures: ["Design the game loop and rendering with latency compensation in mind from the start.", "Test on different hardware/systems to understand latency variance."],
    },
  ],
  resources: [
    {
      type: "documentation",
      name: "MDN Web Audio API Docs",
      description: "The primary reference for the Web Audio API.",
      link: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API",
    },
    {
      type: "documentation",
      name: "AudioContext",
      description: "Details on the core audio processing graph controller.",
      link: "https://developer.mozilla.org/en-US/docs/Web/API/AudioContext",
    },
    {
      type: "documentation",
      name: "AudioBufferSourceNode",
      description: "Documentation for the node used to play back AudioBuffers.",
      link: "https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode",
    },
    {
      type: "tutorial",
      name: "Web Audio API Basics (MDN)",
      description: "Introductory guide to concepts and usage.",
      link: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Basic_concepts",
    },
    {
      type: "tutorial",
      name: "Timing and Synchronization in Web Audio (Various Articles)",
      description: "Search for articles on precise timing and scheduling with Web Audio API for game development patterns.",
    }
  ],
  conclusion: "The Web Audio API offers precise control necessary for rhythm game synchronization. Mastering the AudioContext, asynchronous decoding, AudioBufferSourceNode scheduling, and the relationship between the audio clock and game loop time is essential for accurate audio playback and hit detection.",
}; 