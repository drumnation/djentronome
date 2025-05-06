import { RefObject } from 'react';
import { Mesh } from 'three';

interface HighwayProps {
  highwayRef?: RefObject<Mesh | null>;
}

export const Highway = ({ highwayRef }: HighwayProps) => {
  return (
    <>
      {/* Highway floor with improved metal texture and gradient */}
      <mesh 
        ref={highwayRef}
        position={[0, 0, 0]} 
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[12, 50]} />
        <meshStandardMaterial 
          color="#222" 
          metalness={0.8} 
          roughness={0.4}
          emissive="#111"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Enhanced grid overlay - thinner lines with better spacing for beat visualization */}
      <gridHelper 
        args={[12, 48, "#222", "#181818"]} 
        position={[0, 0.01, -15]} 
        rotation={[Math.PI / 2, 0, 0]}
      />
      
      {/* Beat marker lines - faint dashed white lines to mark quarter notes */}
      {Array.from({ length: 10 }).map((_, i) => (
        <group key={`beat-marker-${i}`}>
          {/* Create dashed line effect with multiple short segments */}
          {Array.from({ length: 12 }).map((_, j) => (
            <mesh 
              key={`beat-dash-${i}-${j}`} 
              position={[
                -5.5 + j,
                0.02, 
                -5 - (i * 2.5)
              ]} 
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <planeGeometry args={[0.4, 0.04]} />
              <meshBasicMaterial 
                color="#ffffff" 
                transparent 
                opacity={0.1 + (i === 0 ? 0.1 : 0)} // First line slightly brighter
                depthWrite={false}
              />
            </mesh>
          ))}
        </group>
      ))}
      
      {/* Enhanced depth gradient overlay - improved fade to black in distance */}
      <mesh position={[0, 0.01, -20]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 30]} />
        <meshBasicMaterial
          color="#000" 
          transparent
          opacity={0.5} // Increased opacity for more depth
          depthWrite={false}
          blending={2} // AdditiveBlending
        />
      </mesh>
    </>
  );
}; 