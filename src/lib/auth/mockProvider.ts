import type { AppUser, AuthProvider, UserRole } from './types';

// Mock simple state
let currentUser: AppUser | null = null;
let listeners: ((user: AppUser | null) => void)[] = [];

function notifyListeners() {
  listeners.forEach(fn => fn(currentUser));
}

const mockUsers: Record<string, AppUser> = {
  'terry.ma@localbuddy.co.uk': {
    uid: 'mock-resident-123',
    email: 'terry.ma@localbuddy.co.uk',
    emailVerified: true,
    displayName: 'Terry Ma',
    building: '1a House',
    properties: { 'property1': 'resident' }
  },
  'emma@committee.com': {
    uid: 'mock-director-123',
    email: 'emma@committee.com',
    emailVerified: true,
    displayName: 'Emma Davies',
    building: '2b House',
    properties: { 'property1': 'director' }
  },
  'agent@management.com': {
    uid: 'mock-agent-123',
    email: 'agent@management.com',
    emailVerified: true,
    displayName: 'Agent Portal',
    building: '3c House',
    properties: { 'property1': 'agent' }
  }
};

export const mockProvider: AuthProvider = {
  signInWithEmail: async (email, pass) => {
    await new Promise(r => setTimeout(r, 800)); // Network delay
    if (mockUsers[email] && pass === 'password123') {
      currentUser = mockUsers[email];
      notifyListeners();
      return currentUser;
    }
    throw new Error('auth/invalid-credential');
  },
  signUpWithEmail: async (email, _pass, role, building, firstName, lastName) => {
    await new Promise(r => setTimeout(r, 800));
    const newUser: AppUser = {
      uid: Math.random().toString(36).substring(7),
      email,
      emailVerified: false,
      displayName: `${firstName} ${lastName}`,
      building,
      properties: { ['property1']: role as UserRole }
    };
    currentUser = newUser;
    notifyListeners();
    return currentUser;
  },
  signInWithGoogle: async () => {
    await new Promise(r => setTimeout(r, 800));
    currentUser = mockUsers['terry.ma@localbuddy.co.uk'];
    notifyListeners();
    return currentUser;
  },
  signOut: async () => {
    await new Promise(r => setTimeout(r, 300));
    currentUser = null;
    notifyListeners();
  },
  resendVerificationEmail: async () => {
    await new Promise(r => setTimeout(r, 800));
    // Simulate immediate verification for testing easily
    if (currentUser) {
      currentUser = { ...currentUser, emailVerified: true };
      setTimeout(notifyListeners, 1000);
    }
  },
  onAuthStateChanged: (callback) => {
    listeners.push(callback);
    callback(currentUser);
    return () => {
      listeners = listeners.filter(fn => fn !== callback);
    };
  }
};
