/**
 * Event emitter for the game loop
 */

import { GameLoopEvent, GameLoopEventHandler, GameLoopEventType } from './types';

/**
 * Event emitter that implements the observer pattern
 */
export class EventEmitter {
  private handlers: Map<GameLoopEventType, Set<GameLoopEventHandler>> = new Map();

  /**
   * Subscribe to an event
   * @param type Event type to subscribe to
   * @param handler Handler function to call when the event occurs
   * @returns Unsubscribe function
   */
  on(type: GameLoopEventType, handler: GameLoopEventHandler): () => void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    
    this.handlers.get(type)!.add(handler);
    
    // Return unsubscribe function
    return () => {
      const handlersForType = this.handlers.get(type);
      if (handlersForType) {
        handlersForType.delete(handler);
        
        // Remove the set if it's empty
        if (handlersForType.size === 0) {
          this.handlers.delete(type);
        }
      }
    };
  }

  /**
   * Subscribe to an event and unsubscribe after it occurs once
   * @param type Event type to subscribe to
   * @param handler Handler function to call when the event occurs
   * @returns Unsubscribe function
   */
  once(type: GameLoopEventType, handler: GameLoopEventHandler): () => void {
    // Create a wrapper that calls the handler and then unsubscribes
    const wrappedHandler: GameLoopEventHandler = (event) => {
      // Call the original handler
      handler(event);
      
      // Unsubscribe
      unsubscribe();
    };
    
    // Subscribe with the wrapped handler
    const unsubscribe = this.on(type, wrappedHandler);
    
    return unsubscribe;
  }

  /**
   * Unsubscribe from all events of a specific type
   * @param type Event type to unsubscribe from
   */
  off(type: GameLoopEventType): void {
    this.handlers.delete(type);
  }

  /**
   * Unsubscribe from all events
   */
  offAll(): void {
    this.handlers.clear();
  }

  /**
   * Emit an event
   * @param event Event to emit
   */
  emit(event: GameLoopEvent): void {
    const handlersForType = this.handlers.get(event.type);
    
    if (handlersForType) {
      // Create a copy of the handlers to avoid issues if handlers modify the set
      const handlers = Array.from(handlersForType);
      
      // Call each handler with the event
      for (const handler of handlers) {
        try {
          handler(event);
        } catch (error) {
          console.error(`Error in event handler for ${event.type}:`, error);
          
          // Emit an error event
          if (event.type !== GameLoopEventType.ERROR) {
            this.emit({
              type: GameLoopEventType.ERROR,
              time: event.time,
              deltaTime: event.deltaTime,
              data: {
                originalEvent: event,
                error
              }
            });
          }
        }
      }
    }
  }
} 