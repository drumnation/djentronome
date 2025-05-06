import { DrumNote } from '../NoteHighwayCanvas.types';

/**
 * Determines the optimal foot (left or right) for a kick drum note
 * based on timing, previous foot used, and drummer's foot dominance
 */
export const getOptimalFootForKick = (
  time: number, 
  bpm: number, 
  prevFoot: 'left' | 'right' | null, 
  prevTime: number | null,
  dominance: 'right' | 'left' = 'right'
): 'left' | 'right' => {
  const intervalMs = 60000 / bpm / 2; // base time spacing for 8th notes
  const timeDiff = prevTime !== null ? time - prevTime : Infinity;

  const isFast = timeDiff < intervalMs * 0.8;
  const isSlow = timeDiff > intervalMs * 1.5;

  // First note always goes to dominant foot
  if (prevFoot === null) return dominance;

  // Allow doubles on strong foot if it's fast but not insanely fast
  // This reflects how metal drummers often use their dominant foot for doubles
  if (isFast && timeDiff > intervalMs * 0.4) {
    if (prevFoot === dominance) return dominance;
    return prevFoot === 'right' ? 'left' : 'right';
  }

  // Reset to dominant foot if there's a larger gap
  // Drummers naturally reset to their dominant foot after pauses
  if (isSlow) return dominance;

  // If already on non-dominant foot and it's tight, go back to dominant
  // This prevents excessive use of the weaker foot
  if (prevFoot !== dominance && isFast) return dominance;

  // Alternate only if required for speed/technique
  return prevFoot === 'right' ? 'left' : 'right';
};

/**
 * Assigns kick drum notes to left foot (lane 2) or right foot (lane 3)
 * based on realistic drumming patterns
 */
export const assignKickFootPatterns = (
  pattern: DrumNote[], 
  bpm: number,
  dominance: 'right' | 'left' = 'right'
): DrumNote[] => {
  // Filter only kick drum notes and sort by time
  const kickNotes = pattern
    .filter(note => note.lane === 2 || note.lane === 3)
    .sort((a, b) => {
      const timeA = a.measure * 4 + a.beat;
      const timeB = b.measure * 4 + b.beat;
      return timeA - timeB;
    });

  if (kickNotes.length === 0) return pattern;

  // Track foot assignments
  let prevFoot: 'left' | 'right' | null = null;
  let prevTime: number | null = null;
  const footAssignments: Record<string, 'left' | 'right'> = {};

  // Assign foot for each kick note
  kickNotes.forEach(note => {
    const noteTime = note.measure * 4 + note.beat;
    const foot = getOptimalFootForKick(noteTime, bpm, prevFoot, prevTime, dominance);
    
    // Store assignment for this note
    footAssignments[note.id] = foot;
    
    // Update tracking variables
    prevFoot = foot;
    prevTime = noteTime;
  });

  // Create a new pattern with updated lane assignments
  return pattern.map(note => {
    // Skip non-kick notes
    if (note.lane !== 2 && note.lane !== 3) return note;
    
    // Get assigned foot for this note
    const foot = footAssignments[note.id];
    
    // Update lane based on foot (2 = left kick, 3 = right kick)
    return {
      ...note,
      lane: foot === 'left' ? 2 : 3
    };
  });
};

/**
 * Generates note spawn times based on pattern, BPM, and distance
 */
export const generateDjentNotes = (
  pattern: DrumNote[], 
  bpm: number,
  distance: number,
  beatsPerMeasure: number = 4
) => {
  // Calculate timing
  const secondsPerBeat = 60 / bpm;
  
  return pattern.map((drumNote) => {
    // Calculate time based on measure and beat position
    const totalBeats = (drumNote.measure * beatsPerMeasure) + drumNote.beat;
    const timeInSeconds = totalBeats * secondsPerBeat;
    
    // Calculate z position (negative for spawning in the distance)
    // Use time to determine where note should spawn to arrive at hit line at the right time
    const zPosition = distance - (timeInSeconds * 5); // Assuming speed of 5 units per second
    
    return {
      id: drumNote.id,
      lane: drumNote.lane,
      position: [(drumNote.lane - 1.5) * 2, 1, zPosition],
      time: timeInSeconds,
      hit: false
    };
  });
}; 