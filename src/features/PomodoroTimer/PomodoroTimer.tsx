// import React from 'react';
import usePomodoro from './usePomodoro';

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

  const padded = (value: number) => value.toString().padStart(2, '0');

  return (
    <div className="rounded-lg bg-white p-6 shadow-md flex flex-col items-start gap-4">
      <h2 className="text-2xl font-bold text-gray-800">
        {isFocusMode ? 'Focus Session' : 'Break Time'}
      </h2>

      <div className="text-6xl font-mono text-gray-900 tracking-widest">
        {padded(minutes)}:{padded(seconds)}
      </div>

      <div className="flex gap-4 mt-2">
        {!isRunning ? (
          <button onClick={startTimer} className="bg-green-500 text-white px-4 py-2 rounded">
            Start
          </button>
        ) : (
          <button onClick={pauseTimer} className="bg-yellow-500 text-white px-4 py-2 rounded">
            Pause
          </button>
        )}
        <button onClick={resetTimer} className="bg-gray-300 text-black px-4 py-2 rounded">
          Reset
        </button>
      </div>

      <p className="text-gray-600 mt-2">
        Sessions completed: <strong>{sessionCount}</strong>
      </p>
    </div>
  );
};

export default PomodoroTimer;
