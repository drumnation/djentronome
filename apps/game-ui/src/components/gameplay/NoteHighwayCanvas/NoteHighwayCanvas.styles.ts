import styled from '@emotion/styled';

/**
 * Container for the Three.js canvas with configurable dimensions
 */
export const CanvasContainer = styled.div<{ width: number; height: number }>`
  width: ${(props: { width: number }) => `${props.width}px`};
  height: ${(props: { height: number }) => `${props.height}px`};
  background-color: #111;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`; 