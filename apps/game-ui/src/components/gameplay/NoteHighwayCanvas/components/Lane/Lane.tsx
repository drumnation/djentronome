import { Text } from '@react-three/drei';
import { LaneProps } from './Lane.types';
import { getDrumLaneColor, getLaneLabel } from './Lane.logic';

/**
 * Component to render a lane on the note highway
 */
export const Lane = ({ position, width, length, lane }: LaneProps) => {
  return (
    <group>
      {/* Main lane */}
      <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial 
          color={getDrumLaneColor(lane)} 
          roughness={0.7}
          metalness={0.2}
          emissive={getDrumLaneColor(lane)}
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Lane borders - slightly brighter than the lane */}
      <mesh position={[position[0] - width/2 - 0.05, position[1], position[2]]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[0.1, length]} />
        <meshStandardMaterial 
          color="#444444" 
          emissive={getDrumLaneColor(lane)}
          emissiveIntensity={0.2}
        />
      </mesh>
      
      <mesh position={[position[0] + width/2 + 0.05, position[1], position[2]]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[0.1, length]} />
        <meshStandardMaterial 
          color="#444444" 
          emissive={getDrumLaneColor(lane)}
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Lane label near the hit line */}
      <mesh position={[position[0], position[1] + 0.1, 4]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width - 0.2, 1]} />
        <meshBasicMaterial 
          color={getDrumLaneColor(lane)} 
          opacity={0.7} 
          transparent={true}
        />
      </mesh>
      
      {/* Text label for the drum type */}
      <Text
        position={[position[0], position[1] + 0.12, 6]}
        rotation={[0, 0, 0]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {getLaneLabel(lane)}
      </Text>
    </group>
  );
}; 