import { Text } from '@react-three/drei';
import { Mesh } from 'three';
import { useAnimatedTestElement } from './AnimatedTestElement.hook';
import { AnimatedTestElementProps } from './AnimatedTestElement.types';

/**
 * Simple animated element for testing the NoteHighwayCanvas
 */
export const AnimatedTestElementComponent = ({ children }: AnimatedTestElementProps) => {
  const { state, refs, fontProps, lanes } = useAnimatedTestElement();
  
  return (
    <>
      {/* Highway floor with improved metal texture and gradient */}
      <mesh 
        ref={refs.highwayRef}
        position={[0, 0, 0]} 
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[12, 50]} />
        <meshStandardMaterial 
          color="#222" 
          metalness={0.8} 
          roughness={0.4}
          emissive="#111"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Grid overlay */}
      <gridHelper 
        args={[12, 24, "#333", "#222"]} 
        position={[0, 0.01, -15]} 
        rotation={[Math.PI / 2, 0, 0]}
      />
      
      {/* Depth gradient overlay */}
      <mesh position={[0, 0.01, -20]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 30]} />
        <meshBasicMaterial
          color="#000" 
          transparent
          opacity={0.5}
          depthWrite={false}
          blending={2} // AdditiveBlending
        />
      </mesh>
      
      {/* Lane dividers */}
      {[-3, -1, 1, 3].map((x, i) => (
        <group key={i}>
          {/* Main lane divider */}
          <mesh position={[x, 0.05, -15]} receiveShadow castShadow>
            <boxGeometry args={[0.08, 0.15, 40]} />
            <meshStandardMaterial 
              color="#444" 
              emissive="#555"
              emissiveIntensity={0.5 + Math.sin(state.time * (1 + i * 0.2)) * 0.2}
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
          
          {/* Shadow beneath the lane divider */}
          <mesh position={[x, 0.01, -15]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.4, 40]} />
            <meshBasicMaterial 
              color="#000" 
              transparent 
              opacity={0.4}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}
      
      {/* Hit line zone */}
      <group position={[0, 0.05, 5]}>
        {/* Main hit line */}
        <mesh ref={refs.hitLineRef} receiveShadow>
          <boxGeometry args={[12, 0.2, 0.3]} />
          <meshStandardMaterial 
            color="#222222" 
            emissive="#444444" 
            emissiveIntensity={0.4}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        
        {/* Hit zone indicators at each lane */}
        {lanes.map((lane, i) => {
          // Create a ref for this hit ring
          const ringRef = (el: Mesh) => {
            refs.hitRingRefs.current[i] = el;
          };
          
          return (
            <mesh 
              key={i} 
              ref={ringRef}
              position={[lane.x, 0.2, 0]} 
              castShadow 
              receiveShadow
            >
              <ringGeometry args={[0.4, 0.6, 24]} />
              <meshStandardMaterial 
                color={lane.color}
                emissive={lane.color}
                emissiveIntensity={0.4 + Math.sin(state.time * 2 + i) * 0.1}
                transparent
                opacity={0.8}
              />
            </mesh>
          );
        })}
      </group>
      
      {/* Animated test notes */}
      <group>
        {/* Yellow cymbal note */}
        <group>
          <mesh 
            ref={refs.yellowNoteRef} 
            position={[-3, 1, -10]} 
            castShadow
          >
            <cylinderGeometry args={[0.5, 0.5, 0.3, 32]} />
            <meshStandardMaterial 
              color="#ffcc00" 
              emissive="#ffcc00" 
              emissiveIntensity={0.5} 
              metalness={0.7} 
              roughness={0.2} 
            />
          </mesh>
          
          {/* Note shadow on highway */}
          <mesh position={[-3, 0.02, -10]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.6, 16]} />
            <meshBasicMaterial 
              color="#ffcc00" 
              transparent 
              opacity={0.25}
              depthWrite={false}
            />
          </mesh>
          
          {/* Trailing effect */}
          <mesh position={[-3, 1, -10.5]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.9, 2.0]} />
            <meshBasicMaterial 
              color="#ffcc00" 
              transparent 
              opacity={0.3}
              depthWrite={false}
            />
          </mesh>
        </group>
        
        {/* Red snare note */}
        <group>
          <mesh 
            ref={refs.redNoteRef} 
            position={[-1, 1, -15]} 
            castShadow
          >
            <cylinderGeometry args={[0.5, 0.5, 0.3, 6]} />
            <meshStandardMaterial 
              color="#ff4400" 
              emissive="#ff4400" 
              emissiveIntensity={0.5} 
              metalness={0.7} 
              roughness={0.2} 
            />
          </mesh>
          
          {/* Note shadow on highway */}
          <mesh position={[-1, 0.02, -15]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.6, 6]} />
            <meshBasicMaterial 
              color="#ff4400" 
              transparent 
              opacity={0.25}
              depthWrite={false}
            />
          </mesh>
          
          {/* Trailing effect */}
          <mesh position={[-1, 1, -15.5]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.9, 2.0]} />
            <meshBasicMaterial 
              color="#ff4400" 
              transparent 
              opacity={0.3}
              depthWrite={false}
            />
          </mesh>
        </group>
        
        {/* Blue kick note */}
        <group>
          <mesh 
            ref={refs.blueNoteRef} 
            position={[1, 1, -20]} 
            castShadow
          >
            <boxGeometry args={[0.8, 0.8, 0.8]} />
            <meshStandardMaterial 
              color="#0044ff" 
              emissive="#0044ff" 
              emissiveIntensity={0.5} 
              metalness={0.7} 
              roughness={0.2} 
            />
          </mesh>
          
          {/* Note shadow on highway */}
          <mesh position={[1, 0.02, -20]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.9, 0.9]} />
            <meshBasicMaterial 
              color="#0044ff" 
              transparent 
              opacity={0.25}
              depthWrite={false}
            />
          </mesh>
          
          {/* Trailing effect */}
          <mesh position={[1, 1, -20.5]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.9, 2.0]} />
            <meshBasicMaterial 
              color="#0044ff" 
              transparent 
              opacity={0.3}
              depthWrite={false}
            />
          </mesh>
        </group>
        
        {/* Green kick note */}
        <group>
          <mesh 
            ref={refs.greenNoteRef} 
            position={[3, 1, -25]} 
            castShadow
          >
            <boxGeometry args={[0.8, 0.8, 0.8]} />
            <meshStandardMaterial 
              color="#00cc44" 
              emissive="#00cc44" 
              emissiveIntensity={0.5} 
              metalness={0.7} 
              roughness={0.2} 
            />
          </mesh>
          
          {/* Note shadow on highway */}
          <mesh position={[3, 0.02, -25]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.9, 0.9]} />
            <meshBasicMaterial 
              color="#00cc44" 
              transparent 
              opacity={0.25}
              depthWrite={false}
            />
          </mesh>
          
          {/* Trailing effect */}
          <mesh position={[3, 1, -25.5]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.9, 2.0]} />
            <meshBasicMaterial 
              color="#00cc44" 
              transparent 
              opacity={0.3}
              depthWrite={false}
            />
          </mesh>
        </group>
      </group>
      
      {/* Lane labels */}
      <group position={[0, 0, 6]}>
        {lanes.map((lane, i) => (
          <Text
            key={i}
            position={[lane.x, 0.3, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.3}
            color={lane.color}
            anchorX="center"
            anchorY="middle"
            fontWeight={fontProps.fontWeight}
            letterSpacing={fontProps.letterSpacing}
            lineHeight={fontProps.lineHeight}
            material-toneMapped={fontProps['material-toneMapped']}
          >
            {lane.name}
          </Text>
        ))}
      </group>
      
      {/* Instructions text */}
      <group position={[0, 2, 8]}>
        {/* Semi-transparent background */}
        <mesh position={[0, 0, -0.1]}>
          <planeGeometry args={[7, 1.2]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.6} />
        </mesh>
        
        <Text
          position={[0, 0, 0]}
          fontSize={0.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          fontWeight={fontProps.fontWeight}
          letterSpacing={fontProps.letterSpacing}
          lineHeight={fontProps.lineHeight}
          material-toneMapped={fontProps['material-toneMapped']}
        >
          Press [ D ]  [ F ]  [ J ]  [ K ] to hit notes
        </Text>
      </group>
      
      {/* Add overhead light for better visibility */}
      <pointLight position={[0, 10, 0]} intensity={0.7} color="#ffffff" />
      
      {children}
    </>
  );
}; 