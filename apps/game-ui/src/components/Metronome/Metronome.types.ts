import { MetronomeConfig } from '../../../../../packages/sound/src';

/**
 * Props for the Metronome component
 */
export interface MetronomeProps {
  /**
   * Initial configuration for the metronome
   */
  initialConfig?: Partial<MetronomeConfig>;
  
  /**
   * Custom CSS class name
   */
  className?: string;
  
  /**
   * Callback when metronome play state changes
   */
  onPlayStateChange?: (isPlaying: boolean) => void;
  
  /**
   * Callback when configuration changes
   */
  onConfigChange?: (config: MetronomeConfig) => void;
} 