import { useState, useRef, useEffect } from 'react';
import { 
  DrumNote, 
  FootDominance, 
  PatternComplexity, 
  AudioContextType 
} from './KickPatternVisualizer.types';
import { 
  createDefaultPattern, 
  generatePattern, 
  assignFeet, 
  organizeNotesByMeasure 
} from './KickPatternVisualizer.logic';
import { KICK_SAMPLES } from './KickPatternVisualizer.constants';

export const useKickPatternVisualizer = (initialPattern?: DrumNote[], initialBpm = 166) => {
  // State
  const [bpm, setBpm] = useState(initialBpm);
  const [dominance, setDominance] = useState<FootDominance>('right');
  const [showComparison, setShowComparison] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedKickSample, setSelectedKickSample] = useState(KICK_SAMPLES[0]?.value || 'acoustic1');
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState<number | null>(null);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [loadingSample, setLoadingSample] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [audioContextState, setAudioContextState] = useState<string>('none');
  const [pattern, setPattern] = useState(initialPattern || createDefaultPattern());
  
  // Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const kickBufferRef = useRef<AudioBuffer | null>(null);
  const schedulerTimerRef = useRef<number | null>(null);
  const notesInQueueRef = useRef<{time: number, id: string, foot: 'left' | 'right'}[]>([]);

  // Calculate foot assignments and organize notes by measure
  const footAssignments = assignFeet(pattern, bpm, dominance);
  const { notesByMeasure, measures } = organizeNotesByMeasure(pattern);
  
  // Initialize audio context on user interaction (required by browsers)
  const initializeAudio = () => {
    setLoadingSample(true);
    setErrorMessage(null);
    
    try {
      // Create audio context if it doesn't exist
      if (!audioContextRef.current) {
        const AudioContextClass = window.AudioContext || 
          (window as unknown as { webkitAudioContext: AudioContextType }).webkitAudioContext;
        audioContextRef.current = new AudioContextClass();
        console.log('AudioContext created successfully');
      }
      
      // Resume audio context if needed (browser autoplay policy)
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume()
          .then(() => {
            setAudioContextState(audioContextRef.current?.state || 'none');
            loadKickSample();
          })
          .catch(error => {
            console.error('Failed to resume AudioContext:', error);
            setErrorMessage('Could not start audio playback. Please try again.');
          });
      } else {
        setAudioContextState(audioContextRef.current.state);
        loadKickSample();
      }
    } catch (error) {
      console.error('Failed to initialize AudioContext:', error);
      setErrorMessage('Could not initialize audio system');
      setLoadingSample(false);
    }
  };
  
  // Update audio context state for display
  useEffect(() => {
    const checkAudioContextState = () => {
      if (audioContextRef.current) {
        setAudioContextState(audioContextRef.current.state);
      }
    };
    
    // Check state immediately and then periodically
    checkAudioContextState();
    const interval = setInterval(checkAudioContextState, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Load the selected kick sample
  const loadKickSample = async () => {
    if (!audioContextRef.current) {
      console.error('Cannot load sample: AudioContext not available');
      setLoadingSample(false);
      setErrorMessage('Audio context not initialized. Please click "Initialize Audio" first.');
      return;
    }
    
    try {
      const selectedSample = KICK_SAMPLES.find(sample => sample.value === selectedKickSample);
      if (!selectedSample) {
        console.error('No sample selected');
        setErrorMessage('No sample selected');
        setLoadingSample(false);
        return;
      }
      
      console.log('Loading sample from path:', selectedSample.path);
      
      const response = await fetch(selectedSample.path);
      if (!response.ok) {
        throw new Error(`Failed to load audio file: ${response.status} ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      console.log('Sample loaded, decoding audio data...', arrayBuffer.byteLength, 'bytes');
      
      kickBufferRef.current = await audioContextRef.current.decodeAudioData(arrayBuffer);
      console.log('Audio data decoded successfully');
      setAudioInitialized(true);
      setLoadingSample(false);
    } catch (error) {
      console.error('Error loading kick sample:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error loading sample');
      setLoadingSample(false);
    }
  };
  
  // Update sample when selection changes
  useEffect(() => {
    if (audioContextRef.current && audioContextRef.current.state === 'running') {
      loadKickSample();
    }
  }, [selectedKickSample]);
  
  // Play a test sound to verify audio is working
  const playTestSound = () => {
    if (!audioContextRef.current || !kickBufferRef.current) {
      setErrorMessage('Audio not ready yet. Please wait or reload the page.');
      return;
    }
    
    try {
      // Resume AudioContext if suspended (browser autoplay policy)
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      
      // Create and play a test sound
      const source = audioContextRef.current.createBufferSource();
      const gainNode = audioContextRef.current.createGain();
      
      source.buffer = kickBufferRef.current;
      gainNode.gain.value = 1.0;
      
      source.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      source.start();
      console.log('Test sound played');
    } catch (error) {
      console.error('Error playing test sound:', error);
      setErrorMessage('Could not play test sound');
    }
  };
  
  // Schedule kicks to play
  const scheduleKicks = () => {
    if (!audioContextRef.current || !isPlaying || !kickBufferRef.current) {
      console.warn('Cannot schedule kicks: AudioContext, buffer not available, or not playing');
      return;
    }
    
    console.log('Scheduling kicks to play at BPM:', bpm);
    
    const { improved } = assignFeet(pattern, bpm, dominance);
    
    // Sort notes chronologically
    const sortedNotes = [...pattern].sort((a, b) => {
      return (a.measure * 4 + a.beat) - (b.measure * 4 + b.beat);
    });
    
    if (sortedNotes.length === 0) {
      console.warn('No notes to play');
      return;
    }
    
    console.log(`Scheduling ${sortedNotes.length} notes`);
    
    // Find the total duration in beats
    const totalBeats = Math.max(...sortedNotes.map(note => note.measure * 4 + note.beat)) + 1;
    console.log('Total beats in pattern:', totalBeats);
    
    // Current time and beat duration
    const now = audioContextRef.current.currentTime;
    const secondsPerBeat = 60 / bpm;
    
    console.log('Current audio time:', now, 'seconds');
    console.log('Seconds per beat:', secondsPerBeat);
    
    // Clear previous notes in queue
    notesInQueueRef.current = [];
    
    // Schedule all notes with absolute times
    sortedNotes.forEach((note, index) => {
      const absoluteBeat = note.measure * 4 + note.beat;
      const foot = improved[note.id];
      
      // Only play notes with valid foot assignments
      if (foot) {
        // Add a small delay to ensure we don't schedule in the past
        const startDelay = 0.2; // 200ms delay before starting playback
        
        // Calculate absolute time to play this note
        const playTime = now + startDelay + (absoluteBeat * secondsPerBeat);
        
        // Create a dedicated buffer source for each note
        const source = audioContextRef.current!.createBufferSource();
        const gainNode = audioContextRef.current!.createGain();
        
        // Set up the source
        source.buffer = kickBufferRef.current;
        
        // Apply slightly different gain based on foot
        const gain = foot === dominance ? 1.0 : 0.9; 
        gainNode.gain.value = gain;
        
        // Connect nodes
        source.connect(gainNode);
        gainNode.connect(audioContextRef.current!.destination);
        
        // Schedule the note to play at the exact time
        source.start(playTime);
        
        console.log(`Note ${index}: measure ${note.measure}, beat ${note.beat} (absolute beat ${absoluteBeat}), foot ${foot}, time ${playTime.toFixed(3)}s`);
        
        // Add to queue for UI updates
        notesInQueueRef.current.push({
          time: playTime,
          id: note.id,
          foot
        });
      }
    });
    
    // Schedule the next iteration (loop playback)
    const loopDuration = totalBeats * secondsPerBeat;
    console.log(`Scheduling next loop in ${loopDuration} seconds`);
    
    // Clear any existing timeout
    if (schedulerTimerRef.current) {
      window.clearTimeout(schedulerTimerRef.current);
    }
    
    // Schedule the next loop
    schedulerTimerRef.current = window.setTimeout(() => {
      if (isPlaying) {
        console.log('Starting next loop iteration');
        scheduleKicks();
      } else {
        console.log('Playback stopped, not scheduling next loop');
      }
    }, loopDuration * 1000);
    
    // Start UI update timer for visual feedback
    requestAnimationFrame(updateCurrentNoteDisplay);
    
    console.log('All notes scheduled successfully');
  };
  
  // Update the visual indicator of current playing note
  const updateCurrentNoteDisplay = () => {
    if (!audioContextRef.current || !isPlaying) {
      setCurrentPlayingIndex(null);
      return;
    }
    
    const currentTime = audioContextRef.current.currentTime;
    let indexToHighlight = null;
    let smallestTimeDiff = Number.MAX_VALUE;
    
    // Find the note closest to current time
    for (let i = 0; i < notesInQueueRef.current.length; i++) {
      const note = notesInQueueRef.current[i];
      if (!note) continue;
      
      const timeDiff = Math.abs(note.time - currentTime);
      
      // If the note is within 0.1 seconds of current time and closer than any previously found note
      if (timeDiff < 0.1 && timeDiff < smallestTimeDiff) {
        smallestTimeDiff = timeDiff;
        indexToHighlight = i;
      }
    }
    
    // Only update state if needed to reduce re-renders
    if (indexToHighlight !== currentPlayingIndex) {
      setCurrentPlayingIndex(indexToHighlight);
    }
    
    // Continue updating if we're still playing
    if (isPlaying) {
      requestAnimationFrame(updateCurrentNoteDisplay);
    }
  };
  
  // Toggle play/stop
  const togglePlayback = () => {
    if (isPlaying) {
      // Stop playback
      console.log('Stopping playback');
      setIsPlaying(false);
      
      // Clear scheduler
      if (schedulerTimerRef.current) {
        window.clearTimeout(schedulerTimerRef.current);
        schedulerTimerRef.current = null;
      }
      
      // Clear any pending notes
      notesInQueueRef.current = [];
      setCurrentPlayingIndex(null);
      
      console.log('Playback stopped');
    } else {
      // Check if audio is available
      if (!audioContextRef.current || !kickBufferRef.current) {
        setErrorMessage('Audio not ready yet. Click "Initialize Audio" first.');
        return;
      }
      
      // Resume or start AudioContext if suspended
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        console.log('Attempting to resume suspended AudioContext');
        audioContextRef.current.resume()
          .then(() => {
            console.log('AudioContext resumed successfully');
            
            // Start playback after a short delay
            setTimeout(() => {
              console.log('Starting playback after AudioContext resume');
              setIsPlaying(true);
              scheduleKicks();
            }, 100);
          })
          .catch(error => {
            console.error('Failed to resume AudioContext:', error);
            setErrorMessage('Could not start audio playback - please interact with the page first');
          });
      } else {
        // Start playback immediately if context is already running
        console.log('Starting playback with running AudioContext');
        setIsPlaying(true);
        scheduleKicks();
      }
    }
  };
  
  // Generate new test pattern with different complexity
  const generateNewPattern = (complexity: PatternComplexity) => {
    const newPattern = generatePattern(complexity);
    setPattern(newPattern);
    
    // If playback is active, restart to apply new pattern
    if (isPlaying) {
      setIsPlaying(false);
      if (schedulerTimerRef.current) {
        window.clearTimeout(schedulerTimerRef.current);
        schedulerTimerRef.current = null;
      }
      // Short delay to ensure state updates before restarting
      window.setTimeout(() => {
        setIsPlaying(true);
        scheduleKicks();
      }, 100);
    }
  };

  // Clean up audio resources
  useEffect(() => {
    return () => {
      if (schedulerTimerRef.current) {
        window.clearTimeout(schedulerTimerRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(err => {
          console.error('Error closing AudioContext:', err);
        });
      }
    };
  }, []);

  // For BPM change handler
  const handleBpmChange = (value: number) => {
    setBpm(value);
    
    // If playback is active, restart to apply new BPM
    if (isPlaying) {
      setIsPlaying(false);
      if (schedulerTimerRef.current) {
        window.clearTimeout(schedulerTimerRef.current);
        schedulerTimerRef.current = null;
      }
      window.setTimeout(() => {
        setIsPlaying(true);
        scheduleKicks();
      }, 100);
    }
  };

  return {
    // State
    bpm,
    dominance,
    showComparison,
    isPlaying,
    selectedKickSample,
    currentPlayingIndex,
    audioInitialized,
    loadingSample,
    errorMessage,
    audioContextState,
    pattern,
    footAssignments,
    notesByMeasure,
    measures,
    
    // Actions
    setBpm: handleBpmChange,
    setDominance,
    setShowComparison,
    setSelectedKickSample,
    initializeAudio,
    loadKickSample,
    playTestSound,
    togglePlayback,
    generateNewPattern,
  };
}; 