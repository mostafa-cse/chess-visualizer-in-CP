
import Toolbar from './components/toolbar/Toolbar';
import ChessGrid from './components/board/ChessGrid';
import PieceLayer from './components/board/PieceLayer';
import HighlightLayer from './components/board/HighlightLayer';
import { useBoardStore } from './store/useBoardStore';

function App() {
  const { rows, cols } = useBoardStore();

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      <Toolbar />
      <main className="flex-1 p-4 md:p-8 flex flex-col items-center justify-center bg-[#0d0f14] overflow-hidden">
        <div className="w-full h-full max-w-5xl max-h-full flex items-center justify-center">
          <div 
            className="relative bg-gray-900 border border-gray-800 rounded-lg shadow-2xl p-4 md:p-8 flex items-center justify-center"
            style={{ 
              maxWidth: '100%', 
              maxHeight: '100%',
              aspectRatio: `${cols}/${rows}` 
            }}
          >
            {/* The actual board container to tightly wrap the grid */}
            <div className="relative w-full h-full">
              {/* Left coordinate gutter */}
              <div className="absolute top-0 bottom-0 -left-6 md:-left-8 w-6 md:w-8 flex flex-col justify-around text-gray-500 font-mono text-[10px] md:text-xs select-none pr-1 md:pr-2">
                {Array.from({ length: rows }).map((_, r) => (
                  <div key={r} className="flex-1 flex items-center justify-end">{r}</div>
                ))}
              </div>

              <ChessGrid />
              <HighlightLayer />
              <PieceLayer />

              {/* Bottom coordinate gutter */}
              <div className="absolute left-0 right-0 -bottom-6 md:-bottom-8 h-6 md:h-8 flex justify-around text-gray-500 font-mono text-[10px] md:text-xs select-none pt-1 md:pt-2">
                {Array.from({ length: cols }).map((_, c) => (
                  <div key={c} className="flex-1 flex items-center justify-center">{c}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
