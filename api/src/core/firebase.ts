import {
  App,
  cert,
  deleteApp,
  FirebaseError,
  initializeApp,
} from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import invariant from "tiny-invariant";

let app: App | null = null;

export function initializeFirebase() {
  invariant(
    process.env.FIREBASE_DATABASE_URL != null,
    "FIREBASE_DATABASE_URL must be defined."
  );

  invariant(
    process.env.FIREBASE_PROJECT_ID != null,
    "FIREBASE_PROJECT_ID must be defined."
  );

  invariant(
    process.env.FIREBASE_CLIENT_EMAIL != null,
    "FIREBASE_CLIENT_EMAIL must be defined."
  );

  invariant(
    process.env.FIREBASE_PRIVATE_KEY != null,
    "FIREBASE_PRIVATE_KEY must be defined."
  );

  if (app == null) {
    app = initializeApp({
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // https://stackoverflow.com/a/41044630/1332513
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    });

    getFirestore().settings({ ignoreUndefinedProperties: true });
  }
}

export function cleanUpFirebase() {
  if (app != null) {
    deleteApp(app);
    app = null;
  }
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
