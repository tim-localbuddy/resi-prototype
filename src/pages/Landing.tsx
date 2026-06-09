import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import styles from './Landing.module.css';

export function Landing() {
  const navigate = useNavigate();

  return (
    <div id="view-landing" className="view on" style={{ paddingTop: 0 }}>
      <nav className={styles.lnav}>
        <Logo onClick={() => navigate('/')} />
        <div className={styles.lnavLinks}>
          <span className={styles.nl}>Features</span>
          <span className={styles.nl}>Pricing</span>
          <span className={styles.nl}>About</span>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/login')}>Sign In</button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/register')}>Get Beta Access</button>
        </div>
      </nav>

      <div className={styles.hero}>
        <div className={styles.heroBadge}>🏢 Beta Access Now Open — Founding Members Free</div>
        <h1 className={styles.heroH1}>The <span className={styles.heroH1Accent}>Digital Operating System</span><br />for Apartment Communities</h1>
        <p className={styles.heroSub}>AI-powered transparency for service charges, leases, and governance. Built for resident directors, Right to Manage (RTM) companies, and managing agents.</p>
        <div className={styles.heroCtas}>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>Get Free Beta Access →</button>
          <button className="btn btn-lg" style={{ background: 'rgba(255,255,255,.12)', color: '#fff', border: '1px solid rgba(255,255,255,.2)' }} onClick={() => navigate('/committee')}>View Demo</button>
        </div>
        <div className={styles.heroTrust}>
          <div className={styles.heroTrustItem}><div className={styles.heroTrustDot}></div>Right to Manage (RTM) Companies</div>
          <div className={styles.heroTrustItem}><div className={styles.heroTrustDot}></div>Property Managers</div>
          <div className={styles.heroTrustItem}><div className={styles.heroTrustDot}></div>Managing Agents</div>
          <div className={styles.heroTrustItem}><div className={styles.heroTrustDot}></div>Resident Directors</div>
          <div className={styles.heroTrustItem}><div className={styles.heroTrustDot}></div>Small Freeholders</div>
        </div>
      </div>

      <div style={{ background: '#fff', padding: 0 }}>
        <div className={styles.section}>
          <div className={styles.sectionLabel}>Core Platform</div>
          <div className={styles.sectionTitle}>Everything your building community needs</div>
          <p className={styles.sectionSub}>From AI-decoded service charges to real-time issue accountability — built for transparency at every level.</p>
          <div className={styles.featGrid}>
            <div className={styles.featCard}>
              <div className={styles.featIcon} style={{ background: '#EFF6FF' }}>💬✨</div>
              <h3 className={styles.featCardTitle}>AI Document Q&amp;A</h3>
              <p className={styles.featCardBody}>Ask questions in plain English about your service charge, lease, or AGM minutes. Bofast finds the answer and cites its source — no more sifting through 80-page documents.</p>
            </div>
            <div className={styles.featCard}>
              <div className={styles.featIcon} style={{ background: '#ECFDF5' }}>📁</div>
              <h3 className={styles.featCardTitle}>Resident Document Archive</h3>
              <p className={styles.featCardBody}>Centralise all building documents with controlled access. Directors choose what's visible to residents vs. committee only — version-tracked and always findable.</p>
            </div>
            <div className={styles.featCard}>
              <div className={styles.featIcon} style={{ background: '#FFFBEB' }}>🔍</div>
              <h3 className={styles.featCardTitle}>Issue Logging &amp; Visibility</h3>
              <p className={styles.featCardBody}>Log, track and chase every building issue from a single dashboard. AI self-discovers compliance gaps. Management agents are held accountable with full audit trails.</p>
            </div>
            <div className={styles.featCard}>
              <div className={styles.featIcon} style={{ background: '#F5F3FF' }}>📅</div>
              <h3 className={styles.featCardTitle}>Governance Memory Timeline</h3>
              <p className={styles.featCardBody}>A living record of every AGM decision, service charge approval, major works consultation and compliance milestone — so nothing falls through the cracks again.</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--bg)' }}>
        <div className={styles.section}>
          <div className={styles.sectionLabel}>How It Works</div>
          <div className={styles.sectionTitle}>Up and running in minutes</div>
          <div className={styles.hiwRow}>
            <div className={styles.hiwItem}>
              <div className={styles.hiwNum}>1</div>
              <h3 className={styles.hiwItemTitle}>Register &amp; Verify</h3>
              <p className={styles.hiwItemBody}>Create your account, verify your email, and tell us your role — resident, director, or managing agent. Founding members get free beta access immediately.</p>
            </div>
            <div className={styles.hiwItem}>
              <div className={styles.hiwNum}>2</div>
              <h3 className={styles.hiwItemTitle}>Upload Your Documents</h3>
              <p className={styles.hiwItemBody}>Directors upload service charge statements, leases, AGM minutes and more. Set visibility per document — committee only or all residents.</p>
            </div>
            <div className={styles.hiwItem}>
              <div className={styles.hiwNum}>3</div>
              <h3 className={styles.hiwItemTitle}>Ask, Log &amp; Govern</h3>
              <p className={styles.hiwItemBody}>Residents and directors query documents via AI, log issues with traceability, and managing agents are notified and held to response timelines.</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff' }}>
        <div className={styles.section}>
          <div className={styles.sectionLabel}>Pricing</div>
          <div className={styles.sectionTitle}>Three tiers, built for every block</div>
          <p className={styles.sectionSub}>From self-managed Right to Manage (RTM) buildings to full managing agent portfolios — start free as a founding beta member.</p>
          <div className={styles.priceGrid}>
            <div className={styles.priceCard}>
              <div className={styles.priceTier}>Tier 1</div>
              <div className={styles.priceName}>Starter</div>
              <div className={styles.priceDesc}>For self-managed Right to Manage (RTM) companies, directors and committee of residents associations and small freeholders ready to take control.</div>
              <div className={styles.priceAmount}><span className={styles.priceAmountSup}>£</span>29<span className={styles.priceAmountSub}>/mo</span></div>
              <ul className={styles.priceFeatures}>
                <li className={styles.priceFeaturesItem}>AI document Q&amp;A (up to 20 docs)</li>
                <li className={styles.priceFeaturesItem}>Resident document archive</li>
                <li className={styles.priceFeaturesItem}>Issue logging &amp; tracking</li>
                <li className={styles.priceFeaturesItem}>Email notifications</li>
                <li className={styles.priceFeaturesItem}>Up to 30 resident accounts</li>
                <li className={styles.priceFeaturesItem}>Governance timeline (basic)</li>
              </ul>
              <button className="btn btn-outline w-full" onClick={() => navigate('/register')}>Get Started Free</button>
            </div>
            <div className={`${styles.priceCard} ${styles.featured}`}>
              <div className={styles.priceBadge}>Most Popular</div>
              <div className={styles.priceTier}>Tier 2</div>
              <div className={styles.priceName}>Professional Block</div>
              <div className={styles.priceDesc}>For professionally managed blocks where transparency and accountability matter most.</div>
              <div className={styles.priceAmount}><span className={styles.priceAmountSup}>£</span>79<span className={styles.priceAmountSub}>/mo</span></div>
              <ul className={styles.priceFeatures}>
                <li className={styles.priceFeaturesItem}>Everything in Starter</li>
                <li className={styles.priceFeaturesItem}>Unlimited documents &amp; residents</li>
                <li className={styles.priceFeaturesItem}>AI issue self-discovery</li>
                <li className={styles.priceFeaturesItem}>Management agent portal</li>
                <li className={styles.priceFeaturesItem}>Weekly reminder automation</li>
                <li className={styles.priceFeaturesItem}>Full governance timeline</li>
                <li className={styles.priceFeaturesItem}>Section 20 consultation tracker</li>
              </ul>
              <button className="btn btn-primary w-full" onClick={() => navigate('/register')}>Get Started Free</button>
            </div>
            <div className={styles.priceCard}>
              <div className={styles.priceTier}>Tier 3</div>
              <div className={styles.priceName}>Agent Portfolio</div>
              <div className={styles.priceDesc}>For managing agents handling multiple buildings — one dashboard, full accountability.</div>
              <div className={styles.priceAmount}><span className={styles.priceAmountSup}>£</span>199<span className={styles.priceAmountSub}>/mo</span></div>
              <ul className={styles.priceFeatures}>
                <li className={styles.priceFeaturesItem}>Everything in Professional</li>
                <li className={styles.priceFeaturesItem}>Multi-building portfolio view</li>
                <li className={styles.priceFeaturesItem}>Agent white-label option</li>
                <li className={styles.priceFeaturesItem}>Priority issue escalation</li>
                <li className={styles.priceFeaturesItem}>Compliance reporting exports</li>
                <li className={styles.priceFeaturesItem}>Dedicated onboarding support</li>
                <li className={styles.priceFeaturesItem}>Custom branding</li>
              </ul>
              <button className="btn btn-navy w-full" onClick={() => navigate('/register')}>Contact Sales</button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.betaBanner}>
        <h2 className={styles.betaBannerTitle}>🎉 Founding Member Beta Access</h2>
        <p className={styles.betaBannerSub}>Be among the first to shape the future of residential transparency. Register now for free access during our beta programme — no credit card required.</p>
        <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>Claim Your Free Beta Access</button>
      </div>

      <footer className={styles.footer}>
        <Logo variant="footer" />
        <div className={styles.footerCopy}>Part of the LocalBuddy AI Infrastructure Layer · © 2026 LocalBuddy Ltd</div>
        <div className={styles.footerLinks}>
          <a className={styles.footerLink}>Privacy</a><a className={styles.footerLink}>Terms</a><a className={styles.footerLink}>Contact</a>
        </div>
      </footer>
    </div>
  );
}
