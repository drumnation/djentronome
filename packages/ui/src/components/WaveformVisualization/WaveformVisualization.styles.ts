import styled from '@emotion/styled';

export const WaveformContainer = styled.div<{
  width?: number;
  height?: number;
  backgroundColor?: string;
}>`
  width: ${(props) => props.width ? `${props.width}px` : '100%'};
  height: ${(props) => props.height ? `${props.height}px` : '100px'};
  background-color: ${(props) => props.backgroundColor || 'transparent'};
  position: relative;
  overflow: hidden;
  border-radius: 4px;
`;

export const WaveformCanvas = styled.canvas`
  width: 100%;
  height: 100%;
`; 