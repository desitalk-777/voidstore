import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB1rR6wcM8QBVlV83ZcmdzovibXl5siku4",
  authDomain: "voidstore-a3f3d.firebaseapp.com",
  projectId: "voidstore-a3f3d",
  storageBucket: "voidstore-a3f3d.firebasestorage.app",
  messagingSenderId: "739680834095",
  appId: "1:739680834095:web:955c0f6122d9365ccd2cda"
};

const app = initializeApp(firebaseConfig);

// Ye teeno exports bahut zaroori hain
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);