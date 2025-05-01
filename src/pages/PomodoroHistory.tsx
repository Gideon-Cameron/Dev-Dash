import { useEffect, useState } from 'react';
import {
  getStartOfDay,
  getEndOfDay,
  getPastDays,
} from '../features/PomodoroTimer/pomodoroUtils';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

type ViewMode = 'daily' | 'weekly' | 'all';

interface FocusSession {
  timestamp: Date;
  duration: number;
  type: 'focus' | 'break';
}

const PomodoroHistory = () => {
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>('daily');

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      const user = getAuth().currentUser;
      if (!user) return;

      const ref = collection(db, 'users', user.uid, 'pomodoroSessions');

      let q;
      const now = new Date();

      if (view === 'daily') {
        q = query(
          ref,
          where('timestamp', '>=', getStartOfDay(now)),
          where('timestamp', '<=', getEndOfDay(now))
        );
      } else if (view === 'weekly') {
        q = query(ref, where('timestamp', '>=', getPastDays(7)));
      } else {
        q = query(ref);
      }

      const snapshot = await getDocs(q);
      const data: FocusSession[] = snapshot.docs.map((doc) => ({
        timestamp: doc.data().timestamp.toDate(),
        duration: doc.data().duration,
        type: doc.data().type,
      }));

      const focusOnly = data.filter((s) => s.type === 'focus');

      setSessions(focusOnly);
      setLoading(false);
    };

    fetchSessions();
  }, [view]);

  const totalMinutes = sessions.reduce((sum, s) => sum + Number(s.duration) / 60, 0);
  const weeklyChartData = generateWeeklyChartData(sessions);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 rounded-lg bg-white dark:bg-gray-800 shadow-md transition-colors duration-300">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Pomodoro History</h1>

      <div className="mb-6 flex gap-4">
        {(['daily', 'weekly', 'all'] as ViewMode[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-2 rounded transition ${
              view === v
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-600 dark:text-gray-400">Loading sessions...</p>
      ) : sessions.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No focus sessions recorded for this view.</p>
      ) : (
        <>
          <div className="mb-4 space-y-2">
            <p className="text-lg text-gray-700 dark:text-gray-200">
              <strong>{sessions.length}</strong> focus sessions
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-200">
              <strong>{Math.round(totalMinutes)}</strong> total minutes focused
            </p>
          </div>

          {view === 'weekly' && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                Weekly Focus Chart
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={weeklyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                  <XAxis dataKey="day" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    wrapperStyle={{
                      backgroundColor: '#1f2937',
                      border: 'none',
                      borderRadius: '0.5rem',
                      color: 'white',
                      padding: '0.5rem',
                    }}
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                    labelStyle={{ color: '#ddd' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="minutes" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Session Timestamps
            </h2>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
              {sessions.map((session, index) => (
                <li key={index}>
                  {session.timestamp.toLocaleDateString()} —{' '}
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

function generateWeeklyChartData(sessions: FocusSession[]) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const data: Record<string, number> = {};

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const key = days[date.getDay()];
    data[key] = 0;
  }

  sessions.forEach((session) => {
    const key = days[session.timestamp.getDay()];
    data[key] += session.duration / 60;
  });

  return Object.entries(data).map(([day, minutes]) => ({
    day,
    minutes: Math.round(minutes),
  }));
}

export default PomodoroHistory;
