/**
 * Types for the sound package
 * @packageDocumentation
 */

/**
 * Audio source type
 */
export enum AudioSourceType {
  /** Local audio file */
  LOCAL = 'local',
  /** Streaming URL */
  STREAM = 'stream'
}

/**
 * Sound configuration
 */
export interface SoundConfig {
  /** Volume from 0 to 1 */
  volume: number;
  /** Whether sound is looping */
  loop: boolean;
  /** Playback rate (1 = normal speed) */
  playbackRate: number;
}

/**
 * Sound state
 */
export interface SoundState {
  /** Whether sound is playing */
  isPlaying: boolean;
  /** Current time in seconds */
  currentTime: number;
  /** Total duration in seconds */
  duration: number;
} 