
import React from 'react';
import { QubitPhysicalState } from '../types';

interface SetupScreenProps {
  onStateSelect: (q1: QubitPhysicalState, q2: QubitPhysicalState) => void;
}

const stateOptions = [
    { label: '|00⟩', q1: QubitPhysicalState.Zero, q2: QubitPhysicalState.Zero },
    { label: '|01⟩', q1: QubitPhysicalState.Zero, q2: QubitPhysicalState.One },
    { label: '|10⟩', q1: QubitPhysicalState.One, q2: QubitPhysicalState.Zero },
    { label: '|11⟩', q1: QubitPhysicalState.One, q2: QubitPhysicalState.One },
];

export const SetupScreen: React.FC<SetupScreenProps> = ({ onStateSelect }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 border-2 border-cyan-500 rounded-lg p-8 shadow-2xl shadow-cyan-500/40 text-center">
        <h2 className="text-3xl font-bold text-cyan-400 mb-6" style={{ textShadow: '0 0 8px #06b6d4' }}>
          Choose Your Initial State
        </h2>
        <p className="text-gray-400 mb-8">Select the starting configuration for your two qubits. Your opponent's state will be set randomly.</p>
        <div className="grid grid-cols-2 gap-4">
          {stateOptions.map(option => (
            <button
              key={option.label}
              onClick={() => onStateSelect(option.q1, option.q2)}
              className="px-8 py-4 bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-2xl rounded-lg transition-transform transform hover:scale-105 border-2 border-cyan-500"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
