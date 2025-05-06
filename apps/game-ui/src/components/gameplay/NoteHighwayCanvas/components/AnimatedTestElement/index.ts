// Export types only, don't re-export components to prevent circular dependency
export type { AnimatedTestElementProps } from './AnimatedTestElement.types';
// Also export the component for stories
export { AnimatedTestElementComponent as AnimatedTestElement } from './AnimatedTestElement'; 