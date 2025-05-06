import { RefObject } from 'react';
import { Mesh } from 'three';

interface HitLineProps {
  time: number;
  hitLineRef: RefObject<Mesh | null>;
  hitRingRefs: {
    current: (Mesh | null)[];
  };
}

export const HitLine = ({ time, hitLineRef, hitRingRefs }: HitLineProps) => {
  return (
    <group position={[0, 0.05, 5]}>
      {/* Main hit line - now metallic black instead of white */}
      <mesh ref={hitLineRef} receiveShadow>
        <boxGeometry args={[12, 0.2, 0.3]} />
        <meshStandardMaterial 
          color="#222222" 
          emissive="#444444" 
          emissiveIntensity={0.4}
          metalness={0.8} // More metallic
          roughness={0.2} // Less rough (more glossy)
        />
      </mesh>
      
      {/* Hit line edge outline for better visual clarity */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[12.05, 0.25, 0.35]} />
        <meshBasicMaterial 
          color="#000000" 
          transparent
          opacity={0.8}
          depthWrite={false}
        />
      </mesh>
      
      {/* Hit zone indicators at each lane - thicker with more glow */}
      {[-3, -1, 1, 3].map((x, i) => {
        // Create a ref for this hit ring
        const ringRef = (el: Mesh) => {
          hitRingRefs.current[i] = el;
        };
        
        return (
          <mesh 
            key={i} 
            ref={ringRef}
            position={[x, 0.2, 0]} 
            castShadow 
            receiveShadow
          >
            <ringGeometry args={[0.4, 0.6, 24]} /> {/* Thicker ring */}
            <meshStandardMaterial 
              color={
                i === 0 ? "#ffcc00" : 
                i === 1 ? "#ff4400" : 
                i === 2 ? "#0044ff" : 
                "#00cc44"
              }
              emissive={
                i === 0 ? "#ffcc00" : 
                i === 1 ? "#ff4400" : 
                i === 2 ? "#0044ff" : 
                "#00cc44"
              }
              emissiveIntensity={0.4 + Math.sin(time * 2 + i) * 0.1}
              transparent
              opacity={0.8} // Increased opacity
            />
          </mesh>
        );
      })}
    </group>
  );
}; 