/**
 * Game-Audio Synchronization Module
 * 
 * Provides an interface between the game loop and audio system for precise timing
 * and synchronization of audio events with gameplay.
 */

import { AudioEngine, AudioEventType, AudioEvent, SyncPoint } from './index';

/**
 * Synchronization event type
 */
export enum SyncEventType {
  BEAT = 'beat',
  BAR = 'bar',
  QUARTER = 'quarter',
  EIGHTH = 'eighth',
  SIXTEENTH = 'sixteenth',
  CUSTOM = 'custom'
}

/**
 * BPM sync configuration
 */
export interface BPMSyncConfig {
  /**
   * Tempo in beats per minute
   */
  bpm: number;
  
  /**
   * Time signature numerator (beats per bar)
   */
  beatsPerBar?: number;
  
  /**
   * Time signature denominator
   */
  beatUnit?: number;
  
  /**
   * Offset in seconds (for alignment adjustment)
   */
  offsetSeconds?: number;
}

/**
 * Rhythm event
 */
export interface RhythmEvent {
  /**
   * Type of rhythm event
   */
  type: SyncEventType;
  
  /**
   * Time in seconds when this event occurs
   */
  time: number;
  
  /**
   * Bar number (if applicable)
   */
  bar?: number;
  
  /**
   * Beat number within bar (if applicable)
   */
  beat?: number;
  
  /**
   * Sub-beat division (if applicable)
   */
  division?: number;
  
  /**
   * Additional event data
   */
  data?: any;
}

/**
 * Callback for rhythm events
 */
export type RhythmEventCallback = (event: RhythmEvent) => void;

/**
 * Bar marker for synchronization
 */
export interface BarMarker {
  /**
   * Bar number
   */
  bar: number;
  
  /**
   * Time in seconds when this bar starts
   */
  time: number;
  
  /**
   * Duration of the bar in seconds
   */
  duration: number;
}

/**
 * Provides synchronization between game loop and audio engine
 */
export class GameAudioSync {
  private audioEngine: AudioEngine;
  private bpmConfig: BPMSyncConfig;
  private rhythmEventListeners: Map<SyncEventType, Set<RhythmEventCallback>> = new Map();
  private activeAudioInstanceId: string | null = null;
  private syncStartTime: number = 0;
  
  /**
   * Create a new game audio sync
   */
  constructor(audioEngine: AudioEngine, bpmConfig: BPMSyncConfig) {
    this.audioEngine = audioEngine;
    this.bpmConfig = {
      ...bpmConfig,
      beatsPerBar: bpmConfig.beatsPerBar || 4,
      beatUnit: bpmConfig.beatUnit || 4,
      offsetSeconds: bpmConfig.offsetSeconds || 0
    };
    
    // Listen for audio events
    this.audioEngine.addEventListener(AudioEventType.SYNC, this.handleAudioSync.bind(this));
    this.audioEngine.addEventListener(AudioEventType.PLAY, this.handleAudioPlay.bind(this));
    this.audioEngine.addEventListener(AudioEventType.STOP, this.handleAudioStop.bind(this));
  }
  
  /**
   * Set BPM configuration
   */
  public setBPMConfig(bpmConfig: BPMSyncConfig): void {
    this.bpmConfig = {
      ...bpmConfig,
      beatsPerBar: bpmConfig.beatsPerBar || 4,
      beatUnit: bpmConfig.beatUnit || 4,
      offsetSeconds: bpmConfig.offsetSeconds || 0
    };
    
    // If we have an active instance, update its sync points
    if (this.activeAudioInstanceId) {
      this.updateSyncPoints(this.activeAudioInstanceId);
    }
  }
  
  /**
   * Get current BPM configuration
   */
  public getBPMConfig(): BPMSyncConfig {
    return { ...this.bpmConfig };
  }
  
  /**
   * Start synchronized playback
   */
  public startSync(soundId: string, options: any = {}): string | null {
    // Generate sync points for this audio
    const syncPoints = this.generateSyncPoints(this.audioEngine.getAudioInfo(soundId)?.duration || 0);
    
    // Play sound with sync points
    const instanceId = this.audioEngine.playSoundWithSync(soundId, options, syncPoints);
    
    if (instanceId) {
      this.activeAudioInstanceId = instanceId;
      this.syncStartTime = this.audioEngine.getCurrentTime();
    }
    
    return instanceId;
  }
  
  /**
   * Stop synchronized playback
   */
  public stopSync(): boolean {
    if (!this.activeAudioInstanceId) {
      return false;
    }
    
    const result = this.audioEngine.stopSound(this.activeAudioInstanceId);
    this.activeAudioInstanceId = null;
    return result;
  }
  
  /**
   * Get the current beat position
   */
  public getBeatPosition(): { bar: number; beat: number; phase: number } {
    if (!this.activeAudioInstanceId) {
      return { bar: 1, beat: 1, phase: 0 };
    }
    
    const currentTime = this.audioEngine.getCurrentTime() - this.syncStartTime + (this.bpmConfig?.offsetSeconds ?? 0);
    const beatsPerSecond = this.bpmConfig.bpm / 60;
    const totalBeats = currentTime * beatsPerSecond;
    
    const beatsPerBar = this.bpmConfig.beatsPerBar || 4;
    const bar = Math.floor(totalBeats / beatsPerBar) + 1;
    const beatInBar = (totalBeats % beatsPerBar) + 1;
    const beat = Math.floor(beatInBar);
    const phase = beatInBar - beat;
    
    return { bar, beat, phase };
  }
  
  /**
   * Get the precise time in seconds for a given beat position
   */
  public getTimeForBeat(bar: number, beat: number): number {
    const beatsPerBar = this.bpmConfig.beatsPerBar || 4;
    const totalBeats = (bar - 1) * beatsPerBar + (beat - 1);
    const secondsPerBeat = 60 / this.bpmConfig.bpm;
    
    return totalBeats * secondsPerBeat - (this.bpmConfig?.offsetSeconds ?? 0);
  }
  
  /**
   * Get the next beat time from current position
   */
  public getNextBeatTime(): number {
    const position = this.getBeatPosition();
    return this.getTimeForBeat(position.bar, Math.ceil(position.beat + 0.001));
  }
  
  /**
   * Get tempo in milliseconds per beat
   */
  public getMillisecondsPerBeat(): number {
    return 60000 / this.bpmConfig.bpm;
  }
  
  /**
   * Add rhythm event listener
   */
  public addEventListener(type: SyncEventType, callback: RhythmEventCallback): void {
    if (!this.rhythmEventListeners.has(type)) {
      this.rhythmEventListeners.set(type, new Set());
    }
    
    const listeners = this.rhythmEventListeners.get(type);
    if (listeners) {
      listeners.add(callback);
    }
  }
  
  /**
   * Remove rhythm event listener
   */
  public removeEventListener(type: SyncEventType, callback: RhythmEventCallback): void {
    if (!this.rhythmEventListeners.has(type)) {
      return;
    }
    
    const listeners = this.rhythmEventListeners.get(type);
    if (listeners) {
      listeners.delete(callback);
    }
  }
  
  /**
   * Handle audio sync events
   */
  private handleAudioSync(event: AudioEvent): void {
    if (!event.data?.syncPoint) {
      return;
    }
    
    const syncPoint = event.data.syncPoint as SyncPoint & { data?: any };
    
    if (syncPoint.data?.rhythmEvent) {
      const rhythmEvent = syncPoint.data.rhythmEvent as RhythmEvent;
      this.dispatchRhythmEvent(rhythmEvent);
    }
  }
  
  /**
   * Handle audio play events
   */
  private handleAudioPlay(event: AudioEvent): void {
    if (event.instanceId === this.activeAudioInstanceId) {
      this.syncStartTime = event.time;
    }
  }
  
  /**
   * Handle audio stop events
   */
  private handleAudioStop(event: AudioEvent): void {
    if (event.instanceId === this.activeAudioInstanceId) {
      this.activeAudioInstanceId = null;
    }
  }
  
  /**
   * Dispatch rhythm event to listeners
   */
  private dispatchRhythmEvent(event: RhythmEvent): void {
    // Dispatch to specific event type listeners
    const listeners = this.rhythmEventListeners.get(event.type);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(event);
        } catch (e) {
          console.error('Error in rhythm event listener:', e);
        }
      });
    }
    
    // Dispatch to CUSTOM listeners for all events
    const customListeners = this.rhythmEventListeners.get(SyncEventType.CUSTOM);
    if (customListeners) {
      customListeners.forEach(listener => {
        try {
          listener(event);
        } catch (e) {
          console.error('Error in custom rhythm event listener:', e);
        }
      });
    }
  }
  
  /**
   * Generate sync points based on BPM settings
   */
  private generateSyncPoints(durationSeconds: number): SyncPoint[] {
    const syncPoints: SyncPoint[] = [];
    const beatsPerSecond = this.bpmConfig.bpm / 60;
    const secondsPerBeat = 1 / beatsPerSecond;
    const beatsPerBar = this.bpmConfig.beatsPerBar || 4;
    const totalBeats = Math.ceil(durationSeconds * beatsPerSecond);
    
    // Generate beat and bar sync points
    for (let i = 0; i < totalBeats; i++) {
      const time = i * secondsPerBeat + (this.bpmConfig?.offsetSeconds ?? 0);
      if (time < 0) continue;
      if (time > durationSeconds) break;
      
      const bar = Math.floor(i / beatsPerBar) + 1;
      const beat = (i % beatsPerBar) + 1;
      
      // Create a sync point for each beat
      syncPoints.push({
        id: `beat-${bar}-${beat}`,
        time,
        triggered: false,
        data: {
          rhythmEvent: {
            type: SyncEventType.BEAT,
            time,
            bar,
            beat,
            division: 1
          }
        }
      });
      
      // Add a bar marker for the first beat of each bar
      if (beat === 1) {
        syncPoints.push({
          id: `bar-${bar}`,
          time,
          triggered: false,
          data: {
            rhythmEvent: {
              type: SyncEventType.BAR,
              time,
              bar,
              beat: 1
            }
          }
        });
      }
      
      // Add eighth notes (two per beat)
      for (let eighth = 1; eighth <= 1; eighth++) {
        const eighthTime = time + (eighth * secondsPerBeat / 2);
        if (eighthTime > durationSeconds) break;
        
        syncPoints.push({
          id: `eighth-${bar}-${beat}-${eighth}`,
          time: eighthTime,
          triggered: false,
          data: {
            rhythmEvent: {
              type: SyncEventType.EIGHTH,
              time: eighthTime,
              bar,
              beat,
              division: eighth + 1
            }
          }
        });
      }
      
      // Add sixteenth notes (four per beat)
      for (let sixteenth = 1; sixteenth <= 3; sixteenth++) {
        const sixteenthTime = time + (sixteenth * secondsPerBeat / 4);
        if (sixteenthTime > durationSeconds) break;
        
        syncPoints.push({
          id: `sixteenth-${bar}-${beat}-${sixteenth}`,
          time: sixteenthTime,
          triggered: false,
          data: {
            rhythmEvent: {
              type: SyncEventType.SIXTEENTH,
              time: sixteenthTime,
              bar,
              beat,
              division: sixteenth + 1
            }
          }
        });
      }
    }
    
    return syncPoints;
  }
  
  /**
   * Update sync points
   */
  private updateSyncPoints(_: string): void {
    // Only process if we have an active audio instance
    if (!this.activeAudioInstanceId) {
      return;
    }
    
    // Get current time from audio engine
    const currentTime = this.audioEngine.getCurrentTime();
    
    // Skip if we haven't moved forward in time
    if (currentTime <= this.syncStartTime) {
      return;
    }
    
    // Calculate time relative to the sync start
    const relativeTime = currentTime - this.syncStartTime + (this.bpmConfig.offsetSeconds || 0);
    
    // Update the beat position based on the current time
    this.updateBeatPosition(relativeTime);
    
    // Check and trigger time signature events
    this.checkTimeSignatureEvents(relativeTime);
  }

  /**
   * Get the current time position, accounting for any offsets
   */
  getCurrentTime(): number {
    if (!this.audioEngine) {
      return 0;
    }
    
    const currentTime = this.audioEngine.getCurrentTime() - this.syncStartTime + (this.bpmConfig?.offsetSeconds ?? 0);
    return currentTime;
  }

  /**
   * Convert beats to seconds
   */
  beatToSeconds(totalBeats: number): number {
    if (!this.bpmConfig || this.bpmConfig.bpm <= 0) {
      return 0;
    }
    
    // Calculate seconds per beat
    const secondsPerBeat = 60 / this.bpmConfig.bpm;
    
    // Apply the offset to convert from beat position to audio time
    return totalBeats * secondsPerBeat - (this.bpmConfig?.offsetSeconds ?? 0);
  }

  /**
   * Generate bar markers for a specified number of bars
   */
  generateBarMarkers(
    numberOfBars: number = 4,
    timeSignature: number = 4,
    startBar: number = 0
  ): BarMarker[] {
    if (!this.bpmConfig || this.bpmConfig.bpm <= 0) {
      return [];
    }
    
    const markers: BarMarker[] = [];
    const secondsPerBeat = 60 / this.bpmConfig.bpm;
    const secondsPerBar = secondsPerBeat * timeSignature;
    
    for (let i = startBar; i < startBar + numberOfBars; i++) {
      const time = i * secondsPerBeat + (this.bpmConfig?.offsetSeconds ?? 0);
      
      markers.push({
        bar: i,
        time,
        duration: secondsPerBar
      });
    }
    
    return markers;
  }

  /**
   * Update the beat position based on the current time
   * @param relativeTime Current time relative to sync start in seconds
   */
  private updateBeatPosition(relativeTime: number): void {
    // Update beat position here using the current time relative to sync start
    const beatsPerSecond = this.bpmConfig.bpm / 60;
    const totalBeats = relativeTime * beatsPerSecond;
    
    const beatsPerBar = this.bpmConfig.beatsPerBar || 4;
    const bar = Math.floor(totalBeats / beatsPerBar) + 1;
    const beatInBar = (totalBeats % beatsPerBar) + 1;
    const beat = Math.floor(beatInBar);
    const phase = beatInBar - beat;
    
    // Log the current position for debugging
    console.debug(`Beat position: ${bar}:${beat} (phase: ${phase.toFixed(2)})`);
  }
  
  /**
   * Check and trigger time signature events
   * @param relativeTime Current time relative to sync start in seconds
   */
  private checkTimeSignatureEvents(relativeTime: number): void {
    // Calculate the current beat position
    const beatsPerSecond = this.bpmConfig.bpm / 60;
    const totalBeats = relativeTime * beatsPerSecond;
    
    // Check if we're on a beat boundary
    const justCrossedBeat = Math.floor(totalBeats) !== Math.floor(totalBeats - 0.01);
    if (justCrossedBeat) {
      const beatsPerBar = this.bpmConfig.beatsPerBar || 4;
      const bar = Math.floor(totalBeats / beatsPerBar) + 1;
      const beat = (Math.floor(totalBeats) % beatsPerBar) + 1;
      
      // Create and dispatch a beat event
      const beatEvent: RhythmEvent = {
        type: SyncEventType.BEAT,
        time: relativeTime,
        bar,
        beat
      };
      this.dispatchRhythmEvent(beatEvent);
      
      // If this is the first beat of a bar, also dispatch a bar event
      if (beat === 1) {
        const barEvent: RhythmEvent = {
          type: SyncEventType.BAR,
          time: relativeTime,
          bar
        };
        this.dispatchRhythmEvent(barEvent);
      }
    }
  }
} 