import { Text } from '@react-three/drei';

interface InstructionsProps {
  currentPattern: string;
  currentBpm: number;
  fontProps: {
    fontWeight: number;
    letterSpacing: number;
    lineHeight: number;
    'material-toneMapped': boolean;
  };
}

export const Instructions = ({ currentPattern, currentBpm, fontProps }: InstructionsProps) => {
  return (
    <group position={[0, 2, 8]}>
      {/* Semi-transparent background for better readability */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[7, 1.5]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.6} />
      </mesh>
      
      <Text
        position={[0, 0.2, 0]}
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
      
      <Text
        position={[0, -0.4, 0]}
        fontSize={0.3}
        color="#aaaaaa"
        anchorX="center"
        anchorY="middle"
        fontWeight={fontProps.fontWeight}
        letterSpacing={fontProps.letterSpacing}
        lineHeight={fontProps.lineHeight}
        material-toneMapped={fontProps['material-toneMapped']}
      >
        {`Current Pattern: ${currentPattern.toUpperCase()} @ ${currentBpm} BPM`}
      </Text>
    </group>
  );
}; 