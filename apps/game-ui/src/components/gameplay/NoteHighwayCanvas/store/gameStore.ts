import { create } from 'zustand';
import { GameState } from '../NoteHighwayCanvas.types';

// Create a store for managing game state
export const useGameStore = create<GameState>((set) => ({
  time: 0,
  bpm: 120,
  playing: false,
  notes: [],
  hitEffects: [],
  timingFeedback: [],
  setTime: (time) => set({ time }),
  setBpm: (bpm) => set({ bpm }),
  setPlaying: (playing) => set({ playing }),
  addNote: (note) => set((state) => ({ notes: [...state.notes, note] })),
  hitNote: (noteId: string) => set((state) => ({
    notes: state.notes.map(note => 
      note.id === noteId ? { ...note, hit: true } : note
    )
  })),
  addHitEffect: (effect) => set((state) => ({ 
    hitEffects: [...state.hitEffects, effect] 
  })),
  removeHitEffect: (id) => set((state) => ({
    hitEffects: state.hitEffects.filter(effect => effect.id !== id)
  })),
  addTimingFeedback: (feedback) => set((state) => ({ 
    timingFeedback: [...state.timingFeedback, feedback] 
  })),
  removeTimingFeedback: (id) => set((state) => ({
    timingFeedback: state.timingFeedback.filter(feedback => feedback.id !== id)
  }))
})); 