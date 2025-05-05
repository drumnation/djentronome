import { describe, it, expect } from 'vitest';
import { 
  InputHandler, 
  createEmptyInputMap, 
  createEmptyInputState,
  defaultBindings,
  InputAction
} from './index';

describe('InputHandler', () => {
  it('should initialize with default bindings', () => {
    const handler = new InputHandler();
    expect(handler).toBeDefined();
  });

  it('should allow custom bindings', () => {
    const customBindings = {
      keyboard: {
        'KeyX': 'Jump' as InputAction,
      }
    };
    const handler = new InputHandler(customBindings);
    expect(handler).toBeDefined();
  });
});

describe('Input state functions', () => {
  it('should create an empty input state', () => {
    const state = createEmptyInputState();
    expect(state.value).toBe(0);
    expect(state.pressed).toBe(false);
    expect(state.released).toBe(false);
    expect(state.held).toBe(false);
  });

  it('should create an empty input map with all actions', () => {
    const map = createEmptyInputMap();
    expect(map.Move).toBeDefined();
    expect(map.Jump).toBeDefined();
    expect(map.Attack).toBeDefined();
    expect(map.Interact).toBeDefined();
    expect(map.Menu).toBeDefined();
    expect(map.Pause).toBeDefined();
  });
});

describe('Default bindings', () => {
  it('should have keyboard bindings', () => {
    expect(defaultBindings.keyboard).toBeDefined();
    expect(defaultBindings.keyboard['Space']).toBe('Jump');
  });

  it('should have gamepad bindings', () => {
    expect(defaultBindings.gamepad).toBeDefined();
    expect(defaultBindings.gamepad['button0']).toBe('Jump');
  });

  it('should have touch bindings', () => {
    expect(defaultBindings.touch).toBeDefined();
    expect(defaultBindings.touch['buttonA']).toBe('Jump');
  });
}); 