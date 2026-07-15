import React from 'react';
import { useBoardStore } from '../../store/useBoardStore';

const ChessGrid: React.FC = () => {
  const { rows, cols, addPiece, removePiece, selectedPiece, mode, pieces } = useBoardStore();

  const handleCellClick = (r: number, c: number) => {
    if (mode === 'place' && selectedPiece) {
      addPiece(selectedPiece, r, c);
    }
  };

  const handleContextMenu = (r: number, c: number, e: React.MouseEvent) => {
    e.preventDefault();
    const piece = pieces.find(p => p.row === r && p.col === c);
    if (piece) {
      removePiece(piece.id);
    }
  };

  return (
    <div 
      className="grid gap-0" 
      style={{ 
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        width: '100%',
        aspectRatio: `${cols}/${rows}`
      }}
    >
      {Array.from({ length: rows }).map((_, r) => (
        Array.from({ length: cols }).map((_, c) => {
          const isLight = (r + c) % 2 === 0;
          return (
              <div 
                key={`${r}-${c}`}
                className={`w-full h-full ${isLight ? 'bg-boardLight' : 'bg-boardDark'} transition-colors ${mode === 'place' ? 'hover:bg-amber-500/40 cursor-pointer' : ''}`}
                onClick={() => handleCellClick(r, c)}
                onContextMenu={(e) => handleContextMenu(r, c, e)}
              />
          );
        })
      ))}
    </div>
  );
};

export default ChessGrid;
