import React from 'react';
import { NoteHighwayCanvas } from './NoteHighwayCanvas';
import { NoteHighwayCanvasProps } from './NoteHighwayCanvas.types';

/**
 * A wrapper for NoteHighwayCanvas specifically for Storybook
 * This helps avoid dynamic import issues in Storybook
 */
export const NoteHighwayCanvasStoryWrapper: React.FC<NoteHighwayCanvasProps> = (props) => {
  return (
    <NoteHighwayCanvas {...props} />
  );
}; 