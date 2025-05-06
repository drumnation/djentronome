/**
 * Beat Detection Module
 * 
 * Provides tools for detecting beats, tempo, and rhythmic patterns in audio.
 */

/**
 * Options for beat detection
 */
export interface BeatDetectionOptions {
  /**
   * Minimum BPM to detect
   */
  minBpm?: number;
  
  /**
   * Maximum BPM to detect
   */
  maxBpm?: number;
  
  /**
   * Sensitivity threshold (0-1)
   */
  sensitivity?: number;
}

/**
 * Beat detection result
 */
export interface BeatDetectionResult {
  /**
   * Detected BPM
   */
  bpm: number;
  
  /**
   * Confidence level (0-1)
   */
  confidence: number;
  
  /**
   * Beat time markers (seconds)
   */
  beats: number[];
  
  /**
   * Onset strength curve
   */
  onsetCurve?: Float32Array;
}

/**
 * Utility for detecting beats and tempo in audio
 */
export class BeatDetector {
  /**
   * Detect beats in an audio buffer
   */
  detectBeats(audioBuffer: AudioBuffer, options: BeatDetectionOptions = {}): BeatDetectionResult {
    const minBpm = options.minBpm ?? 60;
    const maxBpm = options.maxBpm ?? 200;
    const sensitivity = options.sensitivity ?? 0.5;
    
    // Mix all channels to mono for analysis
    const monoData = this.mixToMono(audioBuffer);
    
    // Calculate onset envelope (energy over time)
    const envelope = this.calculateOnsetEnvelope(monoData, audioBuffer.sampleRate);
    
    // Find peaks in the envelope
    const peaks = this.findPeaks(envelope, sensitivity);
    
    // Convert peak indices to seconds
    const beatTimes = peaks.map(idx => idx * (audioBuffer.duration / envelope.length));
    
    // Estimate BPM from beat intervals
    const intervals: number[] = [];
    for (let i = 1; i < beatTimes.length; i++) {
      intervals.push((beatTimes[i] ?? 0) - (beatTimes[i - 1] ?? 0));
    }
    
    let bpm = 120; // Default fallback
    let confidence = 0;
    
    if (intervals.length > 0) {
      // Calculate median interval
      intervals.sort((a, b) => a - b);
      const medianInterval = intervals[Math.floor(intervals.length / 2)] || 0.5; // Default to 0.5s if undefined
      
      // Convert to BPM (avoid division by zero)
      bpm = medianInterval > 0 ? 60 / medianInterval : 120;
      
      // Ensure it's within the desired range
      if (bpm < minBpm) {
        bpm *= 2;
      } else if (bpm > maxBpm) {
        bpm /= 2;
      }
      
      // Calculate confidence based on consistency of intervals
      if (intervals.length > 1) {
        const meanInterval = intervals.reduce((sum, val) => sum + val, 0) / intervals.length;
        const variance = intervals.reduce((sum, val) => sum + Math.pow(val - meanInterval, 2), 0) / intervals.length;
        const stdDev = Math.sqrt(variance);
        
        // Confidence is higher when standard deviation is low relative to the mean
        confidence = meanInterval > 0 ? Math.max(0, Math.min(1, 1 - (stdDev / meanInterval))) : 0;
      }
    }
    
    return {
      bpm,
      confidence,
      beats: beatTimes,
      onsetCurve: envelope
    };
  }
  
  /**
   * Estimate BPM using autocorrelation method
   */
  estimateBpmUsingAutocorrelation(audioBuffer: AudioBuffer, options: BeatDetectionOptions = {}): number {
    const minBpm = options.minBpm ?? 60;
    const maxBpm = options.maxBpm ?? 200;
    
    // Mix to mono and get onset envelope
    const monoData = this.mixToMono(audioBuffer);
    const envelope = this.calculateOnsetEnvelope(monoData, audioBuffer.sampleRate);
    
    // Calculate time between samples
    const secondsPerSample = audioBuffer.duration / envelope.length;
    
    // Convert BPM range to lag range (in samples)
    const minLag = Math.floor(60 / maxBpm / secondsPerSample);
    const maxLag = Math.ceil(60 / minBpm / secondsPerSample);
    
    // Autocorrelation
    const correlations = new Float32Array(maxLag - minLag + 1);
    for (let lag = minLag; lag <= maxLag; lag++) {
      let sum = 0;
      let count = 0;
      
      for (let i = 0; i < envelope.length - lag; i++) {
        sum += (envelope[i] ?? 0) * (envelope[i + lag] ?? 0);
        count++;
      }
      
      correlations[lag - minLag] = count > 0 ? sum / count : 0;
    }
    
    // Find the peak correlation
    let maxCorrelation = 0;
    let bestLag = 0;
    
    for (let i = 0; i < correlations.length; i++) {
      if ((correlations[i] ?? 0) > maxCorrelation) {
        maxCorrelation = correlations[i] ?? 0;
        bestLag = i + minLag;
      }
    }
    
    // Convert lag to BPM
    const bpm = bestLag > 0 ? 60 / (bestLag * secondsPerSample) : 120; // Avoid division by zero
    
    return bpm;
  }
  
  /**
   * Detect rhythmic pattern (e.g., 4/4, 3/4)
   */
  detectRhythmicPattern(audioBuffer: AudioBuffer, options: BeatDetectionOptions = {}): {
    timeSignature: string;
    subdivisions: number[][];
  } {
    // Get beat times
    const { beats } = this.detectBeats(audioBuffer, options);
    
    // Default to 4/4 time signature
    let beatsPerBar = 4;
    
    // Group beats into bars
    const beatGroups: number[][] = [];
    let currentGroup: number[] = [];
    
    for (let i = 0; i < beats.length; i++) {
      currentGroup.push(beats[i] ?? 0);
      
      if (currentGroup.length >= beatsPerBar) {
        beatGroups.push([...currentGroup]);
        currentGroup = [];
      }
    }
    
    if (currentGroup.length > 0) {
      beatGroups.push(currentGroup);
    }
    
    // Analyze subdivisions within each bar
    const subdivisions = beatGroups.map(bar => {
      const subbeats: number[] = [];
      for (let i = 1; i < bar.length; i++) {
        const interval = (bar[i] ?? 0) - (bar[i - 1] ?? 0);
        subbeats.push(interval);
      }
      return subbeats;
    });
    
    return {
      timeSignature: `${beatsPerBar}/4`, // Default to X/4 time
      subdivisions
    };
  }
  
  /**
   * Mix audio buffer to mono
   */
  private mixToMono(audioBuffer: AudioBuffer): Float32Array {
    const channels = audioBuffer.numberOfChannels;
    const length = audioBuffer.length;
    const monoData = new Float32Array(length);
    
    // Mix all channels
    for (let ch = 0; ch < channels; ch++) {
      const channelData = audioBuffer.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        const sample = channelData[i] ?? 0;
        monoData[i] = (monoData[i] ?? 0) + (sample / channels);
      }
    }
    
    return monoData;
  }
  
  /**
   * Calculate onset envelope
   */
  private calculateOnsetEnvelope(monoData: Float32Array, sampleRate: number): Float32Array {
    // Calculate energy in small windows
    const windowSize = Math.floor(sampleRate * 0.02); // 20ms windows
    const hopSize = Math.floor(windowSize / 2); // 50% overlap
    const numWindows = Math.floor((monoData.length - windowSize) / hopSize) + 1;
    
    const envelope = new Float32Array(numWindows);
    
    for (let i = 0; i < numWindows; i++) {
      const windowStart = i * hopSize;
      let energy = 0;
      
      // Calculate energy in this window
      for (let j = 0; j < windowSize; j++) {
        if (windowStart + j < monoData.length) {
          const sample = monoData[windowStart + j] ?? 0;
          energy += sample * sample;
        }
      }
      
      envelope[i] = Math.sqrt(energy / windowSize);
    }
    
    // Apply derivative to highlight changes
    const derivative = new Float32Array(envelope.length - 1);
    for (let i = 0; i < derivative.length; i++) {
      derivative[i] = Math.max(0, (envelope[i + 1] ?? 0) - (envelope[i] ?? 0));
    }
    
    // Smoothing
    const smoothed = new Float32Array(derivative.length);
    const smoothingSize = 5;
    for (let i = 0; i < derivative.length; i++) {
      let sum = 0;
      let count = 0;
      for (let j = Math.max(0, i - smoothingSize); j <= Math.min(derivative.length - 1, i + smoothingSize); j++) {
        sum += derivative[j] ?? 0;
        count++;
      }
      smoothed[i] = count > 0 ? sum / count : 0; // Avoid division by zero
    }
    
    return smoothed;
  }
  
  /**
   * Find peaks in the envelope
   */
  private findPeaks(envelope: Float32Array, sensitivity: number): number[] {
    const peaks: number[] = [];
    const lookAhead = 5; // Look ahead/behind this many samples
    
    // Find the threshold using a basic percentile approach
    const sortedValues = Array.from(envelope).sort((a, b) => (a ?? 0) - (b ?? 0));
    const thresholdIdx = Math.floor(sortedValues.length * (1 - sensitivity));
    const threshold = thresholdIdx >= 0 && thresholdIdx < sortedValues.length
      ? sortedValues[thresholdIdx] ?? 0
      : 0;
    
    // Find peaks
    for (let i = lookAhead; i < envelope.length - lookAhead; i++) {
      if ((envelope[i] ?? 0) > threshold) {
        let isPeak = true;
        
        // Check if it's a local maximum
        for (let j = i - lookAhead; j <= i + lookAhead; j++) {
          if (j !== i && j >= 0 && j < envelope.length && 
              ((envelope[j] ?? 0) > (envelope[i] ?? 0))) {
            isPeak = false;
            break;
          }
        }
        
        if (isPeak) {
          peaks.push(i);
          i += lookAhead; // Skip ahead to avoid multiple detections of the same peak
        }
      }
    }
    
    return peaks;
  }
} 