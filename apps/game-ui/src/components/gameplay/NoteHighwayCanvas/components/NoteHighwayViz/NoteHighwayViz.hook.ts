import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../../store/gameStore';

export const useNoteHighwayViz = () => {
  // Track time for animations
  const timeRef = useRef(0);
  
  // Get notes from game state
  const { notes } = useGameStore();
  
  // Animation loop
  useFrame((_, delta) => {
    timeRef.current += delta;
  });

  return {
    timeRef,
    notes
  };
}; 