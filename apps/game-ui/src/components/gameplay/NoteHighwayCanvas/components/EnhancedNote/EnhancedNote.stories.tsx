import type { Meta, StoryObj } from '@storybook/react';
import { Canvas } from '@react-three/fiber';
import { EnhancedNote } from './EnhancedNote';
import { HitQuality } from './EnhancedNote.types';

const meta: Meta<typeof EnhancedNote> = {
  title: 'Gameplay/NoteHighway/EnhancedNote',
  component: EnhancedNote,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Story />
      </Canvas>
    ),
  ],
  argTypes: {
    lane: {
      control: { type: 'select' },
      options: [0, 1, 2, 3],
      description: 'Lane number (0: cymbal, 1: snare, 2-3: kick drums)',
    },
    hitQuality: {
      control: { type: 'select' },
      options: [null, 'perfect', 'good', 'early', 'late', 'miss'],
      description: 'Quality of the hit timing',
    },
    isAccent: {
      control: 'boolean',
      description: 'Whether the note is an accented note',
    },
    isIntense: {
      control: 'boolean',
      description: 'Visual emphasis for intense sections',
    },
    showWireframe: {
      control: 'boolean',
      description: 'Whether to show wireframe',
    },
    hit: {
      control: 'boolean',
      description: 'Whether the note has been hit',
    },
  },
};

export default meta;
type Story = StoryObj<typeof EnhancedNote>;

export const Cymbal: Story = {
  args: {
    position: [0, 0, 0],
    lane: 0,
    hit: false,
    isAccent: false,
    isIntense: false,
  },
};

export const Snare: Story = {
  args: {
    position: [0, 0, 0],
    lane: 1,
    hit: false,
    isAccent: false,
    isIntense: false,
  },
};

export const KickLeft: Story = {
  args: {
    position: [0, 0, 0],
    lane: 2,
    hit: false,
    isAccent: false,
    isIntense: false,
  },
};

export const KickRight: Story = {
  args: {
    position: [0, 0, 0],
    lane: 3,
    hit: false,
    isAccent: false,
    isIntense: false,
  },
};

export const Perfect: Story = {
  args: {
    position: [0, 0, 0],
    lane: 1,
    hit: true,
    hitQuality: 'perfect' as HitQuality,
  },
};

export const Good: Story = {
  args: {
    position: [0, 0, 0],
    lane: 1,
    hit: true,
    hitQuality: 'good' as HitQuality,
  },
};

export const Early: Story = {
  args: {
    position: [0, 0, 0],
    lane: 1,
    hit: true,
    hitQuality: 'early' as HitQuality,
  },
};

export const Late: Story = {
  args: {
    position: [0, 0, 0],
    lane: 1,
    hit: true,
    hitQuality: 'late' as HitQuality,
  },
};

export const AccentedNote: Story = {
  args: {
    position: [0, 0, 0],
    lane: 0,
    hit: false,
    isAccent: true,
  },
};

export const IntenseSection: Story = {
  args: {
    position: [0, 0, 0],
    lane: 2,
    hit: false,
    isIntense: true,
  },
}; 