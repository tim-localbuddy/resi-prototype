import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ResidentLayout } from './layouts/ResidentLayout';
import { CommitteeLayout } from './layouts/CommitteeLayout';
import { AgentLayout } from './layouts/AgentLayout';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Verify } from './pages/Verify';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicOnlyRoute } from './components/PublicOnlyRoute';
import { DocumentsTab } from './components/DocumentsTab';
import { ChatTab } from './components/ChatTab';
import { IssuesTab } from './components/IssuesTab';
import { OverviewTab } from './components/OverviewTab';
import { BuildingsTab } from './components/BuildingsTab';
import { Profile } from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          {/* Public-only routes: redirect to dashboard if already authenticated */}
          <Route element={<PublicOnlyRoute />}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Verify page: accessible while logged in but unverified */}
          <Route path="/verify" element={<Verify />} />

          {/* Unified Dashboard */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard/*" element={<DashboardLayout viewId="view-dashboard" />} >
              <Route path="*" element={<RoleBasedRouter />} />
            </Route>
            <Route path="/settings/*" element={<DashboardLayout viewId="view-settings" />}>
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>
          
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

import { useAuth } from './contexts/AuthContext';

function RoleBasedRouter() {
  const { user } = useAuth();
  const roles = Object.values(user?.properties || {});
  
  if (roles.includes('agent')) return <AgentRoutes />;
  if (roles.includes('director')) return <CommitteeRoutes />;
  return <ResidentRoutes />;
}

function ResidentRoutes() {
  return (
    <Routes>
      <Route element={<ResidentLayout />}>
        <Route index element={<Navigate to="docs" replace />} />
        <Route path="docs" element={<DocumentsTab role="resident" />} />
        <Route path="chat" element={<ChatTab role="resident" />} />
        <Route path="issues" element={<IssuesTab role="resident" />} />
      </Route>
    </Routes>
  );
}

function CommitteeRoutes() {
  return (
    <Routes>
      <Route element={<CommitteeLayout />}>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<OverviewTab />} />
        <Route path="docs" element={<DocumentsTab role="committee" />} />
        <Route path="chat" element={<ChatTab role="committee" />} />
        <Route path="issues" element={<IssuesTab role="committee" />} />
        <Route path="timeline" element={<div className="tc on" style={{ padding: '24px', textAlign: 'center', color: 'var(--text2)', background: 'var(--surface)', borderRadius: '14px', border: '1px dashed var(--border)' }}><h3>Governance</h3><p>Governance timeline coming soon.</p></div>} />
        <Route path="residents" element={<div className="tc on" style={{ padding: '24px', textAlign: 'center', color: 'var(--text2)', background: 'var(--surface)', borderRadius: '14px', border: '1px dashed var(--border)' }}><h3>Residents</h3><p>Resident management coming soon.</p></div>} />
      </Route>
    </Routes>
  );
}

function AgentRoutes() {
  return (
    <Routes>
      <Route element={<AgentLayout />}>
        <Route index element={<Navigate to="buildings" replace />} />
        <Route path="buildings" element={<BuildingsTab />} />
        <Route path="docs" element={<DocumentsTab role="agent" />} />
        <Route path="issues" element={<IssuesTab role="agent" />} />
      </Route>
    </Routes>
  );
}

export default App;
