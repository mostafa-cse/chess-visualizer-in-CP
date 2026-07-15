import { describe, it, expect, beforeEach } from 'vitest';
import { useBoardStore } from './useBoardStore';

describe('useBoardStore', () => {
  beforeEach(() => {
    // Reset store before each test
    const state = useBoardStore.getState();
    state.resizeBoard(8, 8);
    // Remove all pieces safely
    useBoardStore.setState({ pieces: [], coverageMap: Array(8).fill(null).map(() => Array(8).fill(0)) });
  });

  it('Initializes with default values', () => {
    const state = useBoardStore.getState();
    expect(state.rows).toBe(8);
    expect(state.cols).toBe(8);
    expect(state.pieces.length).toBe(0);
    expect(state.mode).toBe('place');
    expect(state.selectedPiece).toBe('knight');
  });

  it('Can add a piece', () => {
    useBoardStore.getState().addPiece('queen', 3, 3);
    const state = useBoardStore.getState();
    expect(state.pieces.length).toBe(1);
    expect(state.pieces[0].type).toBe('queen');
    expect(state.pieces[0].row).toBe(3);
    expect(state.pieces[0].col).toBe(3);
  });

  it('Adding a piece automatically updates the coverageMap', () => {
    useBoardStore.getState().addPiece('rook', 0, 0);
    const state = useBoardStore.getState();
    
    // Attack map should show row 0 and col 0 as 1 (excluding 0,0 typically, but rook attacks its own line.
    // Wait, let's check a square we know should be attacked: (0, 7)
    expect(state.coverageMap[0][7]).toBe(1);
    // (7, 0)
    expect(state.coverageMap[7][0]).toBe(1);
    // (1, 1) should be 0
    expect(state.coverageMap[1][1]).toBe(0);
  });

  it('Can remove a piece and clear coverageMap', () => {
    useBoardStore.getState().addPiece('rook', 0, 0);
    const pieceId = useBoardStore.getState().pieces[0].id;
    
    useBoardStore.getState().removePiece(pieceId);
    const state = useBoardStore.getState();
    
    expect(state.pieces.length).toBe(0);
    expect(state.coverageMap[0][7]).toBe(0); // Attack cleared
  });

  it('Resizing board truncates out-of-bounds pieces', () => {
    useBoardStore.getState().addPiece('king', 7, 7); // bottom right of 8x8
    useBoardStore.getState().addPiece('king', 2, 2); 
    
    useBoardStore.getState().resizeBoard(5, 5);
    const state = useBoardStore.getState();
    
    // The piece at (7,7) should be removed, (2,2) should remain
    expect(state.pieces.length).toBe(1);
    expect(state.pieces[0].row).toBe(2);
    expect(state.pieces[0].col).toBe(2);
  });

  it('Serializes and loads CP-FEN correctly', () => {
    useBoardStore.getState().addPiece('queen', 0, 0);
    useBoardStore.getState().addPiece('knight', 7, 7);
    
    const fen = useBoardStore.getState().getFEN();
    // Example: "8,8:queen,0,0|knight,7,7"
    expect(fen).toMatch(/^8,8:/);
    expect(fen).toContain('queen,0,0');
    expect(fen).toContain('knight,7,7');

    // Clear and load
    useBoardStore.getState().clearBoard();
    expect(useBoardStore.getState().pieces.length).toBe(0);

    useBoardStore.getState().loadFEN(fen);
    const state = useBoardStore.getState();
    expect(state.rows).toBe(8);
    expect(state.cols).toBe(8);
    expect(state.pieces.length).toBe(2);
    expect(state.pieces.some(p => p.type === 'queen' && p.row === 0 && p.col === 0)).toBe(true);
    expect(state.pieces.some(p => p.type === 'knight' && p.row === 7 && p.col === 7)).toBe(true);
  });

  it('Tracks visited squares correctly', () => {
    useBoardStore.getState().markVisited(2, 2);
    useBoardStore.getState().markVisited(3, 4);

    const state = useBoardStore.getState();
    expect(state.visitedSquares.length).toBe(2);
    expect(state.visitedSquares[0]).toEqual({ r: 2, c: 2 });
    expect(state.visitedSquares[1]).toEqual({ r: 3, c: 4 });

    useBoardStore.getState().clearVisited();
    expect(useBoardStore.getState().visitedSquares.length).toBe(0);
  });
});
