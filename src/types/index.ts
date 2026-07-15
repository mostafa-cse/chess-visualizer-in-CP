export type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
export type ModeType = 'place' | 'attack' | 'coverage' | 'conflict' | 'path' | 'algorithm';

export interface Cell {
  r: number;
  c: number;
}

export interface Piece {
  id: string;
  type: PieceType;
  row: number;
  col: number;
}

export type AlgorithmType = 'n-queens' | 'knights-tour' | 'none';

export type AlgorithmAction = 
  | { type: 'PLACE'; pieceType: PieceType; row: number; col: number }
  | { type: 'REMOVE'; row: number; col: number }
  | { type: 'MARK_VISITED'; row: number; col: number }
  | { type: 'CLEAR_VISITED' };
