import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Verify } from './pages/Verify';
import { ResidentDashboard } from './pages/ResidentDashboard';
import { CommitteeDashboard } from './pages/CommitteeDashboard';
import { AgentDashboard } from './pages/AgentDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/resident" element={<ResidentDashboard />} />
          <Route path="/committee" element={<CommitteeDashboard />} />
          <Route path="/agent" element={<AgentDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
