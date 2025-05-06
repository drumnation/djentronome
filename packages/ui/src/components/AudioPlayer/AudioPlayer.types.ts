/**
 * Type definitions for the AudioPlayer component
 */
import { FileSelectorProps } from '../FileSelector/FileSelector.types';

/**
 * Status of the audio player
 */
export enum AudioPlayerStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  READY = 'ready',
  PLAYING = 'playing',
  PAUSED = 'paused',
  ERROR = 'error'
}

/**
 * Playback controls configuration
 */
export interface PlaybackControls {
  /**
   * Show play/pause button
   */
  showPlayPause?: boolean;
  
  /**
   * Show stop button
   */
  showStop?: boolean;
  
  /**
   * Show volume control
   */
  showVolume?: boolean;
  
  /**
   * Show progress bar
   */
  showProgress?: boolean;
  
  /**
   * Show playback speed control
   */
  showPlaybackRate?: boolean;
}

/**
 * Audio player options
 */
export interface AudioPlayerOptions {
  /**
   * Initial volume (0-1)
   */
  initialVolume?: number;
  
  /**
   * Auto play after loading
   */
  autoPlay?: boolean;
  
  /**
   * Loop playback
   */
  loop?: boolean;
  
  /**
   * Initial playback rate (1 = normal)
   */
  initialPlaybackRate?: number;
}

/**
 * Audio track information
 */
export interface AudioTrackInfo {
  /**
   * Track ID
   */
  id: string;
  
  /**
   * Track name
   */
  name: string;
  
  /**
   * File type
   */
  type: string;
  
  /**
   * Track duration in seconds
   */
  duration?: number;
  
  /**
   * File size in bytes
   */
  size: number;
}

/**
 * Props for AudioPlayer component
 */
export interface AudioPlayerProps {
  /**
   * Audio engine instance to use
   * If not provided, a new instance will be created
   */
  audioEngine?: any; // Will be properly typed when integrated
  
  /**
   * Callback when audio is loaded
   */
  onAudioLoaded?: (trackInfo: AudioTrackInfo) => void;
  
  /**
   * Callback when audio playback starts
   */
  onPlayStart?: (trackInfo: AudioTrackInfo) => void;
  
  /**
   * Callback when audio playback pauses
   */
  onPlayPause?: (currentTime: number) => void;
  
  /**
   * Callback when audio playback stops
   */
  onPlayStop?: () => void;
  
  /**
   * Callback when audio playback ends
   */
  onPlayEnd?: () => void;
  
  /**
   * Callback when an error occurs
   */
  onError?: (error: Error) => void;
  
  /**
   * Callback on playback time update
   */
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  
  /**
   * Audio player options
   */
  options?: AudioPlayerOptions;
  
  /**
   * Playback controls configuration
   */
  controls?: PlaybackControls;
  
  /**
   * Props to pass to the FileSelector component
   */
  fileSelectorProps?: Omit<FileSelectorProps, 'onFileSelect' | 'onSuccess' | 'onError'>;
  
  /**
   * Custom CSS class for styling
   */
  className?: string;
} 