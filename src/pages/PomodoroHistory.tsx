import { useEffect, useState } from 'react';
import { getSessionsForDate } from '../features/PomodoroTimer/pomodoroService';

interface FocusSession {
  timestamp: Date;
  duration: number;
  type: 'focus' | 'break';
}

const PomodoroHistory = () => {
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodaySessions = async () => {
      const today = new Date();
      const data = await getSessionsForDate(today);

      // Only count focus sessions
      const focusSessions = data.filter((session) => session.type === 'focus');

      setSessions(focusSessions);
      setLoading(false);
    };

    fetchTodaySessions();
  }, []);

  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration / 60, 0);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 rounded-lg bg-white shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Today's Pomodoro History</h1>

      {loading ? (
        <p className="text-gray-600">Loading sessions...</p>
      ) : sessions.length === 0 ? (
        <p className="text-gray-500">No focus sessions recorded today.</p>
      ) : (
        <>
          <div className="mb-4 space-y-2">
            <p className="text-lg text-gray-700">
              <strong>{sessions.length}</strong> focus sessions completed
            </p>
            <p className="text-lg text-gray-700">
              <strong>{totalMinutes}</strong> total minutes focused
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Session Timestamps</h2>
            <ul className="space-y-1 text-sm text-gray-600">
              {sessions.map((session, index) => (
                <li key={index}>
                  {session.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default PomodoroHistory;
