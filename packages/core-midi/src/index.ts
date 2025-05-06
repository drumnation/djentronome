/**
 * Core MIDI Package
 * 
 * Provides MIDI device connectivity and message handling for the Djentronome project.
 * 
 * @module @djentronome/core-midi
 */

// Export MIDIHandler
export { MIDIHandler } from './midi-handler';

// Export types
export {
  MIDIMessage,
  MIDIMessageType,
  MIDIConnectionStatus,
  MIDIDeviceInfo,
  MIDIMessageCallback,
  MIDIConnectionCallback,
  MIDIHandlerOptions
} from './types'; 