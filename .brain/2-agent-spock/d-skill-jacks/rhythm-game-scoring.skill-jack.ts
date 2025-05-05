/**
 * Skill-Jack: Rhythm Game Scoring Algorithms
 * 
 * Provides guidance on designing and implementing scoring logic for rhythm games like Djentronome.
 * 
 * @module brain-garden/skill-jack
 * @category concepts
 */

/**
 * Skill-Jack on Rhythm Game Scoring Algorithms
 * 
 * This constant provides comprehensive guidance on understanding and applying
 * common scoring mechanics found in rhythm games, including hit windows, accuracy judgements, score calculation, and combo multipliers.
 */
export const rhythmGameScoringGuide = {
  topic: "Rhythm Game Scoring Algorithms",
  description: "Covers the design and implementation of core scoring mechanics: defining hit windows, judging hit accuracy (e.g., Perfect, Great, Miss), calculating score per note, and implementing combo multipliers.",
  corePrinciples: [
    {
      name: "Hit Windows",
      description: "Define specific time ranges around a note's target time where player input is considered valid. Different windows correspond to different accuracy judgments.",
      examples: ["Perfect: +/- 30ms", "Great: +/- 60ms", "Good: +/- 100ms", "Input outside the largest window is a Miss."],
    },
    {
      name: "Accuracy Judgments",
      description: "Based on which hit window the player's input falls into, assign an accuracy judgment (Perfect, Great, Good, Miss, etc.). This often determines the score awarded and combo progression.",
    },
    {
      name: "Score Calculation",
      description: "Assign points based on the accuracy judgment. Often involves a base score per note multiplied by factors related to accuracy and current combo.",
      examples: ["Perfect: 100 base points", "Great: 50 base points", "Miss: 0 points", "Total Score = Sum(NoteBaseScore * AccuracyMultiplier * ComboMultiplier)"],
    },
    {
      name: "Combo Multiplier",
      description: "Reward consecutive successful hits (typically Perfects/Greats) by incrementing a combo counter. Missing a note usually resets the combo counter to zero.",
      examples: ["Combo increases score multiplier (e.g., 1x, 2x, 4x) at certain thresholds (10 hits, 25 hits).", "Miss breaks combo."],
    },
    {
      name: "Timing Comparison",
      description: "The core logic involves comparing the timestamp of the player's input (e.g., MIDI event timestamp, adjusted for latency) against the target timestamp of the note currently in the hit zone.",
      examples: ["`hitDelta = playerInputTimestamp - noteTargetTimestamp;`", "Checking `Math.abs(hitDelta)` against hit window thresholds."],
    },
    {
      name: "Handling Early/Late Hits and Multiple Inputs",
      description: "Decide how to handle inputs that are slightly early or late, or multiple inputs close together when only one note is present. Often, the input closest to the target time within the largest window is chosen, and subsequent inputs for that note are ignored.",
    },
  ],
  applicationProcess: {
    description: "Steps for an agent to implement a scoring system.",
    steps: [
      {
        name: "Define Hit Windows and Judgments",
        description: "Establish the timing thresholds and corresponding accuracy names.",
        agentActions: [
          {
            action: "Define constants for hit window timings (in milliseconds or seconds).",
            explanation: "`const PERFECT_WINDOW_MS = 30; const GREAT_WINDOW_MS = 60; ...`",
          },
          {
            action: "Define an enum or type for judgments.",
            explanation: "`type Judgment = 'Perfect' | 'Great' | 'Good' | 'Miss';`",
          },
        ],
      },
      {
        name: "Implement Hit Detection Logic",
        description: "Write the core function to compare input time against note time.",
        agentActions: [
          {
            action: "Create a function `judgeHit(playerInputTime, noteTargetTime, calibrationOffset)`.",
            explanation: "Takes relevant timestamps and the calculated latency offset.",
          },
          {
            action: "Calculate the adjusted time difference.",
            explanation: "`const delta = playerInputTime - (noteTargetTime + calibrationOffset);` Ensure consistent time units (e.g., seconds).",
          },
          {
            action: "Compare `Math.abs(delta)` against hit window constants.",
            explanation: "Check from tightest window (Perfect) outwards. Return the corresponding Judgment.",
          },
          {
            action: "Handle the Miss case (if delta exceeds the largest window).",
            explanation: "Return 'Miss'.",
          },
        ],
      },
      {
        name: "Track Notes and Input Registration",
        description: "Maintain the state of upcoming notes and register player inputs against them.",
        agentActions: [
          {
            action: "In the game loop or state, track which notes are currently within the active hit zone.",
            explanation: "Determine which note(s) an incoming player input should be compared against.",
          },
          {
            action: "When a player input (e.g., MIDI kick) occurs, find the corresponding active note(s).",
            explanation: "Typically, the earliest note of the correct type (kick/snare) within the hit zone.",
          },
          {
            action: "Call `judgeHit` with the input time and the note's target time.",
            explanation: "Get the accuracy judgment for that hit.",
          },
          {
            action: "Mark the note as 'hit' or 'judged' to prevent multiple judgments from subsequent inputs.",
            explanation: "Ensure one input corresponds to one judgment per note.",
          },
          {
            action: "Handle notes that pass through the hit zone without being hit (Miss).",
            explanation: "Trigger a 'Miss' judgment when a note's target time passes beyond the largest hit window without a registered hit.",
          },
        ],
      },
      {
        name: "Implement Score and Combo Logic",
        description: "Update the player's score and combo counter based on judgments.",
        agentActions: [
          {
            action: "Maintain `score` and `combo` variables in the game state.",
            explanation: "Initialize both to 0.",
          },
          {
            action: "Create a mapping from Judgment to base score points.",
            explanation: "`const scoreMap = { Perfect: 100, Great: 50, Good: 25, Miss: 0 };`",
          },
          {
            action: "When a judgment is made, update the score.",
            explanation: "`currentScore += scoreMap[judgment] * calculateComboMultiplier(combo);`",
          },
          {
            action: "Update the combo counter based on the judgment.",
            explanation: "If Perfect/Great/Good, increment combo: `combo += 1;`. If Miss, reset combo: `combo = 0;`.",
          },
          {
            action: "Implement `calculateComboMultiplier(combo)` function (optional).",
            explanation: "Return a multiplier based on combo thresholds (e.g., `if (combo >= 50) return 4; else if (combo >= 20) return 2; else return 1;`).",
          },
        ],
      },
      {
        name: "Display Feedback",
        description: "Show judgments, score, and combo to the player.",
        agentActions: [
          {
            action: "Trigger UI updates to display the Judgment text (Perfect, Miss) near the hit zone.",
            explanation: "Provide immediate visual feedback.",
          },
          {
            action: "Update score and combo displays in the HUD.",
            explanation: "Keep the player informed of their performance.",
          },
        ],
      },
    ],
  },
  examples: {
    description: "Scenarios illustrating scoring mechanics.",
    useCases: [
      {
        scenario: "Player hits a note within the Perfect window.",
        implementation: "`judgeHit` returns 'Perfect'. Score increases by base points * combo multiplier. Combo counter increments.",
        outcome: "Maximum score awarded, combo increases, 'Perfect' feedback shown.",
      },
      {
        scenario: "Player misses a note (input is too late or no input).",
        implementation: "Input comparison delta exceeds largest window OR note passes hit zone unhit. Judgment is 'Miss'. Score does not increase. Combo resets to 0.",
        outcome: "No score awarded, combo broken, 'Miss' feedback shown.",
      },
      {
        scenario: "Implementing a combo system where multiplier increases at 10 and 30 hits.",
        implementation: "`calculateComboMultiplier(combo)` returns 1 if combo < 10, 2 if 10 <= combo < 30, and 4 if combo >= 30.",
        outcome: "Score potential increases significantly as the player maintains a long combo.",
      },
    ],
  },
  codeExamples: [
    {
      language: "typescript",
      description: "Basic Hit Judging Function",
      code: `type Judgment = 'Perfect' | 'Great' | 'Good' | 'Miss';

const PERFECT_WINDOW_SEC = 0.030;
const GREAT_WINDOW_SEC   = 0.060;
const GOOD_WINDOW_SEC    = 0.100;

function judgeHit(playerInputTimeSec: number, noteTargetTimeSec: number, calibrationOffsetSec: number = 0): Judgment {\n  const adjustedTargetTime = noteTargetTimeSec + calibrationOffsetSec;\n  const delta = playerInputTimeSec - adjustedTargetTime;\n  const absDelta = Math.abs(delta);\n\n  if (absDelta <= PERFECT_WINDOW_SEC) {\n    return 'Perfect';\n  } else if (absDelta <= GREAT_WINDOW_SEC) {\n    return 'Great';\n  } else if (absDelta <= GOOD_WINDOW_SEC) {\n    return 'Good';\n  } else {\n    return 'Miss'; // Or handle misses separately when notes pass\n  }\n}`,
      explanation: "Calculates the time difference between input and target (adjusted for calibration), compares it to defined windows, and returns the corresponding accuracy judgment.",
    },
    {
      language: "typescript",
      description: "Updating Score and Combo in State (Conceptual - e.g., within Zustand store action)",
      code: `// Assuming Zustand store with: { score: number; combo: number; ... }
const scoreMap = { Perfect: 100, Great: 50, Good: 25, Miss: 0 };

function calculateComboMultiplier(combo: number): number {
  if (combo >= 30) return 4;
  if (combo >= 10) return 2;
  return 1;
}

// Example action within Zustand store
processJudgment(judgment: Judgment) {\n  set((state) => {\n    const currentCombo = judgment === 'Miss' ? 0 : state.combo + 1;\n    const scoreIncrease = scoreMap[judgment] * calculateComboMultiplier(judgment === 'Miss' ? 0 : state.combo);\n    \n    return { \n      score: state.score + scoreIncrease, \n      combo: currentCombo,\n      lastJudgment: judgment // For UI feedback
    };\n  });\n}`,
      explanation: "Conceptual code (like an action in a state management store) showing how to update the score and combo based on the judgment received. It uses a score map and calculates a combo multiplier.",
    },
  ],
  commonPitfalls: [
    {
      name: "Inconsistent Time Units",
      description: "Mixing milliseconds and seconds when comparing timestamps or defining hit windows.",
      solution: "Standardize on one unit (e.g., seconds or milliseconds) for all timing calculations (MIDI timestamps, audio time, hit windows).",
      preventativeMeasures: ["Clearly document the units used.", "Be careful during conversions."],
    },
    {
      name: "Ignoring Latency Calibration",
      description: "Comparing raw MIDI timestamps directly with calculated note target times without accounting for audio/visual/input latency, making the required timing feel unfair or inaccurate.",
      solution: "Implement a calibration feature (F12) and apply the resulting offset to the `noteTargetTime` before comparing with `playerInputTime`.",
      preventativeMeasures: ["Prioritize implementing the calibration tool.", "Always factor in the offset during hit judgment."],
    },
    {
      name: "Double Judging Notes",
      description: "Allowing multiple inputs (e.g., two quick snare hits) to be judged against the same single note, or judging a single input against multiple notes.",
      solution: "Implement logic to mark notes as 'judged' once a valid input is registered within their hit window. Ensure input processing only considers the most relevant active note for comparison.",
      preventativeMeasures: ["Add a `judged: boolean` or `judgment: Judgment | null` state to note objects.", "Carefully design the logic for associating input events with notes in the hit zone."],
    },
    {
      name: "Poorly Defined Hit Windows",
      description: "Hit windows that are too strict, too lenient, or overlap incorrectly, leading to frustrating or unsatisfying gameplay.",
      solution: "Start with standard values from other rhythm games and tune based on playtesting feedback. Ensure windows are nested correctly (Perfect inside Great inside Good).",
      preventativeMeasures: ["Research common hit window timings.", "Make hit windows easily configurable for tuning.", "Playtest extensively."],
    },
  ],
  resources: [
    {
      type: "reference",
      name: "Rhythm Game Design Articles/Talks",
      description: "Search for GDC talks or articles discussing rhythm game mechanics, scoring, and timing.",
    },
    {
      type: "reference",
      name: "Scoring System Examples (Other Games)",
      description: "Analyze how scoring and combo systems work in popular rhythm games like Guitar Hero, Beat Saber, osu!, DDR.",
    },
  ],
  conclusion: "A well-designed scoring system with clear hit windows, accuracy judgments, and rewarding combo mechanics is essential for an engaging rhythm game. Accurate timing comparison, considering latency, and handling edge cases like multiple inputs are key implementation challenges.",
}; 