'use client';

import { createContext, useContext, useMemo } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Firestore } from 'firebase/firestore';
import type { Auth } from 'firebase/auth';

export type FirebaseContext = {
  firebaseApp?: FirebaseApp;
  firestore?: Firestore;
  auth?: Auth;
};

const FirebaseContext = createContext<FirebaseContext | undefined>(undefined);

function FirebaseProvider({
  children,
  ...props
}: { children: React.ReactNode } & FirebaseContext) {
  const value = useMemo(() => props, [props]);
  return (
    <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>
  );
}

function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}

function useFirebaseApp() {
  return useFirebase().firebaseApp;
}

function useFirestore() {
  return useFirebase().firestore;
}

function useAuth() {
  return useFirebase().auth;
}

export { FirebaseProvider, useFirebase, useFirebaseApp, useFirestore, useAuth };
