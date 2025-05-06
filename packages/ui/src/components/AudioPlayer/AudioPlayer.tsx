/**
 * AudioPlayer Component
 * 
 * A complete audio player component that allows selecting audio files
 * and controlling playback with a set of user-friendly controls.
 */
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { FileSelector } from '../FileSelector';
import {
  AudioPlayerContainer,
  PlayerSection,
  StatusIndicator,
  StatusDot,
  ControlsContainer,
  Button,
  SmallButton,
  VolumeControl,
  Slider,
  ProgressContainer,
  TimeDisplay,
  TrackInfo,
  TrackName,
  TrackDetails,
  ErrorMessage,
  PlaybackRateControl,
  PlaybackRateValue,
  PlaybackRateButton
} from './AudioPlayer.styles';
import {
  AudioPlayerProps,
  AudioPlayerStatus,
  AudioTrackInfo
} from './AudioPlayer.types';
import {
  AudioEngineInterface,
  AudioEventType,
  createBasicAudioEngine,
  formatTime,
  convertToTrackInfo
} from './AudioEngineWrapper';
import { defaultTheme } from '../../theme/ThemeProvider';

/**
 * AudioPlayer component for selecting and playing audio files
 */
export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioEngine: externalAudioEngine,
  onAudioLoaded,
  onPlayStart,
  onPlayPause,
  onPlayStop,
  onPlayEnd,
  onError,
  onTimeUpdate,
  options = {},
  controls = {
    showPlayPause: true,
    showStop: true,
    showVolume: true,
    showProgress: true,
    showPlaybackRate: true
  },
  fileSelectorProps,
  className
}) => {
  // State for the audio player
  const [status, setStatus] = useState<AudioPlayerStatus>(AudioPlayerStatus.IDLE);
  const [selectedTrack, setSelectedTrack] = useState<AudioTrackInfo | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(options.initialVolume ?? 1.0);
  const [playbackRate, setPlaybackRate] = useState(options.initialPlaybackRate ?? 1.0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Refs for storing internal state that doesn't need to trigger re-renders
  const audioEngine = useRef<AudioEngineInterface | null>(null);
  const activeInstanceId = useRef<string | null>(null);
  const trackId = useRef<string | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const updateInterval = useRef<NodeJS.Timeout | null>(null);
  
  // Local error handler function
  const handleError = useCallback((error: Error) => {
    setStatus(AudioPlayerStatus.ERROR);
    setErrorMessage(error.message || 'Unknown error occurred');
    if (onError) onError(error);
  }, [onError]);
  
  // Initialize audio engine on component mount
  useEffect(() => {
    const initAudioEngine = async () => {
      try {
        // Use external audio engine if provided, otherwise create a basic one
        if (externalAudioEngine) {
          audioEngine.current = externalAudioEngine;
        } else {
          audioEngine.current = createBasicAudioEngine();
        }
        
        // Initialize the audio engine
        if (audioEngine.current) {
          await audioEngine.current.initialize();
          
          // Set the volume
          audioEngine.current.setMasterVolume(volume);
          
          // Set initial playback rate
          setPlaybackRate(options.initialPlaybackRate || 1.0);
          
          // Add event listeners for audio events
          setupEventListeners();
        }
      } catch (error) {
        setStatus(AudioPlayerStatus.ERROR);
        setErrorMessage(error instanceof Error ? error.message : 'Failed to initialize audio player');
        if (onError) onError(error instanceof Error ? error : new Error('Failed to initialize audio player'));
      }
    };
    
    initAudioEngine();
    
    // Clean up on unmount
    return () => {
      cleanup();
    };
  }, [externalAudioEngine]);
  
  /**
   * Set up event listeners for audio events
   */
  const setupEventListeners = useCallback(() => {
    if (!audioEngine.current) return;
    
    const handleLoad = (event: any) => {
      if (event.soundId !== trackId.current) return;
      
      const info = audioEngine.current?.getAudioInfo(event.soundId);
      if (info) {
        const trackInfo = convertToTrackInfo(event.soundId, info);
        setSelectedTrack(trackInfo);
        setDuration(trackInfo.duration || 0);
        setStatus(AudioPlayerStatus.READY);
        
        if (onAudioLoaded) onAudioLoaded(trackInfo);
        
        // Auto play if enabled
        if (options.autoPlay) {
          playTrack();
        }
      }
    };
    
    const handlePlay = (event: any) => {
      if (event.soundId !== trackId.current) return;
      
      activeInstanceId.current = event.instanceId;
      setStatus(AudioPlayerStatus.PLAYING);
      
      // Start tracking current time
      startTimeTracking();
      
      if (onPlayStart && selectedTrack) onPlayStart(selectedTrack);
    };
    
    const handlePause = (event: any) => {
      if (event.instanceId !== activeInstanceId.current) return;
      
      setStatus(AudioPlayerStatus.PAUSED);
      
      // Stop tracking current time
      stopTimeTracking();
      
      if (onPlayPause) onPlayPause(currentTime);
    };
    
    const handleStop = (event: any) => {
      if (event.instanceId !== activeInstanceId.current) return;
      
      activeInstanceId.current = null;
      setStatus(AudioPlayerStatus.READY);
      setCurrentTime(0);
      
      // Stop tracking current time
      stopTimeTracking();
      
      if (onPlayStop) onPlayStop();
    };
    
    const handleEnd = (event: any) => {
      if (event.instanceId !== activeInstanceId.current) return;
      
      activeInstanceId.current = null;
      setStatus(AudioPlayerStatus.READY);
      setCurrentTime(0);
      
      // Stop tracking current time
      stopTimeTracking();
      
      if (onPlayEnd) onPlayEnd();
    };
    
    const handleError = (event: any) => {
      if (event.soundId !== trackId.current && 
          (!event.instanceId || event.instanceId !== activeInstanceId.current)) return;
      
      if (event.instanceId === activeInstanceId.current) {
        activeInstanceId.current = null;
      }
      
      setStatus(AudioPlayerStatus.ERROR);
      setErrorMessage(event.error || 'Unknown error occurred');
      
      // Stop tracking current time
      stopTimeTracking();
      
      if (onError) onError(new Error(event.error || 'Unknown error occurred'));
    };
    
    // Add event listeners
    audioEngine.current.addEventListener(AudioEventType.LOAD, handleLoad);
    audioEngine.current.addEventListener(AudioEventType.PLAY, handlePlay);
    audioEngine.current.addEventListener(AudioEventType.PAUSE, handlePause);
    audioEngine.current.addEventListener(AudioEventType.STOP, handleStop);
    audioEngine.current.addEventListener(AudioEventType.END, handleEnd);
    audioEngine.current.addEventListener(AudioEventType.ERROR, handleError);
    
    // Return a cleanup function
    return () => {
      if (audioEngine.current) {
        audioEngine.current.removeEventListener(AudioEventType.LOAD, handleLoad);
        audioEngine.current.removeEventListener(AudioEventType.PLAY, handlePlay);
        audioEngine.current.removeEventListener(AudioEventType.PAUSE, handlePause);
        audioEngine.current.removeEventListener(AudioEventType.STOP, handleStop);
        audioEngine.current.removeEventListener(AudioEventType.END, handleEnd);
        audioEngine.current.removeEventListener(AudioEventType.ERROR, handleError);
      }
    };
  }, [options.autoPlay, onAudioLoaded, onPlayStart, onPlayPause, onPlayStop, onPlayEnd, onError]);
  
  /**
   * Start tracking current time during playback
   */
  const startTimeTracking = useCallback(() => {
    // Stop any existing tracking
    stopTimeTracking();
    
    // Start update loop for tracking current time
    const updateTime = () => {
      if (!audioEngine.current || !activeInstanceId.current) return;
      
      // Get current time from audio element
      const audio = document.querySelector('audio');
      if (audio) {
        const newTime = audio.currentTime;
        setCurrentTime(newTime);
        
        if (onTimeUpdate) onTimeUpdate(newTime, duration);
      }
      
      // Schedule next update
      animationFrameId.current = requestAnimationFrame(updateTime);
    };
    
    // Start update loop
    animationFrameId.current = requestAnimationFrame(updateTime);
    
    // Fallback for browsers that don't support requestAnimationFrame
    updateInterval.current = setInterval(() => {
      const audio = document.querySelector('audio');
      if (audio) {
        setCurrentTime(audio.currentTime);
      }
    }, 500);
  }, [duration, onTimeUpdate]);
  
  /**
   * Stop tracking current time during playback
   */
  const stopTimeTracking = useCallback(() => {
    // Cancel animation frame
    if (animationFrameId.current !== null) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    
    // Clear interval
    if (updateInterval.current !== null) {
      clearInterval(updateInterval.current);
      updateInterval.current = null;
    }
  }, []);
  
  /**
   * Clean up resources used by the component
   */
  const cleanup = useCallback(() => {
    // Stop tracking current time
    stopTimeTracking();
    
    // Stop any playing audio
    if (audioEngine.current && activeInstanceId.current) {
      audioEngine.current.stopSound(activeInstanceId.current);
      activeInstanceId.current = null;
    }
    
    // Dispose audio engine if created internally
    if (audioEngine.current && !externalAudioEngine) {
      audioEngine.current.dispose();
      audioEngine.current = null;
    }
  }, [externalAudioEngine, stopTimeTracking]);
  
  /**
   * Handle file selection from the FileSelector component
   */
  const handleFileSelect = useCallback((file: File) => {
    if (!audioEngine.current) return;
    
    // Stop any playing audio
    if (activeInstanceId.current) {
      audioEngine.current.stopSound(activeInstanceId.current);
      activeInstanceId.current = null;
    }
    
    // Reset state
    setStatus(AudioPlayerStatus.LOADING);
    setErrorMessage(null);
    setCurrentTime(0);
    setDuration(0);
    
    // Generate a unique ID for the track
    const id = `track-${Date.now()}`;
    trackId.current = id;
    
    // Load the file
    audioEngine.current.loadFromFile(id, file).catch(error => {
      handleError(error instanceof Error ? error : new Error('Failed to load audio file'));
    });
  }, [onError, handleError]);
  
  /**
   * Handle file selection success
   */
  const handleFileSelectSuccess = useCallback((_: File) => {
    // File loaded, but we'll wait for the LOAD event from the audio engine
    // to update the state with the actual audio information
  }, []);
  
  /**
   * Handle file selection error
   */
  const handleFileSelectError = useCallback((error: Error) => {
    setStatus(AudioPlayerStatus.ERROR);
    setErrorMessage(error.message);
    if (onError) onError(error);
  }, [onError]);
  
  /**
   * Play the current track
   */
  const playTrack = useCallback(() => {
    if (!audioEngine.current || !trackId.current || status === AudioPlayerStatus.PLAYING) return;
    
    // If paused, resume
    if (status === AudioPlayerStatus.PAUSED && activeInstanceId.current) {
      audioEngine.current.resumeSound(activeInstanceId.current);
      return;
    }
    
    // Otherwise start playing from the beginning
    const instanceId = audioEngine.current.playSound(trackId.current, {
      loop: options.loop,
      volume,
      playbackRate
    });
    
    if (instanceId) {
      activeInstanceId.current = instanceId;
    }
  }, [status, volume, playbackRate, options.loop]);
  
  /**
   * Pause the current track
   */
  const pauseTrack = useCallback(() => {
    if (!audioEngine.current || !activeInstanceId.current || status !== AudioPlayerStatus.PLAYING) return;
    
    audioEngine.current.pauseSound(activeInstanceId.current);
  }, [status]);
  
  /**
   * Stop the current track
   */
  const stopTrack = useCallback(() => {
    if (!audioEngine.current || !activeInstanceId.current) return;
    
    audioEngine.current.stopSound(activeInstanceId.current);
  }, []);
  
  /**
   * Toggle play/pause
   */
  const togglePlayPause = useCallback(() => {
    if (status === AudioPlayerStatus.PLAYING) {
      pauseTrack();
    } else {
      playTrack();
    }
  }, [status, pauseTrack, playTrack]);
  
  /**
   * Handle volume change
   */
  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    if (audioEngine.current) {
      audioEngine.current.setMasterVolume(newVolume);
    }
  }, []);
  
  /**
   * Handle progress bar change (seek)
   */
  const handleProgressChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedTrack || !selectedTrack.duration) return;
    
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    
    // Update audio element time
    const audio = document.querySelector('audio');
    if (audio) {
      audio.currentTime = newTime;
      
      if (onTimeUpdate) onTimeUpdate(newTime, duration);
    }
  }, [selectedTrack, duration, onTimeUpdate]);
  
  /**
   * Change playback rate
   */
  const changePlaybackRate = useCallback((rate: number) => {
    setPlaybackRate(rate);
    
    // Update audio element playback rate
    const audio = document.querySelector('audio');
    if (audio) {
      audio.playbackRate = rate;
    }
  }, []);
  
  /**
   * Playback rate options
   */
  const playbackRates = useMemo(() => [0.5, 0.75, 1.0, 1.25, 1.5, 2.0], []);
  
  /**
   * Get status text based on current status
   */
  const getStatusText = useCallback(() => {
    switch (status) {
      case AudioPlayerStatus.IDLE:
        return 'Select a file to begin';
      case AudioPlayerStatus.LOADING:
        return 'Loading audio...';
      case AudioPlayerStatus.READY:
        return 'Ready to play';
      case AudioPlayerStatus.PLAYING:
        return 'Playing';
      case AudioPlayerStatus.PAUSED:
        return 'Paused';
      case AudioPlayerStatus.ERROR:
        return 'Error';
      default:
        return '';
    }
  }, [status]);
  
  return (
    <AudioPlayerContainer className={className} theme={defaultTheme}>
      {/* File Selector Section */}
      <FileSelector
        onFileSelect={handleFileSelect}
        onSuccess={handleFileSelectSuccess}
        onError={handleFileSelectError}
        acceptedFileTypes={fileSelectorProps?.acceptedFileTypes || ['audio/*']}
        maxFileSize={fileSelectorProps?.maxFileSize}
        buttonLabel={fileSelectorProps?.buttonLabel || 'Select Audio File'}
        enableDragAndDrop={fileSelectorProps?.enableDragAndDrop !== false}
        showFileDetails={false}
      />
      
      {/* Player Controls Section */}
      <PlayerSection>
        {/* Status Indicator */}
        <StatusIndicator status={status} theme={defaultTheme}>
          <StatusDot status={status} theme={defaultTheme} />
          {getStatusText()}
        </StatusIndicator>
        
        {/* Track Info */}
        {selectedTrack && (
          <TrackInfo theme={defaultTheme}>
            <TrackName theme={defaultTheme}>{selectedTrack.name}</TrackName>
            <TrackDetails>
              <span>Type: {selectedTrack.type}</span>
              <span>Duration: {formatTime(selectedTrack.duration || 0)}</span>
            </TrackDetails>
          </TrackInfo>
        )}
        
        {/* Playback Controls */}
        {selectedTrack && (
          <>
            {/* Progress Bar */}
            {controls.showProgress && (
              <ProgressContainer>
                <Slider
                  type="range"
                  min={0}
                  max={selectedTrack.duration || 100}
                  value={currentTime}
                  onChange={handleProgressChange}
                  disabled={status === AudioPlayerStatus.LOADING}
                  theme={defaultTheme}
                />
                <TimeDisplay theme={defaultTheme}>
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(selectedTrack.duration || 0)}</span>
                </TimeDisplay>
              </ProgressContainer>
            )}
            
            {/* Control Buttons */}
            <ControlsContainer>
              {/* Play/Pause Button */}
              {controls.showPlayPause && (
                <Button
                  onClick={togglePlayPause}
                  disabled={status === AudioPlayerStatus.LOADING || status === AudioPlayerStatus.ERROR}
                  theme={defaultTheme}
                >
                  {status === AudioPlayerStatus.PLAYING ? '⏸' : '▶'}
                </Button>
              )}
              
              {/* Stop Button */}
              {controls.showStop && (
                <SmallButton
                  onClick={stopTrack}
                  disabled={status !== AudioPlayerStatus.PLAYING && status !== AudioPlayerStatus.PAUSED}
                  theme={defaultTheme}
                >
                  ⏹
                </SmallButton>
              )}
              
              {/* Volume Control */}
              {controls.showVolume && (
                <VolumeControl>
                  <span>🔊</span>
                  <Slider
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={handleVolumeChange}
                    theme={defaultTheme}
                  />
                </VolumeControl>
              )}
              
              {/* Playback Rate Control */}
              {controls.showPlaybackRate && (
                <PlaybackRateControl>
                  <span>Speed:</span>
                  <PlaybackRateValue theme={defaultTheme}>{playbackRate}x</PlaybackRateValue>
                  {playbackRates.map((rate) => (
                    <PlaybackRateButton
                      key={rate}
                      onClick={() => changePlaybackRate(rate)}
                      style={{fontWeight: rate === playbackRate ? 'bold' : 'normal'}}
                      theme={defaultTheme}
                    >
                      {rate}x
                    </PlaybackRateButton>
                  ))}
                </PlaybackRateControl>
              )}
            </ControlsContainer>
          </>
        )}
        
        {/* Error Message */}
        {status === AudioPlayerStatus.ERROR && errorMessage && (
          <ErrorMessage theme={defaultTheme}>{errorMessage}</ErrorMessage>
        )}
      </PlayerSection>
    </AudioPlayerContainer>
  );
}; 