
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBl6EeOXiIiyMjRwcNBEZNSgFbsKypohss",
  authDomain: "bernad-5fbd7.firebaseapp.com",
  projectId: "bernad-5fbd7",
  storageBucket: "bernad-5fbd7.firebasestorage.app",
  messagingSenderId: "932998068591",
  appId: "1:932998068591:web:8eb9f90b51e2201efe509a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
