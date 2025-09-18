
import React from 'react';
import { CardData } from '../types';

interface CardDisplayProps {
  card: CardData;
  isPlayable: boolean;
  onClick: () => void;
  isPreview?: boolean;
  cardViewMode: 'basic' | 'advanced';
  isSelected?: boolean;
  t: (key: string, params?: any) => string;
}

export const CardDisplay: React.FC<CardDisplayProps> = ({ card, isPlayable, onClick, isPreview = false, cardViewMode, isSelected = false, t }) => {
  const cardTypeColor = {
    'single': 'bg-blue-800',
    'two': 'bg-green-800',
    'three': 'bg-red-800',
  };

  const isInteractive = isPlayable && !isPreview;
  
  const baseClasses = "p-2 flex flex-col justify-between rounded-lg shadow-lg border-2 transition-all duration-200 ease-in-out transform";
  const previewSizeClasses = isPreview ? 'w-40 h-56 md:w-48 md:h-64' : 'w-32 h-44 md:w-36 md:h-52';

  const interactiveClasses = isInteractive
    ? 'cursor-pointer'
    : 'cursor-not-allowed';

  // If selected, it's lifted. If not selected but interactive, it lifts on hover.
  const transformClasses = isSelected
    ? '-translate-y-4 shadow-2xl shadow-cyan-500/50'
    : isInteractive
    ? 'hover:-translate-y-4 hover:shadow-2xl hover:shadow-cyan-500/50'
    : '';

  const colorClasses = isPlayable
    ? 'bg-gray-800 border-cyan-400'
    : 'filter grayscale bg-gray-700 border-gray-600';

  const finalClasses = [
    baseClasses,
    previewSizeClasses,
    interactiveClasses,
    transformClasses,
    colorClasses,
  ].join(' ');


  return (
    <div
      onClick={isInteractive ? onClick : undefined}
      className={finalClasses}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-xs md:text-sm text-white">{t(card.name)}</h3>
        <div className={`shrink-0 rounded-full bg-cyan-500 flex items-center justify-center font-bold text-black border-2 border-black ${isPreview ? 'w-8 h-8 text-lg' : 'w-6 h-6 text-base'}`}>
          {card.cost}
        </div>
      </div>
      
      {cardViewMode === 'basic' && <p className={`text-gray-300 my-1 md:my-2 ${isPreview ? 'text-sm' : 'text-xs'}`}>{t(card.description)}</p>}
      
      {cardViewMode === 'advanced' && (
        <div className="flex-grow flex items-center justify-center">
            <span className="text-4xl md:text-5xl font-mono font-bold text-cyan-300" style={{textShadow: '0 0 4px #06b6d4'}}>{card.symbol}</span>
        </div>
      )}

      <div className={`text-xs text-center p-1 rounded-md text-white font-semibold ${cardTypeColor[card.type]}`}>
        {t(`cardDisplay.${card.type}`)}
      </div>
    </div>
  );
};
