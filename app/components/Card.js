'use client';

import { motion } from 'framer-motion';

const Card = ({ emoji, isFlipped, isMatched, isWrong, onClick }) => {
  return (
    <motion.div
      className={`card relative cursor-pointer rounded-xl shadow-lg ${
        isMatched ? 'opacity-70' : 'hover:shadow-xl'
      } ${isWrong ? 'animate-shake' : ''}`}
      onClick={!isFlipped && !isMatched ? onClick : null}
      initial={{ rotateY: 0, backgroundColor: '#4f46e5' }}
      animate={{
        rotateY: isFlipped || isMatched ? 180 : 0,
        backgroundColor: isFlipped || isMatched ? '#f8fafc' : '#4f46e5',
        scale: isMatched ? 0.95 : 1
      }}
      style={{
        aspectRatio: '1',
        transformStyle: 'preserve-3d',
        transform: 'rotateY(0deg)', // Ensure initial state is not flipped
      }}
      whileHover={!isFlipped && !isMatched ? { y: -4, scale: 1.02 } : {}}
      whileTap={!isFlipped && !isMatched ? { scale: 0.98 } : {}}
      transition={{ 
        type: 'spring', 
        stiffness: 400, 
        damping: 25,
        scale: { duration: 0.2 }
      }}
    >
      <div className="card-face front absolute inset-0 flex items-center justify-center rounded-xl bg-indigo-600 text-white" 
           style={{ 
             backfaceVisibility: 'hidden',
             WebkitBackfaceVisibility: 'hidden',
             transform: 'rotateY(0deg)'
           }}>
        <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center text-2xl md:text-3xl">
          ?
        </div>
      </div>
      <div className="card-face back absolute inset-0 flex items-center justify-center rounded-xl bg-white text-4xl md:text-5xl"
           style={{ 
             backfaceVisibility: 'hidden',
             WebKitBackfaceVisibility: 'hidden',
             transform: 'rotateY(180deg)'
           }}>
        {emoji}
      </div>
    </motion.div>
  );
};

export default Card;