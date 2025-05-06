/**
 * Type definitions for the FileSelector component
 */

export enum FileSelectionStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

export interface FileInfo {
  name: string;
  type: string;
  size: number;
  lastModified?: number;
}

export interface FileSelectorProps {
  /**
   * Array of accepted file types (e.g., 'audio/mp3', 'audio/*')
   */
  acceptedFileTypes?: string[];
  
  /**
   * Maximum file size in bytes
   */
  maxFileSize?: number;
  
  /**
   * Callback function triggered when a file is selected
   */
  onFileSelect?: (file: File) => void;
  
  /**
   * Callback function triggered when file selection succeeds
   */
  onSuccess?: (file: File, fileInfo: FileInfo) => void;
  
  /**
   * Callback function triggered when file selection fails
   */
  onError?: (error: Error) => void;
  
  /**
   * Custom label for the file input button
   */
  buttonLabel?: string;
  
  /**
   * Drag and drop support
   */
  enableDragAndDrop?: boolean;
  
  /**
   * Show file details after selection
   */
  showFileDetails?: boolean;
  
  /**
   * Initial status of the component
   */
  initialStatus?: FileSelectionStatus;
  
  /**
   * Custom CSS class for styling
   */
  className?: string;
} 