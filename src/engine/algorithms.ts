import { AlgorithmAction } from '../types';

/**
 * N-Queens (Backtracking DFS)
 * Yields actions to place and remove queens.
 */
export function* solveNQueens(rows: number, cols: number): Generator<AlgorithmAction, boolean, void> {
  const board: boolean[][] = Array(rows).fill(null).map(() => Array(cols).fill(false));
  const n = Math.min(rows, cols); // Usually N-Queens is NxN

  function isSafe(r: number, c: number): boolean {
    // Check column
    for (let i = 0; i < r; i++) {
      if (board[i][c]) return false;
    }
    // Check upper diagonal on left side
    for (let i = r, j = c; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j]) return false;
    }
    // Check upper diagonal on right side
    for (let i = r, j = c; i >= 0 && j < cols; i--, j++) {
      if (board[i][j]) return false;
    }
    return true;
  }

  function* placeQueen(r: number): Generator<AlgorithmAction, boolean, void> {
    if (r >= n) {
      return true;
    }

    for (let c = 0; c < n; c++) {
      if (isSafe(r, c)) {
        board[r][c] = true;
        yield { type: 'PLACE', pieceType: 'queen', row: r, col: c };

        if (yield* placeQueen(r + 1)) {
          return true;
        }

        board[r][c] = false;
        yield { type: 'REMOVE', row: r, col: c };
      }
    }
    return false;
  }

  yield { type: 'CLEAR_VISITED' };
  yield* placeQueen(0);
  return true;
}

/**
 * Knight's Tour (DFS with Warnsdorff's Heuristic)
 */
export function* solveKnightsTour(rows: number, cols: number): Generator<AlgorithmAction, boolean, void> {
  const visited: boolean[][] = Array(rows).fill(null).map(() => Array(cols).fill(false));
  const moves = [
    { dr: -2, dc: -1 }, { dr: -2, dc: 1 }, { dr: -1, dc: -2 }, { dr: -1, dc: 2 },
    { dr: 1, dc: -2 }, { dr: 1, dc: 2 }, { dr: 2, dc: -1 }, { dr: 2, dc: 1 }
  ];

  function isValid(r: number, c: number): boolean {
    return r >= 0 && r < rows && c >= 0 && c < cols && !visited[r][c];
  }

  function countDegree(r: number, c: number): number {
    let count = 0;
    for (const m of moves) {
      if (isValid(r + m.dr, c + m.dc)) count++;
    }
    return count;
  }

  function* tour(r: number, c: number, step: number): Generator<AlgorithmAction, boolean, void> {
    visited[r][c] = true;
    yield { type: 'PLACE', pieceType: 'knight', row: r, col: c };
    yield { type: 'MARK_VISITED', row: r, col: c };

    if (step === rows * cols) {
      return true;
    }

    // Warnsdorff's heuristic: pick the neighbor with the minimum degree
    const neighbors = [];
    for (const m of moves) {
      const nr = r + m.dr;
      const nc = c + m.dc;
      if (isValid(nr, nc)) {
        neighbors.push({ r: nr, c: nc, degree: countDegree(nr, nc) });
      }
    }

    neighbors.sort((a, b) => a.degree - b.degree);

    for (const next of neighbors) {
      if (yield* tour(next.r, next.c, step + 1)) {
        return true;
      }
    }

    visited[r][c] = false;
    // Keep the knight placed on the final successful path, but if we backtrack:
    yield { type: 'REMOVE', row: r, col: c };
    return false;
  }

  yield { type: 'CLEAR_VISITED' };
  yield* tour(0, 0, 1);
  return true;
}
