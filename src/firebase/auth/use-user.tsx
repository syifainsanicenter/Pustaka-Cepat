'use client';
import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { useAuth, useFirestore } from '../provider';

interface UserProfile extends User {
  plan?: 'free' | 'pro' | 'publisher';
}

function useUser() {
  const auth = useAuth();
  const firestore = useFirestore();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribeAuth = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        if (firestore) {
          const userDocRef = doc(firestore, 'users', authUser.uid);
          const unsubscribeFirestore = onSnapshot(userDocRef, (doc) => {
            if (doc.exists()) {
              setUser({ ...authUser, ...doc.data() } as UserProfile);
            } else {
              setUser(authUser); // User exists in Auth, but not in Firestore yet
            }
            setLoading(false);
          }, () => {
            // Handle Firestore error
            setUser(authUser);
            setLoading(false);
          });
          return () => unsubscribeFirestore();
        } else {
          setUser(authUser);
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, [auth, firestore]);

  return { user, loading };
}

export { useUser };
export type { UserProfile };
