import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { NoteHighwayCanvasProps } from './NoteHighwayCanvas.types';
import { CanvasContainer } from './NoteHighwayCanvas.styles';

/**
 * NoteHighwayCanvas component renders a Three.js canvas for the rhythm game note highway.
 * This canvas serves as the container for all gameplay visualization elements.
 */
export const NoteHighwayCanvas: React.FC<NoteHighwayCanvasProps> = ({
  width = window.innerWidth,
  height = window.innerHeight * 0.8,
  children
}) => {
  // Canvas container ref for responsive sizing
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <CanvasContainer 
      ref={containerRef}
      width={width}
      height={height}
    >
      <Canvas
        shadows
        dpr={[1, 2]} // Dynamic pixel ratio for performance
        gl={{ antialias: true, alpha: false }}
      >
        {/* Default camera setup - adjusted to better see the note highway */}
        <PerspectiveCamera 
          makeDefault 
          position={[0, 5, 10]} 
          fov={75}
          near={0.1}
          far={1000}
        />
        
        {/* Enhanced lighting setup with proper intensity */}
        <ambientLight intensity={2.0} />
        <directionalLight 
          position={[10, 10, 10]} 
          intensity={2.0} 
          castShadow 
        />
        <pointLight position={[-10, 10, -10]} intensity={1.5} />
        <hemisphereLight 
          intensity={2.0}
          color="#ffffff"
          groundColor="#000000"
        />
        
        {/* Camera controls with better defaults */}
        <OrbitControls 
          enableZoom={true}
          enablePan={true}
          minPolarAngle={Math.PI / 8}
          maxPolarAngle={Math.PI / 2.5}
          target={[0, 0, -10]}
        />
        
        {/* Debug shapes to verify rendering */}
        <mesh position={[0, 0, -10]} scale={[3, 3, 3]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="hotpink" emissive="hotpink" emissiveIntensity={0.5} />
        </mesh>
        
        <mesh position={[-5, 0, -10]}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="cyan" emissive="cyan" emissiveIntensity={0.5} />
        </mesh>
        
        <mesh position={[5, 0, -10]}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="yellow" emissive="yellow" emissiveIntensity={0.5} />
        </mesh>
        
        {/* Grid for reference */}
        <gridHelper args={[50, 50, '#666666', '#444444']} position={[0, -2, 0]} rotation={[0, 0, 0]} />
        
        {/* Scene background */}
        <color attach="background" args={['#111']} />
        
        {/* Add note highway elements as children */}
        {children}
      </Canvas>
    </CanvasContainer>
  );
}; 