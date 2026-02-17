// Frontend/src/services/auth.service.js
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';

export const loginAdmin = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const token = await userCredential.user.getIdToken();
  sessionStorage.setItem('adminToken', token); // ✅ localStorage → sessionStorage
  return { user: userCredential.user, token };
};

export const logoutAdmin = async () => {
  await signOut(auth);
  sessionStorage.removeItem('adminToken'); // ✅ sessionStorage
};

export const getAuthToken = async () => {
  if (auth.currentUser) {
    const token = await auth.currentUser.getIdToken(true);
    sessionStorage.setItem('adminToken', token); // ✅ sessionStorage
    return token;
  }
  return null;
};

export const getCurrentUser = () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};