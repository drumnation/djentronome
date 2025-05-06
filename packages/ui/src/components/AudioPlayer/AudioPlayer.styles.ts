/**
 * Styles for the AudioPlayer component
 */
import styled from '@emotion/styled';
import { AudioPlayerStatus } from './AudioPlayer.types';

interface ThemeProps {
  theme: {
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

export const AudioPlayerContainer = styled.div<ThemeProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 8px;
  background-color: ${(props) => props.theme.colors?.background || '#f5f5f5'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

export const PlayerSection = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

interface StatusProps extends ThemeProps {
  status: AudioPlayerStatus;
}

export const StatusIndicator = styled.div<StatusProps>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${(props) => {
    switch (props.status) {
      case AudioPlayerStatus.ERROR:
        return props.theme.colors?.error || '#F44336';
      case AudioPlayerStatus.PLAYING:
        return props.theme.colors?.success || '#4CAF50';
      case AudioPlayerStatus.PAUSED:
      case AudioPlayerStatus.READY:
        return props.theme.colors?.primary || '#2196F3';
      default:
        return props.theme.colors?.textSecondary || '#666';
    }
  }};
`;

export const StatusDot = styled.span<StatusProps>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${(props) => {
    switch (props.status) {
      case AudioPlayerStatus.ERROR:
        return props.theme.colors?.error || '#F44336';
      case AudioPlayerStatus.PLAYING:
        return props.theme.colors?.success || '#4CAF50';
      case AudioPlayerStatus.PAUSED:
      case AudioPlayerStatus.READY:
        return props.theme.colors?.primary || '#2196F3';
      default:
        return props.theme.colors?.textSecondary || '#666';
    }
  }};
`;

export const ControlsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0;
`;

export const Button = styled.button<ThemeProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.colors?.primary || '#2196F3'};
  color: ${(props) => props.theme.colors?.textLight || 'white'};
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${(props) => props.theme.colors?.primaryDark || '#1976D2'};
  }
  
  &:disabled {
    background-color: ${(props) => props.theme.colors?.disabled || '#cccccc'};
    cursor: not-allowed;
  }
`;

export const SmallButton = styled(Button)`
  width: 2rem;
  height: 2rem;
`;

export const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const Slider = styled.input<ThemeProps>`
  -webkit-appearance: none;
  width: 100%;
  height: 5px;
  border-radius: 5px;
  background: ${(props) => props.theme.colors?.backgroundLight || '#e0e0e0'};
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: ${(props) => props.theme.colors?.primary || '#2196F3'};
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: ${(props) => props.theme.colors?.primary || '#2196F3'};
    cursor: pointer;
    border: none;
  }
`;

export const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 0.25rem;
`;

export const TimeDisplay = styled.div<ThemeProps>`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors?.textSecondary || '#666'};
`;

export const TrackInfo = styled.div<ThemeProps>`
  padding: 0.75rem;
  background-color: ${(props) => props.theme.colors?.backgroundLight || 'white'};
  border-radius: 4px;
`;

export const TrackName = styled.h4<ThemeProps>`
  margin: 0 0 0.25rem 0;
  color: ${(props) => props.theme.colors?.text || '#333'};
  font-size: 1rem;
`;

export const TrackDetails = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors?.textSecondary || '#666'};
`;

export const ErrorMessage = styled.div<ThemeProps>`
  color: ${(props) => props.theme.colors?.error || '#F44336'};
  padding: 0.5rem;
  border-radius: 4px;
  background-color: ${(props) => `${props.theme.colors?.error}10` || '#FFEBEE'};
  margin-top: 0.5rem;
`;

export const PlaybackRateControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const PlaybackRateValue = styled.span<ThemeProps>`
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors?.textSecondary || '#666'};
  min-width: 2rem;
  text-align: center;
`;

export const PlaybackRateButton = styled.button<ThemeProps>`
  background-color: ${(props) => props.theme.colors?.backgroundLight || 'white'};
  color: ${(props) => props.theme.colors?.text || '#333'};
  border: 1px solid ${(props) => props.theme.colors?.border || '#ddd'};
  border-radius: 4px;
  padding: 0.2rem 0.4rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${(props) => props.theme.colors?.backgroundHover || '#e9e9e9'};
  }
`;

export const CurrentTime = styled.span`
  margin-right: 5px;
  font-size: 0.85rem;
  color: ${(props) => props.theme.colors?.textSecondary || '#666'};
`; 