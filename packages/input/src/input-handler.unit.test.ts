import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { InputHandler, InputDeviceType } from './index';

/**
 * Unit tests for the InputHandler class
 * Test type: Unit
 */
describe('InputHandler', () => {
  let inputHandler: InputHandler;
  let mockCallback: any;

  // Mock window event functions
  const originalAddEventListener = window.addEventListener;
  const originalRemoveEventListener = window.removeEventListener;

  beforeEach(() => {
    // Create a new input handler before each test
    inputHandler = new InputHandler();
    mockCallback = vi.fn();
    
    // Mock window event functions
    window.addEventListener = vi.fn();
    window.removeEventListener = vi.fn();
    
    // Mock performance.now
    vi.spyOn(performance, 'now').mockReturnValue(1000);
  });
  
  afterEach(() => {
    // Restore original functions
    window.addEventListener = originalAddEventListener;
    window.removeEventListener = originalRemoveEventListener;
    vi.restoreAllMocks();
  });

  it('should create an InputHandler instance', () => {
    expect(inputHandler).toBeInstanceOf(InputHandler);
  });

  it('should enable keyboard input', () => {
    inputHandler.enableKeyboard();
    expect(window.addEventListener).toHaveBeenCalledTimes(2);
    expect(window.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
    expect(window.addEventListener).toHaveBeenCalledWith('keyup', expect.any(Function));
  });

  it('should disable keyboard input', () => {
    inputHandler.enableKeyboard();
    inputHandler.disableKeyboard();
    expect(window.removeEventListener).toHaveBeenCalledTimes(2);
    expect(window.removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
    expect(window.removeEventListener).toHaveBeenCalledWith('keyup', expect.any(Function));
  });

  it('should register and call a callback', () => {
    // Mock the handleKeyDown function to manually trigger it
    // @ts-ignore - We need to access private method for testing
    const handleKeyDown = inputHandler.handleKeyDown;
    
    // Register our mock callback
    inputHandler.registerCallback(mockCallback, InputDeviceType.Keyboard);
    
    // Simulate a keydown event
    handleKeyDown({ code: 'KeyA' } as KeyboardEvent);
    
    // Verify the callback was called with the right parameters
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(expect.objectContaining({
      deviceType: InputDeviceType.Keyboard,
      code: 'KeyA',
      pressed: true,
      timestamp: 1000
    }));
  });

  it('should unregister a callback', () => {
    // Register and then unregister the callback
    inputHandler.registerCallback(mockCallback, InputDeviceType.Keyboard);
    inputHandler.unregisterCallback(mockCallback, InputDeviceType.Keyboard);
    
    // Mock the handleKeyDown function to manually trigger it
    // @ts-ignore - We need to access private method for testing
    const handleKeyDown = inputHandler.handleKeyDown;
    
    // Simulate a keydown event
    handleKeyDown({ code: 'KeyA' } as KeyboardEvent);
    
    // Verify the callback was not called
    expect(mockCallback).not.toHaveBeenCalled();
  });
}); 