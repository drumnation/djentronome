/**
 * Core Audio Package
 * 
 * Provides audio engine, synchronization, and analysis functionality.
 */

/**
 * Core Audio Engine for Djentronome
 */
import { FileLoader, AudioFileInfo, AudioSource } from './file-loader';
import { Transcriber, TranscriptionElement, TranscriptionResult, TranscriptionOptions } from './transcriber';

// Audio engine components
export * from './game-sync';
export * from './audio-game-integration';
export * from './buffer-manager';
export * from './bpm-utils';
export * from './audio-analysis';

// Re-export audio analysis submodules for direct access
export * from './audio-analysis/index';

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
 * Audio event types
 */
export enum AudioEventType {
  LOAD = 'load',
  PLAY = 'play',
  PAUSE = 'pause',
  RESUME = 'resume',
  STOP = 'stop',
  END = 'end',
  SYNC = 'sync',
  ERROR = 'error'
}

/**
 * Audio event listener function
 */
export type AudioEventListener = (event: AudioEvent) => void;

/**
 * Audio event object
 */
export interface AudioEvent {
  /**
   * Type of event
   */
  type: AudioEventType;
  /**
   * ID of the audio instance
   */
  instanceId?: string;
  /**
   * ID of the sound
   */
  soundId?: string;
  /**
   * Time of the event in context time
   */
  time: number;
  /**
   * Additional data for the event
   */
  data?: any;
}

/**
 * Sync point for audio events
 */
export interface SyncPoint {
  /**
   * Time in seconds when this sync point should trigger
   */
  time: number;
  /**
   * ID for the sync point
   */
  id: string;
  /**
   * Whether this sync point has been triggered
   */
  triggered: boolean;
  /**
   * Optional data to include with the sync event
   */
  data?: any;
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
  /**
   * Sync points for this instance
   */
  syncPoints?: SyncPoint[];
}

/**
 * Audio Engine class for audio playback and management
 */
export class AudioEngine {
  private context: AudioContext | null = null;
  private masterGainNode: GainNode | null = null;
  private soundBuffers: Map<string, AudioBuffer> = new Map();
  private soundInfos: Map<string, AudioFileInfo> = new Map();
  private activeSounds: Map<string, AudioInstance> = new Map();
  private fileLoader: FileLoader | null = null;
  private bufferManager: BufferManager;
  private localAudio: Map<string, LocalAudio> = new Map();
  private eventListeners: Map<AudioEventType, Set<AudioEventListener>> = new Map();
  private options: AudioEngineOptions;
  private masterVolume: number;
  private enabled: boolean;
  private syncChecker: number | null = null;

  /**
   * Create a new audio engine
   */
  constructor(options: AudioEngineOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.context = new AudioContext();
    this.masterGain = this.context.createGain();
    this.masterGain.gain.value = this.options.gain || 1.0;
    this.masterGain.connect(this.context.destination);
    
    // Initialize file loader
    this.fileLoader = new FileLoader({
      context: this.context
    });
    
    // Initialize buffer manager
    this.bufferManager = new BufferManager({
      maxMemoryMB: this.options.maxMemoryMB || 100,
      streamThresholdMB: this.options.streamThresholdMB || 10
    });

    this.masterVolume = options.masterVolume ?? 1.0;
    this.enabled = options.enabled ?? true;
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
      
      // Start the sync point checker
      this.startSyncChecker();
      
      // Dispatch initialization event
      this.dispatchEvent({
        type: AudioEventType.LOAD,
        time: this.getCurrentTime()
      });
    } catch (error) {
      console.error('Failed to initialize AudioEngine:', error);
      this.enabled = false;
      
      // Dispatch error event
      this.dispatchEvent({
        type: AudioEventType.ERROR,
        time: this.getCurrentTime(),
        data: { error }
      });
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
   * Play a sound
   */
  public playSound(id: string, options: Partial<SoundConfig> = {}): string | null {
    if (!this.enabled || !this.context || !this.masterGainNode) return null;
    
    // Get sound buffer
    const buffer = this.soundBuffers.get(id);
    if (!buffer) {
      console.error(`Sound not loaded: ${id}`);
      return null;
    }
    
    try {
      // Create source node
      const source = this.context.createBufferSource();
      source.buffer = buffer;
      
      // Set loop option
      source.loop = options.loop ?? false;
      
      // Set playback rate
      if (options.playbackRate !== undefined) {
        source.playbackRate.value = options.playbackRate;
      }
      
      // Create gain node for this instance
      const gainNode = this.context.createGain();
      
      // Set volume
      const volume = options.volume ?? 1.0;
      gainNode.gain.value = volume;
      
      // Connect nodes: source -> gain -> master -> destination
      source.connect(gainNode);
      gainNode.connect(this.masterGainNode);
      
      // Generate unique ID for this instance
      const instanceId = `${id}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      
      // Store instance
      const instance: AudioInstance = {
        id: instanceId,
        source,
        gainNode,
        startTime: this.context.currentTime,
        duration: buffer.duration,
        state: 'playing',
        soundId: id
      };
      
      this.activeSounds.set(instanceId, instance);
      
      // Start playback
      source.start();
      
      // Set up ended callback
      source.onended = () => {
        if (this.activeSounds.has(instanceId)) {
          this.activeSounds.delete(instanceId);
          
          // Dispatch end event
          this.dispatchEvent({
            type: AudioEventType.END,
            instanceId,
            soundId: id,
            time: this.getCurrentTime()
          });
        }
      };
      
      // Dispatch play event
      this.dispatchEvent({
        type: AudioEventType.PLAY,
        instanceId,
        soundId: id,
        time: this.context.currentTime,
        data: { duration: buffer.duration }
      });
      
      return instanceId;
    } catch (error) {
      console.error(`Failed to play sound ${id}:`, error);
      
      // Dispatch error event
      this.dispatchEvent({
        type: AudioEventType.ERROR,
        soundId: id,
        time: this.getCurrentTime(),
        data: { error }
      });
      
      return null;
    }
  }
  
  /**
   * Pause sound playback
   */
  public pauseSound(instanceId: string): boolean {
    if (!this.enabled || !this.context) return false;
    
    const instance = this.activeSounds.get(instanceId);
    if (!instance || instance.state !== 'playing') {
      return false;
    }
    
    try {
      // Calculate current position
      const currentTime = this.context.currentTime;
      instance.pauseTime = currentTime - instance.startTime;
      
      // Stop the source (cannot be restarted, will create a new one on resume)
      instance.source.stop();
      
      // Update state
      instance.state = 'paused';
      
      // Dispatch pause event
      this.dispatchEvent({
        type: AudioEventType.PAUSE,
        instanceId,
        soundId: instance.soundId,
        time: currentTime,
        data: { pauseTime: instance.pauseTime }
      });
      
      return true;
    } catch (error) {
      console.error(`Failed to pause sound ${instanceId}:`, error);
      return false;
    }
  }
  
  /**
   * Resume sound playback
   */
  public resumeSound(instanceId: string): boolean {
    if (!this.enabled || !this.context || !this.masterGainNode) return false;
    
    const instance = this.activeSounds.get(instanceId);
    if (!instance || instance.state !== 'paused' || instance.pauseTime === undefined) {
      return false;
    }
    
    try {
      // Get the buffer
      const buffer = this.soundBuffers.get(instance.soundId);
      if (!buffer) {
        return false;
      }
      
      // Create a new source node
      const source = this.context.createBufferSource();
      source.buffer = buffer;
      source.loop = instance.source.loop;
      source.playbackRate.value = instance.source.playbackRate.value;
      
      // Connect to gain node
      source.connect(instance.gainNode);
      
      // Update instance
      instance.source = source;
      instance.startTime = this.context.currentTime - instance.pauseTime;
      instance.state = 'playing';
      
      // Start playback from pause position
      source.start(0, instance.pauseTime);
      
      // Setup ended callback
      source.onended = () => {
        if (this.activeSounds.has(instanceId)) {
          this.activeSounds.delete(instanceId);
          
          // Dispatch end event
          this.dispatchEvent({
            type: AudioEventType.END,
            instanceId,
            soundId: instance.soundId,
            time: this.getCurrentTime()
          });
        }
      };
      
      // Dispatch resume event
      this.dispatchEvent({
        type: AudioEventType.RESUME,
        instanceId,
        soundId: instance.soundId,
        time: this.context.currentTime,
        data: { resumeTime: instance.pauseTime }
      });
      
      return true;
    } catch (error) {
      console.error(`Failed to resume sound ${instanceId}:`, error);
      return false;
    }
  }
  
  /**
   * Stop sound playback
   */
  public stopSound(instanceId: string): boolean {
    if (!this.enabled) return false;
    
    const instance = this.activeSounds.get(instanceId);
    if (!instance) {
      return false;
    }
    
    try {
      if (instance.state === 'playing') {
        instance.source.stop();
      }
      
      // Clean up
      this.activeSounds.delete(instanceId);
      
      // Dispatch stop event
      this.dispatchEvent({
        type: AudioEventType.STOP,
        instanceId,
        soundId: instance.soundId,
        time: this.getCurrentTime()
      });
      
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
   * Play a sound with sync points
   */
  public playSoundWithSync(
    id: string, 
    options: Partial<SoundConfig> = {},
    syncPoints: SyncPoint[] = []
  ): string | null {
    const instanceId = this.playSound(id, options);
    
    if (instanceId) {
      // Add sync points to the instance
      const instance = this.activeSounds.get(instanceId);
      if (instance) {
        instance.syncPoints = syncPoints.map(sp => ({ ...sp, triggered: false }));
      }
    }
    
    return instanceId;
  }
  
  /**
   * Add a sync point to an active sound
   */
  public addSyncPoint(instanceId: string, syncPoint: SyncPoint): boolean {
    const instance = this.activeSounds.get(instanceId);
    if (!instance) {
      return false;
    }
    
    // Initialize syncPoints array if it doesn't exist
    if (!instance.syncPoints) {
      instance.syncPoints = [];
    }
    
    // Add the sync point
    instance.syncPoints.push({ ...syncPoint, triggered: false });
    return true;
  }
  
  /**
   * Add an event listener
   */
  public addEventListener(type: AudioEventType, listener: AudioEventListener): void {
    if (!this.eventListeners.has(type)) {
      this.eventListeners.set(type, new Set());
    }
    
    this.eventListeners.get(type)?.add(listener);
  }
  
  /**
   * Remove an event listener
   */
  public removeEventListener(type: AudioEventType, listener: AudioEventListener): void {
    const listeners = this.eventListeners.get(type);
    if (listeners) {
      listeners.delete(listener);
    }
  }
  
  /**
   * Dispatch an event
   */
  private dispatchEvent(event: AudioEvent): void {
    const listeners = this.eventListeners.get(event.type);
    if (listeners) {
      for (const listener of listeners) {
        listener(event);
      }
    }
  }
  
  /**
   * Start the sync point checker
   */
  private startSyncChecker(): void {
    if (this.syncChecker !== null) {
      return;
    }
    
    const checkSyncPoints = () => {
      if (!this.context) return;
      
      const currentTime = this.getCurrentTime();
      
      // Check all active sounds for sync points
      for (const [instanceId, instance] of this.activeSounds.entries()) {
        if (!instance.syncPoints) continue;
        
        // Calculate playback position
        const elapsedTime = currentTime - instance.startTime;
        
        // Check each sync point
        for (const syncPoint of instance.syncPoints) {
          if (!syncPoint.triggered && elapsedTime >= syncPoint.time) {
            // Mark as triggered
            syncPoint.triggered = true;
            
            // Dispatch sync event
            this.dispatchEvent({
              type: AudioEventType.SYNC,
              instanceId,
              soundId: instance.soundId,
              time: currentTime,
              data: {
                syncPoint,
                elapsedTime
              }
            });
          }
        }
      }
      
      // Schedule next check
      this.scheduleSyncCheck(checkSyncPoints);
    };
    
    // Start checking
    this.scheduleSyncCheck(checkSyncPoints);
  }
  
  /**
   * Schedule the next sync check in a way that works in both browser and Node environments
   */
  private scheduleSyncCheck(callback: () => void): void {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined' && window.requestAnimationFrame) {
      this.syncChecker = window.requestAnimationFrame(callback);
    } else {
      // Fallback for Node.js or environments without requestAnimationFrame
      this.syncChecker = setTimeout(callback, 16) as unknown as number; // ~60fps
    }
  }
  
  /**
   * Stop the sync point checker
   */
  private stopSyncChecker(): void {
    if (this.syncChecker !== null) {
      if (typeof window !== 'undefined' && window.cancelAnimationFrame) {
        window.cancelAnimationFrame(this.syncChecker);
      } else {
        // Fallback for Node.js
        clearTimeout(this.syncChecker as unknown as NodeJS.Timeout);
      }
      this.syncChecker = null;
    }
  }

  /**
   * Dispose of the audio engine
   */
  public dispose(): void {
    // Stop sync checker
    this.stopSyncChecker();
    
    // Clear all event listeners
    this.eventListeners.clear();
    
    // Dispose of audio resources
    for (const [instanceId] of this.activeSounds) {
      this.stopSound(instanceId);
    }
    
    // Close the audio context
    if (this.context) {
      this.context.close();
      this.context = null;
    }
    
    // Clear maps
    this.soundBuffers.clear();
    this.activeSounds.clear();
    this.localAudio.clear();
    
    // Null out references
    this.fileLoader = null;
    this.masterGainNode = null;
  }
}

export { FileLoader, AudioSource };
export type { AudioFileInfo };
export { Transcriber, TranscriptionElement };
export type { TranscriptionResult, TranscriptionOptions };
export default AudioEngine;
