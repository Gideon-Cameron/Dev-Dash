import {
    getFirestore,
    collection,
    addDoc,
    query,
    where,
    getDocs,
    Timestamp,
    orderBy,
  } from 'firebase/firestore';
  import { getAuth } from 'firebase/auth';
  
  const db = getFirestore();
  const auth = getAuth();
  
  interface PomodoroSession {
    timestamp: Date;
    duration: number; // in seconds
    type: 'focus' | 'break';
  }
  
  // 🔵 Add a completed session
  export const logPomodoroSession = async (duration: number, type: 'focus' | 'break') => {
    const user = auth.currentUser;
    if (!user) return;
  
    const ref = collection(db, 'users', user.uid, 'pomodoroSessions');
    console.log('Logging session:', { type, duration });

    await addDoc(ref, {
      timestamp: new Date(),
      duration,
      type,
    });
  };
  
  // 🔍 Get today's sessions
  export const getSessionsForDate = async (date: Date): Promise<PomodoroSession[]> => {
    const user = auth.currentUser;
    if (!user) return [];
  
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
  
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
  
    const ref = collection(db, 'users', user.uid, 'pomodoroSessions');
    const q = query(
      ref,
      where('timestamp', '>=', Timestamp.fromDate(start)),
      where('timestamp', '<=', Timestamp.fromDate(end)),
      orderBy('timestamp', 'asc')
    );
  
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      timestamp: doc.data().timestamp.toDate(),
      duration: doc.data().duration,
      type: doc.data().type,
    }));
  };
  