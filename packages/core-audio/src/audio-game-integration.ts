/**
 * Audio-Game Integration Module
 * 
 * Connects the game loop with audio system for synchronized playback and timing.
 */

import { GameLoop } from '../../game-loop/src';
import { AudioEngine } from './index';
import { GameAudioSync, BPMSyncConfig, SyncEventType, RhythmEvent } from './game-sync';
import { BufferManager } from './buffer-manager';
import { FileLoader } from './file-loader';

/**
 * Configuration for the audio-game integration
 */
export interface AudioGameIntegrationConfig {
  /**
   * Whether to automatically start audio on loop start
   */
  autoStartAudio?: boolean;
  
  /**
   * Whether to automatically stop audio on loop stop
   */
  autoStopAudio?: boolean;
  
  /**
   * BPM configuration for synchronization
   */
  bpmSync?: BPMSyncConfig;
  
  /**
   * ID of the audio to play (if autoStartAudio is true)
   */
  audioId?: string;
  
  /**
   * Audio playback options
   */
  audioOptions?: any;
  
  /**
   * Default BPM (beats per minute)
   */
  defaultBpm?: number;
  
  /**
   * Number of beats per bar (time signature numerator)
   */
  beatsPerBar?: number;
  
  /**
   * Beat unit (time signature denominator)
   */
  beatUnit?: number;
  
  /**
   * Initial audio node gain
   */
  initialGain?: number;
  
  /**
   * Maximum memory for audio buffers in MB
   */
  maxMemoryMB?: number;
}

/**
 * Integrates the game loop with audio engine for synchronized playback
 */
export class AudioGameIntegration {
  private gameLoop: GameLoop;
  private audioEngine: AudioEngine;
  private gameAudioSync: GameAudioSync;
  private config: AudioGameIntegrationConfig;
  private isRunning: boolean = false;
  private isInitialized: boolean = false;
  private activeAudioInstanceId: string | null = null;
  private bufferManager: BufferManager;
  private fileLoader: FileLoader;
  
  /**
   * Create a new audio-game integration
   */
  constructor(
    gameLoop: GameLoop,
    config: AudioGameIntegrationConfig = {}
  ) {
    this.gameLoop = gameLoop;
    this.config = {
      autoStartAudio: config.autoStartAudio ?? false,
      autoStopAudio: config.autoStopAudio ?? false,
      bpmSync: config.bpmSync ?? { bpm: 120 },
      audioId: config.audioId,
      audioOptions: config.audioOptions ?? {},
      defaultBpm: config.defaultBpm,
      beatsPerBar: config.beatsPerBar,
      beatUnit: config.beatUnit,
      initialGain: config.initialGain,
      maxMemoryMB: config.maxMemoryMB
    };
    
    // Initialize audio engine
    this.audioEngine = new AudioEngine({
      gain: this.config.initialGain || 1.0
    });
    
    // Set up the game audio sync
    this.gameAudioSync = new GameAudioSync(this.audioEngine, {
      bpm: this.config.defaultBpm || 120,
      beatsPerBar: this.config.beatsPerBar || 4,
      beatUnit: this.config.beatUnit || 4
    });
    
    // Set up buffer manager
    this.bufferManager = new BufferManager({
      maxMemoryMB: this.config.maxMemoryMB || 100
    });
    
    // Set up file loader
    this.fileLoader = new FileLoader();
    
    // Patch the game loop to include audio updates
    this.patchGameLoop();
  }
  
  /**
   * Initialize the audio-game integration
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }
    
    try {
      // Any additional initialization steps would go here
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize audio-game integration:', error);
      throw error;
    }
  }
  
  /**
   * Start the integration
   */
  public start(): void {
    if (!this.isInitialized) {
      throw new Error('Audio-game integration must be initialized before starting');
    }
    
    if (this.isRunning) {
      return;
    }
    
    this.isRunning = true;
    this.activeAudioInstanceId = this.gameAudioSync.startSync(
      this.config.audioId,
      this.config.audioOptions
    );
    
    // Start the game loop if it's not already running
    if (!this.gameLoop.isRunning()) {
      this.gameLoop.start();
    }
  }
  
  /**
   * Stop the integration
   */
  public stop(): void {
    if (!this.isRunning) {
      return;
    }
    
    this.isRunning = false;
    
    // Stop audio if configured
    if (this.config.autoStopAudio && this.activeAudioInstanceId) {
      this.gameAudioSync.stopSync();
      this.activeAudioInstanceId = null;
    }
    
    // Note: Game loop is not stopped by the integration
  }
  
  /**
   * Get the game audio sync instance
   */
  public getGameAudioSync(): GameAudioSync {
    return this.gameAudioSync;
  }
  
  /**
   * Play audio with synchronization
   */
  public playAudio(audioId: string, options: any = {}): string | null {
    // Stop any active audio first
    if (this.activeAudioInstanceId) {
      this.gameAudioSync.stopSync();
    }
    
    // Start new audio with sync
    this.activeAudioInstanceId = this.gameAudioSync.startSync(audioId, options);
    return this.activeAudioInstanceId;
  }
  
  /**
   * Stop audio playback
   */
  public stopAudio(): boolean {
    if (!this.activeAudioInstanceId) {
      return false;
    }
    
    const result = this.gameAudioSync.stopSync();
    this.activeAudioInstanceId = null;
    return result;
  }
  
  /**
   * Get current beat position
   */
  public getBeatPosition(): { bar: number; beat: number; phase: number } {
    return this.gameAudioSync.getBeatPosition();
  }
  
  /**
   * Set BPM configuration
   */
  public setBPMConfig(bpmConfig: BPMSyncConfig): void {
    this.config.bpmSync = bpmConfig;
    this.gameAudioSync.setBPMConfig(bpmConfig);
  }
  
  /**
   * Get current BPM configuration
   */
  public getBPMConfig(): BPMSyncConfig {
    return this.gameAudioSync.getBPMConfig();
  }
  
  /**
   * Add rhythm event listener
   */
  public addRhythmEventListener(
    type: SyncEventType,
    callback: (event: RhythmEvent) => void
  ): void {
    this.gameAudioSync.addEventListener(type, callback);
  }
  
  /**
   * Remove rhythm event listener
   */
  public removeRhythmEventListener(
    type: SyncEventType,
    callback: (event: RhythmEvent) => void
  ): void {
    this.gameAudioSync.removeEventListener(type, callback);
  }
  
  /**
   * Patch the game loop to include audio updates
   */
  private patchGameLoop(): void {
    // Store the original update function
    const originalUpdate = this.gameLoop['update'];
    
    // Create a new update function that includes audio sync
    const newUpdate = (deltaTime: number) => {
      // Call the original update function
      if (originalUpdate) {
        originalUpdate(deltaTime);
      }
      
      // Perform audio integration update
      this.update();
    };
    
    // Replace the game loop's update function
    this.gameLoop['update'] = newUpdate;
  }
  
  /**
   * Update method called by the game loop
   */
  private update(): void {
    if (!this.isRunning) {
      return;
    }
    
    // Update the game audio sync
    this.gameAudioSync.update();
  }
  
  /**
   * Check if the audio-game integration is initialized
   */
  isReady(): boolean {
    return this.isInitialized;
  }
  
  /**
   * Get the buffer manager
   */
  getBufferManager(): BufferManager {
    return this.bufferManager;
  }
  
  /**
   * Get the file loader
   */
  getFileLoader(): FileLoader {
    return this.fileLoader;
  }
  
  /**
   * Clean up resources
   */
  dispose(): void {
    this.stop();
    this.bufferManager.dispose();
  }
} 