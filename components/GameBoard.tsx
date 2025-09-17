
import React from 'react';
import { GameState, CardData } from '../types';
import { PlayerArea } from './PlayerArea';
import { HandDisplay } from './HandDisplay';
import { CardDisplay } from './CardDisplay';
import { PLAYER1_ID, PLAYER2_ID } from '../constants';

interface GameBoardProps {
  gameState: GameState;
  onSelectCard: (card: CardData) => void;
  onSelectQubit: (playerId: string, qubitId: number) => void;
  onEndTurn: () => void;
  onCancelTarget: () => void;
  cardViewMode: 'basic' | 'advanced';
}

export const GameBoard: React.FC<GameBoardProps> = ({ gameState, onSelectCard, onSelectQubit, onEndTurn, onCancelTarget, cardViewMode }) => {
  const { players, currentPlayerId, awaitingTarget, turn, isCpuThinking } = gameState;
  const player1 = players[PLAYER1_ID];
  const player2 = players[PLAYER2_ID];
  const isPlayer1Turn = currentPlayerId === PLAYER1_ID;
  const isSetupPhase = turn === 1;

  const getTurnText = () => {
      if (isCpuThinking) return 'CPU is thinking...';
      if (isSetupPhase) return `${players[currentPlayerId].name}'s Preparation`;
      return isPlayer1Turn ? `${player1.name}'s Turn` : `${player2.name}'s Turn`;
  }

  return (
    <div className="w-full h-full flex flex-col border-2 border-cyan-700 rounded-lg p-2 md:p-4 bg-black bg-opacity-30 shadow-2xl shadow-cyan-500/20 relative">
        
        {/* Card Preview */}
        {awaitingTarget && (
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-2"
          >
            <CardDisplay card={awaitingTarget.card} isPlayable={false} onClick={() => {}} isPreview cardViewMode={cardViewMode} />
            <button 
              onClick={onCancelTarget}
              className="text-xs bg-red-800 hover:bg-red-700 px-3 py-1 rounded-lg shadow-md transition-all"
            >
                Cancel Target
            </button>
          </div>
        )}
        
        {/* Opponent's Area (Player 2) */}
        <PlayerArea
            player={player2}
            isOpponent={true}
            onSelectQubit={onSelectQubit}
            awaitingTarget={awaitingTarget}
            gameState={gameState}
        />

        {/* Center Divider / Info */}
        <div className="flex items-center justify-between gap-2 md:gap-4 my-2 border-y-2 border-cyan-800 py-2 px-1 md:px-2">
            <div className="text-sm md:text-lg">Turn: <span className="font-bold text-cyan-400">{turn}</span></div>
            <div className="text-md md:text-xl font-bold text-center text-yellow-300 min-w-[100px] md:min-w-[200px] truncate">
                {getTurnText()}
            </div>
            <button
            onClick={onEndTurn}
            disabled={currentPlayerId !== PLAYER1_ID || (awaitingTarget !== null)}
            className="px-4 md:px-6 py-2 bg-red-600 hover:bg-red-500 rounded-md shadow-lg transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:shadow-none text-white font-bold text-sm md:text-base"
            >
            {isSetupPhase ? 'End Prep' : 'End Turn'}
            </button>
        </div>

        {/* Player's Area (Player 1) */}
        <PlayerArea
            player={player1}
            isOpponent={false}
            onSelectQubit={onSelectQubit}
            awaitingTarget={awaitingTarget}
            gameState={gameState}
        />
        
        {/* Player 1 Hand */}
        <div className="mt-auto pt-4 h-44 md:h-52">
            <HandDisplay
              hand={player1.hand}
              onSelectCard={onSelectCard}
              mana={player1.mana}
              isCurrentPlayer={isPlayer1Turn}
              isSetupPhase={isSetupPhase}
              cardViewMode={cardViewMode}
            />
        </div>
    </div>
  );
};
