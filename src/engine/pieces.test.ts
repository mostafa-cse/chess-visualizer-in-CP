import { describe, it, expect } from 'vitest';
import { getAttackedSquares, getRookMoves } from './pieces';
import { Piece } from '../types';

describe('Piece Engine Logic', () => {
  const rows = 8;
  const cols = 8;

  it('Knight jump generation', () => {
    const knight: Piece = { id: '1', type: 'knight', row: 4, col: 4 };
    const attacks = getAttackedSquares(knight, rows, cols, [knight]);
    expect(attacks.length).toBe(8);
    // Spot check a couple
    expect(attacks).toContainEqual({ r: 2, c: 3 });
    expect(attacks).toContainEqual({ r: 6, c: 5 });
  });

  it('Knight edge cases', () => {
    const knight: Piece = { id: '1', type: 'knight', row: 0, col: 0 };
    const attacks = getAttackedSquares(knight, rows, cols, [knight]);
    expect(attacks.length).toBe(2);
    expect(attacks).toContainEqual({ r: 1, c: 2 });
    expect(attacks).toContainEqual({ r: 2, c: 1 });
  });

  it('Rook line attacks unblocked', () => {
    const rook: Piece = { id: '1', type: 'rook', row: 4, col: 4 };
    const attacks = getAttackedSquares(rook, rows, cols, [rook]);
    // 8x8 board, rook at (4,4) -> 7 vertical, 7 horizontal = 14 attacks
    expect(attacks.length).toBe(14);
  });

  it('Rook line attacks blocked by another piece', () => {
    const rook: Piece = { id: '1', type: 'rook', row: 0, col: 0 };
    const blocker: Piece = { id: '2', type: 'pawn', row: 0, col: 3 };
    const attacks = getAttackedSquares(rook, rows, cols, [rook, blocker]);
    
    // Horizontal: attacks (0,1), (0,2), and the blocker at (0,3). (0,4) etc should not be attacked.
    expect(attacks).toContainEqual({ r: 0, c: 1 });
    expect(attacks).toContainEqual({ r: 0, c: 2 });
    expect(attacks).toContainEqual({ r: 0, c: 3 }); // Attack the piece
    expect(attacks).not.toContainEqual({ r: 0, c: 4 }); // Blocked
  });

  it('Bishop diagonal attacks', () => {
    const bishop: Piece = { id: '1', type: 'bishop', row: 4, col: 4 };
    const attacks = getAttackedSquares(bishop, rows, cols, [bishop]);
    // 4 diagonals. Up-Left(4), Up-Right(3), Down-Left(3), Down-Right(3) -> 13
    expect(attacks.length).toBe(13);
  });

  it('Queen combined attacks', () => {
    const queen: Piece = { id: '1', type: 'queen', row: 4, col: 4 };
    const attacks = getAttackedSquares(queen, rows, cols, [queen]);
    // 14 rook + 13 bishop = 27
    expect(attacks.length).toBe(27);
  });

  it('King neighboring squares', () => {
    const king: Piece = { id: '1', type: 'king', row: 4, col: 4 };
    const attacks = getAttackedSquares(king, rows, cols, [king]);
    expect(attacks.length).toBe(8);
  });

  it('Pawn upward attacks', () => {
    const pawn: Piece = { id: '1', type: 'pawn', row: 6, col: 4 };
    const attacks = getAttackedSquares(pawn, rows, cols, [pawn]);
    expect(attacks.length).toBe(2);
    expect(attacks).toContainEqual({ r: 5, c: 3 });
    expect(attacks).toContainEqual({ r: 5, c: 5 });
  });

  it('Piece blocks itself if asked?', () => {
    // The current logic checks `hasPiece(r, c)`. When it casts a ray, if the first square has a piece, it blocks.
    // It should not cast rays onto its own starting square. `dr, dc` starts at `row+dr`, not `row`.
    const rook: Piece = { id: '1', type: 'rook', row: 4, col: 4 };
    const attacks = getRookMoves(rook, rows, cols, [rook]);
    expect(attacks).not.toContainEqual({ r: 4, c: 4 });
  });
});
