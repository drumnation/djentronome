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

// Class to be implemented in the future for handling inputs from different sources
export class InputHandler {
  private inputMap: InputMap;
  private bindings: InputBindings;

  constructor(customBindings?: Partial<InputBindings>) {
    this.inputMap = createEmptyInputMap();
    this.bindings = {
      ...defaultBindings,
      ...customBindings,
    };
  }

  // Methods to be implemented
  public update() {
    // Capture and normalize inputs from different sources
  }

  public getInputMap(): InputMap {
    return this.inputMap;
  }

  public rebindInput(source: keyof InputBindings, key: string, action: InputAction) {
    if (this.bindings[source]) {
      this.bindings[source][key] = action;
    }
  }
}

export default InputHandler; 