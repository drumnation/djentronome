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
  DrumHitEvent,
  DrumHitCallback
} from './alesis-drum-kit';

// Export Fallback Controller
export {
  AlesisDrumKitFallback,
  FallbackKeys,
  DrumKitFallbackOptions
} from './alesis-drum-kit-fallback';

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