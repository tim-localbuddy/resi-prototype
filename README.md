# Resi.ai React Prototype

Welcome to the React/Vite migration of the Resi.ai prototype. This application acts as a digital operating system for apartment communities, implementing a strict authentication and Role-Based Access Control (RBAC) frontend model.

---

## Available Scripts

This project was bootstrapped with Vite React (TypeScript). In your terminal, you can run the following commands:

### `npm run dev`
Runs the app in development mode. Open [http://localhost:5173](http://localhost:5173) to view it in your browser. The page will instantly reload when you make code changes thanks to Hot Module Replacement (HMR).

### `npm run build`
Compiles the application perfectly for production. It first utilizes the TypeScript compiler (`tsc -b`) to securely type-check your entire codebase, then Vite bundles the optimal, minified React application out directly into the `/dist` directory.

### `npm run lint`
Runs ESLint (`eslint .`) across the scripts to catch and optionally fix any stylistic, functional paradigm, and general coding errors in your logic before deployment.

### `npm run preview`
Spins up a local server serving the strictly bundled production code located in `/dist` simulating exactly how the app will behave when hosted on remote architecture for ultimate testing confidence!

---

## Authentication Architecture

The application handles identity securely by utilizing Google Cloud's **Firebase Authentication** alongside **Firestore** for storing complex authorization profile roles.

### `AuthProvider` & The Abstraction Layer
The application maintains a flexible, dual-mode authentication layer located inside `src/lib/auth/`:
- **Real Provider (`firebaseProvider.ts`)**: Connects to the real Firebase SDK. It handles `signInWithEmailAndPassword`, natively interfaces with Google pop-up credentials, and queries Firestore mapping rules.
- **Mock Provider (`mockProvider.ts`)**: Used implicitly to test the UI logic locally. It creates deterministic delays locally allowing you to verify loading UI states without making a single outbound API request.

These are unified behind an `index.ts` exporter. The entire React dom tree is wrapped in `AuthContext.tsx` (`<AuthProvider>`) exposing a unified `user`, `loading`, and `refreshUser` hook context variable anywhere needed. 

### `VITE_USE_MOCK_AUTH`
Transitions between the real internet backend and the offline mock backend happen instantly utilizing the environment variable `VITE_USE_MOCK_AUTH` inside a `.env.local` file. 
- Set `VITE_USE_MOCK_AUTH=true` to test user navigation workflows seamlessly for free.
- Set `VITE_USE_MOCK_AUTH=false` (or omit) when supplying your `VITE_FIREBASE_API_KEY` configurations.

---

## The Registration Flow

Our prototype mandates strict validity requirements during sign-up to promote high operational integrity across properties:

1. **Information Ingress**: A user fills out the registration form mapping their real-world name and their requested system `role`.
2. **Account Creation**: The application successfully creates the user credential block locally or on Google Cloud constraints via the provider hook.
3. **Implicit Email Verification Intercept**: Users do *NOT* go to their dashboard upon successful registration. Native verification triggers are systematically fired. The user is redirected dynamically unconditionally to the `/verify` view screen until they acknowledge and verify their identity. 
**(In Mock Mode: click "Resend verification email" to trigger a developer auto-verify bypass!)**
4. **Google Sign-In Bypass**: Relying on OAuth 2.0 with Google handles email verification structurally; those workflows correctly populate `user.emailVerified` implicitly, skipping standard blockades.

---

## User Roles (RBAC) & Routing

Roles dictate absolute routing layout privileges. Post-verification, the application determines your identity group retrieved from the Firestore mapping hook (`users/{uid}`).

The `<ProtectedRoute allowedRoles={[...roles]} />` strictly prevents cross-contamination of sessions:

| Role String | Target Dashboard | Description |
|---|---|---|
| `resident` | `/resident` | Standard view restricted purely to community announcements and AI logic interactions. |
| `director` | `/committee` | Elevated dashboard privileges including document uploads and global issue oversight. |
| `agent` | `/agent` | External portfolio view intended for managing multi-building interactions. |

If a user naturally logs in without attempting to navigate anywhere specific, the `Login.tsx` view handles explicit evaluation logic to push the user dynamically into the correct dashboard matching their profile role!
