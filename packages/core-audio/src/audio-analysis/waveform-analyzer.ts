/**
 * Waveform Analysis Module
 * 
 * Provides tools for analyzing time-domain waveform data from audio signals.
 */

/**
 * Options for waveform extraction
 */
export interface WaveformExtractionOptions {
  /**
   * Number of data points to extract (default 1000)
   */
  resolution?: number;
  
  /**
   * Which audio channel to use (default 0)
   */
  channel?: number;
  
  /**
   * Whether to normalize waveform data (-1 to 1)
   */
  normalize?: boolean;
}

/**
 * Waveform data result
 */
export interface WaveformData {
  /**
   * Waveform amplitude data (-1 to 1)
   */
  data: Float32Array;
  
  /**
   * Time points in seconds
   */
  times: Float32Array;
  
  /**
   * Peak amplitude in the extracted data
   */
  peak: number;
  
  /**
   * RMS (root mean square) amplitude
   */
  rms: number;
  
  /**
   * Duration of the waveform in seconds
   */
  duration: number;
  
  /**
   * Resolution (number of points)
   */
  resolution: number;
}

/**
 * Utility for analyzing time-domain waveform data
 */
export class WaveformAnalyzer {
  /**
   * Extract waveform data from an audio buffer
   */
  extractWaveform(audioBuffer: AudioBuffer, options: WaveformExtractionOptions = {}): WaveformData {
    const resolution = options.resolution || 1000;
    const channelIndex = Math.min(options.channel ?? 0, audioBuffer.numberOfChannels - 1);
    const normalize = options.normalize !== false; // default true
    
    // Get the raw audio data for the selected channel
    const rawData = audioBuffer.getChannelData(channelIndex);
    const samplesPerPoint = Math.max(1, Math.floor(rawData.length / resolution));
    
    // Create arrays for the output data
    const waveform = new Float32Array(resolution);
    const times = new Float32Array(resolution);
    
    let maxAmplitude = 0;
    let sumSquared = 0;
    
    // Extract waveform by averaging samples
    for (let i = 0; i < resolution; i++) {
      const startSample = i * samplesPerPoint;
      const endSample = Math.min(startSample + samplesPerPoint, rawData.length);
      
      let sum = 0;
      for (let j = startSample; j < endSample; j++) {
        const sample = rawData[j] ?? 0; // Add null coalescing to fix linter error
        sum += sample;
        sumSquared += sample * sample;
      }
      
      const avgAmplitude = sum / (endSample - startSample);
      waveform[i] = avgAmplitude;
      
      // Track max amplitude for normalization
      maxAmplitude = Math.max(maxAmplitude, Math.abs(avgAmplitude));
      
      // Calculate time for this point
      times[i] = i * (audioBuffer.duration / resolution);
    }
    
    // Normalize if requested
    if (normalize && maxAmplitude > 0) {
      for (let i = 0; i < resolution; i++) {
        waveform[i] = (waveform[i] ?? 0) / maxAmplitude; // Fix linter error
      }
      maxAmplitude = 1;
    }
    
    // Calculate RMS (root mean square)
    const rms = Math.sqrt(sumSquared / rawData.length);
    
    return {
      data: waveform,
      times,
      peak: maxAmplitude,
      rms,
      duration: audioBuffer.duration,
      resolution
    };
  }
  
  /**
   * Get amplitude statistics from an audio buffer
   */
  getAmplitudeStats(audioBuffer: AudioBuffer, channel: number = 0): { 
    min: number;
    max: number;
    peak: number;
    rms: number;
    crest: number;
  } {
    const channelData = audioBuffer.getChannelData(
      Math.min(channel, audioBuffer.numberOfChannels - 1)
    );
    
    let min = 0;
    let max = 0;
    let sumSquared = 0;
    
    for (let i = 0; i < channelData.length; i++) {
      const sample = channelData[i] ?? 0;
      min = Math.min(min, sample);
      max = Math.max(max, sample);
      sumSquared += sample * sample;
    }
    
    const peak = Math.max(Math.abs(min), Math.abs(max));
    const rms = Math.sqrt(sumSquared / channelData.length);
    const crest = peak > 0 ? peak / rms : 0; // Crest factor (peak/RMS)
    
    return { min, max, peak, rms, crest };
  }
  
  /**
   * Calculate loudness profile over time
   */
  getLoudnessProfile(audioBuffer: AudioBuffer, segmentDuration: number = 0.1): { 
    times: Float32Array;
    loudness: Float32Array;
  } {
    const numSegments = Math.ceil(audioBuffer.duration / segmentDuration);
    const times = new Float32Array(numSegments);
    const loudness = new Float32Array(numSegments);
    
    const samplesPerSegment = Math.floor(audioBuffer.sampleRate * segmentDuration);
    
    // Mix down to mono
    const monoData = this.mixToMono(audioBuffer);
    
    for (let i = 0; i < numSegments; i++) {
      const startSample = i * samplesPerSegment;
      const endSample = Math.min(startSample + samplesPerSegment, monoData.length);
      
      let sumSquared = 0;
      for (let j = startSample; j < endSample; j++) {
        const sample = monoData[j] ?? 0;
        sumSquared += sample * sample;
      }
      
      // Calculate RMS for this segment
      loudness[i] = Math.sqrt(sumSquared / (endSample - startSample));
      times[i] = i * segmentDuration;
    }
    
    return { times, loudness };
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
        const sample = channelData[i] ?? 0; // Add null coalescing to fix linter error
        // TypeScript sees the index access as potentially undefined, but we know it's valid
        // since we're creating a Float32Array of exactly the right length
        monoData[i] = (monoData[i] ?? 0) + (sample / channels);
      }
    }
    
    return monoData;
  }
} 