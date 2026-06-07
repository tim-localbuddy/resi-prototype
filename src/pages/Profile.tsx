import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authProvider } from '../lib/auth';

export function Profile() {
  const { user, refreshUser } = useAuth();
  
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [building, setBuilding] = useState(user?.building || '');
  
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Update local state if user context updates
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setBuilding(user.building || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      await authProvider.updateProfileDetails(firstName, lastName, building);
      refreshUser();
      setMessage('Profile updated successfully.');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    
    setLoading(true);
    setMessage('');
    setError('');
    try {
      await authProvider.updateUserPassword(password);
      setMessage('Password updated successfully.');
      setPassword('');
    } catch (err: any) {
      if (err.code === 'auth/requires-recent-login') {
        setError('This operation is sensitive and requires recent authentication. Please log out and log back in before retrying.');
      } else {
        setError(err.message || 'Failed to update password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tc on" style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '24px' }}>Your Profile</h2>

      {error && (
        <div className="alert a-red" style={{ marginBottom: '16px' }}>
          <div className="alert-ic">⚠️</div>
          <div>{error}</div>
        </div>
      )}
      
      {message && (
        <div className="alert a-green" style={{ marginBottom: '16px', background: 'rgba(16, 185, 129, 0.1)', color: '#047857', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <div className="alert-ic">✓</div>
          <div>{message}</div>
        </div>
      )}

      <div style={{ background: 'var(--surface)', padding: '24px', borderRadius: '14px', border: '1px solid var(--border)', marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>Personal Details</h3>
        <form onSubmit={handleUpdateProfile}>
          <div className="frow">
            <div className="fg">
              <label className="fl">First name</label>
              <input className="fi" type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} />
            </div>
            <div className="fg">
              <label className="fl">Last name</label>
              <input className="fi" type="text" required value={lastName} onChange={e => setLastName(e.target.value)} />
            </div>
          </div>
          
          <div className="fg">
            <label className="fl">Building / Block name</label>
            <input className="fi" type="text" required value={building} onChange={e => setBuilding(e.target.value)} />
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>

      <div style={{ background: 'var(--surface)', padding: '24px', borderRadius: '14px', border: '1px solid var(--border)' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>Security</h3>
        <form onSubmit={handleUpdatePassword}>
          <div className="fg">
            <label className="fl">New Password</label>
            <input className="fi" type="password" required placeholder="At least 8 characters" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          
          <button type="submit" className="btn btn-outline" disabled={loading || !password}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
