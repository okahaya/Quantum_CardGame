
import React from 'react';
import { CardData } from '../types';
import { CardDisplay } from './CardDisplay';

interface HandDisplayProps {
  hand: CardData[];
  mana: number;
  isCurrentPlayer: boolean;
  onSelectCard: (card: CardData) => void;
}

export const HandDisplay: React.FC<HandDisplayProps> = ({ hand, mana, isCurrentPlayer, onSelectCard }) => {
  const handSize = hand.length;
  const rotationAngle = 10; // Max angle for the fan
  const yOffset = 20; // How much the cards lift up from the center

  return (
    <div className="relative w-full h-48 flex justify-center items-end">
      {hand.map((card, index) => {
        const rotation = (index - (handSize - 1) / 2) * rotationAngle * (handSize > 5 ? 0.6 : 1);
        const translateY = Math.abs(index - (handSize - 1) / 2) * yOffset / (handSize > 5 ? 2 : 1);
        const isPlayable = isCurrentPlayer && mana >= card.cost;

        return (
          <div
            key={`${card.id}-${index}`}
            className="absolute transition-transform duration-300 ease-out"
            style={{
              transform: `rotate(${rotation}deg) translateY(-${translateY}px)`,
              transformOrigin: 'bottom center',
              zIndex: index,
            }}
          >
            <CardDisplay
              card={card}
              isPlayable={isPlayable}
              onClick={() => onSelectCard(card)}
            />
          </div>
        );
      })}
    </div>
  );
};
