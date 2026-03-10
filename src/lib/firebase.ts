import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Check if config is missing
const isConfigMissing = !firebaseConfig.apiKey || !firebaseConfig.projectId;

if (isConfigMissing && typeof window !== 'undefined') {
  console.warn("Firebase configuration is missing. Please check your environment variables.");
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
