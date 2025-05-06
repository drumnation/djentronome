/**
 * Common easing functions for animations
 */

// Linear easing (no easing)
export const linear = (t: number): number => t;

// Sine easing functions
export const easeInSine = (t: number): number => 1 - Math.cos((t * Math.PI) / 2);
export const easeOutSine = (t: number): number => Math.sin((t * Math.PI) / 2);
export const easeInOutSine = (t: number): number => -(Math.cos(Math.PI * t) - 1) / 2;

// Cubic easing functions
export const easeInCubic = (t: number): number => t * t * t;
export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
export const easeInOutCubic = (t: number): number => 
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// Exponential easing functions
export const easeInExpo = (t: number): number => (t === 0) ? 0 : Math.pow(2, 10 * t - 10);
export const easeOutExpo = (t: number): number => (t === 1) ? 1 : 1 - Math.pow(2, -10 * t);
export const easeInOutExpo = (t: number): number => {
  if (t === 0) return 0;
  if (t === 1) return 1;
  return t < 0.5
    ? Math.pow(2, 20 * t - 10) / 2
    : (2 - Math.pow(2, -20 * t + 10)) / 2;
}; 