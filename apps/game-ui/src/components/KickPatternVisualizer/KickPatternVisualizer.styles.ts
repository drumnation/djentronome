// Style definitions using the MantineUI stylings

// Constants for styling
export const GRID_CELL_WIDTH = 20;
export const GRID_CELL_HEIGHT = 30;

export const styles = {
  gridCell: {
    width: GRID_CELL_WIDTH,
    height: GRID_CELL_HEIGHT,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 10,
    color: '#777',
  },
  
  beatMarker: {
    borderRight: '2px solid #555',
  },
  
  halfBeatMarker: {
    borderRight: '1px solid #aaa',
  },
  
  fractionalBeatMarker: {
    borderRight: '1px dashed #ddd',
  },
  
  downBeatCell: {
    backgroundColor: '#f0f0f0',
  },
  
  visualizerContainer: {
    height: GRID_CELL_HEIGHT,
    width: '100%',
    position: 'relative' as const,
    borderRadius: 4,
  },
  
  improvedPatternContainer: {
    backgroundColor: '#f0f9ff',
  },
  
  alternatingPatternContainer: {
    backgroundColor: '#fff4f4',
  },
  
  kickNote: {
    position: 'absolute' as const,
    top: 0,
    width: GRID_CELL_WIDTH,
    height: GRID_CELL_HEIGHT,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    borderRadius: 4,
  },
  
  rightFootNote: {
    backgroundColor: '#ff4444',
  },
  
  leftFootNote: {
    backgroundColor: '#4444ff',
  },
  
  currentlyPlayingNote: {
    border: '2px solid yellow',
    boxShadow: '0 0 10px yellow',
  },
}; 