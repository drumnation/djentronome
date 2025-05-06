import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Canvas } from '@react-three/fiber';
import { AnimatedTestElement } from './index';

const meta: Meta<typeof AnimatedTestElement> = {
  title: 'gameplay/NoteHighwayCanvas/AnimatedTestElement',
  component: AnimatedTestElement,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', height: '500px' }}>
        <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <Story />
        </Canvas>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AnimatedTestElement>;

export const Default: Story = {
  args: {},
};

export const WithCustomCamera: Story = {
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: '100%', height: '500px' }}>
        <Canvas camera={{ position: [0, 8, 12], fov: 45 }}>
          <ambientLight intensity={0.7} />
          <Story />
        </Canvas>
      </div>
    ),
  ],
}; 