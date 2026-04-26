import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Verify } from './pages/Verify';
import { ResidentDashboard } from './pages/ResidentDashboard';
import { CommitteeDashboard } from './pages/CommitteeDashboard';
import { AgentDashboard } from './pages/AgentDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Verify page expects AuthContext, so we don't protect it by role, just check if logged in but unverified usually. */}
          {/* We'll handle exact verification flow inside Verify itself, but it needs standard auth route wrappers */}
          <Route path="/verify" element={<Verify />} />

          {/* Protected Routes using RBAC */}
          <Route element={<ProtectedRoute allowedRoles={['resident']} />}>
            <Route path="/resident" element={<ResidentDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['director']} />}>
            <Route path="/committee" element={<CommitteeDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['agent']} />}>
            <Route path="/agent" element={<AgentDashboard />} />
          </Route>
          
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
