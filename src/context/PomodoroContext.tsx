import { createContext, useContext, ReactNode } from 'react';
import usePomodoro from '../features/PomodoroTimer/usePomodoro';

const PomodoroContext = createContext<ReturnType<typeof usePomodoro> | null>(null);

export const PomodoroProvider = ({ children }: { children: ReactNode }) => {
  const pomodoro = usePomodoro();
  return (
    <PomodoroContext.Provider value={pomodoro}>
      {children}
    </PomodoroContext.Provider>
  );
};

export const usePomodoroContext = () => {
  const ctx = useContext(PomodoroContext);
  if (!ctx) {
    throw new Error('usePomodoroContext must be used within a PomodoroProvider');
  }
  return ctx;
};
