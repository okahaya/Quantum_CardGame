
import React from 'react';

interface HomeScreenProps {
    onStartGame: () => void;
    onOpenSettings: () => void;
    onViewLog: () => void;
    hasLog: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onStartGame, onOpenSettings, onViewLog, hasLog }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-mono flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
      <div className="relative z-10 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-cyan-400 tracking-widest mb-4" style={{ textShadow: '0 0 15px #06b6d4' }}>
          Quantum Gate
        </h1>
        <p className="text-gray-400 text-lg md:text-xl mb-12">The Strategic Qubit Card Game</p>
        
        <div className="flex flex-col items-center gap-6">
            <button
                onClick={onStartGame}
                className="w-64 px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white text-xl font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/30"
            >
                CPU vs AI
            </button>
            <button
                onClick={onViewLog}
                disabled={!hasLog}
                className="w-64 px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white text-lg font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed disabled:transform-none"
            >
                View Last Game Log
            </button>
            <button
                onClick={onOpenSettings}
                className="w-64 px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white text-lg font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
                Settings
            </button>
        </div>
      </div>
    </div>
  );
};
