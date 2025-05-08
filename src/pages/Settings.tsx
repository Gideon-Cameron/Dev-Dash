import { useEffect, useState } from 'react';

const Settings = () => {
  const getInitialTheme = (): 'light' | 'dark' => {
    const saved = localStorage.getItem('devdash-theme');
    return saved === 'light' ? 'light' : 'dark'; // default to dark
  };
  
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);

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

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-colors duration-300">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Settings</h1>

      <div className="space-y-6">
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

        <div className="text-sm text-gray-500 dark:text-gray-400">
          Settings are saved locally and persist between sessions.
        </div>
      </div>
    </div>
  );
};

export default Settings;
