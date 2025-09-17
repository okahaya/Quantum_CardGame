
import React from 'react';
import { PlayerState, AwaitingTargetInfo, GameState } from '../types';
import { QubitDisplay } from './QubitDisplay';
import { isValidTarget } from '../hooks/useGameLogic';

interface PlayerAreaProps {
  player: PlayerState;
  isOpponent: boolean;
  onSelectQubit: (playerId: string, qubitId: number) => void;
  awaitingTarget: AwaitingTargetInfo | null;
  gameState: GameState;
}

const InfoDisplay: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="bg-gray-900 bg-opacity-50 border border-cyan-800 rounded-md p-1 md:p-2 text-center w-16 md:w-20">
        <div className="text-xs text-cyan-400 uppercase">{label}</div>
        <div className="text-md md:text-lg font-bold text-white">{value}</div>
    </div>
);


export const PlayerArea: React.FC<PlayerAreaProps> = ({ player, isOpponent, onSelectQubit, awaitingTarget, gameState }) => {
  return (
    <div className={`flex items-center justify-between w-full p-2 rounded-lg transition-all duration-300 ${isOpponent ? 'flex-row-reverse' : ''}`}>
      <div className={`flex gap-2 md:gap-4 items-center ${isOpponent ? 'flex-row-reverse' : ''}`}>
        <div className="flex flex-col gap-2">
            <InfoDisplay label="Deck" value={player.deck.length} />
            <InfoDisplay label="Discard" value={player.discard.length} />
        </div>
         <div className="flex flex-col gap-2 items-center">
            <h2 className="text-lg md:text-2xl font-bold text-gray-300">{player.name}</h2>
            {!isOpponent && <InfoDisplay label="Mana" value={`${player.mana}/${player.maxMana}`} />}
        </div>
      </div>
      
      <div className="flex gap-2 md:gap-4 flex-wrap justify-end max-w-[60%]">
        {player.qubits.map(qubit => (
          <QubitDisplay
            key={qubit.id}
            qubit={qubit}
            playerId={player.id}
            onSelectQubit={onSelectQubit}
            awaitingTarget={awaitingTarget}
            isValidTarget={isValidTarget(player.id, qubit.id, awaitingTarget, gameState)}
            isOpponent={isOpponent}
          />
        ))}
      </div>
    </div>
  );
};
