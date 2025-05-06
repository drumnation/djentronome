/**
 * AudioPlayerDemo Component
 * 
 * A demo component that shows the AudioPlayer in action with
 * full playback features.
 */
import React, { useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { AudioPlayer } from '../AudioPlayer';
import { AudioTrackInfo } from '../AudioPlayer/AudioPlayer.types';

// Styled components
const DemoContainer = styled.div`
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Header = styled.header`
  margin-bottom: 2rem;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
  color: ${props => props.theme.colors.primary};
`;

const Description = styled.p`
  color: #666;
  margin-bottom: 1.5rem;
`;

const PlayerWrapper = styled.div`
  margin-bottom: 2rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 1rem;
`;

const LogSection = styled.div`
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 1rem;
`;

const LogTitle = styled.h3`
  margin-bottom: 1rem;
  font-size: 18px;
  color: ${props => props.theme.colors.primary};
`;

const LogContainer = styled.div`
  background-color: #1e1e1e;
  color: #ffffff;
  font-family: monospace;
  padding: 1rem;
  border-radius: 4px;
  max-height: 300px;
  overflow-y: auto;
`;

const LogEntry = styled.div`
  margin-bottom: 4px;
  line-height: 1.5;
`;

// Helper functions
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export const AudioPlayerDemo: React.FC = () => {
  const [logEntries, setLogEntries] = useState<string[]>([]);

  /**
   * Add a log entry with timestamp
   */
  const logEvent = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogEntries(prev => [`[${timestamp}] ${message}`, ...prev]);
  }, []);

  /**
   * Handle error event
   */
  const handleError = useCallback((error: Error) => {
    logEvent(`Error: ${error.message}`);
  }, [logEvent]);

  /**
   * Handle audio loaded event
   */
  const handleAudioLoaded = (trackInfo: AudioTrackInfo) => {
    logEvent(`Audio loaded: ${trackInfo.name} (${trackInfo.type}, ${formatFileSize(trackInfo.size)})`);
  };

  /**
   * Handle playback start
   */
  const handlePlayStart = (trackInfo: AudioTrackInfo) => {
    logEvent(`Playback started: ${trackInfo.name}`);
  };

  /**
   * Handle playback end
   */
  const handlePlayEnd = () => {
    logEvent('Playback ended');
  };

  /**
   * Handle time update event
   */
  const handleTimeUpdate = () => {
    // Update time display if needed
  };

  return (
    <DemoContainer>
      <Header>
        <Title>Audio Player Demo</Title>
        <Description>
          Try loading an audio file to test the player. Actions will be logged below.
        </Description>
      </Header>

      <PlayerWrapper>
        <AudioPlayer
          onError={handleError}
          onAudioLoaded={handleAudioLoaded}
          onPlayStart={handlePlayStart}
          onPlayEnd={handlePlayEnd}
          onTimeUpdate={handleTimeUpdate}
        />
      </PlayerWrapper>

      <LogSection>
        <LogTitle>Event Log</LogTitle>
        <LogContainer>
          {logEntries.length === 0 ? (
            <LogEntry>No events yet. Try selecting an audio file.</LogEntry>
          ) : (
            logEntries.map((entry, index) => (
              <LogEntry key={index}>{entry}</LogEntry>
            ))
          )}
        </LogContainer>
      </LogSection>
    </DemoContainer>
  );
}; 