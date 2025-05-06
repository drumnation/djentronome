export interface DjentAnimatedElementProps {
  /**
   * Initial pattern to use for the djent visualization
   * @default 'intro'
   */
  initialPattern?: 'intro' | 'verse' | 'breakdown';
  
  /**
   * Initial BPM (beats per minute) for the visualization
   * @default 166
   */
  initialBpm?: number;
  
  /**
   * Rate at which new notes spawn (in seconds)
   * @default 2
   */
  noteSpawnRate?: number;
}

export interface Note {
  id: string;
  lane: number;
  position: [number, number, number];
  time: number;
  hit: boolean;
}

export interface HitEffect {
  id: string;
  lane: number;
  startTime: number;
  particles: Particle[];
}

export interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  opacity: number;
}

export interface PatternChangeConfig {
  nextPattern: 'intro' | 'verse' | 'breakdown';
  nextBpm: number;
  nextChangeDelay: number;
}

export interface FontProps {
  letterSpacing: number;
  lineHeight: number;
  fontWeight: number;
  'material-toneMapped': boolean;
} 