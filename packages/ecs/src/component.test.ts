import { describe, expect, it, beforeEach } from 'vitest';
import { 
  registerComponent, 
  getComponentConstructor, 
  createComponent,
  clearComponentRegistry
} from './component';
import { Component, ComponentConstructor } from './types';

// Define a test component
class TestComponent implements Component {
  static type = 'test';
  type = TestComponent.type;
  
  constructor(public entityId: number, public value: string) {}
}

describe('Component', () => {
  beforeEach(() => {
    clearComponentRegistry();
  });

  describe('registerComponent', () => {
    it('should register a component type', () => {
      registerComponent(TestComponent);
      
      const retrieved = getComponentConstructor<TestComponent>(TestComponent.type);
      expect(retrieved).toBe(TestComponent);
    });

    it('should throw when registering the same component type twice', () => {
      registerComponent(TestComponent);
      
      expect(() => {
        registerComponent(TestComponent);
      }).toThrow(/already registered/);
    });
  });

  describe('getComponentConstructor', () => {
    it('should return undefined for unregistered component types', () => {
      const retrieved = getComponentConstructor<TestComponent>('nonexistent');
      expect(retrieved).toBeUndefined();
    });
  });

  describe('createComponent', () => {
    it('should create a component instance', () => {
      registerComponent(TestComponent);
      
      const component = createComponent<TestComponent>(TestComponent.type, 1, 'test-value');
      
      expect(component).toBeInstanceOf(TestComponent);
      expect(component.entityId).toBe(1);
      expect(component.value).toBe('test-value');
    });

    it('should throw for unregistered component types', () => {
      expect(() => {
        createComponent<TestComponent>('nonexistent', 1);
      }).toThrow(/not registered/);
    });
  });

  describe('clearComponentRegistry', () => {
    it('should clear all registered components', () => {
      registerComponent(TestComponent);
      clearComponentRegistry();
      
      const retrieved = getComponentConstructor<TestComponent>(TestComponent.type);
      expect(retrieved).toBeUndefined();
    });
  });
}); 