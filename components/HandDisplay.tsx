import React from 'react';
import { CardData } from '../types';
import { CardDisplay } from './CardDisplay';

interface HandDisplayProps {
  hand: CardData[];
  mana: number;
  isCurrentPlayer: boolean;
  isSetupPhase: boolean;
  onSelectCard: (card: CardData) => void;
}

export const HandDisplay: React.FC<HandDisplayProps> = ({ hand, mana, isCurrentPlayer, isSetupPhase, onSelectCard }) => {

  return (
    <div className="w-full h-full flex items-center">
      <div className="w-full flex gap-2 md:gap-4 overflow-x-auto pb-4 px-2">
          {hand.map((card, index) => {
            const isPlayable = isCurrentPlayer && (isSetupPhase || mana >= card.cost);
            return (
              <div key={`${card.id}-${index}`} className="shrink-0">
                <CardDisplay
                  card={card}
                  isPlayable={isPlayable}
                  onClick={() => isPlayable && onSelectCard(card)}
                />
              </div>
            );
          })}
          {hand.length === 0 && (
             <div className="w-full text-center text-gray-500">No cards in hand.</div>
          )}
      </div>
    </div>
  );
};