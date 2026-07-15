import { useEffect, useRef } from 'react';
import { useBoardStore } from '../store/useBoardStore';
import { solveNQueens, solveKnightsTour } from '../engine/algorithms';
import { AlgorithmAction } from '../types';

export const useAlgorithmRunner = () => {
  const { 
    rows, cols, algorithm, isRunning, speed, 
    addPiece, removePiece, markVisited, clearVisited, clearBoard, setIsRunning 
  } = useBoardStore();

  const generatorRef = useRef<Generator<AlgorithmAction, boolean, void> | null>(null);

  useEffect(() => {
    if (!isRunning) return;

    if (!generatorRef.current) {
      clearBoard();
      // Initialize the generator
      if (algorithm === 'n-queens') {
        generatorRef.current = solveNQueens(rows, cols);
      } else if (algorithm === 'knights-tour') {
        generatorRef.current = solveKnightsTour(rows, cols);
      }
    }

    const intervalTime = 1000 / Math.max(1, speed);

    const timer = setInterval(() => {
      if (!generatorRef.current) return;

      const result = generatorRef.current.next();
      
      if (result.done) {
        setIsRunning(false);
        generatorRef.current = null;
        clearInterval(timer);
        return;
      }

      const action = result.value;
      switch (action.type) {
        case 'PLACE':
          addPiece(action.pieceType, action.row, action.col);
          break;
        case 'REMOVE':
          // We need a way to remove pieces at a specific row/col
          // For now, let's use a workaround: get state, find piece, remove by id
          const pieces = useBoardStore.getState().pieces;
          const target = pieces.find(p => p.row === action.row && p.col === action.col);
          if (target) {
            removePiece(target.id);
          }
          break;
        case 'MARK_VISITED':
          markVisited(action.row, action.col);
          break;
        case 'CLEAR_VISITED':
          clearVisited();
          break;
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isRunning, speed, algorithm, rows, cols]);

  // When algorithm or dimensions change, reset generator
  useEffect(() => {
    generatorRef.current = null;
    setIsRunning(false);
  }, [algorithm, rows, cols]);
};
