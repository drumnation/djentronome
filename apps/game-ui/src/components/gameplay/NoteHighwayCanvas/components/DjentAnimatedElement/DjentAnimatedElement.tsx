import { useFrame } from '@react-three/fiber';
import { useDjentAnimation } from './DjentAnimatedElement.hook';
import { DjentAnimatedElementProps } from './DjentAnimatedElement.types';
import { Note as NoteComponent } from '../Note';
import {
  Highway,
  LaneDividers,
  HitLine,
  LaneLabels,
  Instructions,
  Lighting,
  HitEffects
} from './sub-components';

/**
 * A dynamic drum pattern visualization that follows djent metal patterns
 * with enhanced visual separation for clarity at high BPM
 */
export const DjentAnimatedElement = (props: DjentAnimatedElementProps) => {
  const {
    // State
    time,
    currentPattern,
    currentBpm,
    notes,
    hitEffects,
    fontProps,
    
    // Refs
    highwayRef,
    hitLineRef,
    hitRingRefs,
    
    // Animation handlers
    handleAnimationFrame,
    updateHitLine,
    updateHighway,
    updateHitRings
  } = useDjentAnimation(props);
  
  // Update time and animate
  useFrame((_, delta) => {
    // Run the animation frame handler from the hook
    handleAnimationFrame(delta);
    
    // Update all animated elements
    updateHitLine();
    updateHighway();
    updateHitRings();
  });
  
  return (
    <>
      {/* Main visualization elements */}
      <Highway highwayRef={highwayRef} />
      <LaneDividers time={time} />
      <HitLine time={time} hitLineRef={hitLineRef} hitRingRefs={hitRingRefs} />
      <Lighting time={time} />
      
      {/* UI Elements */}
      <LaneLabels fontProps={fontProps} />
      <Instructions 
        currentPattern={currentPattern}
        currentBpm={currentBpm}
        fontProps={fontProps}
      />
      
      {/* Dynamic elements */}
      {notes.map((note) => (
        <NoteComponent 
          key={note.id} 
          position={note.position} 
          lane={note.lane} 
          hit={note.hit} 
          bpm={currentBpm}
        />
      ))}
      <HitEffects time={time} hitEffects={hitEffects} />
    </>
  );
}; 