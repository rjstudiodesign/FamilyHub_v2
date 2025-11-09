// src/firebase.js

// KORREKTUR: Importiere aus den "firebase/..." Paketen, nicht von der CDN
import { initializeApp } from "firebase/app";
import {
  getFirestore,
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
  connectFirestoreEmulator
} from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from "firebase/storage";

// Ihre Firebase Konfiguration (unverändert)
const firebaseConfig = {
  apiKey: "AIzaSyBbx9pn_QARUqxFlvklgk31yHFACVVmjWw",
  authDomain: "family-hub-84c50.firebaseapp.com",
  projectId: "family-hub-84c50",
  storageBucket: "family-hub-84c50.appspot.com",
  messagingSenderId: "910534679848",
  appId: "1:910534679848:web:5604a70a93446fbe21041d",
  measurementId: "G-ESLX6SLENB"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Wenn lokal entwickelt wird, mit Firebase-Emulatoren verbinden
if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
  try {
    // Auth-Emulator (Port 9099)
    connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
    // Firestore-Emulator (Port 8080)
    connectFirestoreEmulator(db, "localhost", 8080);
    console.info('Connected to Firebase emulators: Auth http://localhost:9099, Firestore localhost:8080');
  } catch (e) {
    console.warn('Could not connect to Firebase emulators:', e);
  }
}

// Alles exportieren
export {
  db, storage, auth,
  // Firestore
  collection, query, onSnapshot, addDoc, doc, deleteDoc, serverTimestamp,
  orderBy, runTransaction, getDocs, where, updateDoc, getDoc, setDoc,
  writeBatch, increment, arrayUnion, arrayRemove,
  // Storage
  ref, uploadBytes, uploadBytesResumable, getDownloadURL, deleteObject
};
