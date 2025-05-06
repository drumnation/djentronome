import { HitEffectData } from './HitEffect.types';
import { useHitEffectAnimation } from './HitEffect.hook';

/**
 * Component to render hit effects when a note is hit
 */
export const HitEffect = ({ position, color, createdAt, id }: HitEffectData) => {
  const { meshRef } = useHitEffectAnimation(createdAt, id);
  
  return (
    <mesh position={position} ref={meshRef}>
      <ringGeometry args={[0.8, 1.2, 32]} />
      <meshBasicMaterial color={color} transparent opacity={1} />
    </mesh>
  );
}; 