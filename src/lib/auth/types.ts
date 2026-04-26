export interface AppUser {
  uid: string;
  email: string;
  emailVerified: boolean;
  displayName: string | null;
  role: 'resident' | 'director' | 'agent' | null;
}

export interface AuthProvider {
  signInWithEmail: (email: string, pass: string) => Promise<AppUser>;
  signUpWithEmail: (email: string, pass: string, role: string, buildingName: string, firstName: string, lastName: string) => Promise<AppUser>;
  signInWithGoogle: () => Promise<AppUser>;
  signOut: () => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  onAuthStateChanged: (callback: (user: AppUser | null) => void) => () => void;
}
