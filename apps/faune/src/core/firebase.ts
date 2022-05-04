import firebase from "firebase/app";
// Import all Firebase features here.
import "firebase/auth";
import { getConfig } from "~/core/config";

if (firebase.apps.length === 0) {
  firebase.initializeApp({
    apiKey: getConfig().firebasePublicApiKey,
    authDomain: getConfig().firebaseAuthDomain,
    databaseURL: getConfig().firebaseDatabaseUrl,
    projectId: getConfig().firebaseProjectId,
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
