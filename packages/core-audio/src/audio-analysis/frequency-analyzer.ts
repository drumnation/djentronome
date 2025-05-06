/**
 * Frequency Analysis Module
 * 
 * Provides tools for analyzing frequency data from audio signals.
 */

/**
 * Options for frequency analysis
 */
export interface FrequencyAnalysisOptions {
  /**
   * FFT size (power of 2, default 2048)
   */
  fftSize?: number;
  
  /**
   * Minimum frequency to analyze (Hz)
   */
  minFrequency?: number;
  
  /**
   * Maximum frequency to analyze (Hz)
   */
  maxFrequency?: number;
  
  /**
   * Smoothing time constant (0-1)
   */
  smoothingTimeConstant?: number;
}

/**
 * Frequency analysis result
 */
export interface FrequencyAnalysisResult {
  /**
   * Frequency bins (Hz)
   */
  frequencies: number[];
  
  /**
   * Magnitude values (dB)
   */
  magnitudes: number[];
  
  /**
   * Normalized magnitude values (0-1)
   */
  normalizedMagnitudes: number[];
  
  /**
   * FFT size used for analysis
   */
  fftSize: number;
  
  /**
   * Sample rate of the analyzed audio
   */
  sampleRate: number;
}

/**
 * Utility for analyzing frequency components of audio signals
 */
export class FrequencyAnalyzer {
  private audioContext: AudioContext;
  private analyserNode: AnalyserNode;
  
  /**
   * Create a new frequency analyzer
   */
  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.analyserNode = this.audioContext.createAnalyser();
    
    // Set default properties
    this.analyserNode.fftSize = 2048;
    this.analyserNode.smoothingTimeConstant = 0.8;
  }
  
  /**
   * Get the analyzer node
   */
  getAnalyserNode(): AnalyserNode {
    return this.analyserNode;
  }
  
  /**
   * Connect a node to the analyzer
   */
  connectSource(sourceNode: AudioNode): AudioNode {
    sourceNode.connect(this.analyserNode);
    return this.analyserNode;
  }
  
  /**
   * Set FFT size for frequency analysis
   */
  setFftSize(fftSize: number): void {
    // Ensure it's a power of 2
    const validSizes = [32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768];
    if (validSizes.includes(fftSize)) {
      this.analyserNode.fftSize = fftSize;
    } else {
      console.warn(`Invalid FFT size: ${fftSize}. Using 2048 instead.`);
      this.analyserNode.fftSize = 2048;
    }
  }
  
  /**
   * Analyze frequency data from an audio buffer
   */
  analyzeBuffer(audioBuffer: AudioBuffer, options: FrequencyAnalysisOptions = {}): FrequencyAnalysisResult {
    // Apply options
    const fftSize = options.fftSize || 2048;
    this.setFftSize(fftSize);
    
    if (options.smoothingTimeConstant !== undefined) {
      this.analyserNode.smoothingTimeConstant = Math.max(0, Math.min(1, options.smoothingTimeConstant));
    }
    
    // Create temp offline context and nodes for analysis
    const offlineContext = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    );
    
    const offlineAnalyser = offlineContext.createAnalyser();
    offlineAnalyser.fftSize = fftSize;
    offlineAnalyser.smoothingTimeConstant = this.analyserNode.smoothingTimeConstant;
    
    const bufferSource = offlineContext.createBufferSource();
    bufferSource.buffer = audioBuffer;
    bufferSource.connect(offlineAnalyser);
    
    // Create arrays for analysis
    const frequencyBinCount = offlineAnalyser.frequencyBinCount;
    const frequencyData = new Float32Array(frequencyBinCount);
    
    // Start playback to do analysis
    bufferSource.start(0);
    
    // Get frequency data at the midpoint of the buffer for a representative sample
    offlineContext.startRendering().then(() => {
      offlineAnalyser.getFloatFrequencyData(frequencyData);
    }).catch(err => {
      console.error('Error analyzing frequency data:', err);
    });
    
    // Compute the actual frequencies for each bin
    const frequencies: number[] = new Array(frequencyBinCount);
    const sampleRate = audioBuffer.sampleRate;
    for (let i = 0; i < frequencyBinCount; i++) {
      frequencies[i] = i * sampleRate / (fftSize * 2);
    }
    
    // Filter frequencies if min/max are specified
    let startBin = 0;
    let endBin = frequencyBinCount - 1;
    
    if (options.minFrequency !== undefined) {
      startBin = Math.max(0, Math.floor(options.minFrequency * fftSize / sampleRate));
    }
    
    if (options.maxFrequency !== undefined) {
      endBin = Math.min(frequencyBinCount - 1, Math.ceil(options.maxFrequency * fftSize / sampleRate));
    }
    
    // Create filtered arrays
    const filteredFrequencies = frequencies.slice(startBin, endBin + 1);
    const filteredMagnitudes = Array.from(frequencyData.slice(startBin, endBin + 1));
    
    // Convert dB to linear scale and normalize
    const normalizedMagnitudes = filteredMagnitudes.map(dB => {
      // Convert from dB to linear scale (dB is typically negative, with 0dB being max)
      return Math.pow(10, dB / 20);
    });
    
    // Find max for normalization
    const maxMagnitude = Math.max(...normalizedMagnitudes);
    
    // Normalize to 0-1 range
    const normalized = normalizedMagnitudes.map(mag => mag / (maxMagnitude || 1)); // Avoid division by zero
    
    return {
      frequencies: filteredFrequencies,
      magnitudes: filteredMagnitudes,
      normalizedMagnitudes: normalized,
      fftSize,
      sampleRate
    };
  }
  
  /**
   * Get real-time frequency data from analyzer node
   */
  getRealtimeFrequencyData(): Float32Array {
    const dataArray = new Float32Array(this.analyserNode.frequencyBinCount);
    this.analyserNode.getFloatFrequencyData(dataArray);
    return dataArray;
  }
  
  /**
   * Get the frequencies represented by each bin
   */
  getFrequencyBins(): number[] {
    const bins: number[] = [];
    const binCount = this.analyserNode.frequencyBinCount;
    const sampleRate = this.audioContext.sampleRate;
    
    for (let i = 0; i < binCount; i++) {
      bins.push(i * sampleRate / (this.analyserNode.fftSize * 2));
    }
    
    return bins;
  }
} 