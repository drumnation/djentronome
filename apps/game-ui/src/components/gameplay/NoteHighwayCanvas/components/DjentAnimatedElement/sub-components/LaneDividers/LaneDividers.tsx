interface LaneDividersProps {
  time: number;
}

export const LaneDividers = ({ time }: LaneDividersProps) => {
  return (
    <>
      {/* Lane dividers - enhanced glowing rods with better shadows */}
      {[-3, -1, 1, 3].map((x, i) => (
        <group key={i}>
          {/* Main glowing lane divider */}
          <mesh position={[x, 0.05, -15]} receiveShadow castShadow>
            <boxGeometry args={[0.08, 0.15, 40]} />
            <meshStandardMaterial 
              color="#444" 
              emissive="#555"
              emissiveIntensity={0.5 + Math.sin(time * (1 + i * 0.2)) * 0.2}
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
          
          {/* Enhanced shadow beneath the lane divider */}
          <mesh position={[x, 0.01, -15]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.4, 40]} /> {/* Wider shadow */}
            <meshBasicMaterial 
              color="#000" 
              transparent 
              opacity={0.4} // Increased opacity
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}
    </>
  );
}; 