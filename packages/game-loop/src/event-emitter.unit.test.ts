import { describe, it, expect, vi } from 'vitest';
import { EventEmitter } from './event-emitter';
import { GameLoopEventType, GameLoopEvent } from './types';

/**
 * Unit tests for the EventEmitter class
 * Test type: Unit
 */
describe('EventEmitter', () => {
  it('should create an EventEmitter instance', () => {
    const emitter = new EventEmitter();
    expect(emitter).toBeInstanceOf(EventEmitter);
  });
  
  it('should allow subscribing to events', () => {
    const emitter = new EventEmitter();
    const handler = vi.fn();
    
    const unsubscribe = emitter.on(GameLoopEventType.START, handler);
    
    expect(typeof unsubscribe).toBe('function');
  });
  
  it('should call handlers when emitting events', () => {
    const emitter = new EventEmitter();
    const handler = vi.fn();
    
    emitter.on(GameLoopEventType.START, handler);
    
    const event: GameLoopEvent = {
      type: GameLoopEventType.START,
      time: 0,
      deltaTime: 0
    };
    
    emitter.emit(event);
    
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(event);
  });
  
  it('should allow unsubscribing from events', () => {
    const emitter = new EventEmitter();
    const handler = vi.fn();
    
    const unsubscribe = emitter.on(GameLoopEventType.START, handler);
    
    // Unsubscribe
    unsubscribe();
    
    const event: GameLoopEvent = {
      type: GameLoopEventType.START,
      time: 0,
      deltaTime: 0
    };
    
    emitter.emit(event);
    
    expect(handler).not.toHaveBeenCalled();
  });
  
  it('should allow unsubscribing from all events of a type', () => {
    const emitter = new EventEmitter();
    const handler1 = vi.fn();
    const handler2 = vi.fn();
    
    emitter.on(GameLoopEventType.START, handler1);
    emitter.on(GameLoopEventType.START, handler2);
    
    // Unsubscribe all START handlers
    emitter.off(GameLoopEventType.START);
    
    const event: GameLoopEvent = {
      type: GameLoopEventType.START,
      time: 0,
      deltaTime: 0
    };
    
    emitter.emit(event);
    
    expect(handler1).not.toHaveBeenCalled();
    expect(handler2).not.toHaveBeenCalled();
  });
  
  it('should allow unsubscribing from all events', () => {
    const emitter = new EventEmitter();
    const startHandler = vi.fn();
    const stopHandler = vi.fn();
    
    emitter.on(GameLoopEventType.START, startHandler);
    emitter.on(GameLoopEventType.STOP, stopHandler);
    
    // Unsubscribe all handlers
    emitter.offAll();
    
    const startEvent: GameLoopEvent = {
      type: GameLoopEventType.START,
      time: 0,
      deltaTime: 0
    };
    
    const stopEvent: GameLoopEvent = {
      type: GameLoopEventType.STOP,
      time: 0,
      deltaTime: 0
    };
    
    emitter.emit(startEvent);
    emitter.emit(stopEvent);
    
    expect(startHandler).not.toHaveBeenCalled();
    expect(stopHandler).not.toHaveBeenCalled();
  });
  
  it('should support once subscription', () => {
    const emitter = new EventEmitter();
    const handler = vi.fn();
    
    emitter.once(GameLoopEventType.START, handler);
    
    const event: GameLoopEvent = {
      type: GameLoopEventType.START,
      time: 0,
      deltaTime: 0
    };
    
    // First emit should trigger handler
    emitter.emit(event);
    expect(handler).toHaveBeenCalledTimes(1);
    
    // Second emit should not trigger handler (already unsubscribed)
    emitter.emit(event);
    expect(handler).toHaveBeenCalledTimes(1);
  });
  
  it('should emit error events when handlers throw', () => {
    const emitter = new EventEmitter();
    const errorHandler = vi.fn();
    
    // Subscribe to ERROR events
    emitter.on(GameLoopEventType.ERROR, errorHandler);
    
    // Create a handler that throws
    const badHandler = () => {
      throw new Error('Test error');
    };
    
    // Subscribe bad handler
    emitter.on(GameLoopEventType.START, badHandler);
    
    const event: GameLoopEvent = {
      type: GameLoopEventType.START,
      time: 0,
      deltaTime: 0
    };
    
    // This should emit a START event (triggering the error)
    // and then an ERROR event
    emitter.emit(event);
    
    // Error handler should have been called
    expect(errorHandler).toHaveBeenCalledTimes(1);
    
    // Error event should contain the original event
    const errorEvent = errorHandler.mock.calls[0]?.[0];
    expect(errorEvent?.type).toBe(GameLoopEventType.ERROR);
    expect(errorEvent?.data?.originalEvent).toBe(event);
    expect(errorEvent?.data?.error instanceof Error).toBe(true);
  });
  
  it('should not emit error for errors in error handlers', () => {
    const emitter = new EventEmitter();
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Create an error handler that throws
    const badErrorHandler = () => {
      throw new Error('Error in error handler');
    };
    
    // Subscribe bad handler to ERROR events
    emitter.on(GameLoopEventType.ERROR, badErrorHandler);
    
    // Create an error event
    const errorEvent: GameLoopEvent = {
      type: GameLoopEventType.ERROR,
      time: 0,
      deltaTime: 0,
      data: { error: new Error('Original error') }
    };
    
    // This should not cause an infinite loop
    emitter.emit(errorEvent);
    
    // Console.error should have been called for the error in the error handler
    expect(errorSpy).toHaveBeenCalled();
    
    // Clean up
    errorSpy.mockRestore();
  });
}); 