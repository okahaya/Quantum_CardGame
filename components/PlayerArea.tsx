
import React from 'react';
import { PlayerState, AwaitingTargetInfo, GameState } from '../types';
import { QubitDisplay } from './QubitDisplay';
import { isValidTarget, getDisplayStateForQubit } from '../hooks/useGameLogic';

interface PlayerAreaProps {
  player: PlayerState;
  isOpponent: boolean;
  onSelectQubit: (playerId: string, qubitId: number) => void;
  awaitingTarget: AwaitingTargetInfo | null;
  gameState: GameState;
  t: (key: string, params?: any) => string;
}

const InfoDisplay: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="bg-gray-900 bg-opacity-50 border border-cyan-800 rounded-md p-1 md:p-2 text-center w-16 md:w-20">
        <div className="text-xs text-cyan-400 uppercase">{label}</div>
        <div className="text-md md:text-lg font-bold text-white">{value}</div>
    </div>
);


export const PlayerArea: React.FC<PlayerAreaProps> = ({ player, isOpponent, onSelectQubit, awaitingTarget, gameState, t }) => {
  const qubitCount = gameState.settings.qubitCount;

  return (
    <div className={`flex items-center justify-between w-full p-2 rounded-lg transition-all duration-300 ${isOpponent ? 'flex-row-reverse' : ''}`}>
      <div className={`flex gap-2 md:gap-4 items-center ${isOpponent ? 'flex-row-reverse' : ''}`}>
        <div className="flex flex-col gap-2">
            <InfoDisplay label={t('playerArea.deck')} value={player.deck.length} />
        </div>
         <div className="flex flex-col gap-2 items-center">
            <h2 className="text-lg md:text-2xl font-bold text-gray-300">{t(player.name)}</h2>
            {!isOpponent && <InfoDisplay label={t('playerArea.mana')} value={`${player.mana}/${player.maxMana}`} />}
        </div>
      </div>
      
      <div className="flex gap-2 md:gap-4 flex-wrap justify-end max-w-[60%]">
        {Array.from({ length: qubitCount }).map((_, qubitId) => {
          const displayState = getDisplayStateForQubit(player.stateVector, qubitId, qubitCount);
          const targetIndex = awaitingTarget?.targetsAcquired.findIndex(t => t.playerId === player.id && t.qubitId === qubitId);
          const selectedRoleKey = (targetIndex !== -1 && targetIndex !== undefined && awaitingTarget?.card.roles) ? awaitingTarget.card.roles[targetIndex] : undefined;
          const selectedRole = selectedRoleKey ? t(selectedRoleKey) : undefined;

          return (
            <QubitDisplay
              key={qubitId}
              qubitId={qubitId}
              displayState={displayState}
              playerId={player.id}
              onSelectQubit={onSelectQubit}
              isValidTarget={isValidTarget(player.id, qubitId, awaitingTarget, gameState)}
              isOpponent={isOpponent}
              selectedRole={selectedRole}
              t={t}
            />
          );
        })}
      </div>
    </div>
  );
};
