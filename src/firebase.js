import { initializeApp } from 'firebase/app';
// Importuj druge Firebase proizvode koji su ti potrebni
import { getFirestore } from 'firebase/firestore'; // Ako koristiš Firestore

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

// Ako koristiš Firestore, možeš ga inicijalizovati ovde
const db = getFirestore(app);

export { app, db };
