// src/firebase.js

// KORREKTUR: Importiere aus den "firebase/..." Paketen, nicht von der CDN
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  initializeFirestore,
  CACHE_SIZE_UNLIMITED,
  persistentLocalCache,
  collection,
  query,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  serverTimestamp,
  orderBy,
  runTransaction,
  getDocs,
  where,
  updateDoc,
  getDoc,
  setDoc,
  writeBatch,
  increment,
  arrayUnion,
  arrayRemove,
  limit,
  startAfter
} from "firebase/firestore";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from "firebase/storage";

// Firebase Konfiguration aus Environment-Variablen
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);

// Neue, zukunftssichere Methode zur Aktivierung der Offline-Persistenz
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ cacheSizeBytes: CACHE_SIZE_UNLIMITED })
});

const auth = getAuth(app);
const storage = getStorage(app);

// Alles exportieren
export {
  db, storage, auth,
  // Firestore
  collection, query, onSnapshot, addDoc, doc, deleteDoc, serverTimestamp,
  orderBy, runTransaction, getDocs, where, updateDoc, getDoc, setDoc,
  writeBatch, increment, arrayUnion, arrayRemove, limit, startAfter,
  // Storage
  ref, uploadBytes, uploadBytesResumable, getDownloadURL, deleteObject,
  // Auth
  signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile,
  signOut, onAuthStateChanged, sendPasswordResetEmail
};