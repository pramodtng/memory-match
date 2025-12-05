'use client';

import { motion, AnimatePresence } from 'framer-motion';

const TutorialModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">How to Play</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl"
              aria-label="Close tutorial"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p className="leading-relaxed">
              Welcome to Memory Match! The goal is to find all matching pairs of cards.
            </p>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-indigo-600 dark:text-indigo-400">Game Rules:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Click on a card to flip it over</li>
                <li>Find and match all pairs of cards</li>
                <li>Match all pairs before time runs out</li>
                <li>Complete the game with the fewest moves for a higher score</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-indigo-600 dark:text-indigo-400">Scoring:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Base score: 1000 points</li>
                <li>+10 points for each second remaining</li>
                <li>-5 points for each move</li>
                <li>Minimum score: 100 points</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-indigo-600 dark:text-indigo-400">Star Ratings:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>⭐ 3 stars: Complete with 75%+ time remaining</li>
                <li>⭐ 2 stars: Complete with 50%+ time remaining</li>
                <li>⭐ 1 star: Complete with any time remaining</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              onClick={onClose}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Got it!
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TutorialModal;
