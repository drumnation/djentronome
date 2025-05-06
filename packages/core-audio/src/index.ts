/**
 * Core Audio Engine for Djentronome
 */
import { FileLoader, AudioFileInfo, AudioSource } from './file-loader';
import { Transcriber, TranscriptionElement, TranscriptionResult, TranscriptionOptions } from './transcriber';

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
 * Audio loaded from a local file
 */
export interface LocalAudio {
  /**
   * Decoded audio buffer
   */
  buffer: AudioBuffer;
  /**
   * Information about the file
   */
  info: AudioFileInfo;
}

/**
 * Audio playback instance
 */
export interface AudioInstance {
  /**
   * Unique ID for this playback instance
   */
  id: string;
  /**
   * Audio buffer source node
   */
  source: AudioBufferSourceNode;
  /**
   * Gain node for controlling volume
   */
  gainNode: GainNode;
  /**
   * Start time in context time
   */
  startTime: number;
  /**
   * Duration of audio in seconds
   */
  duration: number;
  /**
   * State of playback
   */
  state: 'playing' | 'paused' | 'stopped';
  /**
   * ID of the sound buffer
   */
  soundId: string;
  /**
   * Offset in seconds for resuming from pause
   */
  pauseTime?: number;
}

/**
 * Core audio engine for managing game audio
 */
export class AudioEngine {
  private context: AudioContext | null = null;
  private masterGainNode: GainNode | null = null;
  private soundBuffers: Map<string, AudioBuffer> = new Map();
  private activeSounds: Map<string, AudioInstance> = new Map();
  private fileLoader: FileLoader | null = null;
  private localAudio: Map<string, LocalAudio> = new Map();
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
      
      // Initialize file loader
      this.fileLoader = new FileLoader({ context: this.context });
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
   * Load audio from a local File object
   */
  public async loadFromFile(id: string, file: File): Promise<boolean> {
    if (!this.enabled || !this.context || !this.fileLoader) {
      return false;
    }
    
    try {
      const result = await this.fileLoader.loadFromFile(file);
      
      // Store both the buffer for playback and the local audio info
      this.soundBuffers.set(id, result.buffer);
      this.localAudio.set(id, result);
      
      return true;
    } catch (error) {
      console.error(`Failed to load audio from file ${id}:`, error);
      return false;
    }
  }
  
  /**
   * Load audio from a URL (can be a remote URL or a local file:// URL)
   */
  public async loadFromUrl(id: string, url: string, filename?: string): Promise<boolean> {
    if (!this.enabled || !this.context || !this.fileLoader) {
      return false;
    }
    
    try {
      const result = await this.fileLoader.loadFromUrl(url, filename);
      
      // Store both the buffer for playback and the local audio info
      this.soundBuffers.set(id, result.buffer);
      this.localAudio.set(id, result);
      
      return true;
    } catch (error) {
      console.error(`Failed to load audio from URL ${id}:`, error);
      return false;
    }
  }
  
  /**
   * Load audio from an ArrayBuffer
   */
  public async loadFromArrayBuffer(
    id: string, 
    arrayBuffer: ArrayBuffer, 
    name: string, 
    format: AudioFormat
  ): Promise<boolean> {
    if (!this.enabled || !this.context || !this.fileLoader) {
      return false;
    }
    
    try {
      const result = await this.fileLoader.loadFromArrayBuffer(arrayBuffer, name, format);
      
      // Store both the buffer for playback and the local audio info
      this.soundBuffers.set(id, result.buffer);
      this.localAudio.set(id, result);
      
      return true;
    } catch (error) {
      console.error(`Failed to load audio from ArrayBuffer ${id}:`, error);
      return false;
    }
  }
  
  /**
   * Get information about loaded local audio
   */
  public getAudioInfo(id: string): AudioFileInfo | null {
    const localAudio = this.localAudio.get(id);
    if (!localAudio) {
      return null;
    }
    
    return localAudio.info;
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
    const startTime = this.context.currentTime;
    source.start(startTime);
    
    // Create audio instance
    const instance: AudioInstance = {
      id: instanceId,
      source,
      gainNode,
      startTime,
      duration: soundBuffer.duration,
      state: 'playing',
      soundId: id
    };
    
    // Store the instance
    this.activeSounds.set(instanceId, instance);
    
    // Add ended listener to clean up
    source.onended = () => {
      // Only handle if not already stopped or paused
      if (this.activeSounds.has(instanceId)) {
        const sound = this.activeSounds.get(instanceId)!;
        if (sound.state === 'playing') {
          sound.state = 'stopped';
          this.activeSounds.delete(instanceId);
        }
      }
    };
    
    return instanceId;
  }

  /**
   * Pause a playing sound
   */
  public pauseSound(instanceId: string): boolean {
    if (!this.enabled || !this.context) return false;

    const instance = this.activeSounds.get(instanceId);
    if (!instance || instance.state !== 'playing') return false;

    try {
      // Calculate current playback position
      const elapsed = this.context.currentTime - instance.startTime;
      const pauseTime = Math.min(elapsed, instance.duration);
      
      // Stop the current source node
      instance.source.stop();
      
      // Update instance state
      instance.state = 'paused';
      instance.pauseTime = pauseTime;
      
      return true;
    } catch (error) {
      console.error(`Failed to pause sound ${instanceId}:`, error);
      return false;
    }
  }
  
  /**
   * Resume a paused sound
   */
  public resumeSound(instanceId: string): boolean {
    if (!this.enabled || !this.context || !this.masterGainNode) return false;

    const instance = this.activeSounds.get(instanceId);
    if (!instance || instance.state !== 'paused' || instance.pauseTime === undefined) return false;

    try {
      // Get the sound buffer
      const soundBuffer = this.soundBuffers.get(instance.soundId);
      if (!soundBuffer) return false;
      
      // Create new source node
      const source = this.context.createBufferSource();
      source.buffer = soundBuffer;
      source.loop = instance.source.loop;
      source.playbackRate.value = instance.source.playbackRate.value;
      
      // Connect to the existing gain node
      source.connect(instance.gainNode);
      
      // Start playback from the pause position
      const startTime = this.context.currentTime;
      source.start(startTime, instance.pauseTime);
      
      // Update instance with new source and times
      instance.source = source;
      instance.startTime = startTime - instance.pauseTime;
      instance.state = 'playing';
      instance.pauseTime = undefined;
      
      // Add ended listener to clean up
      source.onended = () => {
        // Only handle if not already stopped or paused
        if (this.activeSounds.has(instanceId)) {
          const sound = this.activeSounds.get(instanceId)!;
          if (sound.state === 'playing') {
            sound.state = 'stopped';
            this.activeSounds.delete(instanceId);
          }
        }
      };
      
      return true;
    } catch (error) {
      console.error(`Failed to resume sound ${instanceId}:`, error);
      return false;
    }
  }

  /**
   * Stop a playing sound
   */
  public stopSound(instanceId: string): boolean {
    if (!this.enabled) return false;

    const instance = this.activeSounds.get(instanceId);
    if (!instance) return false;

    try {
      if (instance.state === 'playing') {
        instance.source.stop();
      }
      
      instance.state = 'stopped';
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
   * Resume the audio context after user interaction
   */
  public async resumeContext(): Promise<boolean> {
    if (!this.enabled || !this.context) return false;
    
    try {
      if (this.context.state === 'suspended') {
        await this.context.resume();
      }
      return this.context.state === 'running';
    } catch (error) {
      console.error('Failed to resume audio context:', error);
      return false;
    }
  }
  
  /**
   * Get the current accurate audio context time
   */
  public getCurrentTime(): number {
    if (!this.enabled || !this.context) return 0;
    
    return this.context.currentTime;
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
    this.localAudio.clear();
    
    // Close audio context
    if (this.context && this.context.state !== 'closed') {
      this.context.close();
    }
    
    this.context = null;
    this.masterGainNode = null;
    this.fileLoader = null;
  }
}

export { FileLoader, AudioSource };
export type { AudioFileInfo };
export { Transcriber, TranscriptionElement };
export type { TranscriptionResult, TranscriptionOptions };
export default AudioEngine;
