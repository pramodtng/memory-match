// app/hooks/useSound.js
import { useCallback, useEffect, useRef, useState } from 'react';

const useSound = (src, { volume = 0.5, loop = false } = {}) => {
  const sound = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    sound.current = new Audio(src);
    sound.current.volume = volume;
    sound.current.loop = loop;

    sound.current.addEventListener('ended', () => {
      if (!loop) {
        setIsPlaying(false);
      }
    });

    return () => {
      if (sound.current) {
        sound.current.pause();
        sound.current = null;
      }
    };
  }, [src, volume, loop]);

  const play = useCallback(() => {
    if (!sound.current) return;

    sound.current.currentTime = 0;
    sound.current
      .play()
      .then(() => setIsPlaying(true))
      .catch(e => console.log('Audio play failed:', e));
  }, []);

  const pause = useCallback(() => {
    if (!sound.current) return;
    sound.current.pause();
    setIsPlaying(false);
  }, []);

  const stop = useCallback(() => {
    if (!sound.current) return;
    sound.current.pause();
    sound.current.currentTime = 0;
    setIsPlaying(false);
  }, []);

  return { play, pause, stop, isPlaying };
};

export default useSound;