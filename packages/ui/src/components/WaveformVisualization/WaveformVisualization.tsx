import { useEffect, useRef } from 'react';
import { WaveformVisualizationProps } from './WaveformVisualization.types';
import { WaveformContainer, WaveformCanvas } from './WaveformVisualization.styles';

export const WaveformVisualization = ({
  audioData,
  width = 800,
  height = 200,
  color = '#4a90e2',
  backgroundColor = 'transparent',
  className,
}: WaveformVisualizationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !audioData) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw waveform
    const sliceWidth = width / audioData.length;
    const centerY = height / 2;
    
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    
    for (let i = 0; i < audioData.length; i++) {
      const x = i * sliceWidth;
      // Safe access with default value
      const amplitude = audioData[i] ?? 0;
      const y = centerY + (amplitude * centerY);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();
  }, [audioData, width, height, color]);

  return (
    <WaveformContainer
      width={width}
      height={height}
      backgroundColor={backgroundColor}
      className={className}
    >
      <WaveformCanvas ref={canvasRef} />
    </WaveformContainer>
  );
}; 