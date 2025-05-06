import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import { BoxGeometry, EdgesGeometry, Mesh, Material } from 'three';

import { EnhancedNoteProps } from './EnhancedNote.types';
import { 
  NOTE_DIMENSIONS, 
  HIT_LINE_Z,
  VISIBILITY_NEAR,
  getNoteColor, 
  getEmissiveColor, 
  getWireframeColor, 
  getVisibilityByDistance,
  getOpacityByDistance
} from './EnhancedNote.logic';

/**
 * Enhanced note visualization with improved timing feedback
 */
export const EnhancedNote: React.FC<EnhancedNoteProps> = ({
  position,
  lane,
  hit,
  showWireframe,
  isAccent = false,
  hitQuality = null,
  isIntense = false
}) => {
  // References
  const meshRef = useRef<Mesh>(null);
  const hitTimeRef = useRef<number | null>(null);
  const timeRef = useRef(0);
  const [localVisible, setLocalVisible] = useState(true);

  // Derived values
  const isKickDrum = lane === 2 || lane === 3;
  const isCymbal = lane === 0;
  const isSnare = lane === 1;
  
  // Create edge geometry for kicks - Always memoized in the same order
  const edgesGeometry = useMemo(() => {
    if (isKickDrum) {
      const geo = new BoxGeometry(
        NOTE_DIMENSIONS.kick.width, 
        NOTE_DIMENSIONS.kick.height, 
        NOTE_DIMENSIONS.kick.depth
      );
      return new EdgesGeometry(geo);
    }
    return null;
  }, [isKickDrum]);
  
  // Auto-determine visualization aids if not explicitly set
  const useWireframe = showWireframe ?? isKickDrum;
  
  // Color and brightness adjustments
  const noteColor = useMemo(() => getNoteColor(hit, lane, hitQuality), [hit, lane, hitQuality]);
  const emissiveColor = useMemo(() => getEmissiveColor(hit, lane, hitQuality), [hit, lane, hitQuality]);
  
  // Track when a note is hit - only trigger hit animation on ACTUAL hit
  useEffect(() => {
    if (hit && !hitTimeRef.current && meshRef.current) {
      hitTimeRef.current = timeRef.current;
      
      // Apply a hit effect based on quality
      if (meshRef.current) {
        // Scale boost based on hit quality
        const scaleBoost = hitQuality === 'perfect' ? 1.3 : 
                          hitQuality === 'good' ? 1.2 : 1.1;
        
        meshRef.current.scale.set(scaleBoost, scaleBoost, scaleBoost);
      }
    }
  }, [hit, hitQuality]);
  
  // Handle animation and visual updates
  useFrame((_, delta) => {
    timeRef.current += delta;
    
    if (!meshRef.current) return;
    
    // Update visibility based on z-position
    const isVisible = getVisibilityByDistance(position[2]);
    if (localVisible !== isVisible) {
      setLocalVisible(isVisible);
    }
    
    if (!isVisible) {
      // Skip all other processing if not visible
      return;
    }
    
    // Hit animation - ONLY after actual hit, never on approach
    if (hit && hitTimeRef.current !== null) {
      const timeSinceHit = timeRef.current - hitTimeRef.current;
      
      if (timeSinceHit > 0) {
        // Fade out after hit
        const opacity = Math.max(0, 1 - timeSinceHit * 3);
        
        if (meshRef.current.material) {
          const mat = meshRef.current.material as Material;
          if ('opacity' in mat) {
            mat.opacity = opacity;
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
    // Regular note (not hit) - improved approach visualization
    else {
      // Apply distance-based opacity
      const opacity = getOpacityByDistance(position[2], isKickDrum);
      if (meshRef.current.material) {
        const mat = meshRef.current.material as Material;
        if ('opacity' in mat) {
          mat.opacity = opacity;
          mat.transparent = opacity < 0.99;
        }
        
        // Add emissive effects for kick drums to improve visibility
        if ('emissiveIntensity' in mat && isKickDrum) {
          // Boost kick drum visibility in the distance
          const distanceBoost = Math.max(0, Math.min(1, (VISIBILITY_NEAR - position[2]) / -30));
          const intensityBase = isIntense ? 0.5 : 0.3;
          mat.emissiveIntensity = intensityBase + distanceBoost * 0.2;
        }
      }

      // Approaching hit line effect - more subtle, doesn't imply hit
      const distanceToHitLine = HIT_LINE_Z - position[2];
      
      if (distanceToHitLine > 0 && distanceToHitLine < 2) {
        // Subtle scale up as it approaches hit line
        const emphasisFactor = 1.0 + Math.min(0.12, distanceToHitLine * 0.06);
        meshRef.current.scale.set(emphasisFactor, emphasisFactor, 1);
      } else {
        // Normal scale (never scale down)
        meshRef.current.scale.set(1, 1, 1);
      }
    }
  });
  
  // Early exit if not in visible range
  if (!localVisible) return null;
  
  // Use appropriate geometry based on drum type
  const renderNoteGeometry = () => {
    if (isCymbal) {
      return (
        <cylinderGeometry 
          args={[
            NOTE_DIMENSIONS.cymbal.radius, 
            NOTE_DIMENSIONS.cymbal.radius, 
            NOTE_DIMENSIONS.cymbal.height, 
            NOTE_DIMENSIONS.cymbal.segments
          ]} 
        />
      );
    } else if (isSnare) {
      return (
        <cylinderGeometry 
          args={[
            NOTE_DIMENSIONS.snare.radius, 
            NOTE_DIMENSIONS.snare.radius, 
            NOTE_DIMENSIONS.snare.height, 
            NOTE_DIMENSIONS.snare.segments
          ]} 
        />
      );
    } else {
      // Kick drum (left or right)
      return (
        <boxGeometry 
          args={[
            NOTE_DIMENSIONS.kick.width, 
            NOTE_DIMENSIONS.kick.height, 
            NOTE_DIMENSIONS.kick.depth
          ]} 
        />
      );
    }
  };

  return (
    <group>
      <mesh position={position} ref={meshRef} castShadow>
        {renderNoteGeometry()}
        <meshStandardMaterial 
          color={noteColor}
          emissive={emissiveColor}
          emissiveIntensity={isAccent ? 0.7 : isKickDrum ? 0.5 : 0.4}
          metalness={isCymbal ? 0.7 : 0.5}
          roughness={isCymbal ? 0.3 : 0.4}
          transparent
          opacity={1.0} // Handled in animation
        />
      </mesh>
      
      {/* Wireframe outline for better visibility of kicks */}
      {useWireframe && edgesGeometry && !hit && (
        <Line
          position={position}
          // @ts-expect-error EdgesGeometry works with Line from drei but the types don't match perfectly
          geometry={edgesGeometry}
          color={getWireframeColor(hit, lane, hitQuality)}
          lineWidth={1.5}
          transparent
          opacity={0.7}
        />
      )}
    </group>
  );
}; 