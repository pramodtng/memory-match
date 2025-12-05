'use client';

import { motion } from 'framer-motion';
import { Lock, Star, Check } from 'lucide-react';

const LevelSelect = ({ 
  levels, 
  currentLevel, 
  unlockedLevels, 
  levelScores, 
  levelStars, 
  onSelectLevel,
  onClose
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Select Level</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {levels.map((_, index) => {
            const isUnlocked = unlockedLevels.includes(index);
            const isCurrent = index === currentLevel;
            const hasScore = levelScores[index] > 0;
            const stars = levelStars[index] || 0;
            
            return (
              <motion.button
                key={index}
                whileHover={isUnlocked ? { scale: 1.05 } : {}}
                whileTap={isUnlocked ? { scale: 0.95 } : {}}
                onClick={() => isUnlocked && onSelectLevel(index)}
                className={`relative flex flex-col items-center justify-center p-4 rounded-xl transition-all
                  ${isUnlocked 
                    ? 'bg-indigo-50 dark:bg-gray-700 hover:bg-indigo-100 dark:hover:bg-gray-600' 
                    : 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed'}
                  ${isCurrent && 'ring-2 ring-indigo-500'}
                `}
                disabled={!isUnlocked}
              >
                {isCurrent && !hasScore && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                )}
                
                {!isUnlocked ? (
                  <Lock className="w-6 h-6 text-gray-400 mb-1" />
                ) : (
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-lg font-bold text-indigo-600 dark:text-indigo-300">
                      {index + 1}
                    </div>
                    {hasScore && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                )}
                
                <span className={`mt-2 text-sm font-medium ${isUnlocked ? 'text-gray-700 dark:text-gray-200' : 'text-gray-400'}`}>
                  Level {index + 1}
                </span>
                
                {isUnlocked && stars > 0 && (
                  <div className="flex mt-1">
                    {[1, 2, 3].map((star) => (
                      <Star 
                        key={star}
                        className={`w-3 h-3 ${star <= stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                      />
                    ))}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default LevelSelect;
