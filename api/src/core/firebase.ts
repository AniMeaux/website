import { cert, FirebaseError, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

export function initializeFirebase() {
  initializeApp({
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // https://stackoverflow.com/a/41044630/1332513
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });

  getFirestore().settings({
    ignoreUndefinedProperties: true,
  });
}

// `FirebaseError` is an interface and not a class so we cannot use the runtime
// check `instanceof`.
// Check required fields should be enough.
export function isFirebaseError(error: unknown): error is FirebaseError {
  return (
    typeof (error as any).code === "string" &&
    typeof (error as any).message === "string"
  );
}
