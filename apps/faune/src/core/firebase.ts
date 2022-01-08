import firebase from "firebase/app";
// Import all Firebase features here.
import "firebase/auth";

if (firebase.apps.length === 0) {
  firebase.initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}

export { firebase };
type FirebaseError = firebase.FirebaseError;

// `FirebaseError` is an interface and not a class so we cannot use the runtime
// check `instanceof`.
// Check required fields should be enough.
export function isFirebaseError(error: unknown): error is FirebaseError {
  return (
    typeof (error as any).code === "string" &&
    typeof (error as any).message === "string"
  );
}
