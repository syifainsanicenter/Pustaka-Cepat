'use client';
import { initializeFirebase } from '.';
import { FirebaseProvider, type FirebaseContext } from './provider';

// This provider is responsible for initializing Firebase on the client.
function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const firebase = initializeFirebase() as FirebaseContext;
  return <FirebaseProvider {...firebase}>{children}</FirebaseProvider>;
}

export { FirebaseClientProvider };
