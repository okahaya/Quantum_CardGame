
import React from 'react';

interface GameOverModalProps {
  winnerName: string;
  onGoHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ winnerName, onGoHome }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 border-2 border-cyan-500 rounded-lg p-8 shadow-2xl shadow-cyan-500/40 text-center">
        <h2 className="text-3xl font-bold text-cyan-400 mb-4">Game Over</h2>
        <p className="text-xl text-white mb-6">
          <span className="font-bold text-yellow-300">{winnerName}</span> has achieved victory!
        </p>
        <button
          onClick={onGoHome}
          className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-transform transform hover:scale-105"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};
