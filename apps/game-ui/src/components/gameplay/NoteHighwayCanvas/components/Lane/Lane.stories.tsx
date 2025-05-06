import type { Meta, StoryObj } from '@storybook/react';
import { Canvas } from '@react-three/fiber';
import { Lane } from './Lane';
import { LaneType } from './Lane.types';

const meta: Meta<typeof Lane> = {
  title: 'Gameplay/NoteHighway/Lane',
  component: Lane,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <Story />
      </Canvas>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Lane>;

export const CymbalLane: Story = {
  args: {
    position: [0, 0, 0],
    width: 2,
    length: 20,
    lane: LaneType.CYMBAL,
  },
};

export const SnareLane: Story = {
  args: {
    position: [0, 0, 0],
    width: 2,
    length: 20,
    lane: LaneType.SNARE,
  },
};

export const LeftKickLane: Story = {
  args: {
    position: [0, 0, 0],
    width: 2,
    length: 20,
    lane: LaneType.LEFT_KICK,
  },
};

export const RightKickLane: Story = {
  args: {
    position: [0, 0, 0],
    width: 2,
    length: 20,
    lane: LaneType.RIGHT_KICK,
  },
}; 