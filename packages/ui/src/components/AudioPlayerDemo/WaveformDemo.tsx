import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { WaveformVisualization } from '../WaveformVisualization';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const Controls = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #3a80d2;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export interface WaveformDemoProps {
  /** Optional CSS class name */
  className?: string;
}

// Generate a sample audio data for demonstration
const generateDummyAudioData = (length: number): Float32Array => {
  const data = new Float32Array(length);
  for (let i = 0; i < length; i++) {
    // Generate a sine wave pattern
    data[i] = Math.sin(i * (Math.PI / 180) * 10) * 0.5;
  }
  return data;
};

export const WaveformDemo: React.FC<WaveformDemoProps> = ({ className }) => {
  const [audioData, setAudioData] = useState<Float32Array | undefined>(undefined);
  const [isGenerated, setIsGenerated] = useState(false);

  // Generate new waveform data
  const handleGenerateWaveform = () => {
    const length = 500 + Math.floor(Math.random() * 500); // Random length between 500-1000
    setAudioData(generateDummyAudioData(length));
    setIsGenerated(true);
  };

  // Clear the waveform
  const handleClearWaveform = () => {
    setAudioData(undefined);
    setIsGenerated(false);
  };

  // Generate initial waveform on component mount
  useEffect(() => {
    handleGenerateWaveform();
  }, []);

  return (
    <Container className={className}>
      <Title>Waveform Visualization Demo</Title>
      
      <Controls>
        <Button onClick={handleGenerateWaveform}>
          {isGenerated ? 'Regenerate Waveform' : 'Generate Waveform'}
        </Button>
        <Button onClick={handleClearWaveform} disabled={!isGenerated}>
          Clear Waveform
        </Button>
      </Controls>
      
      <WaveformVisualization 
        audioData={audioData}
        width={800}
        height={200}
        color="#4a90e2"
        backgroundColor="#f5f5f5"
      />
    </Container>
  );
}; 