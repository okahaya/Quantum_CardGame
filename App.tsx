
import React, { useState } from 'react';
import { GameBoard } from './components/GameBoard';
import { useGameLogic } from './hooks/useGameLogic';
import { GameOverModal } from './components/GameOverModal';
import { QuantumCircuitDisplay } from './components/QuantumCircuitDisplay';
import { GameLogDisplay } from './components/GameLogDisplay';
import { HomeScreen } from './components/HomeScreen';
import { SettingsModal } from './components/SettingsModal';
import { GameSettings } from './types';
import { FaCog } from 'react-icons/fa'; // Using a popular icon library for the settings gear

const App: React.FC = () => {
  const [screen, setScreen] = useState<'HOME' | 'GAME'>('HOME');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    qubitCount: 3,
    cardViewMode: 'basic',
  });

  const { gameState, dispatch, selectCard, selectQubit, endTurn, cancelTarget } = useGameLogic(gameSettings);
  
  const handleStartGame = () => {
    dispatch({ type: 'START_GAME', settings: gameSettings });
    setScreen('GAME');
  };
  
  const handleGoHome = () => {
      setScreen('HOME');
  };

  const handleSaveSettings = (newSettings: GameSettings) => {
    setGameSettings(newSettings);
    setIsSettingsOpen(false);
    // If we are in-game, starting a new game is required for settings to apply
    if (screen === 'GAME') {
        dispatch({ type: 'START_GAME', settings: newSettings });
    }
  };

  if (screen === 'HOME') {
    return (
      <>
        <HomeScreen 
          onStartGame={handleStartGame} 
          onOpenSettings={() => setIsSettingsOpen(true)} 
        />
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onSave={handleSaveSettings}
          initialSettings={gameSettings}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-mono overflow-hidden relative flex flex-col">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
      
      <header className="relative z-10 w-full flex items-center justify-between p-2 md:p-4 shrink-0">
        <div className="flex-1"></div>
        <div className="text-center flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-cyan-400 tracking-widest" style={{ textShadow: '0 0 8px #06b6d4' }}>
            Quantum Gate
          </h1>
        </div>
        <div className="flex-1 text-right">
          <button onClick={() => setIsSettingsOpen(true)} className="text-gray-400 hover:text-cyan-400 transition-colors p-2 rounded-full">
            <FaCog size={24} />
          </button>
        </div>
      </header>
      
      <main className="relative z-10 flex-grow flex flex-col lg:flex-row items-start p-2 md:p-4 gap-4 w-full h-full">
        <div className="w-full lg:flex-grow h-full">
          <GameBoard
            gameState={gameState}
            onSelectCard={selectCard}
            onSelectQubit={selectQubit}
            onEndTurn={endTurn}
            onCancelTarget={cancelTarget}
            cardViewMode={gameSettings.cardViewMode}
          />
        </div>
        
        <aside className="w-full lg:w-[400px] lg:max-w-[400px] shrink-0 h-[40vh] lg:h-full flex flex-col gap-4">
          <QuantumCircuitDisplay circuitHistory={gameState.circuitHistory} qubitCount={gameSettings.qubitCount} />
          <GameLogDisplay log={gameState.log} awaitingTargetPrompt={gameState.awaitingTarget?.prompt} />
        </aside>

        {gameState.gamePhase === 'GAME_OVER' && gameState.winner && (
          <GameOverModal winnerName={gameState.players[gameState.winner].name} onGoHome={handleGoHome} />
        )}

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onSave={handleSaveSettings}
          initialSettings={gameSettings}
        />
      </main>
    </div>
  );
};

export default App;
