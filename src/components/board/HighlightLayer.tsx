import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBoardStore } from '../../store/useBoardStore';
import { Cell } from '../../types';

const HighlightLayer: React.FC = () => {
  const { coverageMap, rows, cols, mode, recomputeAttacks, pieces, visitedSquares } = useBoardStore();

  useEffect(() => {
    recomputeAttacks();
  }, [pieces, rows, cols, recomputeAttacks]);

  if (mode === 'place' || mode === 'algorithm') {
    // In algorithm mode, we might just want to render visited path, but let's do it below
  }

  const highlights: { r: number; c: number; coverage: number; bgColor: string }[] = [];
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const coverage = coverageMap && coverageMap[r] ? coverageMap[r][c] : 0;
      
      if (coverage > 0) {
        const hasPiece = pieces.some(p => p.row === r && p.col === c);
        
        // Skip if in conflict mode but there's no piece here (meaning no conflict at this square)
        if (mode === 'conflict' && !hasPiece) continue;
        
        // Base red color, intensity increases with coverage
        let bgColor = 'bg-red-500/40';
        if (mode === 'coverage') {
          if (coverage === 1) bgColor = 'bg-amber-500/30';
          else if (coverage === 2) bgColor = 'bg-orange-500/50';
          else if (coverage >= 3) bgColor = 'bg-red-500/70';
        } else if (mode === 'conflict') {
          bgColor = 'bg-red-600/80 ring-2 ring-red-400 z-10'; // Emphasize conflicts
        }

        highlights.push({ r, c, coverage, bgColor });
      }
    }
  }

  // Add visited squares if in algorithm mode
  if (mode === 'algorithm' && visitedSquares) {
    visitedSquares.forEach((cell: Cell) => {
      // Don't duplicate if already in highlights
      if (!highlights.some(h => h.r === cell.r && h.c === cell.c)) {
        highlights.push({ 
          r: cell.r, 
          c: cell.c, 
          coverage: 0, 
          bgColor: 'bg-blue-500/30 ring-1 ring-blue-400' 
        });
      }
    });
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      <AnimatePresence>
        {highlights.map(({ r, c, coverage, bgColor }) => {
          const top = `${(r / rows) * 100}%`;
          const left = `${(c / cols) * 100}%`;
          const width = `${(1 / cols) * 100}%`;
          const height = `${(1 / rows) * 100}%`;

          return (
            <motion.div
              key={`highlight-${r}-${c}-${mode}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className={`absolute pointer-events-none flex items-center justify-center ${bgColor}`}
              style={{ top, left, width, height }}
            >
              {mode === 'coverage' && (
                <span className="text-white/80 font-bold text-xs mix-blend-difference select-none drop-shadow-md">
                  {coverage}
                </span>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default HighlightLayer;
