
import React from 'react';
import { QubitState, QubitPhysicalState, AwaitingTargetInfo } from '../types';
import { PLAYER1_ID } from '../constants';

interface QubitDisplayProps {
  qubit: QubitState;
  playerId: string;
  onSelectQubit: (playerId: string, qubitId: number) => void;
  awaitingTarget: AwaitingTargetInfo | null;
  isOpponent: boolean;
}

const stateStyles = {
  [QubitPhysicalState.Zero]: {
    label: 'State |0⟩',
    color: 'bg-blue-500',
    shadow: 'shadow-blue-400',
    animation: ''
  },
  [QubitPhysicalState.One]: {
    label: 'State |1⟩',
    color: 'bg-red-500',
    shadow: 'shadow-red-400',
    animation: ''
  },
  [QubitPhysicalState.Superposition]: {
    label: 'Superposition',
    color: 'bg-purple-500',
    shadow: 'shadow-purple-400',
    animation: 'animate-pulse'
  }
};

export const QubitDisplay: React.FC<QubitDisplayProps> = ({ qubit, playerId, onSelectQubit, awaitingTarget, isOpponent }) => {
  const { physicalState, id, entangledWith } = qubit;
  const styles = stateStyles[physicalState];
  
  const isSelectable = awaitingTarget && 
    ((awaitingTarget.card.targetOpponent && (isOpponent || playerId === PLAYER1_ID)) || (!awaitingTarget.card.targetOpponent && playerId === awaitingTarget.sourcePlayerId));

  const handleClick = () => {
    if (isSelectable) {
      onSelectQubit(playerId, id);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        onClick={handleClick}
        className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300
                    ${styles.color} ${styles.animation} shadow-lg ${styles.shadow}
                    ${isSelectable ? 'cursor-pointer ring-4 ring-yellow-400 scale-110' : ''}
                    ${entangledWith ? 'border-4 border-dashed border-pink-400' : 'border-4 border-transparent'}`}
      >
        <span className="text-4xl font-bold text-white" style={{textShadow: '0 0 5px black'}}>{physicalState}</span>
        {entangledWith && 
            <div className="absolute -top-2 -right-2 text-xs bg-pink-500 rounded-full w-6 h-6 flex items-center justify-center">🔗</div>
        }
      </div>
      <span className="text-sm text-gray-400">{isOpponent ? 'Opponent' : 'Your'} Qubit {id + 1}</span>
    </div>
  );
};
