/**
 * A simple game loop implementation
 */

export type GameLoopOptions = {
  /**
   * Target frames per second
   */
  fps?: number;
  /**
   * Function to call on each update frame
   */
  update: (deltaTime: number) => void;
  /**
   * Function to call on each render frame
   */
  render?: (deltaTime: number) => void;
};

export class GameLoop {
  private fps: number;
  private frameTime: number;
  private lastFrameTime: number = 0;
  private running: boolean = false;
  private animationFrameId: number | null = null;
  private update: (deltaTime: number) => void;
  private render?: (deltaTime: number) => void;

  constructor(options: GameLoopOptions) {
    this.fps = options.fps || 60;
    this.frameTime = 1000 / this.fps;
    this.update = options.update;
    this.render = options.render;
  }

  /**
   * Start the game loop
   */
  start(): void {
    if (this.running) {
      return;
    }

    this.running = true;
    this.lastFrameTime = performance.now();
    this.animationFrameId = requestAnimationFrame(this.loop.bind(this));
  }

  /**
   * Stop the game loop
   */
  stop(): void {
    if (!this.running || this.animationFrameId === null) {
      return;
    }

    this.running = false;
    cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = null;
  }

  /**
   * Main loop function
   */
  private loop(timestamp: number): void {
    if (!this.running) {
      return;
    }

    const deltaTime = (timestamp - this.lastFrameTime) / 1000;
    this.lastFrameTime = timestamp;
    
    // Update game state
    this.update(deltaTime);

    // Render if needed
    if (this.render) {
      this.render(deltaTime);
    }

    // Queue the next frame
    this.animationFrameId = requestAnimationFrame(this.loop.bind(this));
  }

  /**
   * Check if the loop is currently running
   */
  isRunning(): boolean {
    return this.running;
  }
}

export default GameLoop; 