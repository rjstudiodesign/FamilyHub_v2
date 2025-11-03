// firebase.js – Initialisierung für FamilyHub
// FINALE KORRIGIERTE VERSION

import { initializeApp } from 'https://esm.sh/firebase/app';
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
  arrayRemove
} from 'https://esm.sh/firebase/firestore';
import { getAuth } from 'https://esm.sh/firebase/auth';
import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject // Fehlte ebenfalls oft
} from 'https://esm.sh/firebase/storage';

// Ihre Firebase Konfiguration
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
