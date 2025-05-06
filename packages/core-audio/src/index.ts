/**
 * Core Audio Engine for Djentronome
 */

/**
 * Audio file formats supported
 */
export enum AudioFormat {
  MP3 = 'mp3',
  WAV = 'wav',
  OGG = 'ogg'
}

/**
 * Configuration options for the audio engine
 */
export interface AudioEngineOptions {
  /**
   * Master volume level (0-1)
   */
  masterVolume?: number;
  /**
   * Whether to enable audio
   */
  enabled?: boolean;
  /**
   * Whether to preload all sounds on initialization
   */
  preloadSounds?: boolean;
}

/**
 * Audio sound configuration
 */
export interface SoundConfig {
  /**
   * Path to the audio file
   */
  src: string;
  /**
   * Volume level for this sound (0-1)
   */
  volume?: number;
  /**
   * Whether to loop the sound
   */
  loop?: boolean;
  /**
   * Playback rate (1 = normal)
   */
  playbackRate?: number;
}

/**
 * Core audio engine for managing game audio
 */
export class AudioEngine {
  private context: AudioContext | null = null;
  private masterGainNode: GainNode | null = null;
  private soundBuffers: Map<string, AudioBuffer> = new Map();
  private activeSounds: Map<string, AudioBufferSourceNode> = new Map();
  private masterVolume: number;
  private enabled: boolean;
  private preloadSounds: boolean;

  /**
   * Create a new audio engine
   */
  constructor(options: AudioEngineOptions = {}) {
    this.masterVolume = options.masterVolume ?? 1.0;
    this.enabled = options.enabled ?? true;
    this.preloadSounds = options.preloadSounds ?? false;
  }

  /**
   * Initialize the audio engine
   */
  public async initialize(): Promise<void> {
    if (!this.enabled) return;

    try {
      this.context = new AudioContext();
      this.masterGainNode = this.context.createGain();
      this.masterGainNode.gain.value = this.masterVolume;
      this.masterGainNode.connect(this.context.destination);

      // If preloading is enabled, we would load default sounds here
      if (this.preloadSounds) {
        console.log('Preloading sounds is enabled, but no sounds are configured for preloading');
        // Implementation for preloading would go here
      }
    } catch (error) {
      console.error('Failed to initialize AudioEngine:', error);
      this.enabled = false;
    }
  }

  /**
   * Load a sound into the engine
   */
  public async loadSound(id: string, config: SoundConfig): Promise<boolean> {
    if (!this.enabled || !this.context) return false;

    try {
      const response = await fetch(config.src);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
      
      this.soundBuffers.set(id, audioBuffer);
      return true;
    } catch (error) {
      console.error(`Failed to load sound ${id}:`, error);
      return false;
    }
  }

  /**
   * Play a loaded sound
   */
  public playSound(id: string, options: Partial<SoundConfig> = {}): string | null {
    if (!this.enabled || !this.context || !this.masterGainNode) return null;

    const soundBuffer = this.soundBuffers.get(id);
    if (!soundBuffer) {
      console.warn(`Sound ${id} not found`);
      return null;
    }

    // Generate a unique instance ID for this playback
    const instanceId = `${id}_${Date.now()}`;
    
    // Create source node
    const source = this.context.createBufferSource();
    source.buffer = soundBuffer;
    
    // Set loop if specified
    source.loop = options.loop ?? false;
    
    // Set playback rate if specified
    if (options.playbackRate !== undefined) {
      source.playbackRate.value = options.playbackRate;
    }
    
    // Create gain node for this sound
    const gainNode = this.context.createGain();
    gainNode.gain.value = options.volume ?? 1.0;
    
    // Connect nodes
    source.connect(gainNode);
    gainNode.connect(this.masterGainNode);
    
    // Start playback
    source.start(0);
    
    // Store the source node
    this.activeSounds.set(instanceId, source);
    
    // Add ended listener to clean up
    source.onended = () => {
      this.activeSounds.delete(instanceId);
    };
    
    return instanceId;
  }

  /**
   * Stop a playing sound
   */
  public stopSound(instanceId: string): boolean {
    if (!this.enabled) return false;

    const source = this.activeSounds.get(instanceId);
    if (!source) return false;

    try {
      source.stop();
      this.activeSounds.delete(instanceId);
      return true;
    } catch (error) {
      console.error(`Failed to stop sound ${instanceId}:`, error);
      return false;
    }
  }

  /**
   * Set the master volume
   */
  public setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    
    if (this.masterGainNode) {
      this.masterGainNode.gain.value = this.masterVolume;
    }
  }

  /**
   * Get the current master volume
   */
  public getMasterVolume(): number {
    return this.masterVolume;
  }

  /**
   * Enable or disable audio
   */
  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    
    if (enabled && !this.context) {
      this.initialize();
    }
  }

  /**
   * Check if audio is enabled
   */
  public isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Cleanup resources
   */
  public dispose(): void {
    // Stop all active sounds
    for (const instanceId of this.activeSounds.keys()) {
      this.stopSound(instanceId);
    }
    
    // Clear collections
    this.activeSounds.clear();
    this.soundBuffers.clear();
    
    // Close audio context
    if (this.context && this.context.state !== 'closed') {
      this.context.close();
    }
    
    this.context = null;
    this.masterGainNode = null;
  }
}

export default AudioEngine;
