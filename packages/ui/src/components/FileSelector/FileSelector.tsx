/**
 * FileSelector Component
 * 
 * A UI component for selecting audio files with support for drag and drop.
 */
import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  FileSelectorContainer,
  FileSelectorInput,
  FileSelectorLabel,
  FileSelectorButton,
  FileInfo,
  FileName,
  FileDetails,
  FileDetail,
  ErrorMessage,
  DragActive,
  IconContainer,
  LoadingSpinner
} from './FileSelector.styles';
import {
  FileSelectorProps,
  FileSelectionStatus,
  FileInfo as FileInfoType
} from './FileSelector.types';

/**
 * Format file size to human-readable format
 */
const formatFileSize = (sizeInBytes: number): string => {
  if (sizeInBytes < 1024) {
    return `${sizeInBytes} B`;
  } else if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
  }
};

/**
 * Format last modified date
 */
const formatLastModified = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

/**
 * FileSelector component for selecting audio files
 */
export const FileSelector: React.FC<FileSelectorProps> = ({
  acceptedFileTypes = ['audio/*'],
  maxFileSize,
  onFileSelect,
  onSuccess,
  onError,
  buttonLabel = 'Select Audio File',
  enableDragAndDrop = true,
  showFileDetails = true,
  initialStatus = FileSelectionStatus.IDLE,
  className
}) => {
  const [status, setStatus] = useState<FileSelectionStatus>(initialStatus);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileInfo, setFileInfo] = useState<FileInfoType | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const labelRef = useRef<HTMLLabelElement>(null);
  
  /**
   * Validate file before processing
   */
  const validateFile = useCallback((file: File): { valid: boolean; error?: string } => {
    // Check if file is an audio file
    if (!file.type.startsWith('audio/') && !acceptedFileTypes.includes('*/*')) {
      const isAccepted = acceptedFileTypes.some(type => {
        if (type === 'audio/*') return file.type.startsWith('audio/');
        return file.type === type;
      });
      
      if (!isAccepted) {
        return { 
          valid: false, 
          error: `Invalid file type. Accepted types: ${acceptedFileTypes.join(', ')}` 
        };
      }
    }
    
    // Check file size if maxFileSize is specified
    if (maxFileSize && file.size > maxFileSize) {
      return { 
        valid: false, 
        error: `File size exceeds maximum allowed size (${formatFileSize(maxFileSize)})` 
      };
    }
    
    return { valid: true };
  }, [acceptedFileTypes, maxFileSize]);
  
  /**
   * Process the selected file
   */
  const processFile = useCallback((file: File) => {
    setStatus(FileSelectionStatus.LOADING);
    setErrorMessage(null);
    
    try {
      // Validate file
      const validation = validateFile(file);
      if (!validation.valid) {
        setStatus(FileSelectionStatus.ERROR);
        setErrorMessage(validation.error || 'Invalid file');
        if (onError) onError(new Error(validation.error || 'Invalid file'));
        return;
      }
      
      // Set selected file and create file info
      setSelectedFile(file);
      const info: FileInfoType = {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified
      };
      setFileInfo(info);
      
      // Call callbacks
      if (onFileSelect) onFileSelect(file);
      if (onSuccess) onSuccess(file, info);
      
      setStatus(FileSelectionStatus.SUCCESS);
    } catch (error) {
      setStatus(FileSelectionStatus.ERROR);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      setErrorMessage(errorMsg);
      if (onError) onError(error instanceof Error ? error : new Error(errorMsg));
    }
  }, [validateFile, onFileSelect, onSuccess, onError]);
  
  /**
   * Handle file input change
   */
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0 && files[0]) {
      processFile(files[0]);
    }
  }, [processFile]);
  
  /**
   * Handle click on the button to open file dialog
   */
  const handleButtonClick = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  }, []);
  
  /**
   * Handle drag events for drag and drop functionality
   */
  const handleDragEnter = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragActive(true);
  }, []);
  
  const handleDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragActive(true);
  }, []);
  
  const handleDragLeave = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragActive(false);
  }, []);
  
  /**
   * Handle drop event for drag and drop functionality
   */
  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0 && droppedFiles[0]) {
      processFile(droppedFiles[0]);
    }
  }, [processFile]);
  
  /**
   * Set up event listeners for drag and drop
   */
  useEffect(() => {
    if (!enableDragAndDrop || !labelRef.current) return;
    
    const handleWindowDragOver = (event: DragEvent) => {
      event.preventDefault();
    };
    
    const handleWindowDrop = (event: DragEvent) => {
      event.preventDefault();
    };
    
    // Prevent browser from opening the file
    window.addEventListener('dragover', handleWindowDragOver);
    window.addEventListener('drop', handleWindowDrop);
    
    return () => {
      window.removeEventListener('dragover', handleWindowDragOver);
      window.removeEventListener('drop', handleWindowDrop);
    };
  }, [enableDragAndDrop]);
  
  /**
   * Set up keyboard access for the file input
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLLabelElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (inputRef.current) {
        inputRef.current.click();
      }
    }
  };
  
  return (
    <FileSelectorContainer className={className}>
      <FileSelectorInput
        ref={inputRef}
        id="file-input"
        type="file"
        accept={acceptedFileTypes.join(',')}
        onChange={handleChange}
        style={{ display: 'none' }}
        disabled={status === FileSelectionStatus.LOADING}
        data-testid="file-input"
      />
      
      <FileSelectorLabel
        ref={labelRef}
        htmlFor="file-input"
        status={status}
        onDragEnter={enableDragAndDrop ? handleDragEnter : undefined}
        onDragOver={enableDragAndDrop ? handleDragOver : undefined}
        onDragLeave={enableDragAndDrop ? handleDragLeave : undefined}
        onDrop={enableDragAndDrop ? handleDrop : undefined}
        onKeyDown={handleKeyDown}
      >
        {status === FileSelectionStatus.LOADING ? (
          <>
            <LoadingSpinner />
            <div>Loading...</div>
          </>
        ) : status === FileSelectionStatus.SUCCESS && selectedFile ? (
          <>
            <IconContainer>✓</IconContainer>
            <div>File selected: {selectedFile.name}</div>
          </>
        ) : (
          <>
            <IconContainer>🎵</IconContainer>
            <div>Drag and drop your audio file here, or click to browse</div>
          </>
        )}
        
        {isDragActive && (
          <DragActive>Drop your file here</DragActive>
        )}
      </FileSelectorLabel>
      
      <FileSelectorButton 
        onClick={handleButtonClick}
        disabled={status === FileSelectionStatus.LOADING}
      >
        {buttonLabel}
      </FileSelectorButton>
      
      {status === FileSelectionStatus.ERROR && errorMessage && (
        <ErrorMessage>{errorMessage}</ErrorMessage>
      )}
      
      {showFileDetails && status === FileSelectionStatus.SUCCESS && fileInfo && (
        <FileInfo>
          <FileName>{fileInfo.name}</FileName>
          <FileDetails>
            <FileDetail>Type: {fileInfo.type}</FileDetail>
            <FileDetail>Size: {formatFileSize(fileInfo.size)}</FileDetail>
            {fileInfo.lastModified && (
              <FileDetail>Modified: {formatLastModified(fileInfo.lastModified)}</FileDetail>
            )}
          </FileDetails>
        </FileInfo>
      )}
    </FileSelectorContainer>
  );
}; 