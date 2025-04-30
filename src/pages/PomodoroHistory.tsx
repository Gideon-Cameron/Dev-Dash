import { useEffect, useState } from 'react';
import {
  getStartOfDay,
  getEndOfDay,
  getPastDays,
} from '../features/PomodoroTimer/pomodoroUtils';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';

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
        q = query(ref); // all time
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

  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration / 60, 0);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 rounded-lg bg-white shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Pomodoro History</h1>

      <div className="mb-6 flex gap-4">
        {(['daily', 'weekly', 'all'] as ViewMode[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-2 rounded ${
              view === v
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-600">Loading sessions...</p>
      ) : sessions.length === 0 ? (
        <p className="text-gray-500">No focus sessions recorded for this view.</p>
      ) : (
        <>
          <div className="mb-4 space-y-2">
            <p className="text-lg text-gray-700">
              <strong>{sessions.length}</strong> focus sessions
            </p>
            <p className="text-lg text-gray-700">
              <strong>{Math.round(totalMinutes)}</strong> total minutes focused.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Timestamps</h2>
            <ul className="space-y-1 text-sm text-gray-600">
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

export default PomodoroHistory;
