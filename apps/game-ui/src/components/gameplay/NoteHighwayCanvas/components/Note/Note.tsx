import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';
import { easeInCubic } from '../../utils/easingFunctions';
import { applyZDepthFading } from '../../utils/visualEffects';
import { 
  calculateZLength, 
  renderDrumNote, 
  renderNoteShadow, 
  renderNoteTrail,
  calculateNoteVisualParams
} from './Note.logic';
import type { NoteProps } from './Note.types';

/**
 * Component to render a drum note on the note highway with enhanced visual separation
 * using a clean, deliberate visual style for high readability at fast BPM
 */
export const Note = ({ position, lane, hit, bpm = 120 }: NoteProps) => {
  const meshRef = useRef<Mesh>(null);
  const hitTimeRef = useRef<number | null>(null);
  const timeRef = useRef(0);
  
  // Track when a note is hit to start animation
  useEffect(() => {
    if (hit && !hitTimeRef.current && meshRef.current) {
      hitTimeRef.current = timeRef.current;
      // Initial hit animation - minimal scale up
      meshRef.current.scale.set(1.2, 1.2, 1.2);
    }
  }, [hit]);
  
  // Animate the fade out and apply visual effects
  useFrame((_, delta) => {
    timeRef.current += delta;
    
    if (hit && hitTimeRef.current !== null && meshRef.current) {
      const timeSinceHit = timeRef.current - hitTimeRef.current;
      
      // Fade out animation
      if (timeSinceHit > 0) {
        const opacity = 1 - easeInCubic(Math.min(timeSinceHit * 2, 1));
        
        // Apply to material
        if (meshRef.current.material && 'opacity' in meshRef.current.material) {
          meshRef.current.material.opacity = opacity;
        }
        
        // Scale effect during hit animation - grow slightly then shrink
        const scale = 1.2 - easeInCubic(Math.min(timeSinceHit * 3, 1)) * 0.2;
        meshRef.current.scale.set(scale, scale, scale);
      }
    }
    
    // Apply Z-depth fade for distant notes (only if not hit)
    if (!hit && meshRef.current && meshRef.current.material) {
      // Check if this is a kick drum (lanes 2 and 3)
      const isKickDrum = lane === 2 || lane === 3;
      
      // Get lane color for potential brightness adjustment
      const { noteColor } = calculateNoteVisualParams(position, lane, hit);
      
      // Apply the Z-depth fading with color boost for kicks
      applyZDepthFading(
        meshRef.current.material, 
        position[2],
        isKickDrum,
        noteColor
      );
      
      // Add a subtle scale effect for notes approaching the hit line
      const distanceToHitLine = 5 - position[2];
      if (distanceToHitLine > 0 && distanceToHitLine < 3) {
        // Scale up slightly as notes approach hit line (without changing z-scale)
        const scaleFactor = 1 + Math.min(distanceToHitLine / 6, 0.1);
        meshRef.current.scale.set(scaleFactor, scaleFactor, 1);
      } else {
        // Keep normal scale
        meshRef.current.scale.set(1, 1, 1);
      }
    }
  });
  
  // Calculate visual parameters for rendering
  const {
    pulseFactor,
    isCloseToHitLine,
    visualEmphasis,
    isDistant,
    noteColor,
    shadowOpacity,
    trailLength,
    showTrail,
    trailColor
  } = calculateNoteVisualParams(position, lane, hit);
  
  // Calculate Z length for note depth
  const zLength = calculateZLength(bpm);

  // Prepare component pieces
  const trailComponent = showTrail ? (
    renderNoteTrail({
      position,
      lane,
      trailLength,
      trailColor
    })
  ) : null;
  
  const shadowComponent = (shadowOpacity > 0.02 && !hit) ? (
    renderNoteShadow({
      position,
      lane,
      shadowOpacity
    })
  ) : null;

  return (
    <group>
      {trailComponent}
      <mesh position={position} ref={meshRef} castShadow>
        {renderDrumNote({
          lane,
          zLength,
          pulseFactor,
          visualEmphasis,
          noteColor,
          isCloseToHitLine,
          isDistant,
          hit
        })}
      </mesh>
      {shadowComponent}
    </group>
  );
}; 