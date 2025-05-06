/**
 * Core MIDI Package
 * 
 * Provides MIDI device connectivity and message handling for the Djentronome project.
 * 
 * @module @djentronome/core-midi
 */

// Export MIDIHandler
export { MIDIHandler } from './midi-handler';

// Export Alesis Drum Kit
export { 
  AlesisDrumKit,
  ALESIS_NITRO_KICK_NOTE,
  ALESIS_NITRO_SNARE_NOTE,
} from './alesis-drum-kit';

// Export types from Alesis Drum Kit
export type {
  DrumHitEvent,
  DrumHitCallback
} from './alesis-drum-kit';

// Export Fallback Controller
export {
  AlesisDrumKitFallback,
  FallbackKeys,
} from './alesis-drum-kit-fallback';

// Export types from Fallback Controller
export type {
  DrumKitFallbackOptions
} from './alesis-drum-kit-fallback';

// Export types
export type {
  MIDIMessage,
  MIDIMessageType,
  MIDIConnectionStatus,
  MIDIDeviceInfo,
  MIDIMessageCallback,
  MIDIConnectionCallback,
  MIDIHandlerOptions
} from './types'; 