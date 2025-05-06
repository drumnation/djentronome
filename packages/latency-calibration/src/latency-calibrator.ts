import {
  CalibrationStatus,
  CalibrationStatusListener,
  CalibrationStatusEvent,
  LatencyTestConfig,
  LatencyTestResult,
  InputMethod,
  LatencyCalibratorOptions,
  DeviceLatencySettings,
  CalibrationResponse
} from './types';

const DEFAULT_TEST_CONFIG: LatencyTestConfig = {
  sampleCount: 5,
  minConfidence: 0.8,
  maxStandardDeviation: 10,
  inputMethod: InputMethod.MIDI,
  useAudio: true,
  useVisual: false,
  interval: 1000,
  intervalVariation: 200,
  sampleTimeout: 5000,
  minSampleInterval: 500
};

const DEFAULT_STORAGE_KEY = 'latency-settings';

/**
 * Manages latency calibration and compensation
 */
export class LatencyCalibrator {
  private status: CalibrationStatus = CalibrationStatus.NOT_CALIBRATED;
  private options: LatencyCalibratorOptions;
  private testConfig: LatencyTestConfig;
  private statusListeners: CalibrationStatusListener[] = [];
  private deviceSettings: Record<string, DeviceLatencySettings> = {};

  constructor(options: LatencyCalibratorOptions = {}) {
    this.options = {
      storageKey: DEFAULT_STORAGE_KEY,
      autoLoad: false,
      autoSave: true,
      ...options
    };

    this.testConfig = {
      ...DEFAULT_TEST_CONFIG,
      ...(options.defaultTestConfig || {})
    };

    if (this.options.autoLoad) {
      this.loadSettings();
    }
  }

  /**
   * Get current calibration status
   */
  getStatus(): CalibrationStatus {
    return this.status;
  }

  /**
   * Get current options
   */
  getOptions(): LatencyCalibratorOptions {
    return { ...this.options };
  }

  /**
   * Get current test configuration
   */
  getTestConfig(): LatencyTestConfig {
    return { ...this.testConfig };
  }

  /**
   * Set test configuration
   */
  setTestConfig(config: Partial<LatencyTestConfig>): void {
    this.testConfig = {
      ...this.testConfig,
      ...config
    };
  }

  /**
   * Add a status listener
   */
  addStatusListener(listener: CalibrationStatusListener): void {
    this.statusListeners.push(listener);
  }

  /**
   * Remove a status listener
   */
  removeStatusListener(listener: CalibrationStatusListener): void {
    this.statusListeners = this.statusListeners.filter(l => l !== listener);
  }

  /**
   * Emit a status event to all listeners
   */
  private emitStatus(event: CalibrationStatusEvent): void {
    this.statusListeners.forEach(listener => listener(event));
  }

  /**
   * Start the calibration process
   */
  async calibrate(deviceId: string, deviceName: string): Promise<LatencyTestResult> {
    try {
      this.status = CalibrationStatus.IN_PROGRESS;
      
      // Initial status event
      this.emitStatus({
        status: CalibrationStatus.IN_PROGRESS,
        progress: 0,
        currentSample: 0,
        totalSamples: this.testConfig.sampleCount,
        currentLatency: 0
      });

      const result = await this.runTest();

      // Save the calibration result
      this.deviceSettings[deviceId] = {
        deviceId,
        deviceName,
        inputMethod: this.testConfig.inputMethod,
        latencyOffset: result.latency,
        lastCalibrated: result.timestamp,
        confidence: result.confidence
      };

      // Update status
      this.status = CalibrationStatus.CALIBRATED;
      this.emitStatus({
        status: CalibrationStatus.CALIBRATED,
        progress: 1,
        currentSample: this.testConfig.sampleCount,
        totalSamples: this.testConfig.sampleCount,
        currentLatency: result.latency
      });

      // Auto-save if enabled
      if (this.options.autoSave) {
        this.saveSettings();
      }

      return result;
    } catch (error) {
      // Update status to failed
      this.status = CalibrationStatus.FAILED;
      this.emitStatus({
        status: CalibrationStatus.FAILED,
        progress: 0,
        currentSample: 0,
        totalSamples: this.testConfig.sampleCount,
        currentLatency: 0,
        error: error instanceof Error ? error.message : String(error)
      });

      throw error;
    }
  }

  /**
   * Run a complete latency test
   */
  private async runTest(): Promise<LatencyTestResult> {
    const responses: CalibrationResponse[] = [];
    
    // Collect samples
    for (let i = 0; i < this.testConfig.sampleCount; i++) {
      const response = await this.collectSample(i);
      responses.push(response);
      
      // Update progress
      this.emitStatus({
        status: CalibrationStatus.IN_PROGRESS,
        progress: (i + 1) / this.testConfig.sampleCount,
        currentSample: i + 1,
        totalSamples: this.testConfig.sampleCount,
        currentLatency: this.calculateRunningAverage(responses.map(r => r.latency))
      });
      
      // Wait between samples if not the last one
      if (i < this.testConfig.sampleCount - 1) {
        await this.waitRandomInterval();
      }
    }
    
    // Calculate statistics
    const latencies = responses.map(r => r.latency);
    const stats = this.calculateStats(latencies);
    
    return {
      latency: stats.mean,
      confidence: stats.confidence,
      standardDeviation: stats.standardDeviation,
      measurements: latencies,
      timestamp: Date.now(),
      inputDevice: responses[0]?.signalId.split('-')[0] // Just a placeholder
    };
  }

  /**
   * Collect a single sample
   */
  private async collectSample(sampleIndex: number): Promise<CalibrationResponse> {
    // This is a mock implementation for testing
    // In a real implementation, this would:
    // 1. Play a sound or show a visual cue
    // 2. Wait for user input
    // 3. Calculate the latency between cue and input
    
    // For testing, we'll just simulate a delay
    const signalTime = Date.now();
    const signalId = `${sampleIndex}`;
    
    // Simulate user response after random delay (30-50ms)
    const responseDelay = Math.random() * 20 + 30;
    await new Promise(resolve => setTimeout(resolve, responseDelay));
    
    const responseTime = Date.now();
    
    return {
      signalTime,
      responseTime,
      latency: responseTime - signalTime,
      signalId
    };
  }

  /**
   * Wait a random interval between samples
   */
  private async waitRandomInterval(): Promise<void> {
    const variation = Math.random() * this.testConfig.intervalVariation * 2 - this.testConfig.intervalVariation;
    const waitTime = Math.max(this.testConfig.interval + variation, this.testConfig.minSampleInterval);
    
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }

  /**
   * Calculate statistics from a set of latency measurements
   */
  private calculateStats(latencies: number[]): { mean: number; standardDeviation: number; confidence: number } {
    const mean = this.calculateRunningAverage(latencies);
    
    // Calculate standard deviation
    const squaredDifferences = latencies.map(val => Math.pow(val - mean, 2));
    const variance = squaredDifferences.reduce((sum, val) => sum + val, 0) / latencies.length;
    const standardDeviation = Math.sqrt(variance);
    
    // Calculate confidence based on standard deviation and sample size
    // This is a simplified calculation
    const relativeStdDev = standardDeviation / mean;
    const confidence = Math.max(0, Math.min(1, 1 - relativeStdDev));
    
    return { mean, standardDeviation, confidence };
  }

  /**
   * Calculate running average
   */
  private calculateRunningAverage(values: number[]): number {
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  /**
   * Get latency offset for a device
   */
  getOffset(deviceId: string): number {
    return this.deviceSettings[deviceId]?.latencyOffset || 0;
  }

  /**
   * Get settings for a device
   */
  getDeviceSettings(deviceId: string): DeviceLatencySettings | undefined {
    return this.deviceSettings[deviceId];
  }

  /**
   * Clear all device settings
   */
  clearDeviceSettings(): void {
    this.deviceSettings = {};
    this.status = CalibrationStatus.NOT_CALIBRATED;
  }

  /**
   * Load settings from storage
   */
  loadSettings(): void {
    try {
      // In Node.js environment or test environment, window might be mocked
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }
      
      const data = window.localStorage.getItem(this.options.storageKey || DEFAULT_STORAGE_KEY);
      if (!data) return;
      
      const parsed = JSON.parse(data);
      
      if (parsed.devices && Array.isArray(parsed.devices)) {
        // Convert array to record
        this.deviceSettings = {};
        parsed.devices.forEach((device: DeviceLatencySettings) => {
          this.deviceSettings[device.deviceId] = device;
        });
        
        // Update status if we have settings
        if (Object.keys(this.deviceSettings).length > 0) {
          this.status = CalibrationStatus.CALIBRATED;
        }
      }
    } catch (error) {
      console.error('Failed to load latency settings:', error);
    }
  }

  /**
   * Save settings to storage
   */
  saveSettings(): void {
    try {
      // In Node.js environment or test environment, window might be mocked
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }
      
      // Convert record to array
      const devices = Object.values(this.deviceSettings);
      
      window.localStorage.setItem(
        this.options.storageKey || DEFAULT_STORAGE_KEY,
        JSON.stringify({ devices })
      );
    } catch (error) {
      console.error('Failed to save latency settings:', error);
    }
  }
} 