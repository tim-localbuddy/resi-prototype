import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  sendEmailVerification
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import type { AppUser, AuthProvider, UserRole } from './types';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "dummy",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "dummy",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "dummy",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "dummy",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "dummy",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "dummy"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

async function getUserProfile(uid: string, fallbackEmail: string | null, emailVerified: boolean, displayName: string | null): Promise<AppUser> {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  let properties: Record<string, UserRole> = {};
  let building = '';
  if (docSnap.exists()) {
    properties = docSnap.data().properties || {};
    building = docSnap.data().building || '';
  }
  return {
    uid,
    email: fallbackEmail || '',
    emailVerified,
    displayName,
    building,
    properties
  };
}

export const firebaseProvider: AuthProvider = {
  signInWithEmail: async (email, pass) => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    return await getUserProfile(cred.user.uid, cred.user.email, cred.user.emailVerified, cred.user.displayName);
  },
  signUpWithEmail: async (email, pass, role, building, firstName, lastName) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    let cleanRole: UserRole = 'resident';
    if (role.toLowerCase().includes('director')) cleanRole = 'director';
    if (role.toLowerCase().includes('agent')) cleanRole = 'agent';

    const properties = { ['property1']: cleanRole };

    await setDoc(doc(db, 'users', cred.user.uid), {
      properties,
      firstName,
      lastName,
      building
    });

    await sendEmailVerification(cred.user);
    return await getUserProfile(cred.user.uid, cred.user.email, cred.user.emailVerified, `${firstName} ${lastName}`);
  },
  signInWithGoogle: async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    const docRef = doc(db, 'users', cred.user.uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      await setDoc(docRef, { properties: {} });
    }
    return await getUserProfile(cred.user.uid, cred.user.email, cred.user.emailVerified, cred.user.displayName);
  },
  signOut: async () => {
    await firebaseSignOut(auth);
  },
  resendVerificationEmail: async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    }
  },
  onAuthStateChanged: (callback) => {
    return firebaseOnAuthStateChanged(auth, async (user) => {
      if (user) {
        const profile = await getUserProfile(user.uid, user.email, user.emailVerified, user.displayName);
        callback(profile);
      } else {
        callback(null);
      }
    });
  }
};
