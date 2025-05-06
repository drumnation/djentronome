/**
 * AudioEngine Wrapper
 * 
 * This file provides an abstraction layer for working with the AudioEngine
 * from the core-audio package. This allows the UI components to work with
 * the audio engine without directly depending on the implementation details.
 */

import type { AudioTrackInfo } from './AudioPlayer.types';

// Define the minimally required interface for AudioEngine
export interface AudioEngineInterface {
  initialize: () => Promise<void>;
  loadFromFile: (id: string, file: File) => Promise<boolean>;
  playSound: (id: string, options?: any) => string | null;
  pauseSound: (instanceId: string) => boolean;
  resumeSound: (instanceId: string) => boolean;
  stopSound: (instanceId: string) => boolean;
  setMasterVolume: (volume: number) => void;
  getMasterVolume: () => number;
  getAudioInfo: (id: string) => any | null;
  getCurrentTime: () => number;
  addEventListener: (type: string, listener: (event: any) => void) => void;
  removeEventListener: (type: string, listener: (event: any) => void) => void;
  dispose: () => void;
}

/**
 * Audio file formats we support
 */
export enum AudioFormat {
  MP3 = 'mp3',
  WAV = 'wav',
  OGG = 'ogg'
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
 * Format seconds to MM:SS format
 */
export const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || !isFinite(seconds)) {
    return '00:00';
  }
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Convert audio file info from AudioEngine to AudioTrackInfo
 */
export const convertToTrackInfo = (id: string, info: any): AudioTrackInfo => {
  return {
    id,
    name: info.name || 'Unknown Track',
    type: info.format || info.type || 'Unknown',
    duration: info.duration || 0,
    size: info.size || 0
  };
};

/**
 * Creates a basic HTML5 Audio-based implementation when the full AudioEngine
 * is not available (e.g., during development/testing without the core-audio package)
 */
export const createBasicAudioEngine = (): AudioEngineInterface => {
  const audioElements: Map<string, HTMLAudioElement> = new Map();
  const audioInstances: Map<string, string> = new Map(); // instanceId -> soundId
  const audioInfos: Map<string, any> = new Map();
  const eventListeners: Map<string, Set<(event: any) => void>> = new Map();
  let volume = 1.0;
  
  const dispatchEvent = (type: string, data: any) => {
    const listeners = eventListeners.get(type);
    if (listeners) {
      listeners.forEach(listener => {
        listener({
          type,
          ...data,
          time: Date.now() / 1000
        });
      });
    }
  };
  
  return {
    async initialize(): Promise<void> {
      // No initialization needed for HTML5 Audio
      return;
    },
    
    async loadFromFile(id: string, file: File): Promise<boolean> {
      try {
        // Create URL from file
        const url = URL.createObjectURL(file);
        
        // Create audio element
        const audio = new Audio(url);
        audio.volume = volume;
        
        // Wait for metadata to load
        await new Promise<void>((resolve, reject) => {
          audio.addEventListener('loadedmetadata', () => resolve());
          audio.addEventListener('error', () => reject(new Error('Failed to load audio')));
        });
        
        // Store audio element and info
        audioElements.set(id, audio);
        
        // Store audio info
        const info = {
          name: file.name,
          format: file.type.split('/')[1] || 'mp3',
          type: file.type,
          size: file.size,
          duration: audio.duration
        };
        audioInfos.set(id, info);
        
        // Dispatch load event
        dispatchEvent(AudioEventType.LOAD, { soundId: id });
        
        return true;
      } catch (error) {
        dispatchEvent(AudioEventType.ERROR, { 
          soundId: id, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
        return false;
      }
    },
    
    playSound(id: string, options?: any): string | null {
      const audio = audioElements.get(id);
      if (!audio) return null;
      
      // Set options
      if (options) {
        if (options.loop !== undefined) audio.loop = options.loop;
        if (options.volume !== undefined) audio.volume = options.volume * volume;
        if (options.playbackRate !== undefined) audio.playbackRate = options.playbackRate;
      }
      
      // Reset audio to beginning if it ended
      if (audio.ended) {
        audio.currentTime = 0;
      }
      
      // Generate an instance ID
      const instanceId = `${id}-${Date.now()}`;
      audioInstances.set(instanceId, id);
      
      // Play the audio
      audio.play().then(() => {
        dispatchEvent(AudioEventType.PLAY, { soundId: id, instanceId });
        
        // Add ended event listener
        audio.addEventListener('ended', () => {
          if (!audio.loop) {
            dispatchEvent(AudioEventType.END, { soundId: id, instanceId });
            audioInstances.delete(instanceId);
          }
        });
      }).catch(error => {
        dispatchEvent(AudioEventType.ERROR, { 
          soundId: id, 
          instanceId,
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
        audioInstances.delete(instanceId);
      });
      
      return instanceId;
    },
    
    pauseSound(instanceId: string): boolean {
      const soundId = audioInstances.get(instanceId);
      if (!soundId) return false;
      
      const audio = audioElements.get(soundId);
      if (!audio) return false;
      
      audio.pause();
      dispatchEvent(AudioEventType.PAUSE, { soundId, instanceId });
      return true;
    },
    
    resumeSound(instanceId: string): boolean {
      const soundId = audioInstances.get(instanceId);
      if (!soundId) return false;
      
      const audio = audioElements.get(soundId);
      if (!audio) return false;
      
      audio.play().then(() => {
        dispatchEvent(AudioEventType.RESUME, { soundId, instanceId });
      }).catch(error => {
        dispatchEvent(AudioEventType.ERROR, { 
          soundId, 
          instanceId,
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      });
      
      return true;
    },
    
    stopSound(instanceId: string): boolean {
      const soundId = audioInstances.get(instanceId);
      if (!soundId) return false;
      
      const audio = audioElements.get(soundId);
      if (!audio) return false;
      
      audio.pause();
      audio.currentTime = 0;
      dispatchEvent(AudioEventType.STOP, { soundId, instanceId });
      audioInstances.delete(instanceId);
      return true;
    },
    
    setMasterVolume(newVolume: number): void {
      volume = Math.max(0, Math.min(1, newVolume));
      
      // Update all playing audio elements
      audioElements.forEach(audio => {
        audio.volume = volume;
      });
    },
    
    getMasterVolume(): number {
      return volume;
    },
    
    getAudioInfo(id: string): any | null {
      return audioInfos.get(id) || null;
    },
    
    getCurrentTime(): number {
      return Date.now() / 1000;
    },
    
    addEventListener(type: string, listener: (event: any) => void): void {
      if (!eventListeners.has(type)) {
        eventListeners.set(type, new Set());
      }
      eventListeners.get(type)?.add(listener);
    },
    
    removeEventListener(type: string, listener: (event: any) => void): void {
      if (eventListeners.has(type)) {
        eventListeners.get(type)?.delete(listener);
      }
    },
    
    dispose(): void {
      // Stop all audio and revoke object URLs
      audioElements.forEach(audio => {
        audio.pause();
        if (audio.src.startsWith('blob:')) {
          URL.revokeObjectURL(audio.src);
        }
      });
      
      audioElements.clear();
      audioInstances.clear();
      audioInfos.clear();
      eventListeners.clear();
    }
  };
}; 