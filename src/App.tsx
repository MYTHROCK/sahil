import React, { useState, useCallback } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Gamepad2 } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);

  const handleScoreUpdate = useCallback((newScore: number) => {
    setScore(newScore);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans overflow-hidden flex flex-col pt-8 pb-8 px-4 items-center gap-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black relative">
      
      {/* Background grid overlay */}
      <div className="absolute inset-0 z-0 bg-grid-pattern pointer-events-none opacity-50" />

      {/* Header */}
      <header className="z-10 w-full max-w-4xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Gamepad2 className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 drop-shadow-[0_0_10px_rgba(217,70,239,0.3)]">
            NEON VIPER
          </h1>
        </div>
        
        <div className="flex items-center gap-4 bg-zinc-900/80 px-6 py-2 rounded-full border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
          <span className="text-zinc-400 font-medium tracking-widest text-sm">SCORE</span>
          <span className="text-2xl font-black text-cyan-400 font-mono drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
            {score.toString().padStart(3, '0')}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="z-10 flex-1 w-full flex flex-col items-center justify-center gap-12">
        <div className="flex-1 flex items-center justify-center">
          <SnakeGame onScoreUpdate={handleScoreUpdate} />
        </div>
        
        <div className="w-full max-w-lg mb-4">
          <MusicPlayer />
        </div>
      </main>

    </div>
  );
}
