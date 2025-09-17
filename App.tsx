
import React from 'react';
import { GameBoard } from './components/GameBoard';
import { useGameLogic } from './hooks/useGameLogic';
import { GameOverModal } from './components/GameOverModal';
import { SetupScreen } from './components/SetupScreen';
import { QubitPhysicalState } from './types';

const App: React.FC = () => {
  const { gameState, dispatch, selectCard, selectQubit, endTurn } = useGameLogic();

  const handleStateSelect = (q1: QubitPhysicalState, q2: QubitPhysicalState) => {
    dispatch({ type: 'CHOOSE_INITIAL_STATE', payload: { q1, q2 } });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-mono overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <header className="w-full max-w-7xl text-center mb-4">
          <h1 className="text-4xl font-bold text-cyan-400 tracking-widest" style={{ textShadow: '0 0 8px #06b6d4' }}>
            Quantum Gate
          </h1>
          <p className="text-gray-400">The Strategic Qubit Card Game</p>
        </header>
        
        {gameState.gamePhase === 'SETUP' ? (
          <SetupScreen onStateSelect={handleStateSelect} />
        ) : (
          <>
            <GameBoard
              gameState={gameState}
              onSelectCard={selectCard}
              onSelectQubit={selectQubit}
              onEndTurn={endTurn}
            />
            
            {gameState.gamePhase === 'GAME_OVER' && gameState.winner && (
              <GameOverModal winnerName={gameState.players[gameState.winner].name} onRestart={() => dispatch({ type: 'START_GAME' })} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
