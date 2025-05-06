export interface WaveformVisualizationProps {
  /** Audio data to visualize */
  audioData?: Float32Array;
  /** Width of the visualization in pixels */
  width?: number;
  /** Height of the visualization in pixels */
  height?: number;
  /** Color of the waveform */
  color?: string;
  /** Background color of the visualization */
  backgroundColor?: string;
  /** Optional CSS class name */
  className?: string;
} 