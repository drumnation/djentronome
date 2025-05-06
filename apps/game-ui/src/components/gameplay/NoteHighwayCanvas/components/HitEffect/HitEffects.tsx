import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { HitEffect } from './HitEffect';

/**
 * Component to render all hit effects from the game store
 */
export const HitEffects: React.FC = () => {
  const { hitEffects } = useGameStore();

  return (
    <>
      {hitEffects.map((effect) => (
        <HitEffect
          key={effect.id}
          id={effect.id}
          position={effect.position}
          color={effect.color}
          createdAt={effect.createdAt}
        />
      ))}
    </>
  );
}; 