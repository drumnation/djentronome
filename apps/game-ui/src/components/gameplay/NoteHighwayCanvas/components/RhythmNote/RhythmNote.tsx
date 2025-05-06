import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import type { Mesh } from 'three';
import { RhythmNoteProps, VISIBILITY_BOUNDS, ExtendedMaterial } from './RhythmNote.types';
import { calculateZLength, getNoteColor, getEmissiveColor, createWireframePoints } from './RhythmNote.logic';

/**
 * RhythmNote component - optimized for rhythm gameplay with clear readability
 * following key principles:
 * 1. Full visibility of all notes without fade (100% opacity always)
 * 2. No pre-hit animations that could mislead timing
 * 3. Animation effects only trigger after actual hits
 * 4. Binary visibility (in/out) rather than opacity-based fading
 * 5. Wireframe outlines for kick drums to improve visibility
 */
export const RhythmNote: React.FC<RhythmNoteProps> = ({
  position,
  lane,
  hit,
  bpm = 120,
  hitQuality = null
}) => {
  // References
  const meshRef = useRef<Mesh>(null);
  const hitTimeRef = useRef<number | null>(null);
  const timeRef = useRef(0);
  
  // Derived lane types
  const isKickDrum = lane === 2 || lane === 3;
  const isCymbal = lane === 0;
  const isSnare = lane === 1;
  
  // Track when a note is hit to start animation
  useEffect(() => {
    if (hit && !hitTimeRef.current && meshRef.current) {
      hitTimeRef.current = timeRef.current;
      
      // Apply hit animation only on ACTUAL hits
      if (meshRef.current) {
        // Scale boost based on hit quality
        const scaleBoost = hitQuality === 'perfect' ? 1.3 : 
                          hitQuality === 'good' ? 1.2 : 1.1;
        
        meshRef.current.scale.set(scaleBoost, scaleBoost, scaleBoost);
      }
    }
  }, [hit, hitQuality]);
  
  // Animation frame handler
  useFrame((_, delta) => {
    timeRef.current += delta;
    
    if (!meshRef.current) return;
    
    // Visibility check - simple in/out rather than opacity fade
    const isInVisibleBounds = position[2] >= VISIBILITY_BOUNDS.NEAR && position[2] <= VISIBILITY_BOUNDS.FAR;
    
    // Skip all processing if out of bounds
    if (!isInVisibleBounds) {
      if (meshRef.current.visible) {
        meshRef.current.visible = false;
      }
      return;
    } else if (!meshRef.current.visible) {
      meshRef.current.visible = true;
    }
    
    // Hit animation - ONLY after actual hit
    if (hit && hitTimeRef.current !== null) {
      const timeSinceHit = timeRef.current - hitTimeRef.current;
      
      if (timeSinceHit > 0) {
        // Fade out after hit
        const opacity = Math.max(0, 1 - timeSinceHit * 3);
        
        if (meshRef.current.material) {
          // Type cast to Material with known properties
          const mat = meshRef.current.material as ExtendedMaterial;
          
          if ('opacity' in mat) {
            mat.opacity = opacity;
            mat.transparent = true;
          }
          
          // Update emissive intensity during hit animation
          if ('emissiveIntensity' in mat) {
            // Pulse effect during hit animation
            const pulseRate = Math.sin(timeSinceHit * 15) * 0.3 + 0.7;
            
            // Different intensities based on hit quality
            let baseIntensity = 0.7;
            if (hitQuality === 'perfect') baseIntensity = 1.0;
            else if (hitQuality === 'good') baseIntensity = 0.8;
            else if (hitQuality === 'late' || hitQuality === 'early') baseIntensity = 0.6;
            
            mat.emissiveIntensity = baseIntensity * pulseRate;
          }
        }
        
        // Bounce effect - more pronounced for perfect hits
        const bounceFrequency = hitQuality === 'perfect' ? 20 : 15;
        const bounceMagnitude = hitQuality === 'perfect' ? 0.15 : 0.1;
        
        const bounce = Math.sin(timeSinceHit * bounceFrequency) * bounceMagnitude * Math.max(0, 1 - timeSinceHit * 2);
        const shrinkRate = hitQuality === 'perfect' ? 0.7 : 0.8;
        const baseScale = hitQuality === 'perfect' ? 1.3 : 1.2;
        
        const scale = baseScale - timeSinceHit * shrinkRate + bounce;
        meshRef.current.scale.set(scale, scale, scale);
      }
    } 
    // Regular note (not hit) - NO PRE-HIT ANIMATIONS that could mislead timing
    else {
      // Always maintain full opacity for non-hit notes
      if (meshRef.current.material) {
        // Type cast to Material with known properties
        const mat = meshRef.current.material as ExtendedMaterial;
        
        if ('opacity' in mat) {
          mat.opacity = 1.0;
          mat.transparent = false;
        }
        
        // Consistent emissive intensity - no distance-based changes
        if ('emissiveIntensity' in mat) {
          mat.emissiveIntensity = isKickDrum ? 0.5 : 0.4;
        }
      }

      // No approach animations - maintain consistent size
      meshRef.current.scale.set(1, 1, 1);
    }
  });
  
  // Note color and emissive values
  const noteColor = getNoteColor(hit, lane, hitQuality);
  const emissiveColor = getEmissiveColor(hit, lane, hitQuality);
  
  // Determine the appropriate geometry based on drum type
  const renderNoteGeometry = () => {
    if (isCymbal) {
      return (
        <cylinderGeometry 
          args={[0.9, 0.9, 0.12, 32]} 
        />
      );
    } else if (isSnare) {
      return (
        <cylinderGeometry 
          args={[0.8, 0.8, 0.3, 6]} 
        />
      );
    } else {
      // Kick drum (left or right)
      const zLength = calculateZLength(bpm);
      return (
        <boxGeometry 
          args={[0.8, 0.8, zLength]} 
        />
      );
    }
  };
  
  // Create wireframe points for kick drum outlines
  const wireframePoints = isKickDrum ? createWireframePoints(calculateZLength(bpm)) : [];
  
  return (
    <group position={position}>
      {/* Main note mesh */}
      <mesh ref={meshRef} castShadow>
        {renderNoteGeometry()}
        <meshStandardMaterial 
          color={noteColor}
          emissive={emissiveColor}
          emissiveIntensity={isKickDrum ? 0.5 : 0.4}
          metalness={isCymbal ? 0.7 : 0.5}
          roughness={isCymbal ? 0.3 : 0.4}
          transparent={hit} // Only transparent during hit animations
        />
      </mesh>
      
      {/* Always show wireframe outlines for kicks - critical for readability */}
      {isKickDrum && !hit && (
        <Line
          points={wireframePoints}
          color={lane === 2 ? '#66aaff' : '#33ff88'}
          lineWidth={1.5}
        />
      )}
    </group>
  );
}; 