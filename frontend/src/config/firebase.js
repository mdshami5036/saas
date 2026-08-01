import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBk2phI2oDPrGB7nrVOj66liMOdvquqojw",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "saas-3a97e.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "saas-3a97e",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "saas-3a97e.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "148404297684",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:148404297684:web:4d4e821d26c89ce5254041",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-SLSQEE0M7F"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
};
