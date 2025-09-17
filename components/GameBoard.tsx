
import React from 'react';
import { GameState, CardData } from '../types';
import { PlayerArea } from './PlayerArea';
import { HandDisplay } from './HandDisplay';
import { PLAYER1_ID, PLAYER2_ID } from '../constants';

interface GameBoardProps {
  gameState: GameState;
  onSelectCard: (card: CardData, playerId: string) => void;
  onSelectQubit: (playerId: string, qubitId: number) => void;
  onEndTurn: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({ gameState, onSelectCard, onSelectQubit, onEndTurn }) => {
  const { players, currentPlayerId, awaitingTarget, turn, log, isCpuThinking } = gameState;
  const player1 = players[PLAYER1_ID];
  const player2 = players[PLAYER2_ID];
  const isPlayer1Turn = currentPlayerId === PLAYER1_ID;

  return (
    <div className="w-full max-w-7xl h-[80vh] flex flex-col border-2 border-cyan-700 rounded-lg p-4 bg-black bg-opacity-30 shadow-2xl shadow-cyan-500/20">
      {/* Opponent's Area (Player 2) */}
      <PlayerArea
        player={player2}
        isCurrentPlayer={!isPlayer1Turn}
        isOpponent={true}
        onSelectQubit={onSelectQubit}
        awaitingTarget={awaitingTarget}
      />

      {/* Center Divider / Info */}
      <div className="flex items-center justify-between gap-4 my-2 border-y-2 border-cyan-800 py-2">
        <div className="text-lg">Turn: <span className="font-bold text-cyan-400">{turn}</span></div>
        <div className="text-xl font-bold text-center text-yellow-300">
            {isCpuThinking ? 'CPU is thinking...' : (isPlayer1Turn ? `${player1.name}'s Turn` : `${player2.name}'s Turn`)}
        </div>
        <button
          onClick={onEndTurn}
          disabled={currentPlayerId !== PLAYER1_ID || awaitingTarget !== null}
          className="px-6 py-2 bg-red-600 hover:bg-red-500 rounded-md shadow-lg transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold"
        >
          End Turn
        </button>
      </div>

      {/* Player's Area (Player 1) */}
      <PlayerArea
        player={player1}
        isCurrentPlayer={isPlayer1Turn}
        isOpponent={false}
        onSelectQubit={onSelectQubit}
        awaitingTarget={awaitingTarget}
      />
      
      {/* Player 1 Hand */}
      <div className="mt-auto pt-4">
        <HandDisplay
          hand={player1.hand}
          onSelectCard={(card) => onSelectCard(card, PLAYER1_ID)}
          mana={player1.mana}
          isCurrentPlayer={isPlayer1Turn}
        />
      </div>
       {/* Game Log - for debugging/info */}
       <div className="absolute bottom-2 right-2 w-64 h-24 bg-black bg-opacity-50 border border-gray-600 rounded p-2 text-xs overflow-y-auto">
        <p className="text-gray-400">Game Log:</p>
        {log.slice(-5).map((entry, index) => <p key={index} className="text-gray-200">{entry}</p>)}
      </div>
    </div>
  );
};
