/**
 * Debug Package
 * 
 * This package provides debugging tools for the Djentronome project.
 */
import { DebugOptions, MetricData, StateData } from './types';

/**
 * DebugOverlay class for displaying debug information
 */
export class DebugOverlay {
  private metrics: Map<string, any> = new Map();
  private visible: boolean = false;
  
  /**
   * Create a new debug overlay with options
   */
  constructor(options?: DebugOptions) {
    console.log('Debug overlay initialized', options);
  }
  
  /**
   * Show the debug overlay
   */
  show(): void {
    this.visible = true;
    console.log('Debug overlay shown');
  }
  
  /**
   * Hide the debug overlay
   */
  hide(): void {
    this.visible = false;
    console.log('Debug overlay hidden');
  }
  
  /**
   * Add a metric to the overlay
   */
  addMetric(name: string, value: any): void {
    this.metrics.set(name, value);
    console.log(`Added metric: ${name} = ${value}`);
  }
}

/**
 * StateInspector class for inspecting game state
 */
export class StateInspector {
  /**
   * Display the current state
   */
  displayState(state: StateData): void {
    console.log('Current state:', state);
  }
  
  /**
   * Watch state for changes
   */
  watchState(state: StateData): void {
    console.log('Watching state for changes:', state);
  }
}

// Export all types
export * from './types';
