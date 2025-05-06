import type { Meta, StoryObj } from '@storybook/react';
import { Canvas } from '@react-three/fiber';
import { NoteHighwayViz } from './NoteHighwayViz';

const meta: Meta<typeof NoteHighwayViz> = {
  title: 'Gameplay/NoteHighway/NoteHighwayViz',
  component: NoteHighwayViz,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', height: '500px' }}>
        <Canvas camera={{ position: [0, 15, 10], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Story />
        </Canvas>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof NoteHighwayViz>;

export const Default: Story = {
  args: {
    bpm: 120,
  },
};

export const SlowTempo: Story = {
  args: {
    bpm: 80,
  },
};

export const FastTempo: Story = {
  args: {
    bpm: 180,
  },
}; 