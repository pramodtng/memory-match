'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RotateCw } from 'lucide-react';

const GameOverModal = ({ 
  isOpen, 
  timeLeft, 
  moves, 
  onNewGame, 
  onShowTutorial,
  onLevelSelect,
  score,
  stars,
  level,
  totalLevels
}) => {
  if (!isOpen) return null;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-md w-full shadow-xl text-center my-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500" />
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {timeLeft > 0 ? 'Level Complete! 🎉' : 'Time\'s Up! ⏰'}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 px-2">
            {timeLeft > 0
              ? level < totalLevels - 1
                ? `You completed level ${level + 1}!`
                : 'You completed the game! 🏆'
              : 'Better luck next time!'
            }
          </p>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Time Left</div>
                <div className="text-lg sm:text-xl font-bold">{formatTime(timeLeft)}</div>
              </div>
              <div>
                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Moves</div>
                <div className="text-lg sm:text-xl font-bold">{moves}</div>
              </div>
              <div className="col-span-2">
                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Score</div>
                <div className="text-xl sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {score}
                </div>
                {stars > 0 && (
                  <div className="flex justify-center mt-2 gap-1">
                    {[...Array(stars)].map((_, i) => (
                      <div key={i} className="text-yellow-400 text-lg sm:text-xl">★</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:gap-3">
            <button
              onClick={onNewGame}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 sm:py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <RotateCw className="w-4 h-4 sm:w-5 sm:h-5" />
              {timeLeft > 0 && level < totalLevels - 1 ? 'Next Level' : 'Play Again'}
            </button>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={onLevelSelect}
                className="flex-1 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition-colors text-xs sm:text-sm"
              >
                Level Select
              </button>
              <button
                onClick={onShowTutorial}
                className="flex-1 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition-colors text-xs sm:text-sm"
              >
                How to Play
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default GameOverModal;
