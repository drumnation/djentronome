interface LightingProps {
  time: number;
}

export const Lighting = ({ time }: LightingProps) => {
  return (
    <group>
      {/* Overhead rig beams */}
      <mesh position={[0, 6, -10]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.2, 14, 0.2]} />
        <meshStandardMaterial color="#222" metalness={0.9} roughness={0.2} />
      </mesh>
      
      <mesh position={[0, 6, -20]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.2, 14, 0.2]} />
        <meshStandardMaterial color="#222" metalness={0.9} roughness={0.2} />
      </mesh>
      
      {/* Enhanced spotlight cones - better positioned for note visibility */}
      <spotLight 
        position={[-6, 8, -8]} 
        angle={0.3}
        penumbra={0.7}
        intensity={0.8 + Math.sin(time * 0.5) * 0.2}
        color="#ff3030"
        castShadow
        target-position={[-3, 0, 0]} // Target left side of highway
      />
      
      <spotLight 
        position={[6, 8, -8]} 
        angle={0.3}
        penumbra={0.7}
        intensity={0.6 + Math.sin(time * 0.7) * 0.2}
        color="#3030ff"
        castShadow
        target-position={[3, 0, 0]} // Target right side of highway
      />
      
      {/* New - directional key light for better note shading */}
      <directionalLight
        position={[-5, 10, 10]}
        intensity={0.7}
        color="#ffffff"
        castShadow
      />
      
      {/* Distant wall ambient lights */}
      <pointLight 
        position={[-12, 2, -40]} 
        intensity={0.3 + Math.sin(time * 0.4) * 0.1} 
        color="#550000"
        distance={40}
        decay={2}
      />
      
      <pointLight 
        position={[12, 2, -40]} 
        intensity={0.3 + Math.cos(time * 0.3) * 0.1} 
        color="#000055"
        distance={40}
        decay={2}
      />
      
      {/* Add overhead light for better visibility */}
      <pointLight position={[0, 10, 0]} intensity={0.7} color="#ffffff" />
    </group>
  );
}; 