import { describe, it, expect } from 'vitest';
import { solveNQueens, solveKnightsTour } from './algorithms';

describe('Algorithm Generators', () => {
  it('N-Queens generator yields valid placement actions', () => {
    // 4x4 board has 2 solutions
    const gen = solveNQueens(4, 4);
    let result = gen.next();
    
    // It should at least start by yielding PLACE or MARK_VISITED
    expect(result.done).toBe(false);
    expect((result.value as any)?.type).toMatch(/PLACE|MARK_VISITED|REMOVE|CLEAR_VISITED/);
    
    // Run it to completion (or just a few steps to prevent infinite loop in tests)
    let steps = 0;
    while (!result.done && steps < 1000) {
      result = gen.next();
      steps++;
    }
    expect(result.done).toBe(true);
  });

  it('Knights Tour generator yields valid actions', () => {
    // 5x5 board is the smallest board for a closed tour, but open tours are easier.
    // The algorithm uses Warnsdorff's heuristic so it should find it quickly.
    const gen = solveKnightsTour(5, 5);
    let result = gen.next();
    
    expect(result.done).toBe(false);
    
    let steps = 0;
    while (!result.done && steps < 2000) {
      result = gen.next();
      steps++;
    }
    // It should complete successfully
    expect(result.done).toBe(true);
  });
});
