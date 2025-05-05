/**
 * Skill-Jack: Latency Compensation Logic
 * 
 * Provides guidance on implementing algorithms to measure and compensate for audio, visual, and input latency.
 * 
 * @module brain-garden/skill-jack
 * @category concepts
 */

/**
 * Skill-Jack on Latency Compensation Logic
 * 
 * This constant provides comprehensive guidance on understanding and applying
 * techniques to measure and compensate for the inherent delays in input processing, audio playback, and visual rendering in Djentronome.
 */
export const latencyCompensationGuide = {
  topic: "Latency Compensation Logic",
  description: "Covers methods for measuring combined system latency (input->process->audio/visual) and applying the measured offset to game timing mechanics like hit windows or visual note positioning.",
  corePrinciples: [
    {
      name: "Sources of Latency",
      description: "Latency arises from multiple sources: MIDI input hardware/drivers, USB polling, browser event loop, game logic processing, audio buffer/hardware delay (`AudioContext.outputLatency`), and display refresh rate/response time.",
    },
    {
      name: "Combined Measurement",
      description: "It's often impractical to measure each latency source individually. Calibration typically measures the *total* perceived latency from physical input to perceived audio/visual feedback.",
    },
    {
      name: "User Calibration is Key",
      description: "Since latency varies significantly based on user hardware, drivers, and system load, a user-driven calibration process is the most reliable way to determine the necessary offset.",
    },
    {
      name: "Compensation Strategies",
      description: "The measured latency offset can be applied in several ways: shifting the hit windows earlier, shifting visual note positions later, or adjusting the reference point for comparing input timestamps.",
      examples: ["Effective Hit Time = Note Target Time + Calibration Offset.", "Visual Note Position = Calculate based on (Current Audio Time - Calibration Offset)."],
    },
    {
      name: "AudioContext Clock Reference",
      description: "Using `AudioContext.currentTime` as the high-precision clock for scheduling audio and comparing event timestamps is crucial for accurate latency measurement and compensation.",
    },
  ],
  applicationProcess: {
    description: "Steps for an agent to implement a latency calibration tool and apply the offset.",
    steps: [
      {
        name: "Design Calibration Routine",
        description: "Create a process for the user to measure their perceived latency.",
        agentActions: [
          {
            action: "Plan a simple audio-visual-input task.",
            explanation: "Common method: Simultaneously play a short sound and flash a visual cue at regular intervals. User hits a specific drum pad (e.g., snare) exactly when they perceive the cue.",
          },
          {
            action: "Determine timing references.",
            explanation: "Use `AudioContext.currentTime` to schedule the audio/visual cue precisely.",
          },
          {
            action: "Record user input timestamps.",
            explanation: "Capture the `timeStamp` from the Web MIDI `MIDIMessageEvent` when the user hits the designated pad.",
          },
        ],
      },
      {
        name: "Implement Calibration UI",
        description: "Build the UI component for the calibration process.",
        agentActions: [
          {
            action: "Create a dedicated screen or modal for calibration.",
            explanation: "Provide clear instructions to the user.",
          },
          {
            action: "Implement the visual cue (e.g., flashing element, marker passing a line).",
            explanation: "Sync its appearance/timing with the audio cue using the game loop and AudioContext clock.",
          },
          {
            action: "Trigger the audio cue playback using `AudioBufferSourceNode.start(scheduledTime)`.",
            explanation: "Schedule the sound precisely using `audioCtx.currentTime`.",
          },
          {
            action: "Provide a button to start/stop the calibration test.",
            explanation: "Allow user control.",
          },
        ],
      },
      {
        name: "Implement Measurement Logic",
        description: "Calculate the latency based on user input during calibration.",
        agentActions: [
          {
            action: "For each user hit during calibration, record the MIDI `event.timeStamp`.",
            explanation: "Store these input timestamps.",
          },
          {
            action: "Calculate the precise target time when the audio/visual cue occurred, based on `audioCtx.currentTime`.",
            explanation: "This is the 'expected' hit time if there were zero latency.",
          },
          {
            action: "Calculate the delta for each hit: `delta = midiEventTimestamp - expectedCueTimestamp`.",
            explanation: "Convert timestamps to the same unit (e.g., seconds or ms). Note: MIDI timestamps might need conversion to align with AudioContext time if clocks differ significantly.",
          },
          {
            action: "Average the deltas over multiple hits to get a stable offset.",
            explanation: "Discard outliers if necessary. The average delta represents the measured latency.",
          },
          {
            action: "Store the calculated average offset persistently (e.g., localStorage via Zustand persist middleware).",
            explanation: "The user shouldn't need to recalibrate every session.",
          },
        ],
      },
      {
        name: "Apply Calibration Offset",
        description: "Integrate the stored offset into the core gameplay timing.",
        agentActions: [
          {
            action: "Retrieve the stored calibration offset.",
            explanation: "Load the value from storage/state.",
          },
          {
            action: "Adjust the hit window comparison logic.",
            explanation: "Instead of comparing `playerInputTime` vs `noteTargetTime`, compare `playerInputTime` vs `noteTargetTime + calibrationOffset`. Effectively shifts the hit windows earlier relative to the input time.",
          },
          {
            action: "Alternatively, adjust visual note positioning (less common for hit windows).",
            explanation: "Calculate visual position based on `currentGameAudioTime - calibrationOffset` to make notes arrive visually later, aligning with delayed input perception. Choose one primary compensation method.",
          },
          {
            action: "Ensure the offset is consistently applied wherever input timing is compared to game events.",
            explanation: "Apply in hit detection, scoring, etc.",
          },
        ],
      },
    ],
  },
  examples: {
    description: "Scenarios related to latency handling.",
    useCases: [
      {
        scenario: "User consistently hits notes slightly late according to raw timestamps.",
        implementation: "Run calibration routine. User hits the pad when they perceive the cue. Calculated average delta is positive (e.g., +50ms). This offset is stored.",
        outcome: "Gameplay logic now expects hits 50ms later than the note's raw target time, aligning the hit windows with the user's perceived timing.",
      },
      {
        scenario: "Applying compensation by adjusting hit windows.",
        implementation: "Calibration yields offset `O`. Hit judgment calculates `delta = inputTime - (noteTime + O)`. Comparison uses `abs(delta)` against `PERFECT_WINDOW`, etc.",
        outcome: "The effective center of the hit windows is shifted later by the offset amount `O`.",
      },
    ],
  },
  codeExamples: [
    {
      language: "typescript",
      description: "Conceptual Calibration Measurement",
      code: `// Assume: audioCtx, playCalibrationCue(startTime), stored MIDIEvents
let calibrationDeltas: number[] = [];
const NUM_CALIBRATION_HITS = 10;

function startCalibrationTest() {
  calibrationDeltas = [];
  // Logic to repeatedly schedule cues and collect MIDI input
  scheduleNextCue(audioCtx.currentTime + 1.0); // Start 1 sec from now
}

function scheduleNextCue(cueTargetTime: number) {
  if (calibrationDeltas.length >= NUM_CALIBRATION_HITS) {
    finishCalibration();
    return;
  }
  playCalibrationCue(cueTargetTime); // Plays sound + triggers visual
  // Store cueTargetTime associated with the next expected input
  // ... logic to wait for next MIDI input ...
}

function processCalibrationHit(midiEventTimestamp: number, expectedCueTimestamp: number) {
  // IMPORTANT: Ensure timestamps are comparable (e.g., both relative to navigationStart or converted to AudioContext time)
  // This might require converting midiEventTimestamp (performance.now based?) to audioCtx.currentTime base.
  // Let's assume they ARE comparable for this example:
  const delta = midiEventTimestamp - expectedCueTimestamp; 
  calibrationDeltas.push(delta);
  console.log(\`Hit \${calibrationDeltas.length}/\${NUM_CALIBRATION_HITS}, Delta: \${delta.toFixed(3)}s\`);
  scheduleNextCue(expectedCueTimestamp + 1.0); // Schedule next cue 1s after the last one
}

function finishCalibration() {
  // Calculate average delta (excluding potential outliers)
  const averageOffset = calibrationDeltas.reduce((a, b) => a + b, 0) / calibrationDeltas.length;
  console.log(\`Calibration complete. Average Offset: \${averageOffset.toFixed(3)}s\`);
  // Store averageOffset persistently (e.g., use zustand persist action)
  // useAppStore.getState().setCalibrationOffset(averageOffset);
}
`, 
      explanation: "Conceptual structure for a calibration routine. It schedules cues, collects MIDI input timestamps relative to expected cue times, calculates deltas, averages them, and stores the result.",
    },
    {
      language: "typescript",
      description: "Applying Offset in Hit Judging",
      code: `// Assuming judgeHit function from scoring skill-jack
// And calibrationOffset is retrieved from state/storage

const calibrationOffset = useAppStore(state => state.calibrationOffset); // Example retrieval

function checkHit(midiEventTimestamp: number, noteTargetTime: number) {
  const judgment = judgeHit(midiEventTimestamp, noteTargetTime, calibrationOffset);
  // ... process judgment (update score, combo, UI) ...
  console.log(\`Judged hit with offset \${calibrationOffset}: \${judgment}\`);
}`, 
      explanation: "Shows how the previously calculated `calibrationOffset` is passed into the `judgeHit` function (defined in the scoring skill-jack) to adjust the timing comparison.",
    },
  ],
  commonPitfalls: [
    {
      name: "Inconsistent Timestamp Bases",
      description: "Comparing `performance.now()`-based timestamps (like MIDI `event.timeStamp`) directly with `audioCtx.currentTime` without conversion, leading to incorrect delta calculations.",
      solution: "Establish a reference point. When the audio context is resumed or playback starts, record both `performance.now()` and `audioCtx.currentTime`. Use the difference to convert subsequent MIDI timestamps to the AudioContext timebase before comparison, or vice-versa.",
      preventativeMeasures: ["Explicitly handle timestamp conversions.", "Verify timestamp origins and units."],
    },
    {
      name: "Applying Offset Incorrectly",
      description: "Subtracting the offset when it should be added, or applying it to the wrong timestamp (player input vs. note target), effectively worsening the timing.",
      solution: "Carefully consider the meaning of the offset (e.g., positive offset means input is *later* than expected). Apply it to the `noteTargetTime` so the comparison checks `inputTime` against `noteTargetTime + offset`.",
      preventativeMeasures: ["Test calibration logic thoroughly.", "Add comments explaining the offset application."],
    },
    {
      name: "Calibration Routine Unreliability",
      description: "Calibration task is too difficult, cues are unclear, or too few samples are taken, leading to an inaccurate or unstable offset value.",
      solution: "Design a clear and simple calibration task. Use distinct audio/visual cues. Average over a reasonable number of hits (e.g., 10-20). Consider outlier rejection.",
      preventativeMeasures: ["Playtest the calibration process itself.", "Provide clear instructions."],
    },
    {
      name: "Not Persisting Calibration",
      description: "Requiring the user to recalibrate every time they start the application.",
      solution: "Store the calculated calibration offset in `localStorage` (e.g., using Zustand's `persist` middleware) and load it on startup.",
      preventativeMeasures: ["Integrate offset storage early."],
    },
  ],
  resources: [
    {
      type: "documentation",
      name: "MDN: AudioContext.currentTime",
      description: "Documentation for the high-precision audio clock.",
      link: "https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/currentTime",
    },
    {
      type: "documentation",
      name: "MDN: AudioContext.outputLatency",
      description: "Documentation for the estimated output latency property.",
      link: "https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/outputLatency",
    },
    {
      type: "reference",
      name: "Rhythm Game Latency Discussion (GDC, articles)",
      description: "Search for talks and articles specifically addressing latency challenges and calibration techniques in rhythm games.",
    }
  ],
  conclusion: "Effective latency compensation is critical for fairness and player satisfaction in rhythm games. It involves accurately measuring the combined system latency through user calibration and consistently applying the resulting offset to the core timing logic, typically by adjusting the expected hit time for notes.",
}; 