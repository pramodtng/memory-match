'use client';

import { RotateCw, Clock } from 'lucide-react';

const GameControls = ({
  difficulty,
  timeLeft,
  onNewGame,
  onDifficultyChange,
  isGameComplete,
  isGameStarted
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Difficulty:</span>
        <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm">
          {['easy', 'medium', 'hard'].map((level) => (
            <button
              key={level}
              onClick={() => onDifficultyChange(level)}
              disabled={isGameStarted && !isGameComplete}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                difficulty === level
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              } ${isGameStarted && !isGameComplete ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
          <Clock className="w-5 h-5 text-indigo-600" />
          <span className="font-mono font-medium">{formatTime(timeLeft)}</span>
        </div>
        <button
          onClick={onNewGame}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-sm"
        >
          <RotateCw className="w-5 h-5" />
          <span>{isGameComplete ? 'Play Again' : 'New Game'}</span>
        </button>
      </div>
    </div>
  );
};

export default GameControls;
