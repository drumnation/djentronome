import React from 'react';
import { TempoGridProps } from './TempoGrid.types';
import { useTempoGrid } from './TempoGrid.hook';

/**
 * Component that renders a grid of horizontal tempo lines to visualize beats
 */
export const TempoGrid: React.FC<TempoGridProps> = ({ 
  bpm, 
  lines = 24,
  width = 10, 
  length = 40,
  color = '#333333'
}) => {
  const { groupRef, gridLinesRef, gridLinePositions } = useTempoGrid({ 
    bpm, 
    lines, 
    length 
  });
  
  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {gridLinePositions.map((grid, index) => (
        <mesh 
          key={`grid-${index}`}
          position={grid.position}
          rotation={[-Math.PI / 2, 0, 0]}
          ref={(el) => {
            if (el) gridLinesRef.current[index] = el;
          }}
        >
          <planeGeometry args={[
            width, 
            grid.isMeasureLine ? 0.2 : (grid.isSubBeatLine ? 0.1 : 0.05)
          ]} />
          <meshBasicMaterial 
            color={grid.isMeasureLine ? '#666666' : (grid.isSubBeatLine ? '#444444' : color)} 
            transparent={true} 
            opacity={grid.isMeasureLine ? 0.7 : (grid.isSubBeatLine ? 0.4 : 0.2)}
            depthWrite={false}
          />
        </mesh>
      ))}
      
      {/* Hit line indicator - more prominent */}
      <mesh position={[0, 0.01, 5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, 0.3]} />
        <meshBasicMaterial color="#aaaaaa" transparent={true} opacity={0.8} />
      </mesh>
    </group>
  );
}; 