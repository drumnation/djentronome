import type { Meta, StoryObj } from '@storybook/react';
import { Metronome } from './Metronome';

const meta: Meta<typeof Metronome> = {
  title: 'Components/Metronome',
  component: Metronome,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Metronome>;

export const Default: Story = {
  args: {
    initialConfig: {
      tempo: 120,
      beatsPerMeasure: 4,
      beatUnit: 4,
      subdivision: 1,
      tripletFeel: false,
    },
  },
};

export const FastTempo: Story = {
  args: {
    initialConfig: {
      tempo: 200,
      beatsPerMeasure: 4,
      beatUnit: 4,
      subdivision: 1,
      tripletFeel: false,
    },
  },
};

export const SlowTempo: Story = {
  args: {
    initialConfig: {
      tempo: 60,
      beatsPerMeasure: 4,
      beatUnit: 4,
      subdivision: 1,
      tripletFeel: false,
    },
  },
};

export const EighthNoteSubdivision: Story = {
  args: {
    initialConfig: {
      tempo: 120,
      beatsPerMeasure: 4,
      beatUnit: 4,
      subdivision: 2,
      tripletFeel: false,
    },
  },
};

export const SixteenthNoteSubdivision: Story = {
  args: {
    initialConfig: {
      tempo: 120,
      beatsPerMeasure: 4,
      beatUnit: 4,
      subdivision: 4,
      tripletFeel: false,
    },
  },
};

export const TripletFeel: Story = {
  args: {
    initialConfig: {
      tempo: 120,
      beatsPerMeasure: 4,
      beatUnit: 4,
      subdivision: 1,
      tripletFeel: true,
    },
  },
};

export const OddMeter: Story = {
  args: {
    initialConfig: {
      tempo: 120,
      beatsPerMeasure: 7,
      beatUnit: 8,
      subdivision: 1,
      tripletFeel: false,
    },
  },
}; 