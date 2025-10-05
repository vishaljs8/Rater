import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC7rT4O4SNZxxaztkaH9_Rp5airGVo_Dic",
    authDomain: "rater-b0a77.firebaseapp.com",
    projectId: "rater-b0a77",
    storageBucket: "rater-b0a77.firebasestorage.app",
    messagingSenderId: "1025267916687",
    appId: "1:1025267916687:web:8bb8a5f77704a4731335fa"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
