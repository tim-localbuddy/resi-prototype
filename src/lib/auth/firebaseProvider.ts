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
import type { AppUser, AuthProvider } from './types';

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
  let role: AppUser['role'] = null;
  if (docSnap.exists()) {
    role = docSnap.data().role as AppUser['role'];
  }
  return {
    uid,
    email: fallbackEmail || '',
    emailVerified,
    displayName,
    role
  };
}

export const firebaseProvider: AuthProvider = {
  signInWithEmail: async (email, pass) => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    return await getUserProfile(cred.user.uid, cred.user.email, cred.user.emailVerified, cred.user.displayName);
  },
  signUpWithEmail: async (email, pass, role, building, firstName, lastName) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    // Write role to firestore
    let cleanRole = 'resident';
    if (role.toLowerCase().includes('director')) cleanRole = 'director';
    if (role.toLowerCase().includes('agent')) cleanRole = 'agent';
    
    await setDoc(doc(db, 'users', cred.user.uid), {
      role: cleanRole,
      building,
      firstName,
      lastName
    });
    
    await sendEmailVerification(cred.user);
    return await getUserProfile(cred.user.uid, cred.user.email, cred.user.emailVerified, `${firstName} ${lastName}`);
  },
  signInWithGoogle: async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    // Check if they have a role, if not default to resident
    const docRef = doc(db, 'users', cred.user.uid);
    const docSnap = await getDoc(docRef);
    let role = 'resident';
    if (!docSnap.exists()) {
      await setDoc(docRef, { role: 'resident' });
    } else {
      role = docSnap.data().role || 'resident';
    }
    return {
      uid: cred.user.uid,
      email: cred.user.email || '',
      emailVerified: cred.user.emailVerified,
      displayName: cred.user.displayName,
      role: role as AppUser['role']
    };
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
