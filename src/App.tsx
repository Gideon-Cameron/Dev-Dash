// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy} from "react"
import { useAuth } from './hooks/useAuth';


import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
// import PomodoroHistory from './pages/PomodoroHistory';
import NotFound from './pages/NotFound';
import AppLayout from './layout/AppLayout';
import LoadingScreen from './components/LoadingScreen';

const Settings = lazy(() => import('./pages/Settings'))
const PomodoroHistory = lazy(() => import('./pages/PomodoroHistory'))

const App = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <Routes>
        {/* ✅ Redirect root to appropriate start page */}
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />}
        />

        {/* Public Route */}
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <AppLayout>
                <Dashboard />
              </AppLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/pomodoro-history"
          element={
            isAuthenticated ? (
              <AppLayout>
                <Suspense fallback={<div className='p-6 text-center'>Loading History</div>}>
                  <PomodoroHistory />
                </Suspense>
              </AppLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* 🚀 Lazy-loaded Settings route */}
        <Route
          path="/settings"
          element={
            isAuthenticated ? (
              <AppLayout>
                <Suspense fallback={<div className="p-6 text-center">Loading Settings...</div>}>
                  <Settings />
                </Suspense>
                
              </AppLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
