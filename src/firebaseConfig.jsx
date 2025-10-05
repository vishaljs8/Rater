import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: "rater-b0a77.firebasestorage.app",
    messagingSenderId: "1025267916687",
    appId: "1:1025267916687:web:8bb8a5f77704a4731335fa"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
