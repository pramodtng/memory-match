import { useState, useEffect, useCallback, useRef } from 'react';
import useSound from './useSound';


// Game constants - Expanded emoji categories with themes
const EMOJI_CATEGORIES = {
  animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆'],
  food: ['🍎', '🍌', '🍇', '🍓', '🍊', '🍋', '🍉', '🍑', '🥝', '🍒', '🍐', '🍈', '🥭', '🍍', '🥥', '🥑', '🍅', '🥕', '🌽', '🥔'],
  sports: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🥊', '🏹', '⛷️', '🏂', '🏄', '🏊', '🚴', '🏋️', '🤸', '🤾'],
  nature: ['🌲', '🌳', '🌴', '🌵', '🌷', '🌹', '🌺', '🌻', '🌼', '🌸', '🌾', '🌿', '🍀', '🍁', '🍂', '🍃', '🌰', '🌱', '🌾', '🌿'],
  vehicles: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🚜', '🛴', '🚲', '🛵', '🏍️', '🚨', '🚔', '🚍'],
  faces: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚'],
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

// Level progression configuration - Expanded with themes and special mechanics
const LEVELS = [
  // Beginner Levels (1-5) - Animals Theme
  { difficulty: 'easy', pairs: 4, time: 120, unlockThreshold: 0, theme: 'animals', name: 'Animal Friends', special: null },
  { difficulty: 'easy', pairs: 6, time: 150, unlockThreshold: 1, theme: 'animals', name: 'More Animals', special: null },
  { difficulty: 'easy', pairs: 6, time: 140, unlockThreshold: 2, theme: 'animals', name: 'Quick Match', special: 'time_pressure' },
  { difficulty: 'medium', pairs: 8, time: 180, unlockThreshold: 3, theme: 'animals', name: 'Animal Kingdom', special: null },
  { difficulty: 'medium', pairs: 8, time: 170, unlockThreshold: 4, theme: 'animals', name: 'Speed Challenge', special: 'time_pressure' },
  
  // Intermediate Levels (6-10) - Food Theme
  { difficulty: 'medium', pairs: 8, time: 200, unlockThreshold: 5, theme: 'food', name: 'Fruit Basket', special: null },
  { difficulty: 'medium', pairs: 10, time: 220, unlockThreshold: 6, theme: 'food', name: 'Food Festival', special: null },
  { difficulty: 'medium', pairs: 10, time: 200, unlockThreshold: 7, theme: 'food', name: 'Rush Hour', special: 'time_pressure' },
  { difficulty: 'hard', pairs: 10, time: 240, unlockThreshold: 8, theme: 'food', name: 'Master Chef', special: null },
  { difficulty: 'hard', pairs: 12, time: 280, unlockThreshold: 9, theme: 'food', name: 'Food Marathon', special: null },
  
  // Advanced Levels (11-15) - Sports Theme
  { difficulty: 'hard', pairs: 12, time: 300, unlockThreshold: 10, theme: 'sports', name: 'Sports Arena', special: null },
  { difficulty: 'hard', pairs: 12, time: 280, unlockThreshold: 11, theme: 'sports', name: 'Olympic Challenge', special: 'time_pressure' },
  { difficulty: 'hard', pairs: 14, time: 320, unlockThreshold: 12, theme: 'sports', name: 'Champion Mode', special: null },
  { difficulty: 'hard', pairs: 14, time: 300, unlockThreshold: 13, theme: 'sports', name: 'Extreme Sports', special: 'time_pressure' },
  { difficulty: 'hard', pairs: 16, time: 360, unlockThreshold: 14, theme: 'sports', name: 'Ultimate Challenge', special: null },
  
  // Expert Levels (16-20) - Mixed Themes
  { difficulty: 'hard', pairs: 16, time: 340, unlockThreshold: 15, theme: 'nature', name: 'Nature\'s Beauty', special: null },
  { difficulty: 'hard', pairs: 16, time: 320, unlockThreshold: 16, theme: 'nature', name: 'Forest Rush', special: 'time_pressure' },
  { difficulty: 'hard', pairs: 18, time: 380, unlockThreshold: 17, theme: 'vehicles', name: 'Traffic Jam', special: null },
  { difficulty: 'hard', pairs: 18, time: 360, unlockThreshold: 18, theme: 'vehicles', name: 'Speedway', special: 'time_pressure' },
  { difficulty: 'hard', pairs: 20, time: 400, unlockThreshold: 19, theme: 'faces', name: 'Emoji Master', special: 'time_pressure' },
];

const useMemoryGame = () => {
  const movesRef = useRef(0);
  const comboRef = useRef(0);
  const streakRef = useRef(0);
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
  const [combo, setCombo] = useState(0);
  const [streak, setStreak] = useState(0);
  const [powerUps, setPowerUps] = useState({ hints: 0, extraTime: 0, freeze: 0 });
  const [isFrozen, setIsFrozen] = useState(false);

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
    // Use theme if available, otherwise fall back to difficulty
    const emojiCategory = level.theme ? EMOJI_CATEGORIES[level.theme] : EMOJI_CATEGORIES[level.difficulty];
    const selectedEmojis = emojiCategory.slice(0, level.pairs);
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
    setCombo(0);
    setStreak(0);
    comboRef.current = 0;
    streakRef.current = 0;
    setIsFrozen(false);
    setDifficulty(level.difficulty);
    // Grant power-ups based on level (every 5 levels)
    if (levelIndex > 0 && levelIndex % 5 === 0) {
      setPowerUps({ hints: 1, extraTime: 1, freeze: 1 });
    } else if (levelIndex === 0) {
      setPowerUps({ hints: 1, extraTime: 0, freeze: 0 }); // Start with 1 hint
    }

    // Don't play music here - it will start when the game actually starts (first card flip)
  }, [currentLevel]);

  // Calculate score based on time left, moves, combos, and streaks
  const calculateScore = useCallback((timeRemaining, movesCount, levelIndex = currentLevel, comboCount = 0, streakCount = 0) => {
    const level = LEVELS[levelIndex];
    const settings = DIFFICULTY_SETTINGS[level.difficulty];
    const baseScore = 1000 * (levelIndex + 1);
    const timeBonus = Math.floor((timeRemaining / level.time) * 1000);
    const movePenalty = movesCount * settings.movePenalty;
    // Combo multiplier: 10% bonus per combo (max 5 combos = 50% bonus)
    const comboBonus = Math.min(comboCount * 0.1, 0.5) * baseScore;
    // Streak bonus: 5% bonus per streak (max 10 streaks = 50% bonus)
    const streakBonus = Math.min(streakCount * 0.05, 0.5) * baseScore;
    const calculatedScore = Math.max(
      baseScore + timeBonus - movePenalty + comboBonus + streakBonus, 
      100
    );

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
        // Match found - increase combo and streak
        comboRef.current += 1;
        streakRef.current += 1;
        setCombo(comboRef.current);
        setStreak(streakRef.current);
        
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
              const { score: newScore, stars: newStars } = calculateScore(
                timeLeft, 
                movesRef.current + 1, 
                currentLevel,
                comboRef.current,
                streakRef.current
              );
              setStars(newStars);
              completeLevel(currentLevel, newScore, newStars);
            }

            return newMatchedPairs;
          });

          setFlippedIndices([]);
        }, 500);
      } else {
        // No match, flip cards back after a delay - reset combo and streak
        comboRef.current = 0;
        streakRef.current = 0;
        setCombo(0);
        setStreak(0);
        
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


  // Timer effect - Updated to respect freeze power-up
  useEffect(() => {
    if (!gameStarted || gameComplete || levelComplete || isFrozen) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          const { score: finalScore, stars: finalStars } = calculateScore(0, moves, currentLevel, comboRef.current, streakRef.current);
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
  }, [gameStarted, gameComplete, levelComplete, isFrozen, moves, calculateScore, currentLevel, combo, streak]);

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
      setCombo(0);
      setStreak(0);
      comboRef.current = 0;
      streakRef.current = 0;
      setCurrentLevel(levelIndex);
      initializeGame(levelIndex);
    }
  }, [unlockedLevels, initializeGame]);

  // Power-up functions
  const useHint = useCallback(() => {
    if (powerUps.hints > 0 && flippedIndices.length === 0) {
      // Find two matching cards that haven't been matched yet
      const unmatchedCards = cards
        .map((card, index) => ({ ...card, index }))
        .filter(card => !card.isMatched && !card.isFlipped);
      
      // Group by emoji
      const emojiGroups = {};
      unmatchedCards.forEach(card => {
        if (!emojiGroups[card.emoji]) {
          emojiGroups[card.emoji] = [];
        }
        emojiGroups[card.emoji].push(card.index);
      });
      
      // Find a pair
      for (const emoji in emojiGroups) {
        if (emojiGroups[emoji].length >= 2) {
          // Briefly show the hint
          const [first, second] = emojiGroups[emoji].slice(0, 2);
          setCards(prevCards =>
            prevCards.map((card, i) =>
              i === first || i === second
                ? { ...card, isFlipped: true }
                : card
            )
          );
          
          setTimeout(() => {
            setCards(prevCards =>
              prevCards.map((card, i) =>
                i === first || i === second
                  ? { ...card, isFlipped: false }
                  : card
              )
            );
          }, 2000);
          
          setPowerUps(prev => ({ ...prev, hints: prev.hints - 1 }));
          break;
        }
      }
    }
  }, [powerUps.hints, flippedIndices.length, cards]);

  const useExtraTime = useCallback(() => {
    if (powerUps.extraTime > 0) {
      setTimeLeft(prev => prev + 30); // Add 30 seconds
      setPowerUps(prev => ({ ...prev, extraTime: prev.extraTime - 1 }));
    }
  }, [powerUps.extraTime]);

  const useFreeze = useCallback(() => {
    if (powerUps.freeze > 0) {
      setIsFrozen(true);
      setPowerUps(prev => ({ ...prev, freeze: prev.freeze - 1 }));
      setTimeout(() => setIsFrozen(false), 10000); // Freeze for 10 seconds
    }
  }, [powerUps.freeze]);

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
    levelNames: LEVELS.map((level, idx) => level.name || `Level ${idx + 1}`),
    levelThemes: LEVELS.map(level => level.theme || 'animals'),
    difficulty,
    timeLeft,
    gameStarted,
    isWrong,
    showTutorial,
    totalScore,
    stars,
    flippedIndices,
    isMusicOn,
    combo,
    streak,
    powerUps,
    isFrozen,
    currentLevelName: LEVELS[currentLevel]?.name || `Level ${currentLevel + 1}`,
    currentLevelTheme: LEVELS[currentLevel]?.theme || 'animals',
    currentLevelSpecial: LEVELS[currentLevel]?.special || null,
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
    toggleMusic,
    useHint,
    useExtraTime,
    useFreeze
  };
};

export default useMemoryGame;
