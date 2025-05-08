import { useState, useRef, useEffect } from 'react';
import usePomodoro from './usePomodoro';
import { FiMoreVertical } from 'react-icons/fi';

const PomodoroTimer = () => {
  const {
    minutes,
    seconds,
    isRunning,
    isFocusMode,
    sessionCount,
    startTimer,
    pauseTimer,
    resetTimer,
  } = usePomodoro();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const padded = (value: number) => value.toString().padStart(2, '0');

  // ✅ Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="relative bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-md px-4 py-2 shadow-sm transition-colors duration-300 font-mono text-sm flex flex-col items-end gap-1 min-w-[120px]"
    >
      <div className="flex items-center justify-between w-full gap-2">
        <span className="font-semibold tracking-wide">{isFocusMode ? 'Focus' : 'Break'}</span>
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition"
          aria-label="Open Pomodoro menu"
        >
          <FiMoreVertical size={16} />
        </button>
      </div>

      <span className="text-xl font-bold tracking-widest">
        {padded(minutes)}:{padded(seconds)}
      </span>
      <span className="text-xs text-gray-500 dark:text-gray-400">× {sessionCount}</span>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-32 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md z-10 transition-colors duration-200">
          {!isRunning ? (
            <button
              onClick={() => {
                startTimer();
                setIsOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Start
            </button>
          ) : (
            <button
              onClick={() => {
                pauseTimer();
                setIsOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Pause
            </button>
          )}
          <button
            onClick={() => {
              resetTimer();
              setIsOpen(false);
            }}
            className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

export default PomodoroTimer;
