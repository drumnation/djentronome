import { AnimatedTestElementComponent } from './AnimatedTestElement';
import { AnimatedTestElementProps } from './AnimatedTestElement.types';

// Create a component that uses our implementation component
const InternalComponent = (props: AnimatedTestElementProps) => {
  return <AnimatedTestElementComponent {...props} />;
};

export default InternalComponent; 