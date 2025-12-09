import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMJ8wuZ6grLcf9sEblQago0uyQiwhz9Ok",
  authDomain: "gametibe2025.firebaseapp.com",
  databaseURL: "https://gametibe2025-default-rtdb.firebaseio.com",
  projectId: "gametibe2025",
  storageBucket: "gametibe2025.firebasestorage.app",
  messagingSenderId: "587355158666",
  appId: "1:587355158666:web:017be653b8f8afad721573",
  measurementId: "G-X1RZWWWGF6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firebase Realtime Database
export const database = getDatabase(app);

// Initialize Firebase Storage
export const storage = getStorage(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

export default app;

