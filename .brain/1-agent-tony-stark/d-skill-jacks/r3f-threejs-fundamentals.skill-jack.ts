/**
 * Skill-Jack: React Three Fiber (R3F) & Three.js Fundamentals
 * 
 * Provides foundational knowledge for using R3F to render 3D graphics with Three.js in a React application.
 * 
 * @module brain-garden/skill-jack
 * @category tools
 */

/**
 * Skill-Jack on R3F/Three.js Fundamentals
 * 
 * This constant provides comprehensive guidance on understanding and applying
 * the core concepts of React Three Fiber (R3F) and Three.js for creating 3D visualizations, relevant for the Djentronome note highway.
 */
export const r3fThreeJsFundamentalsGuide = {
  topic: "React Three Fiber (R3F) & Three.js Fundamentals",
  description: "Covers setting up an R3F canvas, understanding the scene graph, cameras, lights, geometries, materials, and basic animation/interaction within a React context.",
  corePrinciples: [
    {
      name: "Declarative 3D with R3F",
      description: "R3F provides React components that map directly to Three.js objects, allowing you to define a 3D scene declaratively using JSX instead of imperative Three.js code.",
      examples: ["Using `<mesh>`, `<boxGeometry>`, `<meshStandardMaterial>` components.", "Managing 3D object state with React state and props."],
    },
    {
      name: "The Canvas Component",
      description: "The `<Canvas>` component from R3F creates the WebGL rendering context and provides the entry point for your 3D scene.",
      examples: ["Placing `<Canvas>` in your React component tree.", "Configuring canvas props like `camera`, `shadows`."],
    },
    {
      name: "Scene Graph",
      description: "Three.js organizes objects in a hierarchical tree structure (Scene > Object3D > Mesh/Light/Camera...). R3F mirrors this with nested JSX components.",
      examples: ["`<group>` component acting as an Object3D container.", "Nesting `<mesh>` components within a `<group>`."],
    },
    {
      name: "Cameras",
      description: "Cameras define the viewpoint into the 3D scene. Common types are `PerspectiveCamera` (most common, realistic perspective) and `OrthographicCamera` (no perspective distortion, useful for 2D-like views or UI).",
      examples: ["Configuring camera `position`, `fov` (field of view) via props or state.", "Using helper libraries like `@react-three/drei` for camera controls (`<OrbitControls>`)."],
    },
    {
      name: "Lights",
      description: "Lights illuminate the scene. Common types include `ambientLight` (overall baseline light), `directionalLight` (like sunlight), `pointLight` (like a bulb), and `spotLight`.",
      examples: ["Adding `<ambientLight intensity={0.5} />`.", "Positioning a `<directionalLight position={[10, 10, 5]} />`."],
    },
    {
      name: "Meshes: Geometry + Material",
      description: "Visible objects in Three.js are typically Meshes, which combine a Geometry (shape, vertices) and a Material (appearance, color, texture, reaction to light).",
      examples: ["`<mesh><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color='red' /></mesh>`", "Using different geometries (`<sphereGeometry>`, `<planeGeometry>`) and materials (`<meshBasicMaterial>`, `<meshPhongMaterial>`)."],
    },
    {
      name: "The Render Loop (`useFrame`) ",
      description: "R3F provides the `useFrame` hook, which executes a callback function on every rendered frame, allowing for animations and state updates.",
      examples: ["Rotating a mesh: `useFrame((state, delta) => { meshRef.current.rotation.y += delta; });`", "Updating object positions based on game state."],
    },
  ],
  applicationProcess: {
    description: "Steps for an agent to set up and render a basic 3D scene using R3F.",
    steps: [
      {
        name: "Installation",
        description: "Add R3F and Three.js dependencies.",
        agentActions: [
          {
            action: "Install core libraries.",
            explanation: "Run `pnpm add @react-three/fiber three`. Add to the correct workspace package (e.g., `game-ui` or `core-graphics`) using `--filter`.",
          },
          {
            action: "Install optional helpers (recommended).",
            explanation: "Run `pnpm add @react-three/drei`. Drei provides useful abstractions and helpers (controls, shapes, etc.).",
          },
        ],
      },
      {
        name: "Setup Canvas",
        description: "Integrate the R3F Canvas into a React component.",
        agentActions: [
          {
            action: "Import `Canvas` from `@react-three/fiber`.",
            explanation: "Get the main R3F component.",
          },
          {
            action: "Render the `<Canvas>` component within your React component tree.",
            explanation: "Ensure it has appropriate dimensions via CSS or parent container styling.",
          },
          {
            action: "Optionally configure Canvas props.",
            explanation: "Set initial camera properties (`camera={{ position: [x, y, z], fov: ... }}`), enable shadows (`shadows`), etc.",
          },
        ],
      },
      {
        name: "Add Scene Elements",
        description: "Populate the Canvas with lights, meshes (geometry + material), and potentially cameras.",
        agentActions: [
          {
            action: "Add at least one light source inside `<Canvas>`.",
            explanation: "E.g., `<ambientLight intensity={0.6} />`, `<directionalLight position={[5, 5, 5]} />`. Objects won't be visible without light (unless using `MeshBasicMaterial`).",
          },
          {
            action: "Create a `<mesh>` component.",
            explanation: "This represents a visible object.",
          },
          {
            action: "Nest a geometry component inside the `<mesh>`.",
            explanation: "E.g., `<boxGeometry args={[width, height, depth]} />` or `<planeGeometry args={[width, height]} />`.",
          },
          {
            action: "Nest a material component inside the `<mesh>`.",
            explanation: "E.g., `<meshStandardMaterial color='orange' />` or `<meshBasicMaterial color='blue' wireframe />`.",
          },
          {
            action: "Set the mesh's position, rotation, or scale via props.",
            explanation: "`<mesh position={[x, y, z]} rotation={[rx, ry, rz]}>...</mesh>`",
          },
        ],
      },
      {
        name: "Implement Animation/Interaction (useFrame)",
        description: "Use the `useFrame` hook for dynamic updates.",
        agentActions: [
          {
            action: "Create a ref for the mesh to be animated.",
            explanation: "`const meshRef = useRef<THREE.Mesh>(null!);`",
          },
          {
            action: "Assign the ref to the mesh component: `<mesh ref={meshRef}>`.",
            explanation: "Allows accessing the underlying Three.js mesh object.",
          },
          {
            action: "Import and use the `useFrame` hook within the component containing the mesh.",
            explanation: "`import { useFrame } from '@react-three/fiber';`",
          },
          {
            action: "Inside `useFrame((state, delta) => { ... })`, update mesh properties.",
            explanation: "Modify `meshRef.current.rotation`, `meshRef.current.position`, etc., often using the `delta` time for frame-rate independent animation.",
          },
        ],
      },
      {
        name: "Add Camera Controls (Optional)",
        description: "Use helpers like OrbitControls for easier scene navigation during development.",
        agentActions: [
          {
            action: "Import `OrbitControls` from `@react-three/drei`.",
            explanation: "Get the camera control helper.",
          },
          {
            action: "Render `<OrbitControls />` inside the `<Canvas>`.",
            explanation: "This automatically attaches controls to the default camera.",
          },
        ],
      },
    ],
  },
  examples: {
    description: "Scenarios demonstrating basic R3F usage.",
    useCases: [
      {
        scenario: "Displaying a single, rotating cube.",
        implementation: "1. Setup `<Canvas>`. 2. Add `<ambientLight />` and `<directionalLight />`. 3. Create a component containing `<mesh ref={meshRef}><boxGeometry /><meshStandardMaterial color='red' /></mesh>`. 4. Use `useFrame` within that component to increment `meshRef.current.rotation.y += delta`.",
        outcome: "A red cube rotating around its Y-axis is rendered.",
      },
      {
        scenario: "Rendering a flat plane to represent the ground.",
        implementation: "Inside `<Canvas>`, add `<mesh rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[100, 100]} /><meshStandardMaterial color='grey' /></mesh>`. The rotation orients the plane horizontally.",
        outcome: "A grey plane appears as the ground.",
      },
      {
        scenario: "Moving an object based on component props or state.",
        implementation: "Pass a `position={[x, y, z]}` prop to a mesh component. Update the `[x, y, z]` values in the parent component's state. R3F will re-render the mesh at the new position.",
        outcome: "The 3D object's position is controlled dynamically by React state.",
      },
    ],
  },
  codeExamples: [
    {
      language: "typescript",
      description: "Basic R3F Scene with a Rotating Cube",
      code: "import React, { useRef } from 'react';\nimport { Canvas, useFrame } from '@react-three/fiber';\nimport * as THREE from 'three';\nimport { OrbitControls } from '@react-three/drei';\n\nfunction Box() {\n  const meshRef = useRef<THREE.Mesh>(null!);\n\n  useFrame((state, delta) => {\n    if (meshRef.current) {\n      meshRef.current.rotation.x += delta * 0.5;\n      meshRef.current.rotation.y += delta * 0.5;\n    }\n  });\n\n  return (\n    <mesh ref={meshRef} scale={1.5}>\n      <boxGeometry args={[1, 1, 1]} />\n      <meshStandardMaterial color={'orange'} />\n    </mesh>\n  );\n}\n\nexport default function BasicScene() {\n  return (\n    <Canvas camera={{ position: [3, 3, 3], fov: 50 }}>\n      <ambientLight intensity={0.7} />\n      <directionalLight position={[10, 10, 5]} intensity={1} />\n      <pointLight position={[-10, -10, -10]} intensity={0.5} />\n      <Box />\n      <OrbitControls />\n      <gridHelper args={[10, 10]} /> {/* Optional ground grid */}\n    </Canvas>\n  );\n}",
      explanation: "Sets up a Canvas with lights, OrbitControls, and a Box component. The Box component uses a ref and useFrame to continuously rotate itself.",
    },
  ],
  commonPitfalls: [
    {
      name: "Black Screen / Nothing Renders",
      description: "Often caused by missing lights, camera positioned inside geometry, incorrect camera settings (near/far planes), or geometry/material not being properly nested within a mesh.",
      solution: "Ensure adequate lighting (add ambient and directional). Check camera position and near/far clipping planes. Verify mesh structure (`<mesh><geometry /><material /></mesh>`). Use helpers like `<axesHelper />` or `<gridHelper />` to orient yourself.",
      preventativeMeasures: ["Start with basic lighting.", "Position camera deliberately.", "Add orientation helpers during development."],
    },
    {
      name: "Incorrect Imports",
      description: "Importing components from `three` instead of `@react-three/fiber` or `@react-three/drei`, or vice-versa.",
      solution: "Import `Canvas`, hooks (`useFrame`, `useThree`) and core components (`mesh`, `group`, geometries, materials) from `@react-three/fiber`. Import helpers (`OrbitControls`, specific shapes, etc.) from `@react-three/drei`. Import the `THREE` namespace for type hints or direct Three.js access from `three`.",
      preventativeMeasures: ["Pay close attention to import sources.", "Use editor autocompletion."],
    },
    {
      name: "Performance Issues",
      description: "Complex scenes, many objects, expensive materials, or inefficient `useFrame` logic can lead to low frame rates.",
      solution: "Optimize geometry (instancing, merging). Use less expensive materials where possible. Profile `useFrame` logic. Consider LOD (Level of Detail). Use tools like `Stats` from `@react-three/drei` to monitor performance.",
      preventativeMeasures: ["Start simple and optimize as needed.", "Monitor performance during development.", "Be mindful of the cost of operations inside `useFrame`."],
    },
    {
      name: "Z-Fighting",
      description: "Flickering effect when two surfaces occupy the same space.",
      solution: "Slightly offset the position of one of the surfaces. Adjust camera near/far clipping planes if appropriate.",
      preventativeMeasures: ["Avoid placing geometries at the exact same coordinates."],
    },
  ],
  resources: [
    {
      type: "documentation",
      name: "React Three Fiber Docs",
      description: "Official documentation for R3F.",
      link: "https://docs.pmnd.rs/react-three-fiber/getting-started/introduction",
    },
    {
      type: "documentation",
      name: "Three.js Docs",
      description: "Official documentation for the underlying Three.js library.",
      link: "https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene",
    },
    {
      type: "documentation",
      name: "@react-three/drei",
      description: "Documentation for the useful helpers library for R3F.",
      link: "https://github.com/pmndrs/drei",
    },
    {
      type: "tutorial",
      name: "R3F Fundamentals Course (Example)",
      description: "Search for introductory courses or tutorials on R3F (e.g., on platforms like YouTube, Udemy, official examples).",
    },
  ],
  conclusion: "React Three Fiber provides a powerful and intuitive way to build 3D experiences within React by leveraging declarative JSX syntax. Understanding the core concepts of the Canvas, scene graph, lighting, meshes, and the `useFrame` hook is fundamental to creating dynamic and interactive 3D visualizations.",
}; 