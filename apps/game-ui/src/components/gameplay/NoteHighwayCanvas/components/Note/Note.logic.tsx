import React from 'react';
import { Line } from '@react-three/drei';
import { getLaneColor } from '../../utils/visualEffects';
import type { DrumNoteRenderProps, NoteShadowProps, NoteTrailProps } from './Note.types';

/**
 * Calculate the Z length (depth) of the note based on BPM to prevent overlap at high tempos
 */
export const calculateZLength = (bpm: number = 120): number => {
  // More aggressive dynamic scaling based on BPM
  if (bpm <= 120) {
    return 0.4; // Base size for slower tempos
  } else if (bpm <= 180) {
    // Linear interpolation between 120 and 180 BPM
    const t = (bpm - 120) / 60;
    return 0.4 - (t * 0.25); // Scale from 0.4 down to 0.15 (more aggressive)
  } else {
    // For very fast tempos (180+ BPM)
    const t = Math.min((bpm - 180) / 60, 1);
    return 0.15 - (t * 0.07); // Scale from 0.15 down to 0.08 at 240+ BPM
  }
};

/**
 * Render different types of drum notes based on lane
 */
export const renderDrumNote = ({
  lane,
  zLength,
  pulseFactor,
  visualEmphasis,
  noteColor,
  isCloseToHitLine,
  isDistant,
  hit
}: DrumNoteRenderProps): React.ReactNode => {
  switch(lane) {
    case 0: // Cymbal/high hat (round, thin, yellow)
      return (
        <mesh scale={[pulseFactor * visualEmphasis, pulseFactor * visualEmphasis, 1]}>
          <cylinderGeometry args={[0.9, 0.9, 0.12, 32]} />
          <meshStandardMaterial 
            color={noteColor}
            emissive={noteColor}
            emissiveIntensity={isCloseToHitLine ? 0.7 : 0.4}
            metalness={0.8}
            roughness={0.2}
            transparent={hit}
            opacity={hit ? 0.9 : 1.0}
          />
        </mesh>
      );
    
    case 1: // Snare (hexagonal, red)
      return (
        <mesh scale={[pulseFactor * visualEmphasis, pulseFactor * visualEmphasis, 1]}>
          <cylinderGeometry args={[0.8, 0.8, zLength, 6]} />
          <meshStandardMaterial 
            color={noteColor}
            emissive={noteColor}
            emissiveIntensity={isCloseToHitLine ? 0.7 : 0.4}
            metalness={0.6}
            roughness={0.4}
            transparent={hit}
            opacity={hit ? 0.9 : 1.0}
          />
        </mesh>
      );
    
    case 2: // Left kick drum (blue cube) - with outline for better visibility
      return (
        <>
          <mesh scale={[pulseFactor * visualEmphasis, pulseFactor * visualEmphasis, 1]}>
            <boxGeometry args={[0.8, 0.8, zLength]} />
            <meshStandardMaterial 
              color={noteColor}
              emissive={noteColor}
              emissiveIntensity={isCloseToHitLine ? 0.7 : 0.4}
              metalness={0.6}
              roughness={0.4}
              transparent={hit}
              opacity={hit ? 0.9 : 1.0}
              // Add top-to-bottom gradient effect via onBeforeCompile
              onBeforeCompile={(shader) => {
                shader.fragmentShader = shader.fragmentShader.replace(
                  'vec4 diffuseColor = vec4( diffuse, opacity );',
                  `
                  vec3 gradColor = diffuse;
                  // Add subtle gradient based on normal - top is brighter
                  gradColor *= mix(0.85, 1.0, normal.y);
                  vec4 diffuseColor = vec4(gradColor, opacity);
                  `
                );
              }}
            />
          </mesh>
          
          {/* Add faint wireframe outline for kicks to improve visibility at distance */}
          {isDistant && (
            <Line
              points={[
                [-0.41, -0.41, -zLength/2], [0.41, -0.41, -zLength/2], [0.41, 0.41, -zLength/2], [-0.41, 0.41, -zLength/2], [-0.41, -0.41, -zLength/2],
                [-0.41, -0.41, zLength/2], [0.41, -0.41, zLength/2], [0.41, 0.41, zLength/2], [-0.41, 0.41, zLength/2], [-0.41, -0.41, zLength/2]
              ]}
              color="#6699ff"
              lineWidth={1}
              transparent
              opacity={0.7}
              scale={[pulseFactor * visualEmphasis, pulseFactor * visualEmphasis, 1]}
            />
          )}
        </>
      );
    
    case 3: // Right kick drum (green cube) - with outline for better visibility
      return (
        <>
          <mesh scale={[pulseFactor * visualEmphasis, pulseFactor * visualEmphasis, 1]}>
            <boxGeometry args={[0.8, 0.8, zLength]} />
            <meshStandardMaterial 
              color={noteColor}
              emissive={noteColor}
              emissiveIntensity={isCloseToHitLine ? 0.7 : 0.4}
              metalness={0.6}
              roughness={0.4}
              transparent={hit}
              opacity={hit ? 0.9 : 1.0}
              // Add top-to-bottom gradient effect via onBeforeCompile
              onBeforeCompile={(shader) => {
                shader.fragmentShader = shader.fragmentShader.replace(
                  'vec4 diffuseColor = vec4( diffuse, opacity );',
                  `
                  vec3 gradColor = diffuse;
                  // Add subtle gradient based on normal - top is brighter
                  gradColor *= mix(0.85, 1.0, normal.y);
                  vec4 diffuseColor = vec4(gradColor, opacity);
                  `
                );
              }}
            />
          </mesh>
          
          {/* Add faint wireframe outline for kicks to improve visibility at distance */}
          {isDistant && (
            <Line
              points={[
                [-0.41, -0.41, -zLength/2], [0.41, -0.41, -zLength/2], [0.41, 0.41, -zLength/2], [-0.41, 0.41, -zLength/2], [-0.41, -0.41, -zLength/2],
                [-0.41, -0.41, zLength/2], [0.41, -0.41, zLength/2], [0.41, 0.41, zLength/2], [-0.41, 0.41, zLength/2], [-0.41, -0.41, zLength/2]
              ]}
              color="#33ff66"
              lineWidth={1}
              transparent
              opacity={0.7}
              scale={[pulseFactor * visualEmphasis, pulseFactor * visualEmphasis, 1]}
            />
          )}
        </>
      );
    
    default: // Fallback
      return (
        <mesh scale={[pulseFactor * visualEmphasis, pulseFactor * visualEmphasis, 1]}>
          <boxGeometry args={[1, 0.2, zLength]} />
          <meshStandardMaterial 
            color={noteColor}
            emissive={noteColor} 
            emissiveIntensity={isCloseToHitLine ? 0.7 : 0.4}
            transparent={hit}
            opacity={hit ? 0.9 : 1.0}
          />
        </mesh>
      );
  }
};

/**
 * Render a subtle shadow beneath the note
 */
export const renderNoteShadow = ({ position, lane, shadowOpacity }: NoteShadowProps): React.ReactNode => {
  return (
    <mesh 
      position={[position[0], 0.02, position[2]]} 
      rotation={[-Math.PI / 2, 0, 0]}
    >
      {lane === 0 || lane === 1 ? (
        <circleGeometry args={[0.6, lane === 1 ? 6 : 32]} />
      ) : (
        <planeGeometry args={[0.8, 0.8]} />
      )}
      <meshBasicMaterial 
        color="#000000" 
        transparent 
        opacity={shadowOpacity}
        depthWrite={false}
      />
    </mesh>
  );
};

/**
 * Render a visual trail behind the note to enhance motion perception
 */
export const renderNoteTrail = ({ position, lane, trailLength, trailColor }: NoteTrailProps): React.ReactNode => {
  return (
    <mesh 
      position={[position[0], position[1], position[2] - trailLength/2]} 
      rotation={[0, 0, 0]}
    >
      {lane === 0 || lane === 1 ? (
        // Cylindrical trail for round notes
        <cylinderGeometry args={[
          lane === 0 ? 0.9 : 0.8, // Radius to match note
          lane === 0 ? 0.9 : 0.8, 
          trailLength,
          lane === 1 ? 6 : 32 // Segments to match note
        ]} />
      ) : (
        // Box trail for kick drums
        <boxGeometry args={[0.8, 0.8, trailLength]} />
      )}
      <meshBasicMaterial 
        color={trailColor}
        transparent 
        opacity={0.3}
        depthWrite={false}
      />
    </mesh>
  );
};

/**
 * Calculate visual parameters for a note based on its position and properties
 */
export const calculateNoteVisualParams = (position: [number, number, number], lane: number, hit: boolean) => {
  // Pulse factor for newly spawned notes (subtle visual indicator)
  const isNew = position[2] < -38;
  const pulseFactor = isNew ? 1.1 : 1.0;
  
  // Position-based effects
  const distanceFromHitLine = Math.abs(position[2] - 5);
  const isCloseToHitLine = distanceFromHitLine < 3;
  
  // Visual emphasis for notes approaching hit line
  const visualEmphasis = isCloseToHitLine ? 1.1 : 1.0;
  
  // Is this a distant note?
  const isDistant = position[2] < -20;
  
  // Get note color from utility
  const noteColor = getLaneColor(lane);
  
  // Shadow opacity calculation
  const shadowOpacity = hit ? 0 : 0.2 * Math.max(0, 1 - distanceFromHitLine / 40);
  
  // Trail parameters
  const distanceToHitLine = 5 - position[2];
  const trailLength = Math.min(distanceToHitLine * 0.4, 1.5);
  const showTrail = !hit && position[2] > 0 && position[2] < 5 && trailLength >= 0.2;
  const trailColor = getLaneColor(lane);
  
  return {
    pulseFactor,
    isCloseToHitLine,
    visualEmphasis,
    isDistant,
    noteColor,
    shadowOpacity,
    distanceToHitLine,
    trailLength,
    showTrail,
    trailColor
  };
}; 