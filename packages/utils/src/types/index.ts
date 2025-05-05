/**
 * Types for utility functions
 * @packageDocumentation
 */

/**
 * A type representing a timer handle
 */
export type TimerHandle = number;

/**
 * A type for a callback function with no arguments
 */
export type Callback = () => void;

/**
 * A type for a callback function with a generic argument
 */
export type CallbackWithArg<T> = (arg: T) => void;

/**
 * Utility type to make all properties in an object optional recursively
 */
export type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

// Utility types will be defined here 