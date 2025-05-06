/**
 * Tests for FileSelector component
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { FileSelector } from './FileSelector';
import { ThemeProvider } from '@emotion/react';

// Mock theme for tests
const theme = {
  colors: {
    primary: '#3498db',
    secondary: '#2ecc71',
    error: '#e74c3c',
    background: '#ecf0f1',
    text: '#2c3e50',
    textSecondary: '#7f8c8d'
  }
};

describe('FileSelector Component', () => {
  it('renders with default props', () => {
    render(
      <ThemeProvider theme={theme}>
        <FileSelector onFileSelect={() => {}} />
      </ThemeProvider>
    );
    expect(screen.getByText(/Drag and drop your audio file here/i)).toBeInTheDocument();
    expect(screen.getByText('Select Audio File')).toBeInTheDocument();
  });

  it('accepts custom button label', () => {
    render(
      <ThemeProvider theme={theme}>
        <FileSelector buttonLabel="Upload Audio" onFileSelect={() => {}} />
      </ThemeProvider>
    );
    expect(screen.getByText('Upload Audio')).toBeInTheDocument();
  });

  it('handles file selection', async () => {
    const onFileSelectMock = vi.fn();
    const onSuccessMock = vi.fn();
    
    render(
      <ThemeProvider theme={theme}>
        <FileSelector 
          onFileSelect={onFileSelectMock} 
          onSuccess={onSuccessMock}
        />
      </ThemeProvider>
    );
    
    const file = new File(['mock audio content'], 'test.mp3', { type: 'audio/mpeg' });
    const input = screen.getByTestId('file-input');
    
    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false
    });
    
    fireEvent.change(input);
    
    // Check if callbacks were called
    expect(onFileSelectMock).toHaveBeenCalledWith(file);
    expect(onSuccessMock).toHaveBeenCalledWith(file, expect.objectContaining({
      name: 'test.mp3',
      type: 'audio/mpeg'
    }));
    
    // Check if file info is displayed
    expect(screen.getByText(/File selected: test.mp3/i)).toBeInTheDocument();
  });
  
  it('shows error message for invalid file type', async () => {
    const onErrorMock = vi.fn();
    
    render(
      <ThemeProvider theme={theme}>
        <FileSelector 
          onFileSelect={() => {}} 
          onError={onErrorMock}
          acceptedFileTypes={['.mp3', '.wav']}
        />
      </ThemeProvider>
    );
    
    const file = new File(['mock text content'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByTestId('file-input');
    
    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false
    });
    
    fireEvent.change(input);
    
    expect(onErrorMock).toHaveBeenCalled();
    
    // Check if error message is displayed
    expect(screen.getByText(/Invalid file type/i)).toBeInTheDocument();
  });
  
  it('shows error message for files exceeding max size', async () => {
    const onErrorMock = vi.fn();
    
    render(
      <ThemeProvider theme={theme}>
        <FileSelector 
          onFileSelect={() => {}} 
          onError={onErrorMock}
          maxFileSize={10} // Very small size to trigger error
        />
      </ThemeProvider>
    );
    
    const file = new File(['mock audio content that is too large'], 'test.mp3', { type: 'audio/mpeg' });
    const input = screen.getByTestId('file-input');
    
    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false
    });
    
    fireEvent.change(input);
    
    expect(onErrorMock).toHaveBeenCalled();
    
    // Check if error message is displayed
    expect(screen.getByText(/exceeds maximum allowed size/i)).toBeInTheDocument();
  });
  
  it('hides file details when showFileDetails is false', async () => {
    render(
      <ThemeProvider theme={theme}>
        <FileSelector 
          onFileSelect={() => {}} 
          showFileDetails={false}
        />
      </ThemeProvider>
    );
    
    const file = new File(['mock audio content'], 'test.mp3', { type: 'audio/mpeg' });
    const input = screen.getByTestId('file-input');
    
    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false
    });
    
    fireEvent.change(input);
    
    // File name should still be shown
    expect(screen.getByText(/File selected: test.mp3/i)).toBeInTheDocument();
    
    // But details should be hidden
    expect(screen.queryByText(/Type:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Size:/i)).not.toBeInTheDocument();
  });
}); 