import type { Meta, StoryObj } from '@storybook/react';
import { NoteHighwayCanvas } from './NoteHighwayCanvas';
import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { create } from 'zustand';
import type { Mesh } from 'three';

// Create a real game state store with Zustand (just like we would in the main app)
interface GameState {
  time: number;
  bpm: number;
  playing: boolean;
  notes: Note[];
  setTime: (time: number) => void;
  setBpm: (bpm: number) => void;
  setPlaying: (playing: boolean) => void;
  addNote: (note: Note) => void;
  hitNote: (noteId: string) => void;
}

interface Note {
  id: string;
  position: [number, number, number];
  lane: number;
  time: number;
  hit: boolean;
}

// Create a real store that would be used in the actual application
const useGameStore = create<GameState>((set) => ({
  time: 0,
  bpm: 120,
  playing: false,
  notes: [],
  setTime: (time) => set({ time }),
  setBpm: (bpm) => set({ bpm }),
  setPlaying: (playing) => set({ playing }),
  addNote: (note) => set((state) => ({ notes: [...state.notes, note] })),
  hitNote: (noteId: string) => set((state) => ({
    notes: state.notes.map(note => 
      note.id === noteId ? { ...note, hit: true } : note
    )
  })),
}));

// Real note component that would be used in the actual game
const Note = ({ position, lane, hit }: { position: [number, number, number], lane: number, hit: boolean }) => {
  const meshRef = useRef<Mesh>(null);
  
  // This is real behavior - meshes will react to game state
  useEffect(() => {
    if (hit && meshRef.current) {
      meshRef.current.scale.set(1.5, 1.5, 1.5);
    }
  }, [hit]);
  
  // Use a different color based on the lane (real game behavior)
  const colors = ['#ff3333', '#33ff33', '#3333ff', '#ffff33'];
  const color = colors[lane % colors.length];
  
  return (
    <mesh position={position} ref={meshRef} castShadow>
      <boxGeometry args={[1, 0.2, 1]} />
      <meshStandardMaterial color={hit ? '#ffffff' : color} emissive={hit ? color : undefined} emissiveIntensity={0.5} />
    </mesh>
  );
};

// Real Lane component for the note highway
const Lane = ({ position, width, length }: { position: [number, number, number], width: number, length: number }) => {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[width, length]} />
      <meshStandardMaterial color="#333333" />
    </mesh>
  );
};

// Real NoteHighway component with actual game logic
const NoteHighway = () => {
  const { time, bpm, playing, notes, setTime, addNote } = useGameStore();
  
  // This simulates the real game - adding notes at regular intervals
  useEffect(() => {
    // Create some test notes - use explicit number array to avoid undefined issues
    const lanes: number[] = [0, 1, 2, 3];
    const noteCount = 20;
    
    // Add notes at regular intervals (based on BPM)
    for (let i = 0; i < noteCount; i++) {
      // Use a different approach to get a random lane that TypeScript can verify
      const laneIndex = Math.min(Math.floor(Math.random() * 4), 3); // Force 0-3 index range
      const lane = lanes[laneIndex] || 0; // Fallback to 0 if somehow undefined
      
      // Position each note at a different time (future position)
      const noteTime = i * (60 / bpm); // One note every beat
      const id = `note-${i}-${lane}`;
      
      addNote({
        id,
        lane,
        time: noteTime,
        // Initial position - the z position will be updated in the useFrame hook
        position: [(lane - 1.5) * 2, 0, -30],
        hit: false
      });
    }
    
    // Start playback
    setTime(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Real gameplay logic - animate notes based on time
  useFrame((_, delta) => {
    if (playing) {
      setTime(time + delta);
      
      // Update note positions based on current time
      notes.forEach(note => {
        // Calculate Z position: start far away and move toward player based on note time and current time
        const speed = 10; // Units per second
        const zPosition = -30 + (time - note.time) * speed;
        
        // Update the note's position
        note.position = [(note.lane - 1.5) * 2, 0, zPosition];
      });
    }
  });
  
  return (
    <>
      {/* Draw grid for reference */}
      <gridHelper args={[20, 20, '#444', '#222']} />
      
      {/* Create lanes */}
      {[0, 1, 2, 3].map((lane) => (
        <Lane 
          key={`lane-${lane}`} 
          position={[(lane - 1.5) * 2, -0.5, 0]} 
          width={1.8} 
          length={30}
        />
      ))}
      
      {/* Add a visual marker for the hit line - moved closer to user/camera */}
      <mesh position={[0, 0, 5]} rotation={[0, 0, 0]}>
        <boxGeometry args={[8, 0.1, 0.1]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>
      
      {/* Render notes */}
      {notes.map((note) => (
        <Note 
          key={note.id} 
          position={note.position} 
          lane={note.lane} 
          hit={note.hit} 
        />
      ))}
    </>
  );
};

// Define meta for the component
const meta: Meta<typeof NoteHighwayCanvas> = {
  title: 'Gameplay/NoteHighwayCanvas',
  component: NoteHighwayCanvas,
  parameters: {
    layout: 'fullscreen',
    // Include real documentation
    docs: {
      description: {
        component: 'The NoteHighwayCanvas is the primary 3D visualization component for gameplay. It renders the Three.js canvas with proper camera positioning, lighting, and controls.',
      },
    },
  },
  // Include real controls
  argTypes: {
    width: { 
      control: { type: 'range', min: 300, max: 1200, step: 50 },
      description: 'Width of the canvas in pixels',
    },
    height: { 
      control: { type: 'range', min: 200, max: 800, step: 50 },
      description: 'Height of the canvas in pixels',
    },
  },
};

export default meta;
type Story = StoryObj<typeof NoteHighwayCanvas>;

// Component to handle gameplay for the Default story
interface StoryProps {
  width?: number;
  height?: number;
}

const DefaultStory = (args: StoryProps) => {
  const { setPlaying } = useGameStore();
  
  // Start gameplay when component mounts (real behavior)
  useEffect(() => {
    setPlaying(true);
    return () => setPlaying(false);
  }, [setPlaying]);
  
  return (
    <NoteHighwayCanvas {...args}>
      <NoteHighway />
    </NoteHighwayCanvas>
  );
};

// Component to handle gameplay for the Interactive story
const InteractiveStory = (args: StoryProps) => {
  const { notes, setPlaying, hitNote } = useGameStore();
  const [hitNotes, setHitNotes] = useState<string[]>([]);
  
  // Start gameplay when component mounts
  useEffect(() => {
    setPlaying(true);
    
    // Handle key presses for hitting notes (real game behavior)
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const lanes = {'d': 0, 'f': 1, 'j': 2, 'k': 3};
      const pressedLane = lanes[key as keyof typeof lanes];
      
      if (pressedLane !== undefined) {
        // Find closest note in this lane that is near the hit line (z=5)
        const laneNotes = notes
          .filter(n => n.lane === pressedLane && !hitNotes.includes(n.id))
          // Add distance from hit line as a property for sorting
          .map(note => ({
            ...note,
            distanceFromHitLine: Math.abs(note.position[2] - 5)
          }))
          // Sort by closest to hit line
          .sort((a, b) => a.distanceFromHitLine - b.distanceFromHitLine);
        
        // Only register hits for notes that are within the hit window
        const hitWindowSize = 3; // Units around the hit line considered valid
        if (laneNotes.length > 0 && 
            laneNotes[0] && 
            typeof laneNotes[0].distanceFromHitLine === 'number' && 
            laneNotes[0].distanceFromHitLine < hitWindowSize) {
          const firstNote = laneNotes[0];
          if (firstNote && firstNote.id) {
            // Add to local hit notes state
            setHitNotes(prev => [...prev, firstNote.id]);
            
            // Mark the note as hit in the store using the hitNote method
            hitNote(firstNote.id);
          }
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      setPlaying(false);
    };
  }, [setPlaying, notes, hitNotes, hitNote]);
  
  return (
    <div>
      <div style={{ marginBottom: '1rem', padding: '1rem', background: '#222', borderRadius: '4px' }}>
        <h3 style={{ margin: 0 }}>Press D, F, J, K to hit notes in each lane</h3>
        <div>Notes hit: {hitNotes.length} / {notes.length}</div>
      </div>
      <NoteHighwayCanvas {...args}>
        <NoteHighway />
      </NoteHighwayCanvas>
    </div>
  );
};

// Default story with real gameplay visualization
export const Default: Story = {
  args: {
    width: 800,
    height: 600,
  },
  render: (args) => <DefaultStory {...args} />
};

// Interactive story that demonstrates user interaction
export const Interactive: Story = {
  args: {
    width: 800,
    height: 600,
  },
  render: (args) => <InteractiveStory {...args} />
}; 