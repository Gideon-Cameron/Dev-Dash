// src/hooks/useAuth.ts
import { useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { useAuthStore } from '../state/authStore';
import { auth, provider } from '../lib/firebase';

export const useAuth = () => {
  const { user, setUser, isLoading, setLoading, logout } = useAuthStore();

  // Listen for auth state changes (runs once on mount)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user ?? null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  // GitHub Sign-In
  const signIn = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
      // user is automatically set in onAuthStateChanged
    } catch (error) {
      console.error('GitHub login failed:', error);
      setLoading(false);
    }
  };

  // Sign Out
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return {
    user,
    isLoading,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };
};
