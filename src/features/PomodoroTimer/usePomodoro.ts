import { useEffect, useState, useRef } from 'react';

const FOCUS_DURATION = 25 * 60; // 25 minutes in seconds
const BREAK_DURATION = 5 * 60;  // 5 minutes in seconds

const usePomodoro = () => {
  const [isFocusMode, setIsFocusMode] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(FOCUS_DURATION);
  const [sessionCount, setSessionCount] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 1) {
            clearInterval(intervalRef.current!);
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const handleSessionComplete = () => {
    if (isFocusMode) {
      setSessionCount((prev) => prev + 1);
    }

    setIsFocusMode(!isFocusMode);
    setTimeLeft(!isFocusMode ? FOCUS_DURATION : BREAK_DURATION);
    setIsRunning(false);
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(isFocusMode ? FOCUS_DURATION : BREAK_DURATION);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return {
    minutes,
    seconds,
    isRunning,
    isFocusMode,
    sessionCount,
    startTimer,
    pauseTimer,
    resetTimer,
  };
};

export default usePomodoro;
