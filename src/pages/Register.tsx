import { Link, useNavigate } from 'react-router-dom';

export function Register() {
  const navigate = useNavigate();

  return (
    <div id="view-register" className="view on" style={{ paddingTop: 0 }}>
      <div className="auth-wrap">
        <div className="auth-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <div className="logo-mark">R</div>
            <span className="logo-txt">Resi<span>.ai</span></span>
            <span className="badge b-blue" style={{ marginLeft: '6px' }}>Beta</span>
          </div>
          <h2>Create your account</h2>
          <p className="sub">Founding members receive free beta access — no card needed.</p>
          <div className="frow">
            <div className="fg"><label className="fl">First name</label><input className="fi" type="text" placeholder="Terry" /></div>
            <div className="fg"><label className="fl">Last name</label><input className="fi" type="text" placeholder="Ma" /></div>
          </div>
          <div className="fg"><label className="fl">Email address</label><input className="fi" type="email" placeholder="you@example.com" /></div>
          <div className="fg"><label className="fl">Building / Block name</label><input className="fi" type="text" placeholder="e.g. Maple House, 42 Elm Road" /></div>
          <div className="fg">
            <label className="fl">Your role</label>
            <select className="fselect">
              <option>Resident</option>
              <option>Committee Director / RTM</option>
              <option>Managing Agent</option>
              <option>Freeholder / Landlord</option>
            </select>
          </div>
          <div className="fg">
            <label className="fl">Password</label>
            <input className="fi" type="password" placeholder="At least 8 characters" />
          </div>
          <div className="fg" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', cursor: 'pointer', color: 'var(--text2)' }}>
              <input type="checkbox" style={{ marginTop: '2px' }} /> I agree to the Terms of Service and Privacy Policy
            </label>
          </div>
          <button className="btn btn-primary w-full" onClick={() => navigate('/verify')}>Create Account &amp; Verify Email →</button>
          <div className="auth-ft">Already have an account? <Link to="/login">Sign in</Link></div>
        </div>
      </div>
    </div>
  );
}
