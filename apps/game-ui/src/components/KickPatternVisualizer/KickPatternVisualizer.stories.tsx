import type { Meta, StoryObj } from '@storybook/react';
import { KickPatternVisualizer } from './KickPatternVisualizer';

const meta = {
  title: 'Gameplay/KickPatternVisualizer',
  component: KickPatternVisualizer,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    bpm: { control: 'number' },
  },
} satisfies Meta<typeof KickPatternVisualizer>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story with different patterns
export const Default: Story = {
  args: {
    bpm: 166,
  },
};

// Story with fast BPM
export const FastBPM: Story = {
  args: {
    bpm: 200,
  },
};

// Story with slow BPM
export const SlowBPM: Story = {
  args: {
    bpm: 100,
  },
};

// Story with preset custom pattern
export const CustomPattern: Story = {
  args: {
    bpm: 180,
    pattern: [
      // Classic djent syncopated pattern
      { id: 'custom-0-0', lane: 2, beat: 0.0, measure: 0 },
      { id: 'custom-0-0.5', lane: 2, beat: 0.5, measure: 0 },
      { id: 'custom-0-0.75', lane: 2, beat: 0.75, measure: 0 },
      { id: 'custom-0-1', lane: 2, beat: 1.0, measure: 0 },
      { id: 'custom-0-1.25', lane: 2, beat: 1.25, measure: 0 },
      { id: 'custom-0-1.75', lane: 2, beat: 1.75, measure: 0 },
      { id: 'custom-0-2', lane: 2, beat: 2.0, measure: 0 },
      
      // Machine gun burst
      { id: 'custom-0-3.0', lane: 2, beat: 3.0, measure: 0 },
      { id: 'custom-0-3.125', lane: 2, beat: 3.125, measure: 0 },
      { id: 'custom-0-3.25', lane: 2, beat: 3.25, measure: 0 },
      { id: 'custom-0-3.375', lane: 2, beat: 3.375, measure: 0 },
      { id: 'custom-0-3.5', lane: 2, beat: 3.5, measure: 0 },
      { id: 'custom-0-3.625', lane: 2, beat: 3.625, measure: 0 },
      { id: 'custom-0-3.75', lane: 2, beat: 3.75, measure: 0 },
      { id: 'custom-0-3.875', lane: 2, beat: 3.875, measure: 0 },
      
      // Second measure with more traditional metal pattern
      { id: 'custom-1-0', lane: 2, beat: 0.0, measure: 1 },
      { id: 'custom-1-0.5', lane: 2, beat: 0.5, measure: 1 },
      { id: 'custom-1-1', lane: 2, beat: 1.0, measure: 1 },
      { id: 'custom-1-1.5', lane: 2, beat: 1.5, measure: 1 },
      { id: 'custom-1-2', lane: 2, beat: 2.0, measure: 1 },
      { id: 'custom-1-2.5', lane: 2, beat: 2.5, measure: 1 },
      { id: 'custom-1-3', lane: 2, beat: 3.0, measure: 1 },
      { id: 'custom-1-3.5', lane: 2, beat: 3.5, measure: 1 },
    ],
  },
}; 