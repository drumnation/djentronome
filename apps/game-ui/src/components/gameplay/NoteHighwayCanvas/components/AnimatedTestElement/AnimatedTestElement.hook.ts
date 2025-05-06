import { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { 
  NoteState,
  NoteRefs,
  FontProps 
} from './AnimatedTestElement.types';
import {
  LANES,
  createKeyMap, 
  isNoteInHitZone,
  updateNotePosition,
  updateHitLine,
  updateHighway,
  updateHitRings
} from './AnimatedTestElement.logic';

export const useAnimatedTestElement = () => {
  // State for animations
  const [time, setTime] = useState(0);
  const [lastHit, setLastHit] = useState<number | null>(null);
  const [missedInput, setMissedInput] = useState<number | null>(null);
  
  // Refs for animated meshes with proper typing
  const yellowNoteRef = useRef<Mesh | null>(null);
  const redNoteRef = useRef<Mesh | null>(null);
  const blueNoteRef = useRef<Mesh | null>(null);
  const greenNoteRef = useRef<Mesh | null>(null);
  const highwayRef = useRef<Mesh | null>(null);
  const hitLineRef = useRef<Mesh | null>(null);
  const hitRingRefs = useRef<Mesh[]>([]);
  
  // Dynamic font loading for tech-style text
  const fontProps: FontProps = { 
    letterSpacing: 0.1,
    lineHeight: 1,
    fontWeight: 700, // Bold text
    'material-toneMapped': false
  };
  
  // Set up keypress detection for simulating hits
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Map keys to lanes
      const keyMap = createKeyMap();
      
      const lane = keyMap[e.key.toLowerCase()];
      if (lane !== undefined) {
        // Check if a note is in the hit zone (z between 4.5 and 5.5)
        const noteInZone = isNoteInHitZone(
          lane, 
          yellowNoteRef, 
          redNoteRef, 
          blueNoteRef, 
          greenNoteRef
        );

        // Trigger hit effect or miss feedback based on note position
        if (noteInZone) {
          // Good hit
          setLastHit(lane);
          setTimeout(() => setLastHit(null), 300);
        } else {
          // Missed hit
          setMissedInput(lane);
          setTimeout(() => setMissedInput(null), 300);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Update time and animate
  useFrame((_, delta) => {
    // Update time
    setTime(prev => prev + delta);
    
    // Move notes toward the hit line
    updateNotePosition(yellowNoteRef, time, delta, -30, 0.5, 1.5, 0.05);
    updateNotePosition(redNoteRef, time, delta, -35, 0.4, 1.2, 0.05);
    updateNotePosition(blueNoteRef, time, delta, -25, 0.3, 1.8, 0.05);
    updateNotePosition(greenNoteRef, time, delta, -40, 0.2, 1.6, 0.05);
    
    // Update hit line, highway, and hit rings
    updateHitLine(hitLineRef, lastHit, time);
    updateHighway(highwayRef, time);
    updateHitRings(hitRingRefs, time, lastHit, missedInput);
  });

  // Group all state in an object
  const state: NoteState = {
    time,
    lastHit,
    missedInput
  };

  // Group all refs in an object
  const refs: NoteRefs = {
    yellowNoteRef,
    redNoteRef,
    blueNoteRef,
    greenNoteRef,
    highwayRef,
    hitLineRef,
    hitRingRefs
  };

  return {
    state,
    refs,
    fontProps,
    lanes: LANES
  };
}; 