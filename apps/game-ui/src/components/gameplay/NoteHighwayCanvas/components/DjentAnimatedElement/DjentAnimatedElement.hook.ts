import { useState, useRef, useEffect } from 'react';
import type { Mesh, Material } from 'three';
import { 
  createHitEffectParticles, 
  createInitialNotes, 
  createNewNotes,
  getNextPatternConfig
} from './DjentAnimatedElement.logic';
import { 
  Note, 
  HitEffect, 
  DjentAnimatedElementProps,
  PatternChangeConfig
} from './DjentAnimatedElement.types';

// Type for material with emissive properties
interface EmissiveMaterial extends Material {
  emissiveIntensity: number;
}

export const useDjentAnimation = ({ 
  initialPattern = 'intro', 
  initialBpm = 166,
  noteSpawnRate = 2
}: DjentAnimatedElementProps) => {
  // State for animations
  const [time, setTime] = useState(0);
  const [lastHit, setLastHit] = useState<number | null>(null);
  const [missedInput, setMissedInput] = useState<number | null>(null);
  const [currentPattern, setCurrentPattern] = useState<string>(initialPattern);
  const [currentBpm, setCurrentBpm] = useState<number>(initialBpm);
  
  // Initialize notes based on the djent pattern
  const [notes, setNotes] = useState<Note[]>(() => createInitialNotes(initialPattern));
  
  // Hit effect tracking state
  const [hitEffects, setHitEffects] = useState<HitEffect[]>([]);
  
  // Refs for animated meshes
  const highwayRef = useRef<Mesh>(null);
  const hitLineRef = useRef<Mesh>(null);
  const hitRingRefs = useRef<Mesh[]>([]);
  
  // Beat counter for pattern changes and visualization
  const beatCountRef = useRef(0);
  const totalMeasuresRef = useRef(0);
  const nextPatternChangeRef = useRef(16); // Change pattern after 16 beats (4 measures)
  const spawnTimerRef = useRef(0); // Timer for spawning new notes

  // Dynamic font loading for tech-style text
  const fontProps = { 
    letterSpacing: 0.1,
    lineHeight: 1,
    fontWeight: 700, // Bold text
    'material-toneMapped': false
  };
  
  // Set up keypress detection for simulating hits
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Map keys to lanes
      const keyMap: Record<string, number> = {
        'd': 0, // yellow lane - cymbal
        'f': 1, // red lane - snare
        'j': 2, // blue lane - left kick
        'k': 3  // green lane - right kick
      };
      
      const lane = keyMap[e.key.toLowerCase()];
      if (lane !== undefined) {
        // Check if any note is in the hit zone (z between 4.5 and 5.5)
        const noteInZone = notes.find(note => 
          note.lane === lane && 
          note.position[2] >= 4.5 && 
          note.position[2] <= 5.5 &&
          !note.hit
        );
        
        if (noteInZone) {
          // Good hit - mark note as hit
          setNotes(prev => prev.map(note => 
            note.id === noteInZone.id ? { ...note, hit: true } : note
          ));
          
          // Generate particles for explosion effect
          const particles = createHitEffectParticles();
          
          // Add a new hit effect with unique ID and particles
          setHitEffects(prev => [...prev, { 
            id: `hit-${lane}-${Date.now()}`, 
            lane, 
            startTime: time,
            particles
          }]);
          
          setLastHit(lane);
          setTimeout(() => setLastHit(null), 300);
        } else {
          // Missed hit
          setMissedInput(lane);
          setTimeout(() => setMissedInput(null), 300);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [notes, time]);
  
  // Function to handle animation frame updates
  const handleAnimationFrame = (delta: number) => {
    // Update time
    setTime(prev => prev + delta);
    spawnTimerRef.current += delta;
    
    // Calculate beat position based on current BPM
    const secondsPerBeat = 60 / currentBpm;
    const currentBeat = time / secondsPerBeat;
    
    // Check if we should change patterns
    if (currentBeat >= nextPatternChangeRef.current && nextPatternChangeRef.current > 0) {
      // Get next pattern configuration
      const nextConfig: PatternChangeConfig = getNextPatternConfig(currentPattern);
      
      // Update pattern and BPM
      setCurrentPattern(nextConfig.nextPattern);
      setCurrentBpm(nextConfig.nextBpm);
      nextPatternChangeRef.current = currentBeat + nextConfig.nextChangeDelay;
      
      // Update total measures count
      totalMeasuresRef.current += 8;
    }
    
    // Update beat counter for visualization
    beatCountRef.current = currentBeat % 4;
    
    // Move notes toward the hit line
    setNotes(prev => prev.map(note => {
      if (note.hit || note.position[2] > 15) {
        // Note is already hit or past the player, keep it as is
        return note;
      }
      
      // Move at a constant speed of 5 units per second
      const newZPos = note.position[2] + delta * 5;
      return {
        ...note,
        position: [note.position[0], note.position[1], newZPos]
      };
    }));
    
    // Remove notes that are too far past the player OR have been hit for more than 0.5 seconds
    if (notes.length > 0) {
      setNotes(prev => prev.filter(note => {
        // Remove notes that are past the player
        if (note.position[2] >= 15) return false;
        
        // Remove hit notes after 0.5 seconds
        if (note.hit) {
          // Find when the note was hit
          const hitEffect = hitEffects.find(effect => effect.lane === note.lane);
          if (hitEffect) {
            const timeSinceHit = time - hitEffect.startTime;
            // Keep note during animation, then remove it
            return timeSinceHit <= 0.5;
          }
        }
        
        // Keep all non-hit notes
        return true;
      }));
    }
    
    // Spawn new notes based on the rate
    if (spawnTimerRef.current > noteSpawnRate) {
      spawnTimerRef.current = 0;
      
      // Generate and add new notes
      const newNotes = createNewNotes(currentPattern);
      if (newNotes.length > 0) {
        setNotes(prev => [...prev, ...newNotes]);
      }
    }
    
    // Hit effects management
    if (hitEffects.length > 0) {
      const currentTime = time; // Capture current time for consistent filtering
      
      // Update particle positions and properties
      setHitEffects(prev => 
        prev.map(effect => {
          const effectAge = currentTime - effect.startTime;
          
          // Update each particle in the effect
          const updatedParticles = effect.particles.map(particle => {
            // Apply gravity and update position
            const updatedParticle = {
              ...particle,
              x: particle.x + particle.vx * delta,
              y: particle.y + particle.vy * delta - 1.0 * delta * delta, // Add gravity
              z: particle.z + particle.vz * delta,
              vy: particle.vy - 1.0 * delta, // Reduce upward velocity due to gravity
              opacity: particle.opacity * (1 - effectAge) // Fade out over time
            };
            
            return updatedParticle;
          });
          
          return {
            ...effect,
            particles: updatedParticles
          };
        })
        .filter(effect => {
          // Keep only effects that are less than 0.6 seconds old
          const effectAge = currentTime - effect.startTime;
          return effectAge < 0.6;
        })
      );
    }
  };
  
  // Animation update functions
  const updateHitLine = () => {
    if (hitLineRef.current) {
      if (lastHit !== null) {
        // Pulse when a note is hit
        const scale = 1.0 + Math.sin(time * 8) * 0.08;
        hitLineRef.current.scale.set(scale, 1.2, 1);
        
        // Material glow pulse
        const material = hitLineRef.current.material as EmissiveMaterial;
        if (material && 'emissiveIntensity' in material) {
          material.emissiveIntensity = 0.8 + Math.sin(time * 8) * 0.4;
        }
      } else {
        // Subtle downbeat emphasis when not hit
        const onBeat = beatCountRef.current < 0.2 || (beatCountRef.current > 3.8 && beatCountRef.current < 4);
        const scale = onBeat ? 1.05 : 1.0 + Math.sin(time * 3) * 0.02;
        hitLineRef.current.scale.set(scale, onBeat ? 1.1 : 1, 1);
        
        // Material subtle glow
        const material = hitLineRef.current.material as EmissiveMaterial;
        if (material && 'emissiveIntensity' in material) {
          material.emissiveIntensity = onBeat ? 0.7 : 0.4 + Math.sin(time * 3) * 0.1;
        }
      }
    }
  };
  
  const updateHighway = () => {
    if (highwayRef.current) {
      // Add subtle wave effect to highway
      const highwayMaterial = highwayRef.current.material as EmissiveMaterial;
      if (highwayMaterial && 'emissiveIntensity' in highwayMaterial) {
        // Emphasize downbeats in the measure
        const onBeat = beatCountRef.current < 0.2 || (beatCountRef.current > 3.8 && beatCountRef.current < 4);
        highwayMaterial.emissiveIntensity = onBeat ? 0.3 : 0.1 + Math.sin(time * 2) * 0.05;
      }
    }
  };
  
  const updateHitRings = () => {
    hitRingRefs.current.forEach((ring, i) => {
      if (ring) {
        // Subtle pulsing animation
        const pulseFactor = 1.0 + Math.sin(time * 2 + i * 0.5) * 0.05;
        ring.scale.set(pulseFactor, pulseFactor, 1);
        
        // Enhanced glow when hit
        const material = ring.material as EmissiveMaterial;
        if (material && 'emissiveIntensity' in material) {
          // Default pulse
          let intensity = 0.4 + Math.sin(time * 2 + i) * 0.1;
          
          // Boost intensity when hit
          if (lastHit === i) {
            intensity = 1.0;
            // Flash effect
            ring.scale.set(1.2, 1.2, 1);
          }
          
          // Dim when missed
          if (missedInput === i) {
            intensity = 0.2;
            // Subtle shake effect
            ring.position.x += Math.sin(time * 20) * 0.02;
          } else {
            ring.position.x = (i - 1.5) * 2; // Reset position
          }
          
          material.emissiveIntensity = intensity;
        }
      }
    });
  };
  
  // Return values and refs needed by the component
  return {
    // State
    time,
    lastHit,
    missedInput,
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
  };
}; 