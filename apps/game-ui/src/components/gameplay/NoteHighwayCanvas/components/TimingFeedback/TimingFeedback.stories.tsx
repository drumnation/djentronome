import { Meta, StoryObj } from '@storybook/react';
import { TimingFeedback } from './TimingFeedback';
import { Canvas } from '@react-three/fiber';

const meta: Meta<typeof TimingFeedback> = {
  title: 'Gameplay/TimingFeedback',
  component: TimingFeedback,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Canvas style={{ height: '200px' }}>
        <Story />
      </Canvas>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof TimingFeedback>;

export const Perfect: Story = {
  args: {
    id: '1',
    position: [0, 0, 0],
    accuracy: 'perfect',
    createdAt: 0,
  },
};

export const Good: Story = {
  args: {
    id: '2',
    position: [0, 0, 0],
    accuracy: 'good',
    createdAt: 0,
  },
};

export const Ok: Story = {
  args: {
    id: '3',
    position: [0, 0, 0],
    accuracy: 'ok',
    createdAt: 0,
  },
};

export const Miss: Story = {
  args: {
    id: '4',
    position: [0, 0, 0],
    accuracy: 'miss',
    createdAt: 0,
  },
}; 