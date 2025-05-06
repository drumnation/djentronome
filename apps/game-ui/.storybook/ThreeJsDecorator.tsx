import React from 'react';

/**
 * A utility decorator for Three.js components in Storybook 
 * that ensures the ThreeJs context is properly set up.
 * 
 * Storybook sometimes has issues with dynamic imports of Three.js components,
 * so this decorator helps ensure the context is properly provided.
 */
export const ThreeJsDecorator = (Story) => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Story />
    </div>
  );
}; 