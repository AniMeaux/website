import firebase from "firebase/app";
// Import all Firebase features here.
import "firebase/auth";

export function initFirebase() {
  if (firebase.apps.length === 0) {
    firebase.initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  }
}
