
import React from 'react';
import { CardData } from '../types';

interface CardDisplayProps {
  card: CardData;
  isPlayable: boolean;
  onClick: () => void;
}

export const CardDisplay: React.FC<CardDisplayProps> = ({ card, isPlayable, onClick }) => {
  const cardTypeColor = {
    'single_qubit_gate': 'bg-blue-800',
    'two_qubit_gate': 'bg-green-800',
    'special': 'bg-purple-800',
  };

  return (
    <div
      onClick={isPlayable ? onClick : undefined}
      className={`w-40 h-56 p-2 flex flex-col justify-between rounded-lg shadow-lg border-2
                  transition-all duration-200 ease-in-out transform
                  ${isPlayable ? 'cursor-pointer hover:-translate-y-4 hover:shadow-2xl hover:shadow-cyan-500/50 border-cyan-400' : 'cursor-not-allowed filter grayscale bg-gray-700 border-gray-600'}
                  ${!isPlayable ? '' : 'bg-gray-800'}
                  `}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-sm text-white">{card.name}</h3>
        <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center font-bold text-black text-lg border-2 border-black">
          {card.cost}
        </div>
      </div>
      
      <p className="text-xs text-gray-300 my-2">{card.action}</p>
      
      <div className={`text-xs text-center p-1 rounded-md text-white font-semibold ${cardTypeColor[card.type]}`}>
        {card.type.replace(/_/g, ' ')}
      </div>
    </div>
  );
};
