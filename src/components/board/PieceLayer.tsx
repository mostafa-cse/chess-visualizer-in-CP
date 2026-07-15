import React from 'react';
import { motion } from 'framer-motion';
import { useBoardStore } from '../../store/useBoardStore';

const pieceIcons: Record<string, string> = {
  king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟'
};

const PieceLayer: React.FC = () => {
  const { pieces, rows, cols } = useBoardStore();

  return (
    <div className="absolute inset-0 pointer-events-none">
      {pieces.map(piece => {
        // Calculate percentages for position to keep it responsive
        const top = `${(piece.row / rows) * 100}%`;
        const left = `${(piece.col / cols) * 100}%`;
        const width = `${(1 / cols) * 100}%`;
        const height = `${(1 / rows) * 100}%`;

        return (
          <motion.div
            key={piece.id}
            initial={{ scale: 0, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute flex items-center justify-center pointer-events-none drop-shadow-lg"
            style={{ top, left, width, height }}
          >
            <span 
              className="text-black font-bold select-none leading-none"
              style={{ fontSize: `min(calc(60vw / ${cols}), calc(60vh / ${rows}))` }} // Responsive font size
            >
              {pieceIcons[piece.type]}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};

export default PieceLayer;
