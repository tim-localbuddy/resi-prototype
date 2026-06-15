import { initializeApp } from 'firebase/app';
import type { ActionCodeSettings } from 'firebase/auth';
import {
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signOut as firebaseSignOut,
  getAuth,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  updatePassword,
  updateProfile
} from 'firebase/auth';
import { connectFirestoreEmulator, doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
import { connectStorageEmulator, getStorage } from 'firebase/storage';
import type { AppUser, AuthProvider } from './types';
import type { UserRole } from "./userRole";

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
export const storage = getStorage(app);
export const functionsEu = getFunctions(app, 'europe-west1');

if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_EMULATOR === 'true') {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099');
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  connectStorageEmulator(storage, '127.0.0.1', 9199);
  connectFunctionsEmulator(functionsEu, '127.0.0.1', 5001);
}

const googleProvider = new GoogleAuthProvider();

async function getUserProfile(uid: string, fallbackEmail: string | null, emailVerified: boolean, displayName: string | null): Promise<AppUser> {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  let properties: Record<string, UserRole> = {};
  let building = '';
  let firstName = '';
  let lastName = '';
  if (docSnap.exists()) {
    const data = docSnap.data();
    properties = data.properties || {};
    building = data.building || '';
    firstName = data.firstName || displayName?.split(' ')[0] || '';
    lastName = data.lastName || displayName?.split(' ').slice(1).join(' ') || '';
  }
  return {
    uid,
    email: fallbackEmail || '',
    emailVerified,
    firstName,
    lastName,
    building,
    properties
  };
}

// After clicking the verification link, Firebase redirects here.
// The user lands on /login where they can sign in with their now-verified account.
const verificationActionSettings: ActionCodeSettings = {
  url: `${window.location.origin}/login`,
  handleCodeInApp: true,
};
export const firebaseProvider: AuthProvider = {
  signInWithEmail: async (email, pass) => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    return await getUserProfile(cred.user.uid, cred.user.email, cred.user.emailVerified, cred.user.displayName);
  },
  signUpWithEmail: async (email, pass, role, building, firstName, lastName) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    const properties = { property1: role };

    await setDoc(doc(db, 'users', cred.user.uid), {
      properties,
      firstName,
      lastName,
      building
    });

    await sendEmailVerification(cred.user, verificationActionSettings);
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
      await sendEmailVerification(auth.currentUser, verificationActionSettings);
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
  },
  updateProfileDetails: async (firstName: string, lastName: string, building: string) => {
    if (!auth.currentUser) throw new Error('Not authenticated');
    
    const displayName = `${firstName} ${lastName}`;
    
    // Update Firebase Auth profile
    await updateProfile(auth.currentUser, { displayName });
    
    // Update Firestore document
    const docRef = doc(db, 'users', auth.currentUser.uid);
    await updateDoc(docRef, {
      firstName,
      lastName,
      building
    });
    
    return await getUserProfile(auth.currentUser.uid, auth.currentUser.email, auth.currentUser.emailVerified, displayName);
  },
  updateUserPassword: async (newPassword: string) => {
    if (!auth.currentUser) throw new Error('Not authenticated');
    await updatePassword(auth.currentUser, newPassword);
  }
};
