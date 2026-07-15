import { Piece, Cell } from '../types';

const isValid = (r: number, c: number, rows: number, cols: number) => {
  return r >= 0 && r < rows && c >= 0 && c < cols;
};

// Check if a piece blocks a ray. For standard CP, pieces don't usually block unless specified,
// but for standard chess movement they do. We will assume pieces block rays for sliding pieces.
const hasPiece = (r: number, c: number, pieces: Piece[]) => {
  return pieces.some(p => p.row === r && p.col === c);
};

const getLineAttacks = (piece: Piece, rows: number, cols: number, dr: number, dc: number, pieces: Piece[]): Cell[] => {
  const attacks: Cell[] = [];
  let r = piece.row + dr;
  let c = piece.col + dc;
  while (isValid(r, c, rows, cols)) {
    attacks.push({ r, c });
    if (hasPiece(r, c, pieces)) break;
    r += dr;
    c += dc;
  }
  return attacks;
};

export const getRookMoves = (piece: Piece, rows: number, cols: number, pieces: Piece[]): Cell[] => {
  return [
    ...getLineAttacks(piece, rows, cols, -1, 0, pieces),
    ...getLineAttacks(piece, rows, cols, 1, 0, pieces),
    ...getLineAttacks(piece, rows, cols, 0, -1, pieces),
    ...getLineAttacks(piece, rows, cols, 0, 1, pieces),
  ];
};

export const getBishopMoves = (piece: Piece, rows: number, cols: number, pieces: Piece[]): Cell[] => {
  return [
    ...getLineAttacks(piece, rows, cols, -1, -1, pieces),
    ...getLineAttacks(piece, rows, cols, -1, 1, pieces),
    ...getLineAttacks(piece, rows, cols, 1, -1, pieces),
    ...getLineAttacks(piece, rows, cols, 1, 1, pieces),
  ];
};

export const getKnightJumps = (piece: Piece, rows: number, cols: number): Cell[] => {
  const moves = [
    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
    [1, -2], [1, 2], [2, -1], [2, 1]
  ];
  return moves
    .map(([dr, dc]) => ({ r: piece.row + dr, c: piece.col + dc }))
    .filter(({ r, c }) => isValid(r, c, rows, cols));
};

export const getKingNeighbors = (piece: Piece, rows: number, cols: number): Cell[] => {
  const attacks: Cell[] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      if (isValid(piece.row + dr, piece.col + dc, rows, cols)) {
        attacks.push({ r: piece.row + dr, c: piece.col + dc });
      }
    }
  }
  return attacks;
};

export const getPawnAttacks = (piece: Piece, rows: number, cols: number): Cell[] => {
  // Typical pawn attacks (upwards diagonally)
  return [
    { r: piece.row - 1, c: piece.col - 1 },
    { r: piece.row - 1, c: piece.col + 1 }
  ].filter(({ r, c }) => isValid(r, c, rows, cols));
};

export const getAttackedSquares = (piece: Piece, rows: number, cols: number, pieces: Piece[]): Cell[] => {
  switch (piece.type) {
    case 'queen':
      return [...getRookMoves(piece, rows, cols, pieces), ...getBishopMoves(piece, rows, cols, pieces)];
    case 'rook':
      return getRookMoves(piece, rows, cols, pieces);
    case 'bishop':
      return getBishopMoves(piece, rows, cols, pieces);
    case 'knight':
      return getKnightJumps(piece, rows, cols);
    case 'king':
      return getKingNeighbors(piece, rows, cols);
    case 'pawn':
      return getPawnAttacks(piece, rows, cols);
    default:
      return [];
  }
};
