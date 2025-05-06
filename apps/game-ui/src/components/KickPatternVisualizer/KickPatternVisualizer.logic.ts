import { DrumNote, FootDominance, PatternComplexity } from './KickPatternVisualizer.types';

/**
 * Improved algorithm for kick foot assignment that accounts for foot dominance
 */
export const getOptimalFootForKick = (
  time: number, 
  bpm: number, 
  prevFoot: 'left' | 'right' | null, 
  prevTime: number | null,
  dominance: FootDominance = 'right'
): 'left' | 'right' => {
  // Initial assignment if no previous foot used
  if (prevFoot === null || prevTime === null) {
    return dominance;
  }
  
  // Calculate time since last kick in milliseconds
  const beatTimeMs = (60 / bpm) * 1000;
  const timeSinceLastMs = (time - prevTime) * beatTimeMs;
  
  // Time thresholds
  const RECOVERY_TIME_MS = 150; // Minimum recovery time for same foot
  const BURST_THRESHOLD_MS = 80; // Time under which we're in "burst" territory
  
  // If kicks are extremely close together, alternate feet
  if (timeSinceLastMs < BURST_THRESHOLD_MS) {
    return prevFoot === 'right' ? 'left' : 'right';
  }
  
  // If previous foot hasn't had time to recover, use other foot
  if (timeSinceLastMs < RECOVERY_TIME_MS) {
    return prevFoot === 'right' ? 'left' : 'right';
  }
  
  // In regular patterns, prefer dominant foot on "strong" beats
  const isFractionBeat = time % 1 !== 0;
  if (!isFractionBeat) {
    // On whole-number beats, prefer dominant foot
    return dominance;
  }
  
  // For other beats, check if we're in a complex rhythm pattern
  // For 8th notes, simple alternation often works well
  return prevFoot === 'right' ? 'left' : 'right';
};

/**
 * Simple alternating algorithm for comparison
 */
export const getAlternatingFoot = (
  prevFoot: 'left' | 'right' | null
): 'left' | 'right' => {
  return prevFoot === 'right' ? 'left' : 'right';
};

/**
 * Assigns feet (left/right) to a chronological pattern of drum notes
 */
export const assignFeet = (
  pattern: DrumNote[], 
  bpm: number, 
  dominance: FootDominance
) => {
  const improvedAssignments: Record<string, 'left' | 'right'> = {};
  const alternatingAssignments: Record<string, 'left' | 'right'> = {};
  
  // Sort all notes chronologically
  const sortedNotes = [...pattern].sort((a, b) => {
    return (a.measure * 4 + a.beat) - (b.measure * 4 + b.beat);
  });
  
  // Calculate optimal foot assignments
  let prevFoot: 'left' | 'right' | null = null;
  let prevTime: number | null = null;
  
  // Optimized algorithm
  sortedNotes.forEach((note) => {
    // Absolute time position (in beats)
    const time = note.measure * 4 + note.beat;
    
    // Get optimal foot based on timing and previous foot
    const foot = getOptimalFootForKick(time, bpm, prevFoot, prevTime, dominance);
    
    // Record the assignment
    improvedAssignments[note.id] = foot;
    
    // Update for next iteration
    prevFoot = foot;
    prevTime = time;
  });
  
  // Reset for alternating algorithm
  let prevFootAlternating: 'left' | 'right' | null = null;
  
  // Simple alternating algorithm
  sortedNotes.forEach((note) => {
    // For alternating, simply alternate feet
    const footAlternating = getAlternatingFoot(prevFootAlternating);
    
    // Record the assignment
    alternatingAssignments[note.id] = footAlternating;
    prevFootAlternating = footAlternating;
  });
  
  return { improved: improvedAssignments, alternating: alternatingAssignments };
};

/**
 * Generate a new pattern with specified complexity
 */
export const generatePattern = (complexity: PatternComplexity): DrumNote[] => {
  const newPattern: DrumNote[] = [];
  
  switch (complexity) {
    case 'simple':
      // Simple quarter notes
      for (let i = 0; i < 4; i++) {
        for (let beat = 0; beat < 4; beat++) {
          newPattern.push({ id: `simple-${i}-${beat}`, lane: 2, beat, measure: i });
        }
      }
      break;
      
    case 'moderate':
      // Moderate complexity with some syncopation
      for (let m = 0; m < 4; m++) {
        // Add some quarter notes
        newPattern.push({ id: `mod-${m}-0`, lane: 2, beat: 0, measure: m });
        newPattern.push({ id: `mod-${m}-2`, lane: 2, beat: 2, measure: m });
        
        // Add some syncopated eighths
        newPattern.push({ id: `mod-${m}-1.5`, lane: 2, beat: 1.5, measure: m });
        newPattern.push({ id: `mod-${m}-3.5`, lane: 2, beat: 3.5, measure: m });
        
        // Add a few bursts
        if (m % 2 === 0) { // In even measures
          newPattern.push({ id: `mod-${m}-2.5`, lane: 2, beat: 2.5, measure: m });
          newPattern.push({ id: `mod-${m}-2.75`, lane: 2, beat: 2.75, measure: m });
        }
      }
      break;
      
    case 'complex':
      // Complex djent patterns
      for (let m = 0; m < 4; m++) {
        // Base pattern on all quarters
        newPattern.push({ id: `complex-${m}-0`, lane: 2, beat: 0, measure: m });
        newPattern.push({ id: `complex-${m}-1`, lane: 2, beat: 1, measure: m });
        newPattern.push({ id: `complex-${m}-2`, lane: 2, beat: 2, measure: m });
        newPattern.push({ id: `complex-${m}-3`, lane: 2, beat: 3, measure: m });
        
        // Add syncopation and bursts
        newPattern.push({ id: `complex-${m}-0.5`, lane: 2, beat: 0.5, measure: m });
        newPattern.push({ id: `complex-${m}-1.5`, lane: 2, beat: 1.5, measure: m });
        newPattern.push({ id: `complex-${m}-2.5`, lane: 2, beat: 2.5, measure: m });
        newPattern.push({ id: `complex-${m}-3.5`, lane: 2, beat: 3.5, measure: m });
        
        // Add 16th notes for one beat per measure (different beat each measure)
        const sixteenthBeat = m % 4;
        newPattern.push({ id: `complex-${m}-${sixteenthBeat}.25`, lane: 2, beat: sixteenthBeat + 0.25, measure: m });
        newPattern.push({ id: `complex-${m}-${sixteenthBeat}.75`, lane: 2, beat: sixteenthBeat + 0.75, measure: m });
        
        // Add burst of 32nd notes in one place
        if (m === 2) {
          for (let i = 0; i < 4; i += 0.125) {
            newPattern.push({ 
              id: `complex-burst-${i}`, 
              lane: 2, 
              beat: 1 + i, 
              measure: m 
            });
          }
        }
      }
      break;
  }
  
  return newPattern;
};

/**
 * Creates a default pattern for initial display
 */
export const createDefaultPattern = (): DrumNote[] => {
  const pattern: DrumNote[] = [];
  
  // Generate a moderate complexity pattern
  for (let m = 0; m < 4; m++) {
    // Quarter notes on beats 1 and 3
    pattern.push({ id: `default-${m}-0`, lane: 2, beat: 0, measure: m });
    pattern.push({ id: `default-${m}-2`, lane: 2, beat: 2, measure: m });
    
    // Eighth notes on beats 1.5 and 3.5 (offbeats)
    pattern.push({ id: `default-${m}-1.5`, lane: 2, beat: 1.5, measure: m });
    pattern.push({ id: `default-${m}-3.5`, lane: 2, beat: 3.5, measure: m });
    
    // Add more complexity to even measures
    if (m % 2 === 0) {
      pattern.push({ id: `default-${m}-0.75`, lane: 2, beat: 0.75, measure: m });
      pattern.push({ id: `default-${m}-2.25`, lane: 2, beat: 2.25, measure: m });
      pattern.push({ id: `default-${m}-2.75`, lane: 2, beat: 2.75, measure: m });
    }
  }
  
  return pattern;
};

/**
 * Helper function to organize notes by measure
 */
export const organizeNotesByMeasure = (pattern: DrumNote[]) => {
  const notesByMeasure = pattern.reduce<Record<number, DrumNote[]>>((acc, note) => {
    if (!acc[note.measure]) {
      acc[note.measure] = [];
    }
    acc[note.measure]!.push(note);
    return acc;
  }, {});
  
  // Sort notes within each measure by beat
  Object.keys(notesByMeasure).forEach(measure => {
    const measureNotes = notesByMeasure[Number(measure)];
    if (measureNotes) {
      measureNotes.sort((a, b) => a.beat - b.beat);
    }
  });
  
  // Get sorted measures
  const measures = Object.keys(notesByMeasure)
    .map(Number)
    .sort((a, b) => a - b);
    
  return { notesByMeasure, measures };
}; 