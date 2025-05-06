import { Text } from '@react-three/drei';
import { TimingFeedbackProps } from './TimingFeedback.types';
import { useTimingFeedback } from './TimingFeedback.hook';

/**
 * Component to render timing feedback for hit notes
 */
export const TimingFeedback = ({ position, accuracy, createdAt, id }: TimingFeedbackProps) => {
  const { opacity, color, text } = useTimingFeedback(id, accuracy, createdAt);
  
  return (
    <Text
      position={[position[0], position[1] + 1, position[2]]}
      fontSize={0.4}
      color={color}
      anchorX="center"
      anchorY="middle"
      material-opacity={opacity}
      material-transparent={true}
    >
      {text}
    </Text>
  );
}; 