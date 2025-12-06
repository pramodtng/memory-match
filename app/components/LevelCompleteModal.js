'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowRight, Star, Trophy } from 'lucide-react';

const LevelCompleteModal = ({ 
  isOpen, 
  level, 
  score, 
  stars,
  onNextLevel,
  onMenu,
  totalLevels,
  isLastLevel
}) => {
  if (!isOpen) return null;

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
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
          </div>
          
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Level {level + 1} Complete! 🎉
          </h2>
          
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 px-2">
            {isLastLevel 
              ? 'Congratulations! You\'ve completed all levels! 🏆' 
              : 'Great job! Ready for the next challenge?'
            }
          </p>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Score</div>
                <div className="text-lg sm:text-xl font-bold text-indigo-600 dark:text-indigo-400">
                  {score}
                </div>
              </div>
              <div>
                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Stars</div>
                <div className="flex justify-center gap-1">
                  {[...Array(3)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${i < stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:gap-3">
            {!isLastLevel ? (
              <button
                onClick={onNextLevel}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 sm:py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                Next Level <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 text-yellow-500 font-medium py-2 text-sm sm:text-base">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Game Completed!</span>
              </div>
            )}
            
            <button
              onClick={onMenu}
              className="flex-1 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium py-2.5 sm:py-3 px-4 rounded-lg transition-colors text-sm sm:text-base"
            >
              Level Selection
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LevelCompleteModal;
