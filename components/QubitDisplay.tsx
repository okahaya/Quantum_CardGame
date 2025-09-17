import React from 'react';
import { QubitState, QubitPhysicalState, AwaitingTargetInfo } from '../types';

interface QubitDisplayProps {
  qubit: QubitState;
  playerId: string;
  onSelectQubit: (playerId: string, qubitId: number) => void;
  awaitingTarget: AwaitingTargetInfo | null;
  isValidTarget: boolean;
  isOpponent: boolean;
}

// FIX: Explicitly type `stateStyles` to make the `animation` property optional. This resolves a TypeScript error where `animation` was not defined for all physical states.
const stateStyles: { [key in QubitPhysicalState]: { color: string; shadow: string; animation?: string } } = {
  [QubitPhysicalState.Zero]: { color: 'bg-blue-500', shadow: 'shadow-blue-400' },
  [QubitPhysicalState.One]: { color: 'bg-red-500', shadow: 'shadow-red-400' },
  [QubitPhysicalState.Superposition]: { color: 'bg-purple-500', shadow: 'shadow-purple-400', animation: 'animate-pulse' }
};

export const QubitDisplay: React.FC<QubitDisplayProps> = ({ qubit, playerId, onSelectQubit, awaitingTarget, isValidTarget, isOpponent }) => {
  const { physicalState, id, entangledWith } = qubit;
  const styles = stateStyles[physicalState];
  
  const isSelectable = !!awaitingTarget;

  const getRingClasses = () => {
    if (!isSelectable) return 'ring-transparent';
    if (isValidTarget) return 'ring-green-400 animate-pulse';
    return 'ring-yellow-400/50';
  }

  const handleClick = () => {
    if (isSelectable && isValidTarget) {
      onSelectQubit(playerId, id);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        onClick={handleClick}
        className={`relative w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all duration-300
                    ${styles.color} ${styles.animation || ''} shadow-lg ${styles.shadow} ring-4
                    ${isValidTarget ? 'cursor-pointer scale-110 hover:ring-green-300' : ''}
                    ${getRingClasses()}
                    ${entangledWith ? 'border-4 border-dashed border-pink-400' : 'border-4 border-transparent'}`}
      >
        <span className="text-2xl md:text-4xl font-bold text-white" style={{textShadow: '0 0 5px black'}}>{physicalState}</span>
        {entangledWith && 
            <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 text-xs bg-pink-500 rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center">🔗</div>
        }
      </div>
      <span className="text-xs md:text-sm text-gray-400">{isOpponent ? 'Opp' : 'Your'} Q{id + 1}</span>
    </div>
  );
};
