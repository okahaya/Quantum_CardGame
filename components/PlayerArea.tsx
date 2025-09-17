
import React from 'react';
import { PlayerState, AwaitingTargetInfo } from '../types';
import { QubitDisplay } from './QubitDisplay';

interface PlayerAreaProps {
  player: PlayerState;
  isCurrentPlayer: boolean;
  isOpponent: boolean;
  onSelectQubit: (playerId: string, qubitId: number) => void;
  awaitingTarget: AwaitingTargetInfo | null;
}

const InfoDisplay: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="bg-gray-900 bg-opacity-50 border border-cyan-800 rounded-md p-2 text-center">
        <div className="text-xs text-cyan-400 uppercase">{label}</div>
        <div className="text-lg font-bold text-white">{value}</div>
    </div>
);


export const PlayerArea: React.FC<PlayerAreaProps> = ({ player, isCurrentPlayer, isOpponent, onSelectQubit, awaitingTarget }) => {
  return (
    <div className={`flex items-center justify-between w-full p-2 rounded-lg transition-all duration-300 ${isCurrentPlayer ? 'bg-cyan-900/30' : ''} ${isOpponent ? 'flex-row-reverse' : ''}`}>
      <div className={`flex gap-4 items-center ${isOpponent ? 'flex-row-reverse' : ''}`}>
        <div className="flex flex-col gap-2">
            <InfoDisplay label="Deck" value={player.deck.length} />
            <InfoDisplay label="Discard" value={player.discard.length} />
        </div>
         <div className="flex flex-col gap-2">
            <InfoDisplay label="Mana" value={`${player.mana}/${player.maxMana}`} />
            <h2 className="text-2xl font-bold text-gray-300">{player.name}</h2>
        </div>
      </div>
      
      <div className="flex gap-8">
        {player.qubits.map(qubit => (
          <QubitDisplay
            key={qubit.id}
            qubit={qubit}
            playerId={player.id}
            onSelectQubit={onSelectQubit}
            awaitingTarget={awaitingTarget}
            isOpponent={isOpponent}
          />
        ))}
      </div>
    </div>
  );
};
