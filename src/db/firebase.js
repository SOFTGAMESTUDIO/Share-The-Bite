// ============================================================================
// Share The Bite: Firebase Cloud Services Hub (Auth, Firestore, RTDB, Storage)
// Project: e-connect-sgs (Connected to Firebase Cloud)
// ============================================================================

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

export const firebaseConfig = {
  apiKey: "AIzaSyDp7T59JiLgt3HaZCGZZtaI1sYATT79EH0",
  authDomain: "e-connect-sgs.firebaseapp.com",
  databaseURL: "https://e-connect-sgs-default-rtdb.firebaseio.com",
  projectId: "e-connect-sgs",
  storageBucket: "e-connect-sgs.firebasestorage.app",
  messagingSenderId: "101128987118",
  appId: "1:101128987118:web:3ec413612a57e697806eff",
  measurementId: "G-VYJL9RWGBD"
};

// Initialize or reuse existing Firebase app instance
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Core Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const storage = getStorage(app);

// Graceful analytics initialization
export let analytics = null;
if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      // Ignore in environments where analytics is blocked
    });
}

export default app;
