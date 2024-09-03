// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'; // Import Firebase Auth

const firebaseConfig = {
  apiKey: "AIzaSyBxnHkXqx4pAwMZMkohaRAHsjXF2m-kEXk",
  authDomain: "event-managment-389c5.firebaseapp.com",
  projectId: "event-managment-389c5",
  storageBucket: "event-managment-389c5.appspot.com",
  messagingSenderId: "1013488098258",
  appId: "1:1013488098258:web:51e9366aface0c5de7460b",
  measurementId: "G-2D46FT3VPD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // Initialize Firebase Auth

export { app, db, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword };
