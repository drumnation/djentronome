import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DefaultTimeProvider, TimeProviderOptions } from './time-provider';

/**
 * Unit tests for the DefaultTimeProvider class
 * Test type: Unit
 */
describe('DefaultTimeProvider', () => {
  let timeProvider: DefaultTimeProvider;
  
  beforeEach(() => {
    // Mock performance.now
    vi.spyOn(performance, 'now').mockReturnValue(0);
    
    // Create a new provider for each test
    timeProvider = new DefaultTimeProvider();
  });
  
  it('should create a DefaultTimeProvider instance with default options', () => {
    expect(timeProvider).toBeInstanceOf(DefaultTimeProvider);
    expect(timeProvider.getTimeScale()).toBe(1.0);
  });
  
  it('should create a DefaultTimeProvider instance with custom time scale', () => {
    const options: TimeProviderOptions = { timeScale: 0.5 };
    const customTimeProvider = new DefaultTimeProvider(options);
    
    expect(customTimeProvider).toBeInstanceOf(DefaultTimeProvider);
    expect(customTimeProvider.getTimeScale()).toBe(0.5);
  });
  
  it('should start with time at 0', () => {
    expect(timeProvider.getTime()).toBe(0);
  });
  
  it('should update time based on fixed timestep', () => {
    // Simulate 16ms passing (consistent with 60fps)
    const timestamp = 16;
    const fixedDeltaTime = 1/60; // 60fps
    
    // Initial update
    timeProvider.update(timestamp, fixedDeltaTime);
    
    // Should have performed 0 fixed updates (time = 0) but accumulated time
    expect(timeProvider.getTime()).toBe(0);
    
    // Simulate another 16ms passing
    vi.spyOn(performance, 'now').mockReturnValue(32);
    timeProvider.update(32, fixedDeltaTime);
    
    // Should have performed 1 fixed update (time += fixedDeltaTime)
    // 1/60 ≈ 0.0167
    expect(timeProvider.getTime()).toBeCloseTo(fixedDeltaTime, 4);
  });
  
  it('should provide interpolation factor for rendering', () => {
    // Fixed delta time (60fps)
    const fixedDeltaTime = 1/60;
    
    // Update with partial step
    timeProvider.update(10, fixedDeltaTime);
    
    // Interpolation factor should be between 0 and 1
    const interpolation = timeProvider.getInterpolationFactor();
    expect(interpolation).toBeGreaterThanOrEqual(0);
    expect(interpolation).toBeLessThanOrEqual(1);
  });
  
  it('should not advance time when paused', () => {
    // First update
    timeProvider.update(16, 1/60);
    
    // Pause
    timeProvider.pause();
    expect(timeProvider.isPaused()).toBe(true);
    
    // Check time before second update
    const timeBefore = timeProvider.getTime();
    
    // Second update
    timeProvider.update(32, 1/60);
    
    // Time should not have changed
    expect(timeProvider.getTime()).toBe(timeBefore);
    expect(timeProvider.getDeltaTime()).toBe(0);
  });
  
  it('should resume time advances after being paused', () => {
    // First update
    timeProvider.update(16, 1/60);
    
    // Pause
    timeProvider.pause();
    
    // Second update (while paused)
    timeProvider.update(32, 1/60);
    
    // Record time while paused
    const timePaused = timeProvider.getTime();
    
    // Resume
    timeProvider.resume();
    expect(timeProvider.isPaused()).toBe(false);
    
    // Update after resume
    timeProvider.update(48, 1/60);
    
    // Time should advance after resuming
    expect(timeProvider.getTime()).toBeGreaterThan(timePaused);
  });
  
  it('should adjust time advancement with time scale', () => {
    // Set time scale to half speed
    timeProvider.setTimeScale(0.5);
    expect(timeProvider.getTimeScale()).toBe(0.5);
    
    // Update with normal deltaTime
    const normalDeltaTime = 1/60;
    timeProvider.update(32, normalDeltaTime);
    timeProvider.update(64, normalDeltaTime);
    
    // Create a reference provider with normal speed
    const normalProvider = new DefaultTimeProvider();
    normalProvider.update(32, normalDeltaTime);
    normalProvider.update(64, normalDeltaTime);
    
    // The slowed provider should advance time more slowly
    expect(timeProvider.getTime()).toBeLessThan(normalProvider.getTime());
    
    // Set time scale to double speed
    timeProvider.setTimeScale(2.0);
    expect(timeProvider.getTimeScale()).toBe(2.0);
    
    // Reset and update both providers
    timeProvider.reset();
    normalProvider.reset();
    
    timeProvider.update(32, normalDeltaTime);
    timeProvider.update(64, normalDeltaTime);
    
    normalProvider.update(32, normalDeltaTime);
    normalProvider.update(64, normalDeltaTime);
    
    // The accelerated provider should advance time more quickly
    expect(timeProvider.getTime()).toBeGreaterThan(normalProvider.getTime());
  });
  
  it('should reset all state correctly', () => {
    // Make some updates to advance time
    timeProvider.update(16, 1/60);
    timeProvider.update(32, 1/60);
    
    // Set time scale
    timeProvider.setTimeScale(0.5);
    
    // Reset
    timeProvider.reset();
    
    // Check all values are back to defaults
    expect(timeProvider.getTime()).toBe(0);
    expect(timeProvider.getDeltaTime()).toBe(0);
    expect(timeProvider.getInterpolationFactor()).toBe(0);
    // Time scale should remain unchanged
    expect(timeProvider.getTimeScale()).toBe(0.5);
  });
}); 