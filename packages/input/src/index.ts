/**
 * Input handling system that follows the principles:
 * - Decouples input capture from gameplay logic
 * - Normalizes input (keyboard, gamepad, touch) into unified events
 * - Allows remapping and abstract bindings
 */

export type InputAction = 
  | 'Move'
  | 'Jump'
  | 'Attack'
  | 'Interact'
  | 'Menu'
  | 'Pause';

export type InputState = {
  value: number;   // For analog inputs: -1.0 to 1.0, for buttons: 0 or 1
  pressed: boolean; // If the input was newly pressed this frame
  released: boolean; // If the input was newly released this frame
  held: boolean;    // If the input is currently being held
};

export type InputMap = Record<InputAction, InputState>;

export type InputBindings = {
  keyboard: Record<string, InputAction>;
  gamepad: Record<string, InputAction>;
  touch: Record<string, InputAction>;
};

// Default input bindings
export const defaultBindings: InputBindings = {
  keyboard: {
    'KeyW': 'Move',
    'KeyA': 'Move',
    'KeyS': 'Move',
    'KeyD': 'Move',
    'Space': 'Jump',
    'KeyE': 'Interact',
    'Escape': 'Menu',
  },
  gamepad: {
    'button0': 'Jump',
    'button1': 'Attack',
    'button2': 'Interact',
    'button9': 'Menu',
    'leftStick': 'Move',
  },
  touch: {
    'joystick': 'Move',
    'buttonA': 'Jump',
    'buttonB': 'Attack',
    'buttonMenu': 'Menu',
  },
};

// Initial empty input state
export const createEmptyInputState = (): InputState => ({
  value: 0,
  pressed: false,
  released: false,
  held: false,
});

// Create an empty input map with all actions initialized
export const createEmptyInputMap = (): InputMap => {
  const actions: InputAction[] = ['Move', 'Jump', 'Attack', 'Interact', 'Menu', 'Pause'];
  return actions.reduce((map, action) => {
    map[action] = createEmptyInputState();
    return map;
  }, {} as InputMap);
};

/**
 * Input handler for keyboard, MIDI and other input methods
 */

/**
 * The different types of input devices supported
 */
export enum InputDeviceType {
  Keyboard = 'keyboard',
  MIDI = 'midi',
  Gamepad = 'gamepad'
}

/**
 * Represents an input event
 */
export interface InputEvent {
  /**
   * The type of input device that triggered the event
   */
  deviceType: InputDeviceType;
  /**
   * The key/note/button that was pressed
   */
  code: string | number;
  /**
   * Whether the key/note/button is currently pressed
   */
  pressed: boolean;
  /**
   * The velocity/pressure of the press (0-1)
   */
  velocity?: number;
  /**
   * When the event occurred
   */
  timestamp: number;
}

/**
 * Callback for input events
 */
export type InputCallback = (event: InputEvent) => void;

/**
 * Input handler class for managing inputs from various devices
 */
export class InputHandler {
  private keyboardCallbacks: Set<InputCallback> = new Set();
  private midiCallbacks: Set<InputCallback> = new Set();
  private gamepadCallbacks: Set<InputCallback> = new Set();
  // These will be used in future implementations
  // TODO: Implement MIDI and gamepad input handling
  private keyboardEnabled: boolean = false;

  /**
   * Create a new input handler
   * @param bindings Optional custom input bindings
   */
  constructor(_bindings?: Partial<InputBindings>) {
    // Store bindings for future implementation if needed
  }

  /**
   * Enable keyboard input
   */
  enableKeyboard(): void {
    if (this.keyboardEnabled) return;
    
    this.keyboardEnabled = true;
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  /**
   * Disable keyboard input
   */
  disableKeyboard(): void {
    if (!this.keyboardEnabled) return;
    
    this.keyboardEnabled = false;
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  /**
   * Handle keyboard down events
   */
  private handleKeyDown = (event: KeyboardEvent): void => {
    const inputEvent: InputEvent = {
      deviceType: InputDeviceType.Keyboard,
      code: event.code,
      pressed: true,
      timestamp: performance.now()
    };
    
    this.keyboardCallbacks.forEach(callback => callback(inputEvent));
  };

  /**
   * Handle keyboard up events
   */
  private handleKeyUp = (event: KeyboardEvent): void => {
    const inputEvent: InputEvent = {
      deviceType: InputDeviceType.Keyboard,
      code: event.code,
      pressed: false,
      timestamp: performance.now()
    };
    
    this.keyboardCallbacks.forEach(callback => callback(inputEvent));
  };

  /**
   * Register a callback for any input event
   */
  registerCallback(callback: InputCallback, deviceType?: InputDeviceType): void {
    if (!deviceType || deviceType === InputDeviceType.Keyboard) {
      this.keyboardCallbacks.add(callback);
    }
    
    if (!deviceType || deviceType === InputDeviceType.MIDI) {
      this.midiCallbacks.add(callback);
    }
    
    if (!deviceType || deviceType === InputDeviceType.Gamepad) {
      this.gamepadCallbacks.add(callback);
    }
  }

  /**
   * Unregister a callback
   */
  unregisterCallback(callback: InputCallback, deviceType?: InputDeviceType): void {
    if (!deviceType || deviceType === InputDeviceType.Keyboard) {
      this.keyboardCallbacks.delete(callback);
    }
    
    if (!deviceType || deviceType === InputDeviceType.MIDI) {
      this.midiCallbacks.delete(callback);
    }
    
    if (!deviceType || deviceType === InputDeviceType.Gamepad) {
      this.gamepadCallbacks.delete(callback);
    }
  }

  /**
   * Clean up all event listeners
   */
  cleanup(): void {
    this.disableKeyboard();
    // Additional cleanup for MIDI and Gamepad would go here
  }
}

export default InputHandler; 