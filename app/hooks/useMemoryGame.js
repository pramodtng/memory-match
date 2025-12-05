import { useState, useEffect, useCallback, useRef } from 'react';
import useSound from './useSound';


// Game constants
const EMOJI_CATEGORIES = {
  easy: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'],
  medium: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮'],
  hard: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔']
};

const DIFFICULTY_SETTINGS = {
  easy: {
    pairs: 8,
    grid: 'grid-cols-4 sm:grid-cols-4 md:grid-cols-4',
    timer: 180,
    timeBonus: 10,
    movePenalty: 5
  },
  medium: {
    pairs: 10,
    grid: 'grid-cols-4 sm:grid-cols-5 md:grid-cols-5',
    timer: 240,
    timeBonus: 15,
    movePenalty: 3
  },
  hard: {
    pairs: 12,
    grid: 'grid-cols-4 sm:grid-cols-6 md:grid-cols-6',
    timer: 300,
    timeBonus: 20,
    movePenalty: 2
  }
};

// Level progression configuration
const LEVELS = [
  { difficulty: 'easy', pairs: 4, time: 120, unlockThreshold: 0 },
  { difficulty: 'easy', pairs: 6, time: 150, unlockThreshold: 1 },
  { difficulty: 'medium', pairs: 6, time: 180, unlockThreshold: 2 },
  { difficulty: 'medium', pairs: 8, time: 200, unlockThreshold: 3 },
  { difficulty: 'hard', pairs: 8, time: 240, unlockThreshold: 4 },
  { difficulty: 'hard', pairs: 10, time: 300, unlockThreshold: 5 },
];

const useMemoryGame = () => {
  const movesRef = useRef(0);
  const [cards, setCards] = useState([]);
  const [isMusicOn, setIsMusicOn] = useState(true);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [unlockedLevels, setUnlockedLevels] = useState([0]);
  const [levelScores, setLevelScores] = useState(Array(LEVELS.length).fill(0));
  const [levelStars, setLevelStars] = useState(Array(LEVELS.length).fill(0));
  const [difficulty, setDifficulty] = useState('easy');
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [isWrong, setIsWrong] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [totalScore, setTotalScore] = useState(0);
  const [stars, setStars] = useState(0);

  const { play: playBgMusic, pause: pauseBgMusic, stop: stopBgMusic } = useSound(
    '/sounds/game_level.wav',
    { volume: 0.3, loop: true }
  );

  const { play: playFlipSound } = useSound(
    '/sounds/flip.wav',
    { volume: 0.5, loop: false }
  );

  const { play: playCompletionSound } = useSound(
    '/sounds/completion.wav',
    { volume: 0.6, loop: false }
  );

  // Initialize game for the current level
  const initializeGame = useCallback((levelIndex = currentLevel) => {
    const level = LEVELS[levelIndex];
    const settings = DIFFICULTY_SETTINGS[level.difficulty];
    const selectedEmojis = EMOJI_CATEGORIES[level.difficulty].slice(0, level.pairs);
    const emojis = [...selectedEmojis, ...selectedEmojis];

    // Shuffle the emojis
    const shuffledEmojis = emojis
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));

    // Reset game state
    movesRef.current = 0;
    setCards(shuffledEmojis);
    setFlippedIndices([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameComplete(false);
    setLevelComplete(false);
    setTimeLeft(level.time);
    setGameStarted(false); // This will be set to true on first card click
    setIsWrong(false);
    setStars(0);
    setDifficulty(level.difficulty);

    // Don't play music here - it will start when the game actually starts (first card flip)
  }, [currentLevel]);

  // Calculate score based on time left and moves
  const calculateScore = useCallback((timeRemaining, movesCount, levelIndex = currentLevel) => {
    const level = LEVELS[levelIndex];
    const settings = DIFFICULTY_SETTINGS[level.difficulty];
    const baseScore = 1000 * (levelIndex + 1);
    const timeBonus = Math.floor((timeRemaining / level.time) * 1000);
    const movePenalty = movesCount * settings.movePenalty;
    const calculatedScore = Math.max(baseScore + timeBonus - movePenalty, 100);

    // Calculate stars based on time remaining percentage
    const timePercentage = (timeRemaining / level.time) * 100;
    let starCount = 0;
    if (timePercentage >= 75) starCount = 3;
    else if (timePercentage >= 50) starCount = 2;
    else if (timePercentage > 0) starCount = 1;

    return { score: calculatedScore, stars: starCount };
  }, [currentLevel]);

  // Handle level completion
  const completeLevel = useCallback((levelIndex, score, stars) => {
    // Update level scores and stars
    setLevelScores(prev => {
      const newScores = [...prev];
      if (score > newScores[levelIndex]) {
        newScores[levelIndex] = score;
      }
      return newScores;
    });

    setLevelStars(prev => {
      const newStars = [...prev];
      if (stars > newStars[levelIndex]) {
        newStars[levelIndex] = stars;
      }
      return newStars;
    });

    // Unlock next level if not already unlocked
    if (levelIndex < LEVELS.length - 1) {
      setUnlockedLevels(prev =>
        prev.includes(levelIndex + 1) ? prev : [...prev, levelIndex + 1]
      );
    }

    // Set level as complete and update total score
    setLevelComplete(true);
    setTotalScore(prev => prev + score);
  }, []);

  // Handle card click
  const handleCardClick = useCallback((index) => {
    // Don't allow flipping if already flipped or matched, or if two cards are already flipped
    if (
      cards[index].isFlipped ||
      cards[index].isMatched ||
      flippedIndices.length >= 2 ||
      gameComplete
    ) {
      return;
    }

    // Play flip sound
    if (isMusicOn) {
      playFlipSound();
    }

    // If this is the first card flip, start the game
    if (flippedIndices.length === 0) {
      setGameStarted(true);
    }

    // Flip the card
    setCards(prevCards =>
      prevCards.map((card, i) =>
        i === index ? { ...card, isFlipped: true } : card
      )
    );

    // Add to flipped indices
    setFlippedIndices(prev => [...prev, index]);
  }, [cards, flippedIndices.length, gameComplete, isMusicOn, playFlipSound]);

  // Check for matches when two cards are flipped
  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [firstIndex, secondIndex] = flippedIndices;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.emoji === secondCard.emoji) {
        // Match found
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map((card, index) =>
              flippedIndices.includes(index)
                ? { ...card, isMatched: true }
                : card
            )
          );

          setMatchedPairs(prev => {
            const newMatchedPairs = prev + 1;
            const level = LEVELS[currentLevel];

            if (newMatchedPairs === level.pairs) {
              const { score: newScore, stars: newStars } = calculateScore(timeLeft, movesRef.current + 1, currentLevel);
              setStars(newStars);
              completeLevel(currentLevel, newScore, newStars);
            }

            return newMatchedPairs;
          });

          setFlippedIndices([]);
        }, 500);
      } else {
        // No match, flip cards back after a delay
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map((card, index) =>
              flippedIndices.includes(index)
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedIndices([]);
          setIsWrong(true);
          setTimeout(() => setIsWrong(false), 500);
        }, 1000);
      }

      movesRef.current += 1;
      setMoves(movesRef.current);
    }
  }, [flippedIndices, cards, difficulty, timeLeft, calculateScore, currentLevel, completeLevel]);


  // Timer effect
  // Updated timer effect
  useEffect(() => {
    if (!gameStarted || gameComplete || levelComplete) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          const { score: finalScore, stars: finalStars } = calculateScore(0, moves);
          setTotalScore(prevScore => {
            const newTotal = prevScore + finalScore;
            localStorage.setItem('memoryMatchHighScore', newTotal.toString());
            return newTotal;
          });
          setStars(finalStars);
          setGameComplete(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameComplete, levelComplete, moves, calculateScore]);

  // Load high score from localStorage on mount
  useEffect(() => {
    const savedHighScore = localStorage.getItem('memoryMatchHighScore');
    if (savedHighScore) {
      setTotalScore(parseInt(savedHighScore, 10));
    }
  }, []);

  // Save high score to localStorage when it changes
  useEffect(() => {
    if (totalScore > 0) {
      localStorage.setItem('memoryMatchHighScore', totalScore.toString());
    }
  }, [totalScore]);

  // Play background music only during active gameplay
  useEffect(() => {
    // Music should only play when:
    // - Game has started (gameStarted is true)
    // - Game is not complete
    // - Level is not complete
    // - Music is enabled
    const shouldPlayMusic = gameStarted && !gameComplete && !levelComplete && isMusicOn;

    if (shouldPlayMusic) {
      playBgMusic();
    } else {
      pauseBgMusic();
    }

    // Cleanup function to stop music when component unmounts
    return () => {
      stopBgMusic();
    };
  }, [gameStarted, gameComplete, levelComplete, isMusicOn, playBgMusic, pauseBgMusic, stopBgMusic]);

  // Play completion sound when level is completed
  useEffect(() => {
    if (levelComplete && isMusicOn) {
      playCompletionSound();
    }
  }, [levelComplete, isMusicOn, playCompletionSound]);

  // Add a function to toggle music
  const toggleMusic = useCallback(() => {
    setIsMusicOn(prev => !prev);
  }, []);

  const nextLevel = useCallback(() => {
    // Reset game state
    setMatchedPairs(0);
    setMoves(0);
    movesRef.current = 0;
    setFlippedIndices([]);
    setLevelComplete(false);
    setGameComplete(false);

    // Calculate next level
    const nextLevel = currentLevel + 1;

    // Update level and initialize game
    setCurrentLevel(nextLevel);
    initializeGame(nextLevel);
  }, [currentLevel, initializeGame]);

  // Toggle tutorial
  const toggleTutorial = useCallback(() => {
    setShowTutorial(prev => !prev);
  }, []);

  // Change level
  const changeLevel = useCallback((levelIndex) => {
    if (levelIndex < 0 || levelIndex >= LEVELS.length) return;
    if (unlockedLevels.includes(levelIndex) || levelIndex === 0) {
      setGameComplete(false);
      setLevelComplete(false);
      setMatchedPairs(0);
      setMoves(0);
      movesRef.current = 0;
      setFlippedIndices([]);
      setCurrentLevel(levelIndex);
      initializeGame(levelIndex);
    }
  }, [unlockedLevels, initializeGame]);

  return {
    // State
    cards,
    matchedPairs,
    moves,
    gameComplete,
    levelComplete,
    currentLevel,
    totalLevels: LEVELS.length,
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
    settings: {
      ...DIFFICULTY_SETTINGS[difficulty],
      pairs: LEVELS[currentLevel]?.pairs || 4,
      timer: LEVELS[currentLevel]?.time || 120
    },

    // Actions
    initializeGame,
    handleCardClick,
    toggleTutorial,
    changeLevel,
    nextLevel,
    setShowTutorial,
    toggleMusic
  };
};

export default useMemoryGame;
