/**
 * Latency Calibration Types
 */

/**
 * Result of a latency test
 */
export interface LatencyTestResult {
  /**
   * Measured latency in milliseconds
   */
  latency: number;
  
  /**
   * Confidence level (0.0-1.0) of the measurement
   */
  confidence: number;
  
  /**
   * Standard deviation of the measurements
   */
  standardDeviation: number;
  
  /**
   * Raw measurements used to calculate the latency
   */
  measurements: number[];
  
  /**
   * Timestamp when the test was performed
   */
  timestamp: number;
  
  /**
   * Input device used for the test (if available)
   */
  inputDevice?: string;
  
  /**
   * Output device used for the test (if available)
   */
  outputDevice?: string;
}

/**
 * Input methods for latency calibration
 */
export enum InputMethod {
  MIDI = 'midi',
  AUDIO = 'audio',
  KEYBOARD = 'keyboard',
  GAMEPAD = 'gamepad',
  MOUSE = 'mouse',
  TOUCH = 'touch'
}

/**
 * Latency test configuration
 */
export interface LatencyTestConfig {
  /**
   * Number of samples to collect for the test
   */
  sampleCount: number;
  
  /**
   * Minimum required confidence level (0.0-1.0)
   */
  minConfidence: number;
  
  /**
   * Maximum standard deviation allowed (in ms)
   */
  maxStandardDeviation: number;
  
  /**
   * Target input method to test
   */
  inputMethod: InputMethod;
  
  /**
   * Whether to use audio for the test signal
   */
  useAudio: boolean;
  
  /**
   * Whether to use visual cues for the test signal
   */
  useVisual: boolean;
  
  /**
   * Interval between test signals (in ms)
   */
  interval: number;
  
  /**
   * Random variation in interval (in ms)
   */
  intervalVariation: number;
  
  /**
   * Timeout for each sample (in ms)
   */
  sampleTimeout: number;
  
  /**
   * Minimum time between samples (in ms)
   */
  minSampleInterval: number;
}

/**
 * Calibration status
 */
export enum CalibrationStatus {
  NOT_CALIBRATED = 'notCalibrated',
  IN_PROGRESS = 'inProgress',
  CALIBRATED = 'calibrated',
  FAILED = 'failed'
}

/**
 * Latency settings for a device
 */
export interface DeviceLatencySettings {
  /**
   * Device identifier
   */
  deviceId: string;
  
  /**
   * Device name
   */
  deviceName: string;
  
  /**
   * Input method
   */
  inputMethod: InputMethod;
  
  /**
   * Latency offset in milliseconds
   */
  latencyOffset: number;
  
  /**
   * Last calibration timestamp
   */
  lastCalibrated: number;
  
  /**
   * Confidence of the calibration (0.0-1.0)
   */
  confidence: number;
}

/**
 * Options for the latency calibrator
 */
export interface LatencyCalibratorOptions {
  /**
   * Default latency test configuration
   */
  defaultTestConfig?: Partial<LatencyTestConfig>;
  
  /**
   * Storage key for persisting calibration data
   */
  storageKey?: string;
  
  /**
   * Whether to auto-load settings on initialization
   */
  autoLoad?: boolean;
  
  /**
   * Whether to auto-save settings after calibration
   */
  autoSave?: boolean;
}

/**
 * Status event for latency calibration
 */
export interface CalibrationStatusEvent {
  /**
   * Current calibration status
   */
  status: CalibrationStatus;
  
  /**
   * Current progress (0.0-1.0)
   */
  progress: number;
  
  /**
   * Current sample index
   */
  currentSample: number;
  
  /**
   * Total number of samples
   */
  totalSamples: number;
  
  /**
   * Current average latency (ms)
   */
  currentLatency: number;
  
  /**
   * Error message if status is FAILED
   */
  error?: string;
}

/**
 * User response to a calibration signal
 */
export interface CalibrationResponse {
  /**
   * Signal timestamp (when the signal was emitted)
   */
  signalTime: number;
  
  /**
   * Response timestamp (when the user responded)
   */
  responseTime: number;
  
  /**
   * Calculated latency (responseTime - signalTime)
   */
  latency: number;
  
  /**
   * Signal identifier
   */
  signalId: string;
}

/**
 * Listener for calibration events
 */
export type CalibrationStatusListener = (event: CalibrationStatusEvent) => void; 