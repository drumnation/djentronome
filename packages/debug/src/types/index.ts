/**
 * Debug package types
 */

/**
 * Options for the debug overlay
 */
export interface DebugOptions {
  /**
   * Position of the overlay
   */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  
  /**
   * Whether to show FPS counter
   */
  showFps?: boolean;
  
  /**
   * Additional metrics to show by default
   */
  defaultMetrics?: string[];
}

/**
 * Metric data structure
 */
export interface MetricData {
  name: string;
  value: any;
  type?: 'number' | 'string' | 'boolean' | 'object';
}

/**
 * Generic state data for state inspector
 */
export interface StateData {
  [key: string]: any;
} 