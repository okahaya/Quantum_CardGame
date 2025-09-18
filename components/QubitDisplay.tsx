
import React from 'react';
import { QubitDisplayState } from '../types';

interface QubitDisplayProps {
  qubitId: number;
  displayState: QubitDisplayState;
  playerId: string;
  onSelectQubit: (playerId: string, qubitId: number) => void;
  isValidTarget: boolean;
  isOpponent: boolean;
  selectedRole?: string;
  t: (key: string, params?: any) => string;
}

const stateStyles: { [key in QubitDisplayState]: { color: string; shadow: string; animation?: string } } = {
  [QubitDisplayState.Zero]: { color: 'bg-blue-500', shadow: 'shadow-blue-400' },
  [QubitDisplayState.One]: { color: 'bg-red-500', shadow: 'shadow-red-400' },
  [QubitDisplayState.Superposition]: { color: 'bg-purple-500', shadow: 'shadow-purple-400', animation: 'animate-pulse' }
};

export const QubitDisplay: React.FC<QubitDisplayProps> = ({ qubitId, displayState, playerId, onSelectQubit, isValidTarget, isOpponent, selectedRole, t }) => {
  const styles = stateStyles[displayState];

  const getRingClasses = () => {
    if (selectedRole) {
      return isOpponent ? 'ring-red-400' : 'ring-yellow-400';
    }
    if (isValidTarget) {
      return isOpponent ? 'ring-purple-400 animate-pulse' : 'ring-green-400 animate-pulse';
    }
    return 'ring-transparent';
  }
  
  const getRoleLabel = () => {
      if (!selectedRole) return null;
      if (selectedRole.toLowerCase().includes('control') || selectedRole.includes('制御')) return 'C';
      if (selectedRole.toLowerCase().includes('target') || selectedRole.includes('対象')) return 'T';
      if (selectedRole.toLowerCase().includes('qubit') || selectedRole.includes('量子ビット')) return selectedRole.split(' ')[1] || selectedRole.split('')[1]; // 'A' or 'B'
      return selectedRole[0];
  }

  const roleLabel = getRoleLabel();

  const handleClick = () => {
    if (isValidTarget) {
      onSelectQubit(playerId, qubitId);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        onClick={handleClick}
        className={`relative w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all duration-300
                    ${styles.color} ${styles.animation || ''} shadow-lg ${styles.shadow} ring-4 border-4 border-transparent
                    ${isValidTarget ? 'cursor-pointer scale-110 hover:ring-green-300' : ''}
                    ${selectedRole ? 'scale-110' : ''}
                    ${getRingClasses()}`}
      >
        <span className="text-2xl md:text-4xl font-bold text-white" style={{textShadow: '0 0 5px black'}}>{displayState}</span>
        {roleLabel && (
            <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-lg border-2 ${isOpponent ? 'bg-red-600 border-red-300' : 'bg-yellow-600 border-yellow-300'}`}>
                {roleLabel}
            </div>
        )}
      </div>
      <span className="text-xs md:text-sm text-gray-400">{t(isOpponent ? 'qubitDisplay.opp' : 'qubitDisplay.your')} Q{qubitId + 1}</span>
    </div>
  );
};
