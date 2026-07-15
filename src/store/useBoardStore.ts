import { create } from 'zustand';
import { Piece, PieceType, ModeType, AlgorithmType, Cell } from '../types';
import { getAttackedSquares } from '../engine/pieces';

interface BoardStore {
  rows: number;
  cols: number;
  pieces: Piece[];
  selectedPiece: PieceType | null;
  mode: ModeType;
  
  // Computed
  coverageMap: number[][];
  
  // Algorithm State
  algorithm: AlgorithmType;
  isRunning: boolean;
  speed: number;
  visitedSquares: Cell[];
  
  // Actions
  resizeBoard: (rows: number, cols: number) => void;
  addPiece: (type: PieceType, row: number, col: number) => void;
  removePiece: (id: string) => void;
  setMode: (mode: ModeType) => void;
  setSelectedPiece: (type: PieceType | null) => void;
  recomputeAttacks: () => void;
  setAlgorithm: (algo: AlgorithmType) => void;
  setIsRunning: (run: boolean) => void;
  setSpeed: (speed: number) => void;
  markVisited: (r: number, c: number) => void;
  clearVisited: () => void;
  clearBoard: () => void;
  getFEN: () => string;
  loadFEN: (fen: string) => void;
}

const computeCoverageMap = (rows: number, cols: number, pieces: Piece[]): number[][] => {
  const map = Array(rows).fill(null).map(() => Array(cols).fill(0));
  for (const piece of pieces) {
    const attacks = getAttackedSquares(piece, rows, cols, pieces);
    for (const cell of attacks) {
      if (cell.r >= 0 && cell.r < rows && cell.c >= 0 && cell.c < cols) {
        map[cell.r][cell.c] += 1;
      }
    }
  }
  return map;
};

export const useBoardStore = create<BoardStore>((set, get) => ({
  rows: 8,
  cols: 8,
  pieces: [],
  selectedPiece: 'knight',
  mode: 'place',
  attackMap: Array(8).fill(null).map(() => Array(8).fill(false)), // Keeping this for typescript safety if old references exist momentarily
  coverageMap: Array(8).fill(null).map(() => Array(8).fill(0)),
  
  algorithm: 'n-queens',
  isRunning: false,
  speed: 50,
  visitedSquares: [],

  resizeBoard: (rows, cols) => set((state) => {
    // Keep pieces that are still within bounds
    const newPieces = state.pieces.filter(p => p.row < rows && p.col < cols);
    const newCoverageMap = computeCoverageMap(rows, cols, newPieces);
    return { rows, cols, pieces: newPieces, coverageMap: newCoverageMap };
  }),

  addPiece: (type, row, col) => set((state) => {
    // Remove existing piece at that cell if any
    const filteredPieces = state.pieces.filter(p => !(p.row === row && p.col === col));
    const newPiece: Piece = { id: `${type}-${row}-${col}-${Date.now()}`, type, row, col };
    const newPieces = [...filteredPieces, newPiece];
    const newCoverageMap = computeCoverageMap(state.rows, state.cols, newPieces);
    return { pieces: newPieces, coverageMap: newCoverageMap };
  }),

  removePiece: (id) => set((state) => {
    const newPieces = state.pieces.filter(p => p.id !== id);
    const newCoverageMap = computeCoverageMap(state.rows, state.cols, newPieces);
    return { pieces: newPieces, coverageMap: newCoverageMap };
  }),

  setMode: (mode) => set({ mode }),
  
  setSelectedPiece: (type) => set({ selectedPiece: type }),

  recomputeAttacks: () => set((state) => ({
    coverageMap: computeCoverageMap(state.rows, state.cols, state.pieces)
  })),

  setAlgorithm: (algo) => set({ algorithm: algo }),
  setIsRunning: (run) => set({ isRunning: run }),
  setSpeed: (speed) => set({ speed }),
  markVisited: (r, c) => set((state) => ({ visitedSquares: [...state.visitedSquares, { r, c }] })),
  clearVisited: () => set({ visitedSquares: [] }),
  clearBoard: () => set((state) => ({ 
    pieces: [], 
    visitedSquares: [],
    coverageMap: computeCoverageMap(state.rows, state.cols, []) 
  })),

  getFEN: () => {
    const state = get();
    const piecesStr = state.pieces.map((p: Piece) => `${p.type},${p.row},${p.col}`).join('|');
    return `${state.rows},${state.cols}:${piecesStr}`;
  },

  loadFEN: (fen) => set((state) => {
    try {
      const [dims, piecesPart] = fen.split(':');
      const [rStr, cStr] = dims.split(',');
      const r = parseInt(rStr);
      const c = parseInt(cStr);
      
      if (isNaN(r) || isNaN(c) || r < 1 || c < 1) return state; // Invalid FEN

      const newPieces: Piece[] = [];
      if (piecesPart) {
        const pieceStrs = piecesPart.split('|');
        for (const pStr of pieceStrs) {
          const [type, prStr, pcStr] = pStr.split(',');
          const pr = parseInt(prStr);
          const pc = parseInt(pcStr);
          if (!isNaN(pr) && !isNaN(pc)) {
            newPieces.push({
              id: `${type}-${pr}-${pc}-${Math.random()}`,
              type: type as PieceType,
              row: pr,
              col: pc
            });
          }
        }
      }

      return {
        rows: r,
        cols: c,
        pieces: newPieces,
        visitedSquares: [],
        coverageMap: computeCoverageMap(r, c, newPieces)
      };
    } catch (e) {
      console.error("Invalid FEN format");
      return state;
    }
  })
}));
