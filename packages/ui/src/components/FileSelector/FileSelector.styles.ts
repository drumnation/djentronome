/**
 * Styles for the FileSelector component
 */
import styled from '@emotion/styled';
import { FileSelectionStatus } from './FileSelector.types';

interface ThemeProps {
  theme?: {
    colors?: {
      background?: string;
      backgroundHover?: string;
      backgroundLight?: string;
      primary?: string;
      primaryDark?: string;
      textLight?: string;
      text?: string;
      textSecondary?: string;
      border?: string;
      success?: string;
      error?: string;
      disabled?: string;
    };
  };
}

export const FileSelectorContainer = styled.div<ThemeProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 1rem;
  border-radius: 8px;
  background-color: ${(props) => props.theme?.colors?.background || '#f5f5f5'};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const FileSelectorInput = styled.input`
  display: none;
`;

interface LabelProps extends ThemeProps {
  status?: FileSelectionStatus;
}

export const FileSelectorLabel = styled.label<LabelProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 120px;
  padding: 1rem;
  cursor: pointer;
  border: 2px dashed ${(props) => {
    switch(props.status) {
      case FileSelectionStatus.SUCCESS:
        return props.theme?.colors?.success || '#4CAF50';
      case FileSelectionStatus.ERROR:
        return props.theme?.colors?.error || '#F44336';
      case FileSelectionStatus.LOADING:
        return props.theme?.colors?.primary || '#2196F3';
      default:
        return props.theme?.colors?.border || '#ddd';
    }
  }};
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme?.colors?.backgroundHover || '#e9e9e9'};
  }
`;

export const FileSelectorButton = styled.button<ThemeProps>`
  background-color: ${(props) => props.theme?.colors?.primary || '#2196F3'};
  color: ${(props) => props.theme?.colors?.textLight || 'white'};
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme?.colors?.primaryDark || '#1976D2'};
  }

  &:disabled {
    background-color: ${(props) => props.theme?.colors?.disabled || '#cccccc'};
    cursor: not-allowed;
  }
`;

export const FileInfo = styled.div<ThemeProps>`
  width: 100%;
  margin-top: 1rem;
  padding: 1rem;
  background-color: ${(props) => props.theme?.colors?.backgroundLight || 'white'};
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const FileName = styled.h4<ThemeProps>`
  margin: 0 0 0.5rem 0;
  color: ${(props) => props.theme?.colors?.text || '#333'};
`;

export const FileDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const FileDetail = styled.p<ThemeProps>`
  margin: 0;
  font-size: 0.875rem;
  color: ${(props) => props.theme?.colors?.textSecondary || '#666'};
`;

export const ErrorMessage = styled.div<ThemeProps>`
  color: ${(props) => props.theme?.colors?.error || '#F44336'};
  margin-top: 0.5rem;
  font-size: 0.875rem;
  width: 100%;
  text-align: center;
`;

export const DragActive = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(33, 150, 243, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

export const IconContainer = styled.div<ThemeProps>`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: ${(props) => props.theme?.colors?.primary || '#2196F3'};
`;

export const LoadingSpinner = styled.div<ThemeProps>`
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: ${(props) => props.theme?.colors?.primary || '#2196F3'};
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`; 