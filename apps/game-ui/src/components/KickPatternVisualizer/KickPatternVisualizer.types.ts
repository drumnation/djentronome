// Types for KickPatternVisualizer component

export interface DrumNote {
  id: string;
  lane: number;
  beat: number;
  measure: number;
}

export interface KickSample {
  value: string;
  label: string;
  path: string;
}

export interface FootAssignments {
  improved: Record<string, 'left' | 'right'>;
  alternating: Record<string, 'left' | 'right'>;
}

export type FootDominance = 'left' | 'right';
export type PatternComplexity = 'simple' | 'moderate' | 'complex';
export type AudioContextType = typeof AudioContext;

export interface KickPatternVisualizerProps {
  pattern?: DrumNote[];
  bpm?: number;
} 