// Frontend/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { logoutAdmin } from '../services/auth.service';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';

const AuthContext = createContext();

const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 minutes milliseconds

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const inactivityTimer = useRef(null); // timer reference

  // ── Logout function ──
  const logout = async () => {
    await logoutAdmin();
    sessionStorage.removeItem('adminToken'); // sessionStorage clear
    setUser(null);
  };

  // ── Inactivity timer reset ──
  const resetTimer = () => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }
    inactivityTimer.current = setTimeout(() => {
      console.log('⏰ 15 min inactivity — auto logout');
      logout();
    }, INACTIVITY_LIMIT);
  };

  // ── User activity listeners ──
  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

    const handleActivity = () => {
      if (user) resetTimer(); // sirf logged in ho toh timer reset karo
    };

    events.forEach((e) => window.addEventListener(e, handleActivity));

    return () => {
      events.forEach((e) => window.removeEventListener(e, handleActivity));
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, [user]); // user change hone pe re-attach karo

  // ── Firebase Auth State Listener ──
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        sessionStorage.setItem('adminToken', token); // ✅ sessionStorage
        setUser({ email: firebaseUser.email, uid: firebaseUser.uid });
        resetTimer(); // login hote hi timer shuru
      } else {
        sessionStorage.removeItem('adminToken');
        setUser(null);
        if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);