import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh, Material } from 'three';
import { TempoGridProps } from './TempoGrid.types';
import { 
  calculateLineSpacing, 
  generateGridLinePositions, 
  updateGridLinePosition,
  calculateGridLineOpacity
} from './TempoGrid.logic';

export const useTempoGrid = ({ 
  bpm, 
  lines = 24, 
  length = 40
}: TempoGridProps) => {
  const groupRef = useRef<Group>(null);
  const gridLinesRef = useRef<(Mesh | null)[]>([]);
  const scrollTimeRef = useRef(0);
  
  // Calculate distance between lines based on BPM and note speed
  const lineSpacing = useMemo(() => calculateLineSpacing(bpm), [bpm]);
  
  // Pre-calculate positions for beat and sub-beat lines
  const gridLinePositions = useMemo(() => 
    generateGridLinePositions(lines, length, lineSpacing), 
    [lines, length, lineSpacing]
  );
  
  // Set up frame animation
  useFrame((_, delta) => {
    scrollTimeRef.current += delta;
    
    if (groupRef.current) {
      // Move all grid lines based on scrolling speed
      gridLinesRef.current.forEach((line, index) => {
        if (line && index < gridLinePositions.length) {
          const gridPos = gridLinePositions[index];
          
          // Make sure gridPos exists before using it
          if (gridPos) {
            // Update position
            const wrappedZ = updateGridLinePosition(gridPos, scrollTimeRef.current, length);
            line.position.z = wrappedZ;
            
            // Calculate opacity based on distance to hit line
            const distToHitLine = 5 - wrappedZ;
            const material = line.material as Material;
            calculateGridLineOpacity(
              material,
              distToHitLine,
              gridPos.isMeasureLine,
              gridPos.isSubBeatLine
            );
          }
        }
      });
    }
  });
  
  return {
    groupRef,
    gridLinesRef,
    gridLinePositions
  };
}; 