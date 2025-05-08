import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { PomodoroProvider } from './context/PomodoroContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PomodoroProvider>
      <App />
    </PomodoroProvider>
  </StrictMode>
);
