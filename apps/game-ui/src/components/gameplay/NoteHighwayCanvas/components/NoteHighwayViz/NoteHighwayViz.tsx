import React from 'react';
import { RhythmNote } from '../RhythmNote';
import { useNoteHighwayViz } from './NoteHighwayViz.hook';
import { NoteHighwayVizProps } from './NoteHighwayViz.types';
import type { Note } from '../../NoteHighwayCanvas.types';

/**
 * Main visualization component for the drum highway
 * Uses consistent, readable note visualization based on rhythm game principles
 */
export const NoteHighwayViz: React.FC<NoteHighwayVizProps> = ({ 
  bpm = 120 
}) => {
  // Get state from hook
  const { notes } = useNoteHighwayViz();
  
  return (
    <group>
      {/* Render all notes using the optimized RhythmNote component */}
      {notes.map((note: Note) => (
        <RhythmNote
          key={note.id}
          position={note.position}
          lane={note.lane}
          hit={note.hit}
          bpm={bpm}
        />
      ))}
      
      {/* Hit judgment line */}
      <mesh position={[0, 0.01, 5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 0.4]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
      </mesh>
      
      {/* Note highway - dark floor with subtle grid */}
      <mesh position={[0, 0, -25]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 70]} />
        <meshStandardMaterial 
          color="#111122"
          metalness={0.8}
          roughness={0.4}
        />
      </mesh>
      
      {/* Lane dividers */}
      {[-3, -1, 1, 3].map((x, i) => (
        <mesh key={i} position={[x, 0.02, -25]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.05, 70]} />
          <meshBasicMaterial color="#333344" transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}; 