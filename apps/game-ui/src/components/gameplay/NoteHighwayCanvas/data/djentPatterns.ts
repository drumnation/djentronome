import { DrumNote } from '../NoteHighwayCanvas.types';
import { assignKickFootPatterns } from '../utils/drumPatterns';

// Create predefined djent drum patterns
export const djentPatterns = (() => {
  // Create basic patterns first (without foot assignments)
  const basicIntroPattern: DrumNote[] = [
    // Cymbal accents on the 1 and syncopated points
    { id: 'intro-c-0-0', lane: 0, beat: 0.0, measure: 0 },
    { id: 'intro-c-1-0', lane: 0, beat: 1.0, measure: 0 },
    { id: 'intro-c-2-0', lane: 0, beat: 2.0, measure: 0 },
    { id: 'intro-c-3-0', lane: 0, beat: 3.0, measure: 0 },
    
    // Kick pattern - typical djent "gallop" rhythm (initially all as generic kicks)
    { id: 'intro-k-0-0', lane: 2, beat: 0.0, measure: 0 },
    { id: 'intro-k-0.5-0', lane: 2, beat: 0.5, measure: 0 },
    { id: 'intro-k-0.75-0', lane: 2, beat: 0.75, measure: 0 },
    { id: 'intro-k-1-0', lane: 2, beat: 1.0, measure: 0 },
    { id: 'intro-k-1.5-0', lane: 2, beat: 1.5, measure: 0 },
    { id: 'intro-k-1.75-0', lane: 2, beat: 1.75, measure: 0 },
    { id: 'intro-k-2-0', lane: 2, beat: 2.0, measure: 0 },
    { id: 'intro-k-2.5-0', lane: 2, beat: 2.5, measure: 0 },
    { id: 'intro-k-2.75-0', lane: 2, beat: 2.75, measure: 0 },
    { id: 'intro-k-3-0', lane: 2, beat: 3.0, measure: 0 },
    { id: 'intro-k-3.5-0', lane: 2, beat: 3.5, measure: 0 },
    { id: 'intro-k-3.75-0', lane: 2, beat: 3.75, measure: 0 },
    
    // Second measure
    { id: 'intro-c-0-1', lane: 0, beat: 0.0, measure: 1 },
    { id: 'intro-c-1-1', lane: 0, beat: 1.0, measure: 1 },
    { id: 'intro-c-2-1', lane: 0, beat: 2.0, measure: 1 },
    { id: 'intro-c-3-1', lane: 0, beat: 3.0, measure: 1 },
    
    { id: 'intro-k-0-1', lane: 2, beat: 0.0, measure: 1 },
    { id: 'intro-k-0.5-1', lane: 2, beat: 0.5, measure: 1 },
    { id: 'intro-k-0.75-1', lane: 2, beat: 0.75, measure: 1 },
    { id: 'intro-k-1-1', lane: 2, beat: 1.0, measure: 1 },
    { id: 'intro-k-1.5-1', lane: 2, beat: 1.5, measure: 1 },
    { id: 'intro-k-1.75-1', lane: 2, beat: 1.75, measure: 1 },
    { id: 'intro-k-2-1', lane: 2, beat: 2.0, measure: 1 },
    { id: 'intro-k-2.5-1', lane: 2, beat: 2.5, measure: 1 },
    { id: 'intro-k-2.75-1', lane: 2, beat: 2.75, measure: 1 },
    { id: 'intro-k-3-1', lane: 2, beat: 3.0, measure: 1 },
    { id: 'intro-k-3.5-1', lane: 2, beat: 3.5, measure: 1 },
    { id: 'intro-k-3.75-1', lane: 2, beat: 3.75, measure: 1 },
  ];
  
  const basicVersePattern: DrumNote[] = [
    // First measure - syncopated cymbal accents
    { id: 'verse-c-0-0', lane: 0, beat: 0.0, measure: 0 },
    { id: 'verse-c-1-0', lane: 0, beat: 1.0, measure: 0 },
    { id: 'verse-c-1.75-0', lane: 0, beat: 1.75, measure: 0 },
    { id: 'verse-c-2.5-0', lane: 0, beat: 2.5, measure: 0 },
    { id: 'verse-c-3.5-0', lane: 0, beat: 3.5, measure: 0 },
    
    // Snare on 2 and 4
    { id: 'verse-s-1-0', lane: 1, beat: 1.0, measure: 0 },
    { id: 'verse-s-3-0', lane: 1, beat: 3.0, measure: 0 },
    
    // Complex kick pattern (initially all generic kicks)
    { id: 'verse-k-0-0', lane: 2, beat: 0.0, measure: 0 },
    { id: 'verse-k-0.5-0', lane: 2, beat: 0.5, measure: 0 },
    { id: 'verse-k-0.75-0', lane: 2, beat: 0.75, measure: 0 },
    { id: 'verse-k-1.25-0', lane: 2, beat: 1.25, measure: 0 },
    { id: 'verse-k-1.75-0', lane: 2, beat: 1.75, measure: 0 },
    { id: 'verse-k-2-0', lane: 2, beat: 2.0, measure: 0 },
    { id: 'verse-k-2.25-0', lane: 2, beat: 2.25, measure: 0 },
    { id: 'verse-k-2.5-0', lane: 2, beat: 2.5, measure: 0 },
    { id: 'verse-k-2.75-0', lane: 2, beat: 2.75, measure: 0 },
    { id: 'verse-k-3.25-0', lane: 2, beat: 3.25, measure: 0 },
    { id: 'verse-k-3.75-0', lane: 2, beat: 3.75, measure: 0 },
    
    // Second measure
    { id: 'verse-c-0-1', lane: 0, beat: 0.0, measure: 1 },
    { id: 'verse-c-0.75-1', lane: 0, beat: 0.75, measure: 1 },
    { id: 'verse-c-1.5-1', lane: 0, beat: 1.5, measure: 1 },
    { id: 'verse-c-2.25-1', lane: 0, beat: 2.25, measure: 1 },
    { id: 'verse-c-3-1', lane: 0, beat: 3.0, measure: 1 },
    
    // Snare on 2 and 4
    { id: 'verse-s-1-1', lane: 1, beat: 1.0, measure: 1 },
    { id: 'verse-s-3-1', lane: 1, beat: 3.0, measure: 1 },
    
    // More complex kick pattern
    { id: 'verse-k-0-1', lane: 2, beat: 0.0, measure: 1 },
    { id: 'verse-k-0.5-1', lane: 2, beat: 0.5, measure: 1 },
    { id: 'verse-k-1-1', lane: 2, beat: 1.0, measure: 1 },
    { id: 'verse-k-1.5-1', lane: 2, beat: 1.5, measure: 1 },
    { id: 'verse-k-2-1', lane: 2, beat: 2.0, measure: 1 },
    { id: 'verse-k-2.5-1', lane: 2, beat: 2.5, measure: 1 },
    { id: 'verse-k-3-1', lane: 2, beat: 3.0, measure: 1 },
    { id: 'verse-k-3.5-1', lane: 2, beat: 3.5, measure: 1 },
  ];
  
  const basicBreakdownPattern: DrumNote[] = [
    // First measure - quarter note cymbals
    { id: 'break-c-0-0', lane: 0, beat: 0.0, measure: 0 },
    { id: 'break-c-1-0', lane: 0, beat: 1.0, measure: 0 },
    { id: 'break-c-2-0', lane: 0, beat: 2.0, measure: 0 },
    { id: 'break-c-3-0', lane: 0, beat: 3.0, measure: 0 },
    
    // Heavy syncopated kick pattern (initially all generic kicks)
    { id: 'break-k-0-0', lane: 2, beat: 0.0, measure: 0 },
    { id: 'break-k-0.25-0', lane: 2, beat: 0.25, measure: 0 },
    { id: 'break-k-0.75-0', lane: 2, beat: 0.75, measure: 0 },
    { id: 'break-k-1-0', lane: 2, beat: 1.0, measure: 0 },
    { id: 'break-k-1.25-0', lane: 2, beat: 1.25, measure: 0 },
    { id: 'break-k-1.75-0', lane: 2, beat: 1.75, measure: 0 },
    { id: 'break-k-2-0', lane: 2, beat: 2.0, measure: 0 },
    { id: 'break-k-2.25-0', lane: 2, beat: 2.25, measure: 0 },
    { id: 'break-k-2.75-0', lane: 2, beat: 2.75, measure: 0 },
    { id: 'break-k-3-0', lane: 2, beat: 3.0, measure: 0 },
    { id: 'break-k-3.25-0', lane: 2, beat: 3.25, measure: 0 },
    { id: 'break-k-3.75-0', lane: 2, beat: 3.75, measure: 0 },
  ];
  
  // Apply foot pattern algorithm to each pattern with right-foot dominance
  return {
    introPattern: assignKickFootPatterns(basicIntroPattern, 166, 'right'),
    versePattern: assignKickFootPatterns(basicVersePattern, 173, 'right'),
    breakdownPattern: assignKickFootPatterns(basicBreakdownPattern, 169, 'right')
  };
})(); 