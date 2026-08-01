import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoSampleApiKeyForAutoPrint2026",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "autoprint-saas.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "autoprint-saas",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "autoprint-saas.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:abcdef1234567890"
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
