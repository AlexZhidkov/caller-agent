import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import {
  getFunctions,
  httpsCallable,
  connectFunctionsEmulator,
} from "firebase/functions";
import { getFirestore } from "firebase/firestore";

import { config } from "config";

const firebaseConfig = {
  apiKey: config.FIREBASE_API_KEY,
  authDomain: config.FIREBASE_AUTH_DOMAIN,
  projectId: config.FIREBASE_PROJECT_ID,
  storageBucket: config.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: config.FIREBASE_MESSAGING_SENDERID,
  appId: config.FIREBASE_APPID,
  measurementId: config.FIREBASE_MEASUREMENTID,
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const functions = getFunctions(app);
const db = getFirestore(app);

if (location.hostname === "localhost") {
  connectFunctionsEmulator(functions, "localhost", 5001);
}

export { app, analytics, auth, functions, httpsCallable, db };
