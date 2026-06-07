import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';

export function Landing() {
  const navigate = useNavigate();

  return (
    <div id="view-landing" className="view on" style={{ paddingTop: 0 }}>
      <nav className="lnav">
        <Logo onClick={() => navigate('/')} />
        <div className="lnav-links">
          <span className="nl">Features</span>
          <span className="nl">Pricing</span>
          <span className="nl">About</span>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/login')}>Sign In</button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/register')}>Get Beta Access</button>
        </div>
      </nav>

      <div className="hero">
        <div className="hero-badge">🏢 Beta Access Now Open — Founding Members Free</div>
        <h1>The <span>Digital Operating System</span><br />for Apartment Communities</h1>
        <p className="hero-sub">AI-powered transparency for service charges, leases, and governance. Built for resident directors, Right to Manage (RTM) companies, and managing agents.</p>
        <div className="hero-ctas">
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>Get Free Beta Access →</button>
          <button className="btn btn-lg" style={{ background: 'rgba(255,255,255,.12)', color: '#fff', border: '1px solid rgba(255,255,255,.2)' }} onClick={() => navigate('/committee')}>View Demo</button>
        </div>
        <div className="hero-trust">
          <div className="hero-trust-item"><div className="hero-trust-dot"></div>Right to Manage (RTM) Companies</div>
          <div className="hero-trust-item"><div className="hero-trust-dot"></div>Property Managers</div>
          <div className="hero-trust-item"><div className="hero-trust-dot"></div>Managing Agents</div>
          <div className="hero-trust-item"><div className="hero-trust-dot"></div>Resident Directors</div>
          <div className="hero-trust-item"><div className="hero-trust-dot"></div>Small Freeholders</div>
        </div>
      </div>

      <div style={{ background: '#fff', padding: 0 }}>
        <div className="section">
          <div className="section-label">Core Platform</div>
          <div className="section-title">Everything your building community needs</div>
          <p className="section-sub">From AI-decoded service charges to real-time issue accountability — built for transparency at every level.</p>
          <div className="feat-grid">
            <div className="feat-card">
              <div className="feat-icon" style={{ background: '#EFF6FF' }}>💬✨</div>
              <h3>AI Document Q&amp;A</h3>
              <p>Ask questions in plain English about your service charge, lease, or AGM minutes. Bofast finds the answer and cites its source — no more sifting through 80-page documents.</p>
            </div>
            <div className="feat-card">
              <div className="feat-icon" style={{ background: '#ECFDF5' }}>📁</div>
              <h3>Resident Document Archive</h3>
              <p>Centralise all building documents with controlled access. Directors choose what's visible to residents vs. committee only — version-tracked and always findable.</p>
            </div>
            <div className="feat-card">
              <div className="feat-icon" style={{ background: '#FFFBEB' }}>🔍</div>
              <h3>Issue Logging &amp; Visibility</h3>
              <p>Log, track and chase every building issue from a single dashboard. AI self-discovers compliance gaps. Management agents are held accountable with full audit trails.</p>
            </div>
            <div className="feat-card">
              <div className="feat-icon" style={{ background: '#F5F3FF' }}>📅</div>
              <h3>Governance Memory Timeline</h3>
              <p>A living record of every AGM decision, service charge approval, major works consultation and compliance milestone — so nothing falls through the cracks again.</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--bg)' }}>
        <div className="section">
          <div className="section-label">How It Works</div>
          <div className="section-title">Up and running in minutes</div>
          <div className="hiw-row">
            <div className="hiw-item">
              <div className="hiw-num">1</div>
              <h3>Register &amp; Verify</h3>
              <p>Create your account, verify your email, and tell us your role — resident, director, or managing agent. Founding members get free beta access immediately.</p>
            </div>
            <div className="hiw-item">
              <div className="hiw-num">2</div>
              <h3>Upload Your Documents</h3>
              <p>Directors upload service charge statements, leases, AGM minutes and more. Set visibility per document — committee only or all residents.</p>
            </div>
            <div className="hiw-item">
              <div className="hiw-num">3</div>
              <h3>Ask, Log &amp; Govern</h3>
              <p>Residents and directors query documents via AI, log issues with traceability, and managing agents are notified and held to response timelines.</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff' }}>
        <div className="section">
          <div className="section-label">Pricing</div>
          <div className="section-title">Three tiers, built for every block</div>
          <p className="section-sub">From self-managed Right to Manage (RTM) buildings to full managing agent portfolios — start free as a founding beta member.</p>
          <div className="price-grid">
            <div className="price-card">
              <div className="price-tier">Tier 1</div>
              <div className="price-name">Starter</div>
              <div className="price-desc">For self-managed Right to Manage (RTM) companies, directors and committee of residents associations and small freeholders ready to take control.</div>
              <div className="price-amount"><sup>£</sup>29<sub>/mo</sub></div>
              <ul className="price-features">
                <li>AI document Q&amp;A (up to 20 docs)</li>
                <li>Resident document archive</li>
                <li>Issue logging &amp; tracking</li>
                <li>Email notifications</li>
                <li>Up to 30 resident accounts</li>
                <li>Governance timeline (basic)</li>
              </ul>
              <button className="btn btn-outline w-full" onClick={() => navigate('/register')}>Get Started Free</button>
            </div>
            <div className="price-card featured">
              <div className="price-badge">Most Popular</div>
              <div className="price-tier">Tier 2</div>
              <div className="price-name">Professional Block</div>
              <div className="price-desc">For professionally managed blocks where transparency and accountability matter most.</div>
              <div className="price-amount"><sup>£</sup>79<sub>/mo</sub></div>
              <ul className="price-features">
                <li>Everything in Starter</li>
                <li>Unlimited documents &amp; residents</li>
                <li>AI issue self-discovery</li>
                <li>Management agent portal</li>
                <li>Weekly reminder automation</li>
                <li>Full governance timeline</li>
                <li>Section 20 consultation tracker</li>
              </ul>
              <button className="btn btn-primary w-full" onClick={() => navigate('/register')}>Get Started Free</button>
            </div>
            <div className="price-card">
              <div className="price-tier">Tier 3</div>
              <div className="price-name">Agent Portfolio</div>
              <div className="price-desc">For managing agents handling multiple buildings — one dashboard, full accountability.</div>
              <div className="price-amount"><sup>£</sup>199<sub>/mo</sub></div>
              <ul className="price-features">
                <li>Everything in Professional</li>
                <li>Multi-building portfolio view</li>
                <li>Agent white-label option</li>
                <li>Priority issue escalation</li>
                <li>Compliance reporting exports</li>
                <li>Dedicated onboarding support</li>
                <li>Custom branding</li>
              </ul>
              <button className="btn btn-navy w-full" onClick={() => navigate('/register')}>Contact Sales</button>
            </div>
          </div>
        </div>
      </div>

      <div className="beta-banner">
        <h2>🎉 Founding Member Beta Access</h2>
        <p>Be among the first to shape the future of residential transparency. Register now for free access during our beta programme — no credit card required.</p>
        <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>Claim Your Free Beta Access</button>
      </div>

      <footer className="footer">
        <Logo variant="footer" />
        <div className="footer-copy">Part of the LocalBuddy AI Infrastructure Layer · © 2026 LocalBuddy Ltd</div>
        <div className="footer-links">
          <a>Privacy</a><a>Terms</a><a>Contact</a>
        </div>
      </footer>
    </div>
  );
}
