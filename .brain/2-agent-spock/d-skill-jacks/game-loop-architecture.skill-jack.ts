/**
 * Skill-Jack: Game Loop Architecture
 * 
 * Provides guidance on designing and implementing the main game loop for the Djentronome project.
 * 
 * @module brain-garden/skill-jack
 * @category architecture
 */

/**
 * Skill-Jack on Game Loop Architecture
 * 
 * This constant provides comprehensive guidance on understanding and applying
 * common game loop patterns and best practices suitable for a rhythm game like Djentronome.
 */
export const gameLoopArchitectureGuide = {
  topic: "Game Loop Architecture",
  description: "Covers the fundamental responsibilities of a game loop (input processing, state updates, rendering), different loop types (fixed vs. variable timestep), and strategies for managing timing and synchronization.",
  corePrinciples: [
    {
      name: "Core Responsibilities",
      description: "A game loop repeatedly performs three main tasks: Process Input, Update Game State, and Render Graphics.",
      examples: ["Checking for MIDI input.", "Advancing note positions based on elapsed time.", "Drawing the note highway and UI elements."],
    },
    {
      name: "Timing is Crucial",
      description: "The loop needs to manage time accurately to ensure consistent game speed, smooth animation, and correct synchronization between input, game state, and rendering/audio.",
      examples: ["Calculating delta time between frames.", "Using high-resolution timers like `performance.now()`."],
    },
    {
      name: "Decoupling Update Rate from Render Rate",
      description: "Game logic updates (physics, state changes) should ideally run at a consistent rate (fixed timestep) independent of how fast the graphics can be rendered (variable framerate), preventing gameplay speed variations.",
      examples: ["Running physics updates at 60Hz even if rendering runs at 120Hz.", "Using time accumulation techniques for fixed updates."],
    },
    {
      name: "`requestAnimationFrame` for Rendering",
      description: "Browser-based games should use `window.requestAnimationFrame(callback)` to schedule rendering. It syncs with the browser's refresh rate, optimizes performance, and pauses when the tab is inactive.",
      examples: ["The main loop driver is typically a function passed to `requestAnimationFrame`."],
    },
    {
      name: "State Management Integration",
      description: "The game loop interacts with the state management system (e.g., Zustand) to read current state for rendering/logic and dispatch updates based on input or time progression.",
    },
  ],
  applicationProcess: {
    description: "Steps for an agent to implement a robust game loop.",
    steps: [
      {
        name: "Choose Loop Type (Fixed vs. Variable Timestep)",
        description: "Decide on the primary loop strategy. A fixed timestep update loop combined with variable rendering via `requestAnimationFrame` is generally recommended for rhythm games.",
        agentActions: [
          {
            action: "Evaluate the need for deterministic physics/logic updates.",
            explanation: "Rhythm games rely heavily on precise timing, favoring fixed updates.",
          },
          {
            action: "Plan for a fixed update rate (e.g., 60 times per second).",
            explanation: "`const FIXED_UPDATE_MS = 1000 / 60;`",
          },
        ],
      },
      {
        name: "Setup Main Loop with `requestAnimationFrame`",
        description: "Create the main function that drives the loop.",
        agentActions: [
          {
            action: "Define a main `gameLoop(timestamp)` function.",
            explanation: "`timestamp` is provided by `requestAnimationFrame` (DOMHighResTimeStamp).",
          },
          {
            action: "Inside `gameLoop`, calculate delta time since the last frame.",
            explanation: "`const deltaTime = timestamp - lastTimestamp; lastTimestamp = timestamp;`",
          },
          {
            action: "Request the next animation frame.",
            explanation: "`requestAnimationFrame(gameLoop);` placed typically at the start or end of the function.",
          },
          {
            action: "Start the loop initially.",
            explanation: "`lastTimestamp = performance.now(); requestAnimationFrame(gameLoop);`",
          },
        ],
      },
      {
        name: "Implement Fixed Timestep Update Logic",
        description: "Integrate fixed-rate game state updates within the variable-rate render loop.",
        agentActions: [
          {
            action: "Maintain an accumulator for elapsed time.",
            explanation: "`accumulator += deltaTime;`",
          },
          {
            action: "Use a `while` loop to process fixed updates based on the accumulator.",
            explanation: "`while (accumulator >= FIXED_UPDATE_MS) { updateGameState(FIXED_UPDATE_MS); accumulator -= FIXED_UPDATE_MS; }`",
          },
          {
            action: "Create the `updateGameState(fixedDeltaTime)` function.",
            explanation: "This function handles all fixed-rate logic: advancing note positions, checking collisions/hit windows, updating scores, processing queued input events.",
          },
        ],
      },
      {
        name: "Process Input",
        description: "Handle user input (MIDI, keyboard) within the loop.",
        agentActions: [
          {
            action: "Poll input state from input handlers/systems at the beginning of the `gameLoop` or within `updateGameState`.",
            explanation: "MIDI events might be queued asynchronously; process the queue during the update.",
          },
          {
            action: "Translate raw input into game actions.",
            explanation: "Map MIDI notes or key presses to actions like 'hitKick', 'pause'.",
          },
        ],
      },
      {
        name: "Implement Rendering Logic",
        description: "Draw the current game state to the screen.",
        agentActions: [
          {
            action: "Create a `renderGame(interpolationFactor)` function.",
            explanation: "This function handles drawing the scene (note highway, UI). The `interpolationFactor` (optional) can be used for smoother rendering between fixed updates.",
          },
          {
            action: "Call `renderGame` once per `requestAnimationFrame` callback, after fixed updates.",
            explanation: "Render the latest state. Interpolation factor `alpha = accumulator / FIXED_UPDATE_MS` can be passed for smooth visuals.",
          },
          {
            action: "Inside `renderGame`, read the necessary game state.",
            explanation: "Get current note positions, score, UI state, etc.",
          },
          {
            action: "Call appropriate rendering functions (Canvas 2D, R3F).",
            explanation: "Draw the elements based on the current (potentially interpolated) state.",
          },
        ],
      },
      {
        name: "Handle Loop Control (Pause/Resume)",
        description: "Implement logic to pause and resume the game loop.",
        agentActions: [
          {
            action: "Use a boolean flag (`isPaused`).",
            explanation: "Check this flag at the beginning of the `gameLoop` function.",
          },
          {
            action: "If paused, skip the input processing and state update steps.",
            explanation: "Continue calling `requestAnimationFrame` to keep rendering (e.g., a pause menu) or cancel it if nothing needs rendering.",
          },
          {
            action: "When resuming, correctly handle `lastTimestamp` and the time accumulator to avoid jumps.",
            explanation: "Reset `lastTimestamp = performance.now();` when resuming.",
          },
        ],
      },
    ],
  },
  examples: {
    description: "Scenarios related to game loop implementation.",
    useCases: [
      {
        scenario: "Implementing a basic fixed timestep loop.",
        implementation: "Structure `gameLoop(timestamp)` with `requestAnimationFrame`. Calculate `deltaTime`. Accumulate time. Use a `while (accumulator >= FIXED_STEP)` loop calling `update(FIXED_STEP)`. Call `render()` once per frame.",
        outcome: "Game logic updates consistently, decoupled from rendering framerate.",
      },
      {
        scenario: "Ensuring smooth visuals despite variable frame rates.",
        implementation: "In the fixed timestep loop, calculate an interpolation factor `alpha = accumulator / FIXED_UPDATE_MS`. Pass `alpha` to the `render(alpha)` function. Inside `render`, calculate interpolated positions for rendering: `renderPos = previousPos * (1 - alpha) + currentPos * alpha`.",
        outcome: "Visual movement appears smoother even if rendering framerate fluctuates relative to the fixed update rate.",
      },
      {
        scenario: "Handling the 'Spiral of Death' (updates taking longer than the fixed step).",
        implementation: "Add a maximum limit to the number of fixed updates processed per frame in the `while` loop (e.g., max 5 updates). This prevents the game from freezing if updates become too slow, although it might cause temporal inaccuracies.",
        outcome: "The loop remains responsive even under heavy load, at the cost of potential simulation slowdown.",
      },
    ],
  },
  codeExamples: [
    {
      language: "typescript",
      description: "Simplified Fixed Timestep Game Loop Structure",
      code: `const FIXED_UPDATE_MS = 1000 / 60; // Target 60 updates per second
let lastTimestamp = 0;
let accumulator = 0;
let animationFrameId: number | null = null;
let isRunning = false;

function processInput() { /* ... check MIDI queue, keyboard ... */ }
function updateGameState(deltaTimeMs: number) { /* ... advance notes, check hits, update score ... */ }
function renderGame(interpolationAlpha: number) { /* ... draw notes, UI (potentially interpolating positions) ... */ }

function gameLoop(timestamp: number) {
  if (!isRunning) return;

  const deltaTime = timestamp - lastTimestamp;
  lastTimestamp = timestamp;

  // Prevent massive jumps if tab was inactive
  accumulator += Math.min(deltaTime, 1000); // Cap delta time, e.g., at 1 second

  processInput();

  let updateCount = 0;
  const MAX_UPDATES_PER_FRAME = 5; // Avoid spiral of death

  while (accumulator >= FIXED_UPDATE_MS && updateCount < MAX_UPDATES_PER_FRAME) {
    updateGameState(FIXED_UPDATE_MS);
    accumulator -= FIXED_UPDATE_MS;
    updateCount++;
  }

  const interpolationAlpha = accumulator / FIXED_UPDATE_MS;
  renderGame(interpolationAlpha);

  animationFrameId = requestAnimationFrame(gameLoop);
}

function startGame() {
  if (isRunning) return;
  isRunning = true;
  lastTimestamp = performance.now();
  accumulator = 0; // Reset accumulator
  animationFrameId = requestAnimationFrame(gameLoop);
  console.log('Game loop started.');
}

function stopGame() {
  if (!isRunning) return;
  isRunning = false;
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  console.log('Game loop stopped.');
}

// Call startGame() when ready, potentially after user interaction + audio context resume.
`,
      explanation: "Illustrates a game loop using requestAnimationFrame with a fixed timestep update achieved via an accumulator. Includes basic loop control (start/stop) and spiral of death prevention.",
    },
  ],
  commonPitfalls: [
    {
      name: "Variable Game Speed",
      description: "Tying game logic updates directly to the variable `deltaTime` from `requestAnimationFrame` causes game speed to fluctuate with framerate.",
      solution: "Implement a fixed timestep update loop using an accumulator, ensuring `updateGameState` is called with a constant delta time value.",
      preventativeMeasures: ["Adopt the fixed timestep pattern from the start."],
    },
    {
      name: "Incorrect Delta Time Calculation",
      description: "Errors in calculating the time elapsed between frames lead to incorrect simulation speed.",
      solution: "Ensure `deltaTime = currentTimestamp - lastTimestamp` is calculated correctly each frame, and `lastTimestamp` is updated.",
      preventativeMeasures: ["Use high-resolution timers (`performance.now()` or the `requestAnimationFrame` timestamp).", "Carefully track `lastTimestamp`."],
    },
    {
      name: "Ignoring Browser Throttling/Pausing",
      description: "`requestAnimationFrame` pauses when the tab is inactive. Naive delta time calculation upon resuming can cause a large jump in the accumulator, leading to a burst of updates or visual glitches.",
      solution: "Cap the maximum `deltaTime` used to increment the accumulator (e.g., `Math.min(deltaTime, 1000)`) to handle large gaps gracefully.",
      preventativeMeasures: ["Implement delta time capping.", "Consider explicitly pausing/resuming game logic on visibility changes."],
    },
    {
      name: "Mixing Clocks (Audio vs. RAF)",
      description: "Using `audioCtx.currentTime` directly for game logic updates or `performance.now()` for audio scheduling without proper synchronization.",
      solution: "Synchronize clocks as described in the Web Audio skill-jack. Use the game loop's clock (derived from RAF timestamp) for game state updates and visual positioning. Use the AudioContext clock for scheduling audio events (`source.start()`).",
      preventativeMeasures: ["Clearly define which clock governs which system.", "Implement explicit synchronization logic where clocks interact."],
    }
  ],
  resources: [
    {
      type: "reference",
      name: "Game Loop (Game Programming Patterns by Robert Nystrom)",
      description: "Excellent chapter explaining various game loop patterns in detail.",
      link: "https://gameprogrammingpatterns.com/game-loop.html",
    },
    {
      type: "documentation",
      name: "MDN: requestAnimationFrame",
      description: "Documentation for the core browser animation API.",
      link: "https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame",
    },
    {
      type: "tutorial",
      name: "Fix Your Timestep! (Glenn Fiedler)",
      description: "Classic article explaining fixed timestep loops and their importance.",
      link: "https://gafferongames.com/post/fix_your_timestep/",
    },
    {
      type: "documentation",
      name: "MDN: High resolution time API (`performance.now()`)",
      description: "Documentation for the high-precision timer.",
      link: "https://developer.mozilla.org/en-US/docs/Web/API/Performance/now",
    }
  ],
  conclusion: "A well-structured game loop is the heart of any game. For Djentronome, a fixed timestep update loop driven by `requestAnimationFrame` is recommended to ensure accurate rhythm synchronization, consistent logic execution, and smooth rendering.",
}; 