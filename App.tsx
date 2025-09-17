import React from 'react';
import { GameBoard } from './components/GameBoard';
import { useGameLogic } from './hooks/useGameLogic';
import { GameOverModal } from './components/GameOverModal';
import { QuantumCircuitDisplay } from './components/QuantumCircuitDisplay';
import { GameLogDisplay } from './components/GameLogDisplay';

const App: React.FC = () => {
  const { gameState, dispatch, selectCard, selectQubit, endTurn, cancelTarget } = useGameLogic();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-mono overflow-hidden relative flex flex-col">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
      
      <header className="relative z-10 w-full text-center p-2 md:p-4 shrink-0">
        <h1 className="text-3xl md:text-4xl font-bold text-cyan-400 tracking-widest" style={{ textShadow: '0 0 8px #06b6d4' }}>
          Quantum Gate
        </h1>
        <p className="text-gray-400 text-sm md:text-base">The Strategic Qubit Card Game</p>
      </header>
      
      <main className="relative z-10 flex-grow flex flex-col lg:flex-row items-start p-2 md:p-4 gap-4 w-full h-full">
        <div className="w-full lg:flex-grow h-full">
          <GameBoard
            gameState={gameState}
            onSelectCard={selectCard}
            onSelectQubit={selectQubit}
            onEndTurn={endTurn}
            onCancelTarget={cancelTarget}
          />
        </div>
        
        <aside className="w-full lg:w-[400px] lg:max-w-[400px] shrink-0 h-[40vh] lg:h-full flex flex-col gap-4">
          <QuantumCircuitDisplay circuitHistory={gameState.circuitHistory} />
          <GameLogDisplay log={gameState.log} awaitingTargetPrompt={gameState.awaitingTarget?.prompt} />
        </aside>

        {gameState.gamePhase === 'GAME_OVER' && gameState.winner && (
          <GameOverModal winnerName={gameState.players[gameState.winner].name} onRestart={() => dispatch({ type: 'START_GAME' })} />
        )}
      </main>
    </div>
  );
};

export default App;