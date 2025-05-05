/**
 * Skill-Jack: Canvas 2D Rendering Fundamentals
 * 
 * Provides foundational knowledge for using the HTML Canvas 2D API for drawing and animation.
 * 
 * @module brain-garden/skill-jack
 * @category tools
 */

/**
 * Skill-Jack on Canvas 2D Rendering
 * 
 * This constant provides comprehensive guidance on understanding and applying
 * the HTML Canvas 2D API for creating custom 2D graphics and animations, relevant for the initial Djentronome note highway.
 */
export const canvas2dRenderingGuide = {
  topic: "Canvas 2D Rendering Fundamentals",
  description: "Covers setting up an HTML Canvas, obtaining the 2D rendering context, drawing basic shapes, text, and images, and implementing simple animation loops using `requestAnimationFrame`.",
  corePrinciples: [
    {
      name: "The `<canvas>` Element",
      description: "The HTML `<canvas>` element provides a resolution-dependent bitmap surface for drawing graphics via scripting (usually JavaScript).",
      examples: ["`<canvas id='gameCanvas' width='800' height='600'></canvas>`", "Accessing the canvas element using `document.getElementById` or React refs."],
    },
    {
      name: "The 2D Rendering Context",
      description: "Drawing operations are performed on the 2D rendering context obtained from the canvas element using `canvas.getContext('2d')`.",
      examples: ["`const ctx = canvas.getContext('2d');`", "Checking if the context was successfully obtained."],
    },
    {
      name: "Coordinate System",
      description: "The canvas uses a coordinate system where (0,0) is the top-left corner. X increases to the right, and Y increases downwards.",
    },
    {
      name: "State Machine",
      description: "The 2D context is a state machine. Properties like `fillStyle`, `strokeStyle`, `lineWidth`, `font` persist until changed. Use `ctx.save()` and `ctx.restore()` to manage state changes temporarily.",
      examples: ["Setting `ctx.fillStyle = 'blue';` before drawing a rectangle.", "`ctx.save(); ctx.translate(x, y); /* draw rotated */ ctx.restore();`"],
    },
    {
      name: "Drawing Shapes",
      description: "The context provides methods for drawing basic shapes like rectangles (`fillRect`, `strokeRect`, `clearRect`), lines (`beginPath`, `moveTo`, `lineTo`, `stroke`), arcs/circles (`arc`), and paths.",
      examples: ["`ctx.fillRect(10, 10, 100, 50);`", "Drawing a line from (10,10) to (100,100)."],
    },
    {
      name: "Drawing Text and Images",
      description: "Use `fillText` or `strokeText` to draw text, and `drawImage` to render images, other canvases, or video frames onto the canvas.",
      examples: ["`ctx.font = '20px Arial'; ctx.fillText('Score: 100', 10, 30);`", "`ctx.drawImage(imgElement, x, y, width, height);`"],
    },
    {
      name: "Animation Loop (`requestAnimationFrame`) ",
      description: "Smooth animation is achieved by repeatedly clearing and redrawing the canvas within a loop driven by `window.requestAnimationFrame(callback)`.",
      examples: ["Creating a `draw()` function that clears the canvas and redraws elements.", "Calling `requestAnimationFrame(draw)` within the `draw` function itself to loop."],
    },
  ],
  applicationProcess: {
    description: "Steps for an agent to set up and draw basic graphics/animations on a Canvas.",
    steps: [
      {
        name: "Setup HTML Canvas Element",
        description: "Add a `<canvas>` element to the HTML or JSX.",
        agentActions: [
          {
            action: "Include `<canvas>` tag with appropriate `id`, `width`, and `height` attributes.",
            explanation: "Define the drawing surface.",
          },
          {
            action: "In React, obtain a ref to the canvas element.",
            explanation: "`const canvasRef = useRef<HTMLCanvasElement>(null);` and `<canvas ref={canvasRef} ... />`",
          },
        ],
      },
      {
        name: "Get 2D Rendering Context",
        description: "Obtain the context object used for drawing.",
        agentActions: [
          {
            action: "Access the canvas DOM element (using ref in React).",
            explanation: "`const canvas = canvasRef.current;`",
          },
          {
            action: "Call `canvas.getContext('2d')`.",
            explanation: "`const ctx = canvas?.getContext('2d');`",
          },
          {
            action: "Check if context is successfully retrieved.",
            explanation: "`if (!ctx) { console.error('Could not get 2D context'); return; }` Handle potential null case.",
          },
        ],
      },
      {
        name: "Implement Drawing Logic",
        description: "Write functions to draw specific elements (shapes, text, images).",
        agentActions: [
          {
            action: "Set context properties (fillStyle, strokeStyle, lineWidth, font, etc.).",
            explanation: "Define the appearance before drawing.",
          },
          {
            action: "Call drawing methods (fillRect, strokeRect, beginPath, lineTo, stroke, fillText, drawImage, etc.).",
            explanation: "Use the appropriate methods with correct coordinates and dimensions.",
          },
          {
            action: "Use `ctx.save()` and `ctx.restore()` when applying transformations (translate, rotate, scale) temporarily.",
            explanation: "Prevents transformations from affecting subsequent drawing operations.",
          },
        ],
      },
      {
        name: "Create Animation Loop (if needed)",
        description: "Set up a loop using `requestAnimationFrame` for dynamic rendering.",
        agentActions: [
          {
            action: "Define a main `drawLoop` or `render` function.",
            explanation: "This function will contain all drawing logic for a single frame.",
          },
          {
            action: "Inside the loop, clear the canvas.",
            explanation: "`ctx.clearRect(0, 0, canvas.width, canvas.height);` Prevents drawing artifacts from previous frames.",
          },
          {
            action: "Update state variables (positions, scores, etc.).",
            explanation: "Calculate the new state for the current frame.",
          },
          {
            action: "Call specific drawing functions to render the updated scene.",
            explanation: "Redraw all elements based on the new state.",
          },
          {
            action: "Request the next frame.",
            explanation: "`const animationFrameId = requestAnimationFrame(drawLoop);` Call recursively to continue the loop. Store the ID to cancel later if needed (`cancelAnimationFrame(animationFrameId)`).",
          },
          {
            action: "Start the loop initially.",
            explanation: "Make the first call to `requestAnimationFrame(drawLoop);` typically within a `useEffect` hook (in React) or after initial setup.",
          },
        ],
      },
    ],
  },
  examples: {
    description: "Scenarios demonstrating basic Canvas 2D usage.",
    useCases: [
      {
        scenario: "Drawing a simple blue rectangle.",
        implementation: "Get context `ctx`. Set `ctx.fillStyle = 'blue';`. Call `ctx.fillRect(50, 50, 150, 100);`.",
        outcome: "A blue rectangle appears on the canvas at position (50,50) with width 150 and height 100.",
      },
      {
        scenario: "Animating a circle moving across the canvas.",
        implementation: "Setup canvas and context. Define circle position `{x, y}` in state. Create `drawLoop`. Inside loop: clear canvas, update `x` (e.g., `x += speed`), draw circle using `ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();`, call `requestAnimationFrame(drawLoop)`.",
        outcome: "A circle moves horizontally across the canvas.",
      },
      {
        scenario: "Displaying text that updates based on a score variable.",
        implementation: "Get context `ctx`. In the drawing/animation loop: set `ctx.font`, `ctx.fillStyle`. Call `ctx.fillText(\`Score: ${scoreVariable}\`, 10, 30);`. Update `scoreVariable` elsewhere in the application logic.",
        outcome: "Text displaying the current score is rendered on the canvas and updates dynamically.",
      },
    ],
  },
  codeExamples: [
    {
      language: "typescript",
      description: "Basic Canvas Setup and Drawing in React",
      code: `import React, { useRef, useEffect } from 'react';

const SimpleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to get 2D context');
      return;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw a red rectangle
    ctx.fillStyle = 'red';
    ctx.fillRect(10, 10, 100, 80);

    // Draw blue text
    ctx.fillStyle = 'blue';
    ctx.font = '24px sans-serif';
    ctx.fillText('Hello Canvas!', 120, 50);

  }, []); // Runs once on mount

  return <canvas ref={canvasRef} width={400} height={200} style={{ border: '1px solid black' }} />;
};

export default SimpleCanvas;`,
      explanation: "A React component that sets up a canvas using a ref, gets the 2D context in `useEffect`, clears it, and draws a simple rectangle and text.",
    },
    {
      language: "typescript",
      description: "Simple Canvas Animation Loop in React",
      code: `import React, { useRef, useEffect } from 'react';

const AnimatedCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const xPos = useRef<number>(0); // Use ref to keep state between renders without causing re-render

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update position
      xPos.current = (xPos.current + 2) % canvas.width;

      // Draw circle
      ctx.fillStyle = 'green';
      ctx.beginPath();
      ctx.arc(xPos.current, canvas.height / 2, 20, 0, Math.PI * 2);
      ctx.fill();

      // Request next frame
      animationFrameId.current = requestAnimationFrame(draw);
    };

    // Start animation
    draw();

    // Cleanup function to cancel animation on unmount
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []); // Empty dependency array ensures setup runs once

  return <canvas ref={canvasRef} width={600} height={100} style={{ border: '1px solid lightgray' }} />;
};

export default AnimatedCanvas;`,
      explanation: "Demonstrates a basic animation loop using `requestAnimationFrame` and `useRef` to manage animation state (position and frame ID) within a React component. It draws a circle moving horizontally and includes cleanup.",
    },
  ],
  commonPitfalls: [
    {
      name: "Forgetting to Clear the Canvas",
      description: "Drawing operations accumulate on each frame if `ctx.clearRect()` is not called, leading to trails or visual glitches.",
      solution: "Call `ctx.clearRect(0, 0, canvas.width, canvas.height);` at the beginning of each animation frame/drawing function.",
      preventativeMeasures: ["Always include `clearRect` in the animation loop structure."],
    },
    {
      name: "Context Null Check",
      description: "Attempting to use the 2D context before it's obtained or if `getContext('2d')` fails (e.g., in unsupported environments).",
      solution: "Always check if the context variable (`ctx`) is truthy before calling any drawing methods on it.",
      preventativeMeasures: ["Use optional chaining (`ctx?.fillRect(...)`) or explicit null checks (`if (!ctx) return;`)."],
    },
    {
      name: "Performance Issues with Complex Scenes",
      description: "Drawing many complex shapes, large images, or performing heavy calculations within the animation loop can lead to low frame rates.",
      solution: "Optimize drawing logic (e.g., pre-render static elements to an offscreen canvas). Simplify calculations. Use performance profiling tools. Consider WebGL (via R3F/Three.js) for demanding graphics.",
      preventativeMeasures: ["Monitor performance during development.", "Avoid unnecessary work inside the loop.", "Profile complex drawing routines."],
    },
    {
      name: "Incorrect State Management in React",
      description: "Using `useState` for rapidly changing animation variables (like position) inside the loop can cause excessive re-renders, harming performance. Forgetting cleanup for `requestAnimationFrame` can lead to memory leaks.",
      solution: "Use `useRef` to store animation state that doesn't need to trigger re-renders directly. Ensure `cancelAnimationFrame` is called in the `useEffect` cleanup function.",
      preventativeMeasures: ["Understand the difference between `useState` and `useRef` for animation.", "Always include cleanup logic for effects that start loops or subscriptions."],
    },
  ],
  resources: [
    {
      type: "documentation",
      name: "MDN Canvas API",
      description: "The primary reference for the Canvas API.",
      link: "https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API",
    },
    {
      type: "documentation",
      name: "MDN CanvasRenderingContext2D",
      description: "Reference for all methods and properties of the 2D context.",
      link: "https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D",
    },
    {
      type: "tutorial",
      name: "MDN Canvas Tutorial",
      description: "Step-by-step guide covering basic and advanced Canvas usage.",
      link: "https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial",
    },
    {
      type: "documentation",
      name: "window.requestAnimationFrame()",
      description: "Documentation for the animation loop function.",
      link: "https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame",
    }
  ],
  conclusion: "The Canvas 2D API provides a flexible way to render custom 2D graphics and animations directly in the browser. Effective use involves understanding the rendering context state machine, coordinate system, drawing methods, and implementing efficient animation loops using `requestAnimationFrame`.",
}; 