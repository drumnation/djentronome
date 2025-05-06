import type { Meta, StoryObj } from '@storybook/react';
import { GameplayAreaWithMetronome } from './GameplayAreaWithMetronome';
import { DjentAnimatedElement } from '../NoteHighwayCanvas/components/DjentAnimatedElement/DjentAnimatedElement';
import { Box } from '@mantine/core';

const meta = {
  title: 'Gameplay/GameplayAreaWithMetronome',
  component: GameplayAreaWithMetronome,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    width: { control: 'number' },
    height: { control: 'number' },
    initialBpm: { 
      control: { type: 'range', min: 60, max: 240, step: 1 },
      description: 'Initial beats per minute',
    },
    initialBeatsPerMeasure: { 
      control: { type: 'range', min: 1, max: 12, step: 1 },
      description: 'Time signature numerator',
    },
    initialSubdivision: { 
      control: { type: 'select', options: [1, 2, 4] },
      description: 'Subdivision options (1 = quarter notes, 2 = eighth notes, 4 = sixteenth notes)',
    },
    initialTripletFeel: { 
      control: 'boolean',
      description: 'Whether to use triplet feel',
    },
    metronomePosition: {
      control: { type: 'radio', options: ['bottom', 'side'] },
      description: 'Position of the metronome UI',
    },
    hideMetronome: { 
      control: 'boolean',
      description: 'Hide the metronome UI',
    },
  },
  decorators: [
    (Story) => (
      <Box style={{ width: '100%', height: '100vh' }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof GameplayAreaWithMetronome>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    width: window.innerWidth,
    height: window.innerHeight,
    initialBpm: 120,
    initialBeatsPerMeasure: 4,
    initialSubdivision: 1,
    initialTripletFeel: false,
    metronomePosition: 'bottom',
    hideMetronome: false,
  },
  render: (args) => (
    <GameplayAreaWithMetronome {...args} canvasChildren={<DjentAnimatedElement initialBpm={args.initialBpm} />} />
  ),
};

export const MetronomeOnSide: Story = {
  args: {
    ...Default.args,
    metronomePosition: 'side',
  },
  render: (args) => (
    <GameplayAreaWithMetronome {...args} canvasChildren={<DjentAnimatedElement initialBpm={args.initialBpm} />} />
  ),
};

export const HighBPM: Story = {
  args: {
    ...Default.args,
    initialBpm: 180,
    initialSubdivision: 2,
  },
  render: (args) => (
    <GameplayAreaWithMetronome {...args} canvasChildren={<DjentAnimatedElement initialBpm={args.initialBpm} />} />
  ),
};

export const EighthNoteSubdivisions: Story = {
  args: {
    ...Default.args,
    initialBpm: 120,
    initialSubdivision: 2,
  },
  render: (args) => (
    <GameplayAreaWithMetronome {...args} canvasChildren={<DjentAnimatedElement initialBpm={args.initialBpm} />} />
  ),
};

export const TripletFeel: Story = {
  args: {
    ...Default.args,
    initialBpm: 120,
    initialSubdivision: 1,
    initialTripletFeel: true,
  },
  render: (args) => (
    <GameplayAreaWithMetronome {...args} canvasChildren={<DjentAnimatedElement initialBpm={args.initialBpm} />} />
  ),
};

export const OddTimeSignature: Story = {
  args: {
    ...Default.args,
    initialBpm: 120,
    initialBeatsPerMeasure: 7,
  },
  render: (args) => (
    <GameplayAreaWithMetronome {...args} canvasChildren={<DjentAnimatedElement initialBpm={args.initialBpm} />} />
  ),
}; 