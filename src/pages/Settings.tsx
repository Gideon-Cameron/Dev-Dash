import { useEffect, useState } from 'react';

const Settings = () => {
  const getInitialTheme = (): 'light' | 'dark' => {
    const saved = localStorage.getItem('devdash-theme');
    return saved === 'light' ? 'light' : 'dark';
  };

  const getInitialDurations = () => {
    const stored = localStorage.getItem('pomodoro-preferences');
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        focusDuration: parsed.focusDurationMin || 25,
        breakDuration: parsed.breakDurationMin || 5,
      };
    }
    return { focusDuration: 25, breakDuration: 5 };
  };

  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);
  const [focusDuration, setFocusDuration] = useState<number>(getInitialDurations().focusDuration);
  const [breakDuration, setBreakDuration] = useState<number>(getInitialDurations().breakDuration);

  useEffect(() => {
    const savedTheme = localStorage.getItem('devdash-theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (theme: 'light' | 'dark') => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('devdash-theme', newTheme);
  };

  const handleDurationChange = () => {
    const prefs = {
      focusDurationMin: Math.max(1, focusDuration),
      breakDurationMin: Math.max(1, breakDuration),
    };
    localStorage.setItem('pomodoro-preferences', JSON.stringify(prefs));

    // ✅ Dispatch update event to inform usePomodoro
    window.dispatchEvent(new Event('pomodoro-preferences-updated'));

    // alert('Pomodoro durations updated. Timer reset to new values.');
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-colors duration-300">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Settings</h1>

      <div className="space-y-8">
        {/* Theme Switcher */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Theme</h2>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <input
                type="radio"
                name="theme"
                value="light"
                checked={theme === 'light'}
                onChange={() => handleThemeChange('light')}
                className="form-radio text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              Light
            </label>
            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <input
                type="radio"
                name="theme"
                value="dark"
                checked={theme === 'dark'}
                onChange={() => handleThemeChange('dark')}
                className="form-radio text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              Dark
            </label>
          </div>
        </div>

        {/* Pomodoro Durations */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Pomodoro Durations
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="w-40 text-gray-700 dark:text-gray-300">Focus duration (min):</label>
              <input
                type="number"
                min={1}
                max={120}
                value={focusDuration}
                onChange={(e) => setFocusDuration(Number(e.target.value))}
                className="w-20 p-2 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-40 text-gray-700 dark:text-gray-300">Break duration (min):</label>
              <input
                type="number"
                min={1}
                max={60}
                value={breakDuration}
                onChange={(e) => setBreakDuration(Number(e.target.value))}
                className="w-20 p-2 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <button
              onClick={handleDurationChange}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
            >
              Save Durations
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          Settings are saved locally and persist between sessions.
        </div>
      </div>
    </div>
  );
};

export default Settings;
