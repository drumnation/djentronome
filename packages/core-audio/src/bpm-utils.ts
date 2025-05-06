/**
 * BPM Utility Functions
 * 
 * Provides utilities for BPM-related calculations and synchronization
 */

/**
 * The basic BpmUtils object for calculations related to tempo
 */
export const BpmUtils = {
  /**
   * Calculate milliseconds per beat
   * @param bpm Beats per minute
   * @returns Milliseconds per beat
   */
  msPerBeat(bpm: number): number {
    return 60000 / bpm;
  },
  
  /**
   * Calculate seconds per beat
   * @param bpm Beats per minute
   * @returns Seconds per beat
   */
  secondsPerBeat(bpm: number): number {
    return 60 / bpm;
  },
  
  /**
   * Convert beat number to seconds
   * @param beat Beat number (starting from 0)
   * @param bpm Beats per minute
   * @returns Time in seconds
   */
  beatToSeconds(beat: number, bpm: number): number {
    return beat * this.secondsPerBeat(bpm);
  },
  
  /**
   * Convert seconds to beat number and phase
   * @param seconds Time in seconds
   * @param bpm Beats per minute
   * @returns Object with beat number and phase (0-1)
   */
  secondsToBeat(seconds: number, bpm: number): { beat: number; phase: number } {
    const beatsPerSecond = bpm / 60;
    const totalBeats = seconds * beatsPerSecond;
    const beatNumber = Math.floor(totalBeats);
    const phase = totalBeats - beatNumber;
    
    return {
      beat: beatNumber,
      phase
    };
  },
  
  /**
   * Convert bar:beat:division to total beats
   * @param bar Bar number (starting from 1)
   * @param beat Beat number within bar (starting from 1)
   * @param division Division within beat (0-1)
   * @param beatsPerBar Beats per bar (time signature numerator)
   * @returns Total beats from start
   */
  barBeatToBeats(
    bar: number, 
    beat: number, 
    division: number = 0, 
    beatsPerBar: number = 4
  ): number {
    return (bar - 1) * beatsPerBar + (beat - 1) + division;
  },
  
  /**
   * Convert total beats to bar:beat:division
   * @param totalBeats Total number of beats from start
   * @param beatsPerBar Beats per bar (time signature numerator)
   * @returns Object with bar, beat and phase
   */
  beatsToBarBeat(
    totalBeats: number, 
    beatsPerBar: number = 4
  ): { bar: number; beat: number; phase: number } {
    const bar = Math.floor(totalBeats / beatsPerBar) + 1;
    const beatInBar = (totalBeats % beatsPerBar);
    const beat = Math.floor(beatInBar) + 1;
    const phase = beatInBar - Math.floor(beatInBar);
    
    return { bar, beat, phase };
  },
  
  /**
   * Calculate time in seconds for a specific bar and beat
   * @param bar Bar number (starting from 1)
   * @param beat Beat number within bar (starting from 1)
   * @param division Division within beat (0-1)
   * @param bpm Beats per minute
   * @param beatsPerBar Beats per bar (time signature numerator)
   * @returns Time in seconds
   */
  timeForBarBeat(
    bar: number, 
    beat: number, 
    division: number = 0, 
    bpm: number = 120, 
    beatsPerBar: number = 4
  ): number {
    const totalBeats = this.barBeatToBeats(bar, beat, division, beatsPerBar);
    return this.beatToSeconds(totalBeats, bpm);
  },
  
  /**
   * Calculate bar:beat:division for a specific time
   * @param seconds Time in seconds
   * @param bpm Beats per minute
   * @param beatsPerBar Beats per bar (time signature numerator)
   * @returns Object with bar, beat and phase
   */
  getPositionAtTime(
    seconds: number, 
    bpm: number = 120, 
    beatsPerBar: number = 4
  ): { bar: number; beat: number; phase: number } {
    const beatInfo = this.secondsToBeat(seconds, bpm);
    const barBeatInfo = this.beatsToBarBeat(beatInfo.beat, beatsPerBar);
    
    // Preserve the original phase from secondsToBeat
    return {
      bar: barBeatInfo.bar,
      beat: barBeatInfo.beat,
      phase: beatInfo.phase
    };
  },
  
  /**
   * Get the next beat time from current position
   * @param currentSeconds Current time in seconds
   * @param bpm Beats per minute
   * @returns Time in seconds for the next beat
   */
  getNextBeatTime(currentSeconds: number, bpm: number): number {
    const { beat } = this.secondsToBeat(currentSeconds, bpm);
    return this.beatToSeconds(beat + 1, bpm);
  },
  
  /**
   * Calculate frequency for a specific note
   * @param midiNote MIDI note number (60 = C4/middle C)
   * @returns Frequency in Hz
   */
  noteToFrequency(midiNote: number): number {
    return 440 * Math.pow(2, (midiNote - 69) / 12);
  },
  
  /**
   * Get a readable description of a time signature
   * @param beatsPerBar Beats per bar (numerator)
   * @param beatUnit Beat unit (denominator)
   * @returns String representation (e.g., "4/4", "3/4")
   */
  getTimeSignatureString(beatsPerBar: number, beatUnit: number): string {
    return `${beatsPerBar}/${beatUnit}`;
  },
  
  /**
   * Calculate scroll position based on time and BPM
   * @param timeSec Current time in seconds
   * @param bpm Beats per minute
   * @param laneHeight Height of one beat in pixels
   * @returns Scroll position in pixels
   */
  calculateScrollOffset(timeSec: number, bpm: number, laneHeight: number = 100): number {
    const beatsPerSec = bpm / 60;
    const beatsTraveled = timeSec * beatsPerSec;
    return beatsTraveled * laneHeight;
  },
  
  /**
   * Calculate vertical position of a note based on its time and current time
   * @param noteTimeSec Note time in seconds
   * @param currentTimeSec Current playback time in seconds
   * @param bpm Beats per minute
   * @param laneHeight Height of one beat in pixels
   * @returns Vertical position in pixels
   */
  calculateNoteYPosition(
    noteTimeSec: number, 
    currentTimeSec: number, 
    bpm: number, 
    laneHeight: number = 100
  ): number {
    const beatsPerSec = bpm / 60;
    const beatDifference = (noteTimeSec - currentTimeSec) * beatsPerSec;
    return beatDifference * laneHeight;
  }
}; 