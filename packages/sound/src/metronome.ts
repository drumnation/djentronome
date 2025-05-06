/**
 * Metronome service for Djentronome
 * 
 * Uses the core-audio engine to play metronome sounds with
 * precise timing for rhythm-based gameplay
 */

import { AudioEngine, SoundConfig } from '../../core-audio/src';

/**
 * Default paths to metronome samples
 */
export const DEFAULT_METRONOME_SOUNDS = {
  downbeat: '/sounds/metronome/woodblock-high.wav',
  quarterNote: '/sounds/metronome/woodblock-low.wav',
  subdivision: '/sounds/metronome/woodblock-tick.wav',
  triplet: '/sounds/metronome/woodblock-mid.wav',
};

/**
 * Metronome configuration
 */
export interface MetronomeConfig {
  /** BPM (beats per minute) */
  tempo: number;
  /** Time signature numerator */
  beatsPerMeasure: number;
  /** Time signature denominator (4 = quarter note, 8 = eighth note, etc.) */
  beatUnit: number;
  /** Subdivision per beat (1 = quarter notes, 2 = eighth notes, 4 = sixteenth notes) */
  subdivision: number;
  /** Whether to use triplet feel */
  tripletFeel: boolean;
  /** Custom sound paths (optional) */
  sounds?: {
    downbeat?: string;
    quarterNote?: string;
    subdivision?: string;
    triplet?: string;
  };
  /** Volume levels for each sound type (0-1) */
  volumes?: {
    downbeat?: number;
    quarterNote?: number;
    subdivision?: number;
    triplet?: number;
  };
}

/**
 * Default metronome configuration
 */
const DEFAULT_CONFIG: MetronomeConfig = {
  tempo: 120,
  beatsPerMeasure: 4,
  beatUnit: 4,
  subdivision: 1,
  tripletFeel: false,
  volumes: {
    downbeat: 1.0,
    quarterNote: 0.8,
    subdivision: 0.6,
    triplet: 0.7,
  }
};

/**
 * Metronome service for rhythm-based timing
 */
export class Metronome {
  private audioEngine: AudioEngine;
  private config: MetronomeConfig;
  private isPlaying: boolean = false;
  private intervalId: number | null = null;
  private currentBeat: number = 0;
  private currentSubdivision: number = 0;
  private soundIds: Record<string, string> = {};
  
  /**
   * Create a new metronome service
   */
  constructor(audioEngine: AudioEngine, config: Partial<MetronomeConfig> = {}) {
    this.audioEngine = audioEngine;
    this.config = { ...DEFAULT_CONFIG, ...config };
  }
  
  /**
   * Load all metronome sounds
   */
  public async loadSounds(): Promise<boolean> {
    const sounds = {
      downbeat: this.config.sounds?.downbeat || DEFAULT_METRONOME_SOUNDS.downbeat,
      quarterNote: this.config.sounds?.quarterNote || DEFAULT_METRONOME_SOUNDS.quarterNote,
      subdivision: this.config.sounds?.subdivision || DEFAULT_METRONOME_SOUNDS.subdivision,
      triplet: this.config.sounds?.triplet || DEFAULT_METRONOME_SOUNDS.triplet,
    };
    
    try {
      for (const [key, src] of Object.entries(sounds)) {
        const soundConfig: SoundConfig = {
          src,
          volume: this.config.volumes?.[key as keyof typeof this.config.volumes] || 1.0,
        };
        
        const result = await this.audioEngine.loadSound(key, soundConfig);
        if (result) {
          this.soundIds[key] = key;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Failed to load metronome sounds:', error);
      return false;
    }
  }
  
  /**
   * Start the metronome
   */
  public start(): void {
    if (this.isPlaying) return;
    
    this.isPlaying = true;
    this.currentBeat = 0;
    this.currentSubdivision = 0;
    
    // Calculate interval based on tempo and subdivision
    const bpm = this.config.tempo;
    const minuteMs = 60000;
    const beatMs = minuteMs / bpm;
    const subdivisionMs = beatMs / this.getSubdivisionCount();
    
    // Start the interval
    this.tick(); // Initial tick
    this.intervalId = window.setInterval(() => this.tick(), subdivisionMs);
  }
  
  /**
   * Stop the metronome
   */
  public stop(): void {
    if (!this.isPlaying) return;
    
    this.isPlaying = false;
    
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  
  /**
   * Update metronome configuration
   */
  public updateConfig(config: Partial<MetronomeConfig>): void {
    const wasPlaying = this.isPlaying;
    
    // Stop if currently playing
    if (wasPlaying) {
      this.stop();
    }
    
    // Update config
    this.config = { ...this.config, ...config };
    
    // Restart if it was playing
    if (wasPlaying) {
      this.start();
    }
  }
  
  /**
   * Get current configuration
   */
  public getConfig(): MetronomeConfig {
    return { ...this.config };
  }
  
  /**
   * Check if metronome is playing
   */
  public isActive(): boolean {
    return this.isPlaying;
  }
  /**
   * Play a test sound to check if audio is working
   */
  public playTestSound(): void {
    if (this.soundIds.downbeat) {
      this.audioEngine.playSound(this.soundIds.downbeat);
    }
  }

  
  /**
   * Process tick and play appropriate sounds
   */
  private tick(): void {
    // If we're processing a tick, determine which sound to play
    if (this.currentSubdivision === 0) {
      // On the first beat of the measure
      if (this.currentBeat === 0) {
        if (this.soundIds.downbeat) {
          this.audioEngine.playSound(this.soundIds.downbeat);
        }
      } else {
        // Regular beat
        if (this.soundIds.quarterNote) {
          this.audioEngine.playSound(this.soundIds.quarterNote);
        }
      }
    } else {
      // Subdivision tick
      if (this.config.tripletFeel) {
        if (this.soundIds.triplet) {
          this.audioEngine.playSound(this.soundIds.triplet);
        }
      } else {
        if (this.soundIds.subdivision) {
          this.audioEngine.playSound(this.soundIds.subdivision);
        }
      }
    }
    
    // Update beat and subdivision counters
    this.incrementCounters();
  }
  
  /**
   * Increment beat and subdivision counters
   */
  private incrementCounters(): void {
    const subdivisionCount = this.getSubdivisionCount();
    
    // Increment subdivision
    this.currentSubdivision++;
    
    // If we've reached the end of subdivisions for this beat
    if (this.currentSubdivision >= subdivisionCount) {
      this.currentSubdivision = 0;
      this.currentBeat++;
      
      // If we've reached the end of the measure
      if (this.currentBeat >= this.config.beatsPerMeasure) {
        this.currentBeat = 0;
      }
    }
  }
  
  /**
   * Get the number of subdivisions per beat
   */
  private getSubdivisionCount(): number {
    if (this.config.tripletFeel) {
      return 3 * this.config.subdivision;
    }
    return this.config.subdivision;
  }
}

export default Metronome; 
