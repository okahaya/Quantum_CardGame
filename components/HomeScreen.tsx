
import React from 'react';
import { Language } from '../App';

interface HomeScreenProps {
    onStartGame: () => void;
    onOpenSettings: () => void;
    onViewLog: () => void;
    hasLog: boolean;
    onViewRules: () => void;
    onToggleLanguage: () => void;
    language: Language;
    t: (key: string) => string;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onStartGame, onOpenSettings, onViewLog, hasLog, onViewRules, onToggleLanguage, language, t }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-mono flex flex-col items-center justify-center p-4 relative">
        <button 
            onClick={onToggleLanguage}
            className="absolute top-4 left-4 w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-white font-bold text-lg transition-all transform hover:scale-110 shadow-lg"
            aria-label="Toggle Language"
        >
            {language === 'ja' ? 'EN' : 'JP'}
        </button>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
      <div className="relative z-10 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-cyan-400 tracking-widest mb-12" style={{ textShadow: '0 0 15px #06b6d4' }}>
          {t('homeScreen.title')}
        </h1>
        
        <div className="flex flex-col items-center gap-6">
            <button
                onClick={onStartGame}
                className="w-64 px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white text-xl font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/30"
            >
                {t('homeScreen.startGame')}
            </button>
            <button
                onClick={onViewLog}
                disabled={!hasLog}
                className="w-64 px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white text-lg font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed disabled:transform-none"
            >
                {t('homeScreen.viewLog')}
            </button>
            <button
                onClick={onViewRules}
                className="w-64 px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white text-lg font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
                {t('homeScreen.rules')}
            </button>
            <button
                onClick={onOpenSettings}
                className="w-64 px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white text-lg font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
                {t('homeScreen.settings')}
            </button>
        </div>
      </div>
    </div>
  );
};
