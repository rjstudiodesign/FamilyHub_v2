// firebase.js – Veredelte Version für VITE
// Importiert Firebase lokal aus 'node_modules' statt von 'esm.sh'

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
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
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-storage.js";

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