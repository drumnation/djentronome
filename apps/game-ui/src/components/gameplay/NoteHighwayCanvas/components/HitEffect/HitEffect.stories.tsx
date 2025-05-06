import React from 'react';
import { StoryObj, Meta } from '@storybook/react';
import { Canvas } from '@react-three/fiber';
import { HitEffect } from './HitEffect';
import { HitEffectData } from './HitEffect.types';

// Mock data for the stories
const mockHitEffect: HitEffectData = {
  id: 'hit-effect-1',
  position: [0, 0, 0],
  color: '#ff0000',
  createdAt: Date.now() / 1000
};

// Add the 'Canvas' wrapper since we are working with R3F
const R3FCanvas = (Story: React.ComponentType) => (
  <Canvas style={{ width: '100%', height: '400px' }}>
    <ambientLight intensity={0.8} />
    <Story />
  </Canvas>
);

const meta: Meta<typeof HitEffect> = {
  title: 'Gameplay/NoteHighway/HitEffect',
  component: HitEffect,
  decorators: [R3FCanvas],
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof HitEffect>;

// Default story with basic hit effect
export const Default: Story = {
  args: {
    ...mockHitEffect
  },
};

// Different color hit effect
export const BlueEffect: Story = {
  args: {
    ...mockHitEffect,
    color: '#0000ff'
  },
};

// Green hit effect
export const GreenEffect: Story = {
  args: {
    ...mockHitEffect,
    color: '#00ff00'
  },
}; 