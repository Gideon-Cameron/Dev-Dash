import { useEffect, useRef, useState } from 'react';
import { logPomodoroSession } from './pomodoroService';
import {
  requestNotificationPermission,
  showNotification,
  flashTitle,
} from '../../utils/notificationUtils';

const STORAGE_STATE_KEY = 'pomodoro-state';
const STORAGE_PREFS_KEY = 'pomodoro-preferences';

interface StoredPomodoroState {
  isFocusMode: boolean;
  isRunning: boolean;
  endTime: number | null;
  timeLeftMs: number;
  sessionCount: number;
}

interface PomodoroPreferences {
  focusDurationMin: number;
  breakDurationMin: number;
}

const DEFAULT_PREFS: PomodoroPreferences = {
  focusDurationMin: 25,
  breakDurationMin: 5,
};

const getPreferences = (): PomodoroPreferences => {
  try {
    const raw = localStorage.getItem(STORAGE_PREFS_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw);
    return {
      focusDurationMin: parsed.focusDurationMin ?? DEFAULT_PREFS.focusDurationMin,
      breakDurationMin: parsed.breakDurationMin ?? DEFAULT_PREFS.breakDurationMin,
    };
  } catch {
    return DEFAULT_PREFS;
  }
};

const initialPrefs = getPreferences();
const initialDurationMs = initialPrefs.focusDurationMin * 60 * 1000;

const usePomodoro = () => {
  const [isFocusMode, setIsFocusMode] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [preferences, setPreferences] = useState<PomodoroPreferences>(initialPrefs);
  const [timeLeftMs, setTimeLeftMs] = useState(initialDurationMs);
  const [sessionCount, setSessionCount] = useState(0);

  const endTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const hasCompletedRef = useRef(false);

  // Load session state
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_STATE_KEY);
    const prefs = getPreferences();
    setPreferences(prefs);

    const focusMs = prefs.focusDurationMin * 60 * 1000;
    const breakMs = prefs.breakDurationMin * 60 * 1000;

    if (stored) {
      const state: StoredPomodoroState = JSON.parse(stored);
      setIsFocusMode(state.isFocusMode);
      setSessionCount(state.sessionCount);

      if (state.isRunning && state.endTime) {
        const now = Date.now();
        const remaining = state.endTime - now;

        if (remaining > 0) {
          setTimeLeftMs(remaining);
          endTimeRef.current = state.endTime;
          setIsRunning(true);
        } else {
          handleSessionComplete(state.isFocusMode, prefs);
        }
      } else {
        setTimeLeftMs(state.timeLeftMs);
      }
    } else {
      const initial = isFocusMode ? focusMs : breakMs;
      setTimeLeftMs(initial);
    }
  }, []);

  // Respond to preference updates immediately
  useEffect(() => {
    const handlePreferenceUpdate = () => {
      const newPrefs = getPreferences();
      setPreferences(newPrefs);

      const newDuration = (isFocusMode
        ? newPrefs.focusDurationMin
        : newPrefs.breakDurationMin) * 60 * 1000;

      // Reset timer regardless of isRunning
      setTimeLeftMs(newDuration);
      endTimeRef.current = null;
      hasCompletedRef.current = false;

      if (isRunning) {
        requestNotificationPermission();
        endTimeRef.current = Date.now() + newDuration;
        setIsRunning(true);
      }
    };

    window.addEventListener('pomodoro-preferences-updated', handlePreferenceUpdate);
    return () =>
      window.removeEventListener('pomodoro-preferences-updated', handlePreferenceUpdate);
  }, [isRunning, isFocusMode]);

  // Persist session state
  useEffect(() => {
    const state: StoredPomodoroState = {
      isFocusMode,
      isRunning,
      endTime: endTimeRef.current,
      timeLeftMs,
      sessionCount,
    };
    localStorage.setItem(STORAGE_STATE_KEY, JSON.stringify(state));
  }, [isFocusMode, isRunning, timeLeftMs, sessionCount]);

  const updateTimer = () => {
    if (!endTimeRef.current) return;
    const now = Date.now();
    const remaining = Math.max(endTimeRef.current - now, 0);
    setTimeLeftMs(remaining);

    if (remaining <= 0 && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      handleSessionComplete(isFocusMode, preferences);
      return;
    }

    animationFrameRef.current = requestAnimationFrame(updateTimer);
  };

  useEffect(() => {
    if (isRunning) {
      if (!endTimeRef.current) {
        endTimeRef.current = Date.now() + timeLeftMs;
      }
      animationFrameRef.current = requestAnimationFrame(updateTimer);
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isRunning]);

  const handleSessionComplete = async (
    completedFocusMode: boolean,
    prefs: PomodoroPreferences
  ) => {
    const completedType = completedFocusMode ? 'focus' : 'break';
    const durationMs = completedFocusMode
      ? prefs.focusDurationMin * 60 * 1000
      : prefs.breakDurationMin * 60 * 1000;

    await logPomodoroSession(durationMs / 1000, completedType);
    showNotification('Session Complete', `Time for a ${completedFocusMode ? 'break' : 'focus'} session!`);
    flashTitle('⏰ Session Complete!');

    if (completedFocusMode) setSessionCount((prev) => prev + 1);

    const nextIsFocus = !completedFocusMode;
    const nextDuration =
      nextIsFocus ? prefs.focusDurationMin : prefs.breakDurationMin;

    setIsFocusMode(nextIsFocus);
    setTimeLeftMs(nextDuration * 60 * 1000);
    endTimeRef.current = null;
    setIsRunning(false);
    hasCompletedRef.current = false;
  };

  const startTimer = () => {
    requestNotificationPermission();
    if (!isRunning) {
      endTimeRef.current = Date.now() + timeLeftMs;
      setIsRunning(true);
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
    if (endTimeRef.current) {
      const remaining = Math.max(endTimeRef.current - Date.now(), 0);
      setTimeLeftMs(remaining);
      endTimeRef.current = null;
    }
  };

  const resetTimer = () => {
    const durationMin = isFocusMode
      ? preferences.focusDurationMin
      : preferences.breakDurationMin;
    setIsRunning(false);
    setTimeLeftMs(durationMin * 60 * 1000);
    endTimeRef.current = null;
    hasCompletedRef.current = false;
  };

  const minutes = Math.floor(timeLeftMs / 1000 / 60);
  const seconds = Math.floor((timeLeftMs / 1000) % 60);

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
