export type UserRole = 'resident' | 'director' | 'agent' | 'committee';

export interface AppUser {
  uid: string;
  email: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  building: string;
  properties: Record<string, UserRole>;
}

export interface AuthProvider {
  signInWithEmail: (email: string, pass: string) => Promise<AppUser>;
  signUpWithEmail: (email: string, pass: string, role: string, buildingName: string, firstName: string, lastName: string) => Promise<AppUser>;
  signInWithGoogle: () => Promise<AppUser>;
  signOut: () => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  onAuthStateChanged: (callback: (user: AppUser | null) => void) => () => void;
  updateProfileDetails: (firstName: string, lastName: string, building: string) => Promise<AppUser>;
  updateUserPassword: (newPassword: string) => Promise<void>;
}
