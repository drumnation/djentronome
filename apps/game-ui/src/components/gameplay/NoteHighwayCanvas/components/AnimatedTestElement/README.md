# AnimatedTestElement

A simple animated 3D component for testing the NoteHighwayCanvas with React Three Fiber.

## Overview

This component visualizes a rhythm game note highway with:
- Four drum lanes (cymbal, snare, left kick, right kick)
- Animated note objects that move toward the player
- Hit detection zone
- Interactive gameplay via keyboard input (D, F, J, K keys)
- Visual feedback for hits and misses

## Structure

The component follows React component standards with proper file organization:

```
AnimatedTestElement/
├── index.ts                       # Barrel export
├── AnimatedTestElement.tsx        # Main component
├── AnimatedTestElement.types.ts   # TypeScript interfaces/types
├── AnimatedTestElement.hook.ts    # Stateful logic (custom hooks)
├── AnimatedTestElement.logic.ts   # Pure business logic
├── AnimatedTestElement.stories.tsx # Storybook stories
└── README.md                      # Documentation
```

## Usage

```tsx
import { AnimatedTestElement } from './components/AnimatedTestElement';
import { Canvas } from '@react-three/fiber';

const MyComponent = () => (
  <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
    <ambientLight intensity={0.5} />
    <AnimatedTestElement />
  </Canvas>
);
```

## Keyboard Controls

- `D` - Yellow lane (Cymbal)
- `F` - Red lane (Snare)
- `J` - Blue lane (Left Kick)
- `K` - Green lane (Right Kick)

Press these keys when notes reach the hit line for a successful hit.

## Implementation Details

- Uses react-three-fiber for 3D rendering
- Uses drei for text rendering
- Includes realistic lighting and material effects
- Visual feedback for hits and misses 