/**
 * Skill-Jack: Data Structures for Game Rhythm Patterns
 * 
 * Provides guidance on choosing and designing data structures to represent rhythmic patterns for Djentronome.
 * 
 * @module brain-garden/skill-jack
 * @category concepts
 */

/**
 * Skill-Jack on Data Structures for Game Patterns
 * 
 * This constant provides comprehensive guidance on selecting and implementing
 * efficient data structures for storing, accessing, and processing kick/snare rhythm patterns.
 */
export const dataStructuresGamePatternsGuide = {
  topic: "Data Structures for Game Rhythm Patterns",
  description: "Covers suitable data structures (e.g., arrays of objects, timed event queues) for representing transcribed or manually defined rhythm patterns, considering efficient querying for gameplay.",
  corePrinciples: [
    {
      name: "Time-Based Representation",
      description: "The core data is time-based: each kick or snare event occurs at a specific point in the song's timeline.",
      examples: ["Representing a kick at 1.532 seconds."],
    },
    {
      name: "Event Attributes",
      description: "Each event needs attributes like its timestamp and type (kick/snare). Additional attributes like velocity, duration (if applicable), or judgment state might be added later.",
      examples: [`{ time: 1.532, type: 'kick', velocity: 100, judged: false }`],
    },
    {
      name: "Query Efficiency for Gameplay",
      description: "The data structure must allow efficient querying during the game loop to find notes currently within the visible range or the hit window based on the current audio time.",
      examples: ["Quickly finding all notes between time `t` and `t + lookaheadTime`."],
    },
    {
      name: "Sorted Order",
      description: "Storing events chronologically (sorted by time) is almost always essential for efficient processing during playback.",
    },
    {
      name: "Immutability (Post-Load)",
      description: "Once a song pattern is loaded or transcribed, the core note data structure should generally be treated as immutable during gameplay to avoid accidental modification.",
    },
  ],
  applicationProcess: {
    description: "Steps for an agent to choose and implement a data structure for rhythm patterns.",
    steps: [
      {
        name: "Define Event Object Structure",
        description: "Specify the TypeScript type or interface for a single rhythmic event.",
        agentActions: [
          {
            action: "Create a type `NoteEvent`.",
            explanation: "`type NoteEvent = { time: number; // in seconds type: 'kick' | 'snare'; // Add other types if needed id: string; // Unique ID velocity?: number; judged?: boolean; // For gameplay state };`",
          },
          {
            action: "Ensure essential fields (`time`, `type`, `id`) are present.",
            explanation: "Time is crucial for sorting and querying. Type distinguishes instruments. ID helps tracking.",
          },
        ],
      },
      {
        name: "Choose Primary Storage Structure",
        description: "Select the main data structure to hold the collection of NoteEvents.",
        agentActions: [
          {
            action: "Option 1: Sorted Array of Objects.",
            explanation: "`const pattern: NoteEvent[] = [ ... ]; pattern.sort((a, b) => a.time - b.time);` Simple to implement and understand. Good for moderate length songs.",
          },
          {
            action: "Option 2: Separate Arrays per Type (Sorted).",
            explanation: "`const kicks: NoteEvent[] = [...]; const snares: NoteEvent[] = [...];` Might simplify finding the next note of a specific type but requires managing multiple arrays.",
          },
          {
            action: "Option 3: More Advanced Structures (Consider later if needed).",
            explanation: "Structures like Interval Trees could optimize range queries, but add significant complexity. Start simpler.",
          },
          {
            action: "Recommend starting with a single sorted array (`NoteEvent[]`).",
            explanation: "It's the most straightforward approach and likely sufficient for initial needs. Performance can be optimized later.",
          },
        ],
      },
      {
        name: "Implement Loading/Parsing",
        description: "Load pattern data (e.g., from JSON) and parse it into the chosen data structure.",
        agentActions: [
          {
            action: "Fetch or read the pattern data file.",
            explanation: "E.g., load a JSON file containing an array of event objects.",
          },
          {
            action: "Parse the data into an array of `NoteEvent` objects.",
            explanation: "Ensure data conforms to the `NoteEvent` type.",
          },
          {
            action: "Sort the array by the `time` property.",
            explanation: "`pattern.sort((a, b) => a.time - b.time);` This is crucial for efficient querying.",
          },
          {
            action: "Assign unique IDs to each note if not present in the source data.",
            explanation: "Helps with state management and React keys if rendering individually.",
          },
        ],
      },
      {
        name: "Implement Efficient Querying for Gameplay",
        description: "Create functions to find relevant notes during the game loop.",
        agentActions: [
          {
            action: "Use pointer/index optimization for querying the sorted array.",
            explanation: "Maintain an index (`nextNoteIndex`) pointing to the next note to consider. In the game loop, only check notes from `nextNoteIndex` onwards whose `time` is within the relevant range (e.g., `currentTime` to `currentTime + lookahead`). Increment `nextNoteIndex` as notes pass.",
          },
          {
            action: "Implement `findNotesInTimeRange(startTime, endTime, pattern)`.",
            explanation: "This function uses the pointer optimization (or binary search if needed, though linear scan from the last index is often fine) to efficiently return notes within the specified time window.",
          },
          {
            action: "Implement `findNextNoteOfType(currentTime, type, pattern)`.",
            explanation: "Efficiently finds the next upcoming note of a specific type ('kick' or 'snare') after the current time, again using pointer optimization.",
          },
        ],
      },
    ],
  },
  examples: {
    description: "Scenarios involving rhythm pattern data structures.",
    useCases: [
      {
        scenario: "Storing a transcribed drum pattern from a JSON file.",
        implementation: "Define `NoteEvent` type. Load JSON data into `NoteEvent[]`. Sort the array by `time`.",
        outcome: "The rhythm pattern is stored in memory in a queryable, sorted format.",
      },
      {
        scenario: "Finding notes to display on the highway in the next 2 seconds.",
        implementation: "In the game loop, calculate `currentTime` and `lookaheadTime = currentTime + 2.0`. Call `findNotesInTimeRange(currentTime, lookaheadTime, pattern)` using pointer optimization to avoid searching the entire array each frame.",
        outcome: "Efficient retrieval of only the notes relevant for near-future rendering.",
      },
      {
        scenario: "Finding the target snare note when the player hits the snare pad.",
        implementation: "Get `inputTime`. Call `findNextNoteOfType(inputTime - maxHitWindow, 'snare', pattern)` to find the closest snare note within the hit window timing tolerance. The search starts from the `lastProcessedSnareIndex` to optimize.",
        outcome: "Quickly identifies the relevant note for hit judgment without iterating the whole pattern.",
      },
    ],
  },
  codeExamples: [
    {
      language: "typescript",
      description: "NoteEvent Type Definition",
      code: `type NoteType = 'kick' | 'snare'; // Can be extended

interface NoteEvent {
  id: string; // Unique identifier (e.g., generated UUID or index)
  time: number; // Time in seconds from the start of the song
  type: NoteType;
  velocity?: number; // Optional: MIDI velocity (0-127)
  duration?: number; // Optional: For notes with length
  judged?: boolean;  // Optional: Gameplay state tracking
  judgment?: 'Perfect' | 'Great' | 'Good' | 'Miss'; // Optional: Gameplay state
}`, 
      explanation: "A TypeScript interface defining the structure for each rhythmic event, including essential time/type and optional gameplay-related fields.",
    },
    {
      language: "typescript",
      description: "Querying Sorted Array with Pointer Optimization",
      code: `// Assume 'pattern' is NoteEvent[] sorted by time
let nextNoteIndex = 0;

function findNotesInTimeRange(startTime: number, endTime: number, pattern: NoteEvent[]): NoteEvent[] {\n  const visibleNotes: NoteEvent[] = [];\n  // Start search from the last known index\n  for (let i = nextNoteIndex; i < pattern.length; i++) {\n    const note = pattern[i];\n    if (note.time >= startTime && note.time < endTime) {\n      visibleNotes.push(note);\n    } else if (note.time >= endTime) {\n      // Notes are sorted, so we can stop searching early\n      break; \n    }\n    // Optimization: If a note is significantly before startTime, \n    // we might advance nextNoteIndex, but requires care.\n    // A simpler approach is to advance it only when notes are judged/passed.\n  }\n  return visibleNotes;\n}\n\n// In game loop, after notes pass the judgment line:
// If (note[nextNoteIndex].time < currentTime - hitWindow) { nextNoteIndex++; }`,
      explanation: "Demonstrates querying a sorted array efficiently. It maintains `nextNoteIndex` to avoid re-scanning past notes. The loop breaks early because the array is sorted. `nextNoteIndex` should be advanced as notes pass the hit/judgment line in the game loop.",
    },
  ],
  commonPitfalls: [
    {
      name: "Not Sorting the Pattern Data",
      description: "Failing to sort the array of note events by time after loading/parsing makes efficient time-based querying impossible.",
      solution: "Always call `.sort((a, b) => a.time - b.time)` on the note array immediately after it's populated.",
      preventativeMeasures: ["Include sorting as a mandatory step in the data loading process."],
    },
    {
      name: "Inefficient Querying (Full Array Scan)",
      description: "Searching the entire note array from the beginning on every game frame to find visible notes or notes in the hit window. This becomes very slow for long songs.",
      solution: "Implement pointer/index optimization. Maintain an index of the next relevant note and start searches from that index, advancing it as notes pass.",
      preventativeMeasures: ["Design query functions with optimization in mind.", "Profile game loop performance."],
    },
    {
      name: "Mutable Pattern Data During Gameplay",
      description: "Modifying the core note array (e.g., adding `judged` properties directly) during gameplay, which can lead to unexpected behavior if not handled carefully or if the structure is needed elsewhere.",
      solution: "Treat the loaded pattern array as immutable. Store gameplay state (like `judged` status or `judgment`) separately, potentially in a map keyed by note ID, or manage it within the game state system.",
      preventativeMeasures: ["Establish clear conventions for handling gameplay state vs. static song data."],
    },
    {
      name: "Incorrect Time Units",
      description: "Storing or comparing times in inconsistent units (e.g., mixing seconds and milliseconds) leads to synchronization errors.",
      solution: "Standardize on a single time unit (seconds are common for Web Audio API) for all note event times and game clock calculations.",
      preventativeMeasures: ["Clearly define time units in type definitions and documentation."],
    },
  ],
  resources: [
    {
      type: "reference",
      name: "JavaScript Array sort()",
      description: "MDN documentation for sorting arrays.",
      link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort",
    },
    {
      type: "reference",
      name: "Time Complexity (Big O Notation)",
      description: "Understanding algorithmic complexity helps in choosing efficient query methods (e.g., O(n) for linear scan vs. O(log n) for binary search).",
    },
  ],
  conclusion: "Choosing an appropriate data structure, primarily a time-sorted array of event objects, is crucial for representing rhythm patterns. Implementing efficient querying mechanisms, typically using index/pointer optimization, is essential for smooth gameplay performance, especially for finding notes within specific time ranges during the game loop.",
}; 