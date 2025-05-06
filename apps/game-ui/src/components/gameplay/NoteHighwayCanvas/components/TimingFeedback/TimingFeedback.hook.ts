import { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../../store/gameStore';
import { AccuracyDisplayData } from './TimingFeedback.types';

/**
 * Hook to manage timing feedback animation and lifecycle
 */
export const useTimingFeedback = (
  id: string,
  accuracy: 'perfect' | 'good' | 'ok' | 'miss',
  createdAt: number
) => {
  const [opacity, setOpacity] = useState(1);
  const { time, removeTimingFeedback } = useGameStore();
  
  // Get color and text based on accuracy
  const getAccuracyData = (): AccuracyDisplayData => {
    switch(accuracy) {
      case 'perfect': return { color: '#ffff00', text: 'PERFECT!' };
      case 'good': return { color: '#00ff00', text: 'GOOD' };
      case 'ok': return { color: '#00ffff', text: 'OK' };
      case 'miss': return { color: '#ff0000', text: 'MISS' };
      default: return { color: '#ffffff', text: '' };
    }
  };
  
  const { color, text } = getAccuracyData();
  
  // Setup animation frame logic
  useFrame(() => {
    const age = time - createdAt;
    setOpacity(Math.max(0, 1 - age));
    
    if (age > 1) {
      removeTimingFeedback(id);
    }
  });
  
  return {
    opacity,
    color,
    text
  };
}; 