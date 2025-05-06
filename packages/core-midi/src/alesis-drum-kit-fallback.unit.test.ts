import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AlesisDrumKitFallback, FallbackKeys } from './alesis-drum-kit-fallback';
import { ALESIS_NITRO_KICK_NOTE, ALESIS_NITRO_SNARE_NOTE } from './alesis-drum-kit';

describe('AlesisDrumKitFallback', () => {
  let fallback: AlesisDrumKitFallback;
  
  // Mock window and event listener
  const mockWindow = {
    addEventListener: vi.fn(),
    removeEventListener: vi.fn()
  };
  
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Mock performance.now
    vi.spyOn(performance, 'now').mockReturnValue(1000);
    
    // Create fallback with mock window
    fallback = new AlesisDrumKitFallback({
      target: mockWindow as unknown as Window
    });
  });
  
  describe('Initialization', () => {
    it('should add event listener on initialize', () => {
      fallback.initialize();
      
      expect(mockWindow.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
    });
    
    it('should not initialize if already initialized', () => {
      fallback.initialize();
      fallback.initialize();
      
      expect(mockWindow.addEventListener).toHaveBeenCalledTimes(1);
    });
    
    it('should not initialize if disabled', () => {
      const disabledFallback = new AlesisDrumKitFallback({
        enabled: false,
        target: mockWindow as unknown as Window
      });
      
      disabledFallback.initialize();
      
      expect(mockWindow.addEventListener).not.toHaveBeenCalled();
    });
    
    it('should not initialize if no target', () => {
      const noTargetFallback = new AlesisDrumKitFallback({
        target: undefined
      });
      
      noTargetFallback.initialize();
      
      expect(mockWindow.addEventListener).not.toHaveBeenCalled();
    });
  });
  
  describe('Keyboard Events', () => {
    it('should trigger kick callback on kick key', () => {
      // Initialize fallback
      fallback.initialize();
      
      // Extract the keydown handler
      const keydownHandler = mockWindow.addEventListener.mock.calls[0][1];
      
      // Create kick callback
      const kickCallback = vi.fn();
      fallback.onKickHit(kickCallback);
      
      // Create mock event for kick key
      const kickEvent = {
        code: FallbackKeys.KICK,
        defaultPrevented: false,
        repeat: false,
        preventDefault: vi.fn()
      };
      
      // Call the handler with the event
      keydownHandler(kickEvent);
      
      // Verify callback was called with correct data
      expect(kickCallback).toHaveBeenCalledWith({
        timestamp: 1000,
        velocity: 100
      });
      
      // Verify preventDefault was called
      expect(kickEvent.preventDefault).toHaveBeenCalled();
    });
    
    it('should trigger snare callback on snare key', () => {
      // Initialize fallback
      fallback.initialize();
      
      // Extract the keydown handler
      const keydownHandler = mockWindow.addEventListener.mock.calls[0][1];
      
      // Create snare callback
      const snareCallback = vi.fn();
      fallback.onSnareHit(snareCallback);
      
      // Create mock event for snare key
      const snareEvent = {
        code: FallbackKeys.SNARE,
        defaultPrevented: false,
        repeat: false,
        preventDefault: vi.fn()
      };
      
      // Call the handler with the event
      keydownHandler(snareEvent);
      
      // Verify callback was called with correct data
      expect(snareCallback).toHaveBeenCalledWith({
        timestamp: 1000,
        velocity: 100
      });
      
      // Verify preventDefault was called
      expect(snareEvent.preventDefault).toHaveBeenCalled();
    });
    
    it('should not trigger callback on repeat events', () => {
      // Initialize fallback
      fallback.initialize();
      
      // Extract the keydown handler
      const keydownHandler = mockWindow.addEventListener.mock.calls[0][1];
      
      // Create callbacks
      const kickCallback = vi.fn();
      fallback.onKickHit(kickCallback);
      
      // Create mock event with repeat flag
      const repeatEvent = {
        code: FallbackKeys.KICK,
        defaultPrevented: false,
        repeat: true,
        preventDefault: vi.fn()
      };
      
      // Call the handler with the event
      keydownHandler(repeatEvent);
      
      // Verify callback was not called
      expect(kickCallback).not.toHaveBeenCalled();
      
      // Verify preventDefault was not called
      expect(repeatEvent.preventDefault).not.toHaveBeenCalled();
    });
    
    it('should not trigger callback if already prevented', () => {
      // Initialize fallback
      fallback.initialize();
      
      // Extract the keydown handler
      const keydownHandler = mockWindow.addEventListener.mock.calls[0][1];
      
      // Create callbacks
      const kickCallback = vi.fn();
      fallback.onKickHit(kickCallback);
      
      // Create mock event with defaultPrevented flag
      const preventedEvent = {
        code: FallbackKeys.KICK,
        defaultPrevented: true,
        repeat: false,
        preventDefault: vi.fn()
      };
      
      // Call the handler with the event
      keydownHandler(preventedEvent);
      
      // Verify callback was not called
      expect(kickCallback).not.toHaveBeenCalled();
      
      // Verify preventDefault was not called
      expect(preventedEvent.preventDefault).not.toHaveBeenCalled();
    });
  });
  
  describe('Manual Triggers', () => {
    it('should trigger kick callbacks with triggerKickHit', () => {
      const kickCallback = vi.fn();
      fallback.onKickHit(kickCallback);
      
      fallback.triggerKickHit();
      
      expect(kickCallback).toHaveBeenCalledWith({
        timestamp: 1000,
        velocity: 100
      });
    });
    
    it('should trigger snare callbacks with triggerSnareHit', () => {
      const snareCallback = vi.fn();
      fallback.onSnareHit(snareCallback);
      
      fallback.triggerSnareHit();
      
      expect(snareCallback).toHaveBeenCalledWith({
        timestamp: 1000,
        velocity: 100
      });
    });
    
    it('should use provided velocity', () => {
      const kickCallback = vi.fn();
      fallback.onKickHit(kickCallback);
      
      fallback.triggerKickHit(75);
      
      expect(kickCallback).toHaveBeenCalledWith({
        timestamp: 1000,
        velocity: 75
      });
    });
  });
  
  describe('Cleanup', () => {
    it('should remove event listener and clear callbacks', () => {
      // Initialize fallback
      fallback.initialize();
      
      // Extract the keydown handler
      const keydownHandler = mockWindow.addEventListener.mock.calls[0][1];
      
      // Add callbacks
      const kickCallback = vi.fn();
      const snareCallback = vi.fn();
      fallback.onKickHit(kickCallback);
      fallback.onSnareHit(snareCallback);
      
      // Cleanup
      fallback.cleanup();
      
      // Verify event listener was removed
      expect(mockWindow.removeEventListener).toHaveBeenCalledWith('keydown', keydownHandler);
      
      // Verify callbacks no longer work
      fallback.triggerKickHit();
      fallback.triggerSnareHit();
      
      expect(kickCallback).not.toHaveBeenCalled();
      expect(snareCallback).not.toHaveBeenCalled();
    });
  });
  
  describe('Static Properties', () => {
    it('should expose note constants', () => {
      expect(AlesisDrumKitFallback.KICK_NOTE).toBe(ALESIS_NITRO_KICK_NOTE);
      expect(AlesisDrumKitFallback.SNARE_NOTE).toBe(ALESIS_NITRO_SNARE_NOTE);
    });
  });
}); 