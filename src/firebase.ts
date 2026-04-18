import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBXPTlC8YGvQkNy9ka7AO7ssk1fF4O1Vf8",
  authDomain: "beverageshop-2b2a5.firebaseapp.com",
  projectId: "beverageshop-2b2a5",
  storageBucket: "beverageshop-2b2a5.firebasestorage.app",
  messagingSenderId: "252691672468",
  appId: "1:252691672468:web:09e10eeaef90e95d6ff381"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
