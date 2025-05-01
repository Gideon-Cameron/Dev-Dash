import { useEffect, useState, useRef } from 'react';
import { logPomodoroSession } from './pomodoroService';

const FOCUS_DURATION = 25 * 60;
const BREAK_DURATION = 5 * 60;

const usePomodoro = () => {
  const [isFocusMode, setIsFocusMode] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(FOCUS_DURATION);
  const [sessionCount, setSessionCount] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const hasCompletedRef = useRef(false); // ✅ avoid double-triggering

  useEffect(() => {
    if (isRunning) {
      // ✅ Clear any previous interval before creating a new one
      if (intervalRef.current) clearInterval(intervalRef.current);

      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (!hasCompletedRef.current) {
              hasCompletedRef.current = true; // ✅ prevent multiple calls
              clearInterval(intervalRef.current!);
              handleSessionComplete();
            }
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

  const handleSessionComplete = async () => {
    const completedType = isFocusMode ? 'focus' : 'break';
    const duration = isFocusMode ? FOCUS_DURATION : BREAK_DURATION;

    await logPomodoroSession(duration, completedType);

    if (isFocusMode) {
      setSessionCount((prev) => prev + 1);
    }

    setIsFocusMode((prev) => !prev);
    setTimeLeft(isFocusMode ? BREAK_DURATION : FOCUS_DURATION);
    setIsRunning(false);
    hasCompletedRef.current = false; // ✅ reset guard for next session
  };

  const startTimer = () => {
    hasCompletedRef.current = false; // ✅ ensure it's ready for a clean start
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(isFocusMode ? FOCUS_DURATION : BREAK_DURATION);
    hasCompletedRef.current = false;
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
