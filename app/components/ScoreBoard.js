'use client';

import { Trophy, RotateCw, Clock, Zap, Heart, Star } from 'lucide-react';

const ScoreBoard = ({ 
  moves, 
  matchedPairs, 
  totalPairs, 
  timeLeft, 
  highScore,
  onNewGame,
  stars
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <Zap className="w-4 h-4" />
          <span>Moves</span>
        </div>
        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{moves}</div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <Heart className="w-4 h-4 text-red-500" />
          <span>Matches</span>
        </div>
        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          {matchedPairs} / {totalPairs}
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <span>Score</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {highScore || '--'}
          </span>
          {stars > 0 && (
            <div className="flex ml-2">
              {[...Array(stars)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;
