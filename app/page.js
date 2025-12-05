'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import { Trophy, Star, Home, Play, RotateCw } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState, useEffect, useCallback } from 'react';

// Import components with no SSR to avoid hydration issues
const GameBoard = dynamic(() => import('./components/GameBoard'), { ssr: false });
const ScoreBoard = dynamic(() => import('./components/ScoreBoard'), { ssr: false });
const GameControls = dynamic(() => import('./components/GameControls'), { ssr: false });
const GameOverModal = dynamic(() => import('./components/GameOverModal'), { ssr: false });
const TutorialModal = dynamic(() => import('./components/TutorialModal'), { ssr: false });
const LevelCompleteModal = dynamic(() => import('./components/LevelCompleteModal'), { ssr: false });
const LevelSelect = dynamic(() => import('./components/LevelSelect'), { ssr: false });

// Import custom hook
import useMemoryGame from './hooks/useMemoryGame';

export default function MemoryGame() {
  const [showLevelSelect, setShowLevelSelect] = useState(false);

  const {
    // State
    cards,
    matchedPairs,
    moves,
    gameComplete,
    levelComplete,
    currentLevel,
    totalLevels,
    unlockedLevels,
    levelScores,
    levelStars,
    difficulty,
    timeLeft,
    gameStarted,
    isWrong,
    showTutorial,
    totalScore,
    stars,
    flippedIndices,
    isMusicOn,
    settings,

    // Actions
    initializeGame,
    handleCardClick,
    toggleTutorial,
    changeLevel,
    nextLevel,
    setShowTutorial,
    toggleMusic
  } = useMemoryGame();

  const handleCardClickWithSound = useCallback(
    (index) => {
      handleCardClick(index);
    },
    [handleCardClick]
  );

  // Handle new game with level selection
  const handleNewGame = (level = currentLevel) => {
    changeLevel(level);
  };

  // Handle next level
  const handleNextLevel = () => {
    nextLevel();
  };

  // Toggle level select modal
  const toggleLevelSelect = () => {
    setShowLevelSelect(!showLevelSelect);
  };

  return (
    <div className="min-h-screen py-4 md:py-8 px-4 bg-linear-to-b from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <Head>
        <title>Memory Match | A Fun Card Matching Game</title>
        <meta name="description" content="Test your memory with this fun and challenging card matching game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-6 md:mb-8">
          <motion.h1
            className="text-3xl md:text-5xl font-extrabold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Memory Match
          </motion.h1>
          <div className="flex justify-center items-center gap-4 mb-2">
            <p className="text-gray-600 dark:text-gray-300">
              Level {currentLevel + 1} of {totalLevels}
            </p>
            <div className="flex items-center gap-1">
              {[...Array(3)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < (levelStars[currentLevel] || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                />
              ))}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 max-w-md mx-auto">
            <div
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${(matchedPairs / settings.pairs) * 100}%` }}
            ></div>
          </div>
        </header>

        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <button
              onClick={toggleLevelSelect}
              className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>Levels</span>
            </button>
            <button
              onClick={() => initializeGame(currentLevel)}
              className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              title="Restart Level"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow">
              <div className="text-sm text-gray-500 dark:text-gray-400">Score</div>
              <div className="font-bold text-indigo-600 dark:text-indigo-400">{totalScore}</div>
            </div>

            <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow">
              <div className="text-sm text-gray-500 dark:text-gray-400">Time</div>
              <div className="font-mono font-bold">
                {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:
                {(timeLeft % 60).toString().padStart(2, '0')}
              </div>
            </div>
            
            <button
              onClick={toggleMusic}
              className={`p-2 rounded-full transition-colors ${isMusicOn
                  ? 'bg-green-100 text-green-600 hover:bg-green-200'
                  : 'bg-red-100 text-red-600 hover:bg-red-200'
                }`}
              title={isMusicOn ? "Mute sound" : "Unmute sound"}
            >
              {isMusicOn ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .89-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .89-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <ScoreBoard
          moves={moves}
          matchedPairs={matchedPairs}
          totalPairs={settings.pairs}
          timeLeft={timeLeft}
          score={totalScore}  // Changed from highScore to totalScore
          stars={stars}
        />

        {/* Game Board */}
        <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl shadow-md">
          <GameBoard
            cards={cards}
            flippedIndices={flippedIndices}
            isWrong={isWrong}
            onCardClick={handleCardClickWithSound}
            gridClass={settings.grid}
          />
        </div>

        {/* Tutorial Modal */}
        <TutorialModal
          isOpen={showTutorial}
          onClose={() => setShowTutorial(false)}
        />

        {/* Add missing import */}
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          }
          
          .font-mono {
            font-feature-settings: 'tnum' on, 'lnum' on;
          }
        `}</style>

        {/* Level Complete Modal */}
        <LevelCompleteModal
          isOpen={levelComplete && !gameComplete}
          level={currentLevel}
          score={totalScore}  // Changed from score to totalScore
          stars={stars}
          onNextLevel={handleNextLevel}
          onMenu={toggleLevelSelect}
          totalLevels={totalLevels}
          isLastLevel={currentLevel === totalLevels - 1}
        />

        {/* Game Over Modal */}
        <GameOverModal
          isOpen={gameComplete}
          timeLeft={timeLeft}
          moves={moves}
          score={totalScore}  // Changed from score to totalScore
          stars={stars}
          level={currentLevel}
          totalLevels={totalLevels}
          onNewGame={() => handleNewGame(currentLevel)}
          onLevelSelect={toggleLevelSelect}
          onShowTutorial={() => setShowTutorial(true)}
        />

        {/* Level Select Modal */}
        <AnimatePresence>
          {showLevelSelect && (
            <LevelSelect
              levels={Array.from({ length: totalLevels })}
              currentLevel={currentLevel}
              unlockedLevels={unlockedLevels}
              levelScores={levelScores}
              levelStars={levelStars}
              onSelectLevel={(level) => {
                handleNewGame(level);
                setShowLevelSelect(false);
              }}
              onClose={toggleLevelSelect}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
