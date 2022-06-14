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
