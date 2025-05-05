import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DebugOverlay } from './index';

describe('DebugOverlay', () => {
  beforeEach(() => {
    // Mock console methods
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be defined', () => {
    const overlay = new DebugOverlay();
    expect(overlay).toBeDefined();
  });

  it('should show the overlay', () => {
    const overlay = new DebugOverlay();
    overlay.show();
    expect(console.log).toHaveBeenCalledWith('Debug overlay shown');
  });

  it('should hide the overlay', () => {
    const overlay = new DebugOverlay();
    overlay.hide();
    expect(console.log).toHaveBeenCalledWith('Debug overlay hidden');
  });

  it('should add metrics', () => {
    const overlay = new DebugOverlay();
    overlay.addMetric('fps', 60);
    expect(console.log).toHaveBeenCalledWith('Added metric: fps = 60');
  });
}); 