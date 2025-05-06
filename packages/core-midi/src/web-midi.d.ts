/**
 * Type definitions for the Web MIDI API
 */
declare namespace WebMidi {
  interface MIDIOptions {
    sysex?: boolean;
    software?: boolean;
  }

  interface MIDIAccess extends EventTarget {
    inputs: Map<string, MIDIInput>;
    outputs: Map<string, MIDIOutput>;
    onstatechange: ((this: MIDIAccess, ev: MIDIConnectionEvent) => any) | null;
    sysexEnabled: boolean;
    addEventListener(type: 'statechange', listener: (event: MIDIConnectionEvent) => void): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener(type: 'statechange', listener: (event: MIDIConnectionEvent) => void): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
  }

  interface MIDIConnectionEvent extends Event {
    port: MIDIPort;
  }

  interface MIDIMessageEvent extends Event {
    data: Uint8Array;
    timeStamp: number;
  }

  interface MIDIPort extends EventTarget {
    id: string;
    manufacturer: string;
    name: string;
    type: 'input' | 'output';
    version: string;
    state: 'connected' | 'disconnected';
    connection: 'open' | 'closed' | 'pending';
    onstatechange: ((this: MIDIPort, ev: Event) => any) | null;
    open(): Promise<MIDIPort>;
    close(): Promise<MIDIPort>;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
  }

  interface MIDIInput extends MIDIPort {
    type: 'input';
    onmidimessage: ((this: MIDIInput, ev: MIDIMessageEvent) => any) | null;
    addEventListener(type: 'midimessage', listener: (event: MIDIMessageEvent) => void): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener(type: 'midimessage', listener: (event: MIDIMessageEvent) => void): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
  }

  interface MIDIOutput extends MIDIPort {
    type: 'output';
    send(data: number[] | Uint8Array, timestamp?: DOMHighResTimeStamp): void;
    clear(): void;
  }
}

interface Navigator {
  requestMIDIAccess(options?: WebMidi.MIDIOptions): Promise<WebMidi.MIDIAccess>;
} 