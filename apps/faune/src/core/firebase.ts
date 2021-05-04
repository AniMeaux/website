import firebase from "firebase/app";
// Import all Firebase features here.
import "firebase/auth";

export type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
};

export function initializeFirebase(config: FirebaseConfig) {
  if (firebase.apps.length === 0) {
    firebase.initializeApp(config);
  }
}

export { firebase };
