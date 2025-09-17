
import React from 'react';
import { CardData } from '../types';
import { CardDisplay } from './CardDisplay';

interface HandDisplayProps {
  hand: CardData[];
  mana: number;
  isCurrentPlayer: boolean;
  isSetupPhase: boolean;
  onSelectCard: (card: CardData) => void;
  cardViewMode: 'basic' | 'advanced';
  selectedCard: CardData | undefined | null;
  onCancelTarget: () => void;
  actionsTaken: number;
}

export const HandDisplay: React.FC<HandDisplayProps> = ({ hand, mana, isCurrentPlayer, isSetupPhase, onSelectCard, cardViewMode, selectedCard, onCancelTarget, actionsTaken }) => {

  return (
    <div className="w-full h-full flex items-center">
      <div className="w-full flex gap-2 md:gap-4 overflow-x-auto pb-4 px-2">
          {hand.map((card) => {
            const hasActions = isSetupPhase || actionsTaken < 2;
            const isPlayable = isCurrentPlayer && hasActions && (isSetupPhase || mana >= card.cost);
            const isSelected = selectedCard?.instanceId === card.instanceId;

            const handleClick = () => {
              if (!isPlayable || selectedCard) {
                if(isSelected) onCancelTarget();
                return;
              };
              onSelectCard(card);
            };

            return (
              <div key={card.instanceId} className="shrink-0">
                <CardDisplay
                  card={card}
                  isPlayable={isPlayable}
                  onClick={handleClick}
                  cardViewMode={cardViewMode}
                  isSelected={isSelected}
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