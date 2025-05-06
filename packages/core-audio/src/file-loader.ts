/**
 * File loader for handling local audio files
 */
import { AudioFormat } from './index';

/**
 * Options for loading a file
 */
export interface FileLoaderOptions {
  /**
   * AudioContext to use for decoding
   */
  context: AudioContext;
}

/**
 * Source of audio file
 */
export enum AudioSource {
  /**
   * File object from file input or drag-and-drop
   */
  FILE = 'file',
  
  /**
   * File from URL (local file:// or remote http://)
   */
  URL = 'url',
  
  /**
   * ArrayBuffer containing audio data
   */
  BUFFER = 'buffer'
}

/**
 * Information about loaded audio file
 */
export interface AudioFileInfo {
  /**
   * Original name of the file
   */
  name: string;
  
  /**
   * Format of the audio file
   */
  format: AudioFormat;
  
  /**
   * Size of the file in bytes
   */
  size: number;
  
  /**
   * Duration of the audio in seconds (if available)
   */
  duration?: number;
  
  /**
   * Source of the audio file
   */
  source: AudioSource;
}

/**
 * Class for handling loading of audio files from various sources
 */
export class FileLoader {
  private context: AudioContext;
  
  /**
   * Create a new file loader
   */
  constructor(options: FileLoaderOptions) {
    this.context = options.context;
  }
  
  /**
   * Load audio from a File object
   */
  public async loadFromFile(file: File): Promise<{ buffer: AudioBuffer, info: AudioFileInfo }> {
    try {
      // Validate file
      this.validateFile(file);
      
      // Read file as ArrayBuffer
      const arrayBuffer = await this.readFileAsArrayBuffer(file);
      
      // Decode audio data
      const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
      
      // Get file info
      const info: AudioFileInfo = {
        name: file.name,
        format: this.getAudioFormatFromFile(file),
        size: file.size,
        duration: audioBuffer.duration,
        source: AudioSource.FILE
      };
      
      return { buffer: audioBuffer, info };
    } catch (error) {
      console.error('Failed to load audio from file:', error);
      throw error;
    }
  }
  
  /**
   * Load audio from a URL
   */
  public async loadFromUrl(url: string, filename?: string): Promise<{ buffer: AudioBuffer, info: AudioFileInfo }> {
    try {
      // Fetch the file
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }
      
      // Get response as ArrayBuffer
      const arrayBuffer = await response.arrayBuffer();
      
      // Decode audio data
      const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
      
      // Extract filename from URL if not provided
      const name = filename || this.getFilenameFromUrl(url);
      
      // Get file info
      const info: AudioFileInfo = {
        name,
        format: this.getAudioFormatFromUrl(url),
        size: arrayBuffer.byteLength,
        duration: audioBuffer.duration,
        source: AudioSource.URL
      };
      
      return { buffer: audioBuffer, info };
    } catch (error) {
      console.error('Failed to load audio from URL:', error);
      throw error;
    }
  }
  
  /**
   * Load audio from an ArrayBuffer
   */
  public async loadFromArrayBuffer(
    arrayBuffer: ArrayBuffer, 
    name: string, 
    format: AudioFormat
  ): Promise<{ buffer: AudioBuffer, info: AudioFileInfo }> {
    try {
      // Decode audio data
      const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
      
      // Get file info
      const info: AudioFileInfo = {
        name,
        format,
        size: arrayBuffer.byteLength,
        duration: audioBuffer.duration,
        source: AudioSource.BUFFER
      };
      
      return { buffer: audioBuffer, info };
    } catch (error) {
      console.error('Failed to load audio from ArrayBuffer:', error);
      throw error;
    }
  }
  
  /**
   * Validate that a file is a supported audio format
   */
  private validateFile(file: File): void {
    // Check MIME type
    if (!file.type.startsWith('audio/')) {
      throw new Error(`File is not an audio file: ${file.type}`);
    }
    
    // Try to determine format
    const format = this.getAudioFormatFromFile(file);
    if (!format) {
      throw new Error(`Unsupported audio format: ${file.type}`);
    }
  }
  
  /**
   * Read a File as ArrayBuffer
   */
  private readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        resolve(reader.result as ArrayBuffer);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  }
  
  /**
   * Get audio format from a File object
   */
  private getAudioFormatFromFile(file: File): AudioFormat {
    // Check MIME type
    if (file.type === 'audio/mp3' || file.type === 'audio/mpeg') {
      return AudioFormat.MP3;
    } else if (file.type === 'audio/wav' || file.type === 'audio/x-wav') {
      return AudioFormat.WAV;
    } else if (file.type === 'audio/ogg') {
      return AudioFormat.OGG;
    }
    
    // Try to determine from extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension === 'mp3') {
      return AudioFormat.MP3;
    } else if (extension === 'wav') {
      return AudioFormat.WAV;
    } else if (extension === 'ogg') {
      return AudioFormat.OGG;
    }
    
    // Default to MP3 if we can't determine
    return AudioFormat.MP3;
  }
  
  /**
   * Get audio format from URL
   */
  private getAudioFormatFromUrl(url: string): AudioFormat {
    // Extract extension from URL
    const extension = url.split('.').pop()?.toLowerCase();
    
    if (extension === 'mp3') {
      return AudioFormat.MP3;
    } else if (extension === 'wav') {
      return AudioFormat.WAV;
    } else if (extension === 'ogg') {
      return AudioFormat.OGG;
    }
    
    // Default to MP3 if we can't determine
    return AudioFormat.MP3;
  }
  
  /**
   * Extract filename from URL
   */
  private getFilenameFromUrl(url: string): string {
    // Try to extract filename from URL
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const filename = pathname.split('/').pop() || 'audio-file';
      return filename;
    } catch (error) {
      // If URL parsing fails, extract the last part of the path
      const parts = url.split('/');
      return parts[parts.length - 1] || 'audio-file';
    }
  }
} 