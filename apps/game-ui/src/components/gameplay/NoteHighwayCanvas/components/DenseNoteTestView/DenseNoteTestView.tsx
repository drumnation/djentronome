import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Note } from '../Note';
import { DenseNoteTestViewProps } from './DenseNoteTestView.types';

/**
 * A component that generates a dense stream of notes to test visualization at high BPM
 */
export const DenseNoteTestView = ({ 
  bpm = 180, 
  enabled = false
}: DenseNoteTestViewProps) => {
  // State for notes
  const [notes, setNotes] = useState<{
    id: string;
    lane: number;
    position: [number, number, number];
    time: number;
    hit: boolean;
  }[]>([]);
  
  // Refs for animation and timing
  const timeRef = useRef(0);
  const lastNoteTimeRef = useRef(0);
  const isEnabledRef = useRef(enabled);
  
  // Testing modes (toggle with number keys)
  const [testMode, setTestMode] = useState('rapid-fire'); // 'rapid-fire', 'blast-beat', 'polyrhythm'
  const [activeLane, setActiveLane] = useState(1); // Default to snare
  
  // Update enabled ref when prop changes
  useEffect(() => {
    isEnabledRef.current = enabled;
  }, [enabled]);
  
  // Handle mode switching with keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isEnabledRef.current) return;
      
      switch (e.key) {
        case '1':
          setTestMode('rapid-fire');
          break;
        case '2':
          setTestMode('blast-beat');
          break;
        case '3':
          setTestMode('polyrhythm');
          break;
        case '4':
          setTestMode('dense-breakdown');
          break;
        case 'c': // Cymbal
          setActiveLane(0);
          break;
        case 's': // Snare
          setActiveLane(1);
          break;
        case 'k': // Kick
          setActiveLane(2);
          break;
        case 'b': // Both kicks
          setActiveLane(3);
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Calculate time between notes based on BPM and test mode
  const getTimeBetweenNotes = () => {
    const secondsPerBeat = 60 / bpm;
    
    switch (testMode) {
      case 'rapid-fire':
        return secondsPerBeat / 4; // 16th notes
      case 'blast-beat':
        return secondsPerBeat / 2; // 8th notes
      case 'polyrhythm':
        return secondsPerBeat / 3; // Triplets
      case 'dense-breakdown':
        return secondsPerBeat / 8; // 32nd notes (extremely dense - stress test)
      default:
        return secondsPerBeat / 4;
    }
  };
  
  // Get lanes for current test mode
  const getLanesForCurrentMode = (): number[] => {
    switch (testMode) {
      case 'rapid-fire':
        return [activeLane];
      case 'blast-beat':
        return timeRef.current % (60 / bpm / 2) < (60 / bpm / 4) ? [1] : [2]; // Alternating snare/kick
      case 'polyrhythm':
        return [0, 1, 2]; // All lanes
      case 'dense-breakdown':
        return [activeLane];
      default:
        return [activeLane];
    }
  };
  
  // Update animation
  useFrame((_, delta) => {
    if (!isEnabledRef.current) return;
    
    // Update time
    timeRef.current += delta;
    
    // Spawn a new note based on test mode and timing
    const timeBetweenNotes = getTimeBetweenNotes();
    if (timeRef.current - lastNoteTimeRef.current > timeBetweenNotes) {
      lastNoteTimeRef.current = timeRef.current;
      
      // Get lanes for this test mode
      const lanesForMode = getLanesForCurrentMode();
      
      // Create a new note for each lane
      lanesForMode.forEach(lane => {
        const newNote = {
          id: `test-${lane}-${Date.now()}-${Math.random()}`,
          lane,
          position: [(lane - 1.5) * 2, 1, -30] as [number, number, number],
          time: timeRef.current,
          hit: false
        };
        
        setNotes(prev => [...prev, newNote]);
      });
    }
    
    // Move notes toward the hit line (5 units per second)
    setNotes(prev => 
      prev
        .map(note => {
          if (note.hit) return note;
          
          // Move the note forward
          const newZ = note.position[2] + delta * 5;
          const newPosition: [number, number, number] = [
            note.position[0],
            note.position[1],
            newZ
          ];
          
          return {
            ...note,
            position: newPosition
          };
        })
        // Remove notes that are past the player or that have been hit
        .filter(note => note.position[2] < 15 && (!note.hit || timeRef.current - note.time < 0.5))
    );
  });
  
  if (!enabled) return null;
  
  return (
    <group>
      {/* Notes */}
      {notes.map(note => (
        <Note 
          key={note.id}
          position={note.position}
          lane={note.lane}
          hit={note.hit}
          bpm={bpm}
        />
      ))}
      
      {/* Mode display */}
      <Text
        position={[5, 5, 0]}
        color="#ffffff"
        fontSize={0.5}
        anchorX="left"
        anchorY="middle"
      >
        {`Test Mode: ${testMode} (${bpm} BPM)`}
      </Text>
      
      {/* Instructions */}
      <Text
        position={[5, 4, 0]}
        color="#aaaaaa"
        fontSize={0.3}
        anchorX="left"
        anchorY="middle"
      >
        Press 1-4 to change test patterns, C/S/K/B to change lane
      </Text>
    </group>
  );
}; 