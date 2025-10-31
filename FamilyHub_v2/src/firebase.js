// firebase.js – Initialisierung für FamilyHub


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
  orderBy
} from 'https://esm.sh/firebase/firestore';
import { getAuth } from 'https://esm.sh/firebase/auth';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL
} from 'https://esm.sh/firebase/storage';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Firestore Hilfsfunktionen exportieren
export {
  collection,
  query,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  serverTimestamp,
  orderBy,
  ref,
  uploadBytesResumable,
  getDownloadURL
};
