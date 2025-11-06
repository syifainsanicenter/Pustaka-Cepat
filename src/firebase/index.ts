import { initializeApp, getApps, type FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

// The following functions are used to initialize and get the Firebase services.
// They are exported from this file so that they can be used throughout the
// application.

// We initialize Firebase once and then export the services.
function initializeFirebase(config?: FirebaseOptions) {
  const firebaseApp =
    getApps()[0] ?? initializeApp(config ?? firebaseConfig ?? {});

  const firestore = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);

  return {
    firebaseApp,
    firestore,
    auth,
  };
}

export { initializeFirebase };
export * from './provider';
export * from './client-provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
