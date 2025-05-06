import { getLaneColor } from '../../DjentAnimatedElement.logic';

interface HitEffect {
  id: string;
  lane: number;
  startTime: number;
  particles: Array<{
    x: number;
    y: number;
    z: number;
    size: number;
    opacity: number;
  }>;
}

interface HitEffectsProps {
  time: number;
  hitEffects: HitEffect[];
}

export const HitEffects = ({ time, hitEffects }: HitEffectsProps) => {
  return (
    <>
      {hitEffects.map((effect) => {
        const effectAge = time - effect.startTime;
        const laneX = (effect.lane - 1.5) * 2; // X position based on lane
        const effectColor = getLaneColor(effect.lane);
        
        return (
          <group key={effect.id}>
            {/* Initial flash ring */}
            <mesh 
              position={[laneX, 0.1, 5]} 
              rotation={[-Math.PI / 2, 0, 0]}
              scale={[1 + effectAge * 5, 1 + effectAge * 5, 1]}
            >
              <ringGeometry args={[0.5, 0.7, 32]} />
              <meshBasicMaterial 
                color={effectColor} 
                transparent={true}
                opacity={Math.max(0, 0.7 - effectAge * 2)} // Fade quickly
                side={2} // DoubleSide
              />
            </mesh>
            
            {/* Render particles */}
            {effect.particles.map((particle, i) => (
              <mesh 
                key={`${effect.id}-p${i}`}
                position={[
                  laneX + particle.x, 
                  0.1 + particle.y, 
                  5 + particle.z
                ]}
                scale={[particle.size, particle.size, particle.size]}
              >
                <sphereGeometry args={[0.1, 8, 8]} />
                <meshBasicMaterial 
                  color={effectColor}
                  transparent={true}
                  opacity={particle.opacity * (1 - effectAge * 1.5)} // Fade out
                  depthWrite={false} // Don't block visibility
                />
              </mesh>
            ))}
          </group>
        );
      })}
    </>
  );
}; 