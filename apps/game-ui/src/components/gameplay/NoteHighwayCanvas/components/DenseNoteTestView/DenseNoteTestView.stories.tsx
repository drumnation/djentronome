import { Meta, StoryObj } from '@storybook/react';
import { DenseNoteTestView } from './DenseNoteTestView';

const meta: Meta<typeof DenseNoteTestView> = {
  title: 'Gameplay/NoteHighwayCanvas/DenseNoteTestView',
  component: DenseNoteTestView,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DenseNoteTestView>;

export const Default: Story = {
  args: {
    bpm: 180,
    enabled: true,
  },
};

export const SlowTempo: Story = {
  args: {
    bpm: 120,
    enabled: true,
  },
};

export const FastTempo: Story = {
  args: {
    bpm: 240,
    enabled: true,
  },
}; 