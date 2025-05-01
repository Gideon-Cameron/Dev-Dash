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
    <div className="rounded-lg bg-white dark:bg-gray-800 p-4 shadow-md flex flex-col items-start gap-3 transition-colors duration-300">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
        {isFocusMode ? 'Focus Session' : 'Break Time'}
      </h2>

      <div className="text-5xl font-mono text-gray-900 dark:text-gray-100 tracking-widest">
        {padded(minutes)}:{padded(seconds)}
      </div>

      <div className="flex gap-3">
        {!isRunning ? (
          <button
            onClick={startTimer}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
          >
            Start
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition"
          >
            Pause
          </button>
        )}
        <button
          onClick={resetTimer}
          className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-black dark:text-white px-4 py-2 rounded transition"
        >
          Reset
        </button>
      </div>

      <p className="text-gray-600 dark:text-gray-400 text-sm">
        Sessions completed: <strong>{sessionCount}</strong>
      </p>
    </div>
  );
};

export default PomodoroTimer;
