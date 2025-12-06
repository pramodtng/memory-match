'use client';

import { motion } from 'framer-motion';
import Card from './Card';

const GameBoard = ({ 
  cards, 
  flippedIndices, 
  isWrong, 
  onCardClick, 
  gridClass 
}) => {
  return (
    <motion.div 
      className={`grid ${gridClass} gap-2 sm:gap-3 md:gap-4`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {cards.map((card, index) => (
        <Card
          key={`${card.id}-${card.isMatched ? 'matched' : 'unmatched'}`}
          emoji={card.emoji}
          isFlipped={card.isFlipped}
          isMatched={card.isMatched}
          isWrong={isWrong && flippedIndices.includes(index)}
          onClick={() => onCardClick(index)}
        />
      ))}
    </motion.div>
  );
};

export default GameBoard;
