import { Text } from '@react-three/drei';

interface LaneLabelsProps {
  fontProps: {
    fontWeight: number;
    letterSpacing: number;
    lineHeight: number;
    'material-toneMapped': boolean;
  };
}

export const LaneLabels = ({ fontProps }: LaneLabelsProps) => {
  return (
    <group position={[0, 0, 6]}>
      <Text
        position={[-3, 0.3, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.3}
        color="#ffcc00"
        anchorX="center"
        anchorY="middle"
        fontWeight={fontProps.fontWeight}
        letterSpacing={fontProps.letterSpacing}
        lineHeight={fontProps.lineHeight}
        material-toneMapped={fontProps['material-toneMapped']}
      >
        CYMBAL
      </Text>
      
      <Text
        position={[-1, 0.3, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.3}
        color="#ff4400"
        anchorX="center"
        anchorY="middle"
        fontWeight={fontProps.fontWeight}
        letterSpacing={fontProps.letterSpacing}
        lineHeight={fontProps.lineHeight}
        material-toneMapped={fontProps['material-toneMapped']}
      >
        SNARE
      </Text>
      
      <Text
        position={[1, 0.3, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.3}
        color="#0044ff"
        anchorX="center"
        anchorY="middle"
        fontWeight={fontProps.fontWeight}
        letterSpacing={fontProps.letterSpacing}
        lineHeight={fontProps.lineHeight}
        material-toneMapped={fontProps['material-toneMapped']}
      >
        L KICK
      </Text>
      
      <Text
        position={[3, 0.3, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.3}
        color="#00cc44"
        anchorX="center"
        anchorY="middle"
        fontWeight={fontProps.fontWeight}
        letterSpacing={fontProps.letterSpacing}
        lineHeight={fontProps.lineHeight}
        material-toneMapped={fontProps['material-toneMapped']}
      >
        R KICK
      </Text>
    </group>
  );
}; 