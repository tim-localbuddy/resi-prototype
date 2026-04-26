import type { AuthProvider } from './types';
import { mockProvider } from './mockProvider';
import { firebaseProvider } from './firebaseProvider';

const useMock = import.meta.env.VITE_USE_MOCK_AUTH === 'true';

export const authProvider: AuthProvider = useMock ? mockProvider : firebaseProvider;
