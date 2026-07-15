import React from 'react';
import { Settings, Target, MousePointer2, Share2 } from 'lucide-react';
import { useBoardStore } from '../../store/useBoardStore';
import { PieceType, ModeType, AlgorithmType } from '../../types';
import { useAlgorithmRunner } from '../../hooks/useAlgorithmRunner';

const pieceIcons: Record<PieceType, string> = {
  king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟'
};

const Toolbar: React.FC = () => {
  const { rows, cols, resizeBoard, selectedPiece, setSelectedPiece, mode, setMode, algorithm, setAlgorithm, isRunning, setIsRunning, speed, setSpeed, clearBoard, getFEN, loadFEN } = useBoardStore();
  const [fenInput, setFenInput] = React.useState('');
  useAlgorithmRunner();

  return (
    <div className="w-full md:w-80 shrink-0 bg-gray-900 border-b md:border-b-0 md:border-r border-gray-800 p-6 flex flex-col gap-6 md:gap-8 h-auto md:h-screen md:overflow-y-auto z-10">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent mb-1">
          Chess CP Lab
        </h1>
        <p className="text-gray-400 text-sm">Phase 1: React Engine</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
          <Settings size={16} /> Board Config
        </h2>
        <div className="flex gap-4">
          <label className="flex-1">
            <span className="block text-xs text-gray-500 mb-1">Rows</span>
            <input 
              type="number" 
              min="1" max="32" 
              value={rows}
              onChange={(e) => resizeBoard(Math.max(1, Math.min(32, parseInt(e.target.value) || 8)), cols)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </label>
          <label className="flex-1">
            <span className="block text-xs text-gray-500 mb-1">Cols</span>
            <input 
              type="number" 
              min="1" max="32" 
              value={cols}
              onChange={(e) => resizeBoard(rows, Math.max(1, Math.min(32, parseInt(e.target.value) || 8)))}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </label>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
          <Target size={16} /> Mode
        </h2>
        <div className="flex gap-2 p-1 bg-gray-800 rounded-lg">
          {(['place', 'attack', 'coverage', 'conflict', 'algorithm'] as ModeType[]).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              aria-label={`Select Mode: ${m}`}
              className={`flex-1 py-1.5 px-3 text-sm rounded-md capitalize transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-inset ${
                mode === m 
                  ? 'bg-gray-700 text-white shadow-sm' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {mode === 'algorithm' ? (
        <div className="space-y-4 fade-in">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
            <Settings size={16} /> Algorithms
          </h2>
          <select 
            value={algorithm} 
            onChange={(e) => setAlgorithm(e.target.value as AlgorithmType)}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500 text-white"
          >
            <option value="n-queens">N-Queens</option>
            <option value="knights-tour">Knight's Tour</option>
          </select>
          
          <div>
            <label className="block text-xs text-gray-500 mb-1">Speed ({speed}x)</label>
            <input 
              type="range" min="1" max="100" value={speed} 
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              className="w-full accent-amber-500" 
            />
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setIsRunning(!isRunning)}
              className={`flex-1 py-2 rounded font-bold transition-colors ${isRunning ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-green-500/20 text-green-500 border border-green-500/50'}`}
            >
              {isRunning ? 'Pause' : 'Play'}
            </button>
            <button 
              onClick={clearBoard}
              className="flex-1 py-2 rounded font-bold bg-gray-800 text-gray-400 hover:text-white border border-gray-700 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      ) : (
        <div className={`space-y-4 transition-opacity ${mode !== 'place' ? 'opacity-50 pointer-events-none' : ''}`}>
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
            <MousePointer2 size={16} /> Pieces
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(pieceIcons) as PieceType[]).map(type => (
              <button
                key={type}
                onClick={() => setSelectedPiece(type)}
                aria-label={`Select Piece: ${type}`}
                className={`h-12 text-2xl flex items-center justify-center rounded border transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-inset ${
                  selectedPiece === type 
                    ? 'bg-amber-500/20 border-amber-500 text-amber-500' 
                    : 'bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-gray-600'
                }`}
              >
                {pieceIcons[type]}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Select a piece and click the board to place. Right-click on a piece to remove it.
          </p>
          <button 
            onClick={clearBoard}
            className="w-full py-2 rounded font-bold bg-gray-800 text-gray-400 hover:text-white border border-gray-700 transition-colors"
          >
            Clear Board
          </button>
        </div>
      )}

      <div className="space-y-4 pt-4 border-t border-gray-800">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
          <Share2 size={16} /> CP-FEN
        </h2>
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => navigator.clipboard.writeText(getFEN())}
            className="w-full py-2 rounded font-bold bg-gray-800 text-amber-500 hover:bg-gray-700 border border-gray-700 transition-colors text-sm"
          >
            Copy FEN to Clipboard
          </button>
          <div className="flex gap-2">
            <input 
              type="text"
              placeholder="Paste FEN..."
              value={fenInput}
              onChange={(e) => setFenInput(e.target.value)}
              className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
            />
            <button 
              onClick={() => {
                if (fenInput) loadFEN(fenInput);
              }}
              className="px-3 py-2 rounded font-bold bg-amber-500/20 text-amber-500 border border-amber-500/50 hover:bg-amber-500/30 transition-colors text-sm"
            >
              Load
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
