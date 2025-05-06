import { djentPatterns } from '../../data/djentPatterns';
import { Note, Particle, PatternChangeConfig } from './DjentAnimatedElement.types';

/**
 * Get the appropriate drum pattern based on the pattern name
 */
export const getPatternByName = (patternName: string) => {
  switch (patternName) {
    case 'verse':
      return djentPatterns.versePattern;
    case 'breakdown':
      return djentPatterns.breakdownPattern;
    case 'intro':
    default:
      return djentPatterns.introPattern;
  }
};

/**
 * Create initial notes for visualization
 */
export const createInitialNotes = (initialPattern: string): Note[] => {
  const initialNotes: Note[] = [];
  
  // Determine which pattern to use based on initialPattern
  const patternToUse = getPatternByName(initialPattern);
  
  // Add some notes from the selected pattern at various distances
  patternToUse.forEach((drumNote, idx) => {
    // Only use every 3rd note to avoid overwhelming the view
    if (idx % 3 === 0) {
      // Position notes at regular intervals from -30 to 0
      const zPosition = -30 + (idx * 1.5);
      initialNotes.push({
        id: `initial-${drumNote.id}`,
        lane: drumNote.lane,
        position: [(drumNote.lane - 1.5) * 2, 1, zPosition],
        time: 0, // These are just for initial visualization
        hit: false
      });
    }
  });
  
  // Add some notes from a different pattern further back for variety
  const secondaryPattern = initialPattern === 'intro' ? 
    djentPatterns.versePattern : djentPatterns.introPattern;
  
  secondaryPattern.slice(0, 8).forEach((drumNote, idx) => {
    const zPosition = -40 - (idx * 1.5);
    initialNotes.push({
      id: `initial-secondary-${drumNote.id}`,
      lane: drumNote.lane,
      position: [(drumNote.lane - 1.5) * 2, 1, zPosition],
      time: 0,
      hit: false
    });
  });
  
  return initialNotes;
};

/**
 * Create particles for hit effect
 */
export const createHitEffectParticles = (): Particle[] => {
  const numParticles = 15; // Number of particles in the explosion
  const particles: Particle[] = [];
  
  // Create particles with random velocities and sizes
  for (let i = 0; i < numParticles; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.5 + Math.random() * 1.5;
    particles.push({
      x: 0, // Will be positioned at hit lane
      y: 0, // Will start at 0.1 above ground
      z: 0, // Will be positioned at hit line
      vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
      vy: Math.random() * 0.8 + 0.2, // Upward velocity
      vz: (Math.random() - 0.5) * speed * 0.5, // Less z-velocity to keep particles near hit line
      size: 0.2 + Math.random() * 0.6,
      opacity: 0.7 + Math.random() * 0.3
    });
  }
  
  return particles;
};

/**
 * Generate a vertical offset for visual separation of notes
 */
export const getVerticalOffset = (noteIndex: number): number => {
  // Apply a very slight vertical offset for consecutive notes in the same lane
  // This helps with visual separation while not affecting gameplay
  return (noteIndex % 2) * 0.15; // Alternate between 0 and 0.15 units
};

/**
 * Create new notes based on the current pattern
 */
export const createNewNotes = (currentPattern: string): Note[] => {
  const patternToUse = getPatternByName(currentPattern);
  const newNotes: Note[] = [];
  const numNotesToAdd = 5 + Math.floor(Math.random() * 5); // Add 5-10 notes
  
  for (let i = 0; i < numNotesToAdd; i++) {
    const randomIdx = Math.floor(Math.random() * patternToUse.length);
    const drumNote = patternToUse[randomIdx];
    
    // Check if drumNote is defined before using it
    if (drumNote) {
      // Position them far enough back
      const zPosition = -40 - (Math.random() * 10);
      const verticalOffset = getVerticalOffset(newNotes.length);
      
      newNotes.push({
        id: `dynamic-${drumNote.id}-${Date.now()}-${i}`,
        lane: drumNote.lane,
        position: [(drumNote.lane - 1.5) * 2, 1 + verticalOffset, zPosition] as [number, number, number],
        time: 0,
        hit: false
      });
    }
  }
  
  return newNotes;
};

/**
 * Get color for a lane
 */
export const getLaneColor = (lane: number): string => {
  switch(lane) {
    case 0: return '#ffdd00'; // Yellow for cymbal
    case 1: return '#ff3333'; // Red for snare
    case 2: return '#3333ff'; // Blue for left kick
    case 3: return '#33ff33'; // Green for right kick
    default: return '#ffffff';
  }
};

/**
 * Get the next pattern configuration based on current pattern
 */
export const getNextPatternConfig = (currentPattern: string): PatternChangeConfig => {
  switch (currentPattern) {
    case 'intro':
      return {
        nextPattern: 'verse',
        nextBpm: 173, // BPM from the tab for verse
        nextChangeDelay: 32
      };
    case 'verse':
      return {
        nextPattern: 'breakdown',
        nextBpm: 169, // BPM from the tab for breakdown
        nextChangeDelay: 32
      };
    case 'breakdown':
    default:
      return {
        nextPattern: 'intro',
        nextBpm: 166, // Back to intro BPM
        nextChangeDelay: 32
      };
  }
}; 