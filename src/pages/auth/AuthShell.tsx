import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import logo from '../../assets/chronix_logo.png';
import logoWhite from '../../assets/chronix_logo_white.png';
import { ArrowLeft } from 'lucide-react';

// Import industry background images
import hospitality1 from '../../assets/industries/hospitality-1.jpg';
import construction1 from '../../assets/industries/construction-1.jpg';
import retail1 from '../../assets/industries/retail-1.jpg';
import manufacturing1 from '../../assets/industries/manufacturing-1.jpg';
import logistics1 from '../../assets/industries/logistics-1.jpg';
import agriculture1 from '../../assets/industries/agriculture-1.jpg';
import healthcare1 from '../../assets/industries/healthcare-1.jpg';
import education1 from '../../assets/industries/education-1.jpg';
import bpo1 from '../../assets/industries/bpo-1.jpg';
import financial1 from '../../assets/industries/financial-1.jpg';
import foodbeverage1 from '../../assets/industries/foodbeverage-1.jpg';
import security1 from '../../assets/industries/security-1.jpg';
import hospitality2 from '../../assets/industries/hospitality-2.jpg';
import construction2 from '../../assets/industries/construction-2.jpg';
import retail2 from '../../assets/industries/retail-2.jpg';
import manufacturing2 from '../../assets/industries/manufacturing-2.jpg';
import logistics2 from '../../assets/industries/logistics-2.jpg';
import healthcare2 from '../../assets/industries/healthcare-2.jpg';

const MARQUEE_ROW_A = [hospitality1, construction1, retail1, manufacturing1, logistics1, agriculture1, healthcare1, education1, bpo1];
const MARQUEE_ROW_B = [financial1, foodbeverage1, security1, hospitality2, construction2, retail2, manufacturing2, logistics2, healthcare2];

interface AuthShellProps {
  children: ReactNode;
}

export function AuthShell({ children }: AuthShellProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="login-container">
      <div className="login-left-panel">
        <div style={{ maxWidth: 380, margin: '0 auto', width: '100%' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <Link 
              to="/" 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.4rem', 
                color: 'var(--text-secondary)', 
                textDecoration: 'none', 
                fontSize: '0.88rem', 
                fontWeight: 600, 
                transition: 'color 0.2s' 
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--chronix-navy)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              <ArrowLeft size={16} /> Back to website
            </Link>
          </div>
          <div className="auth-top-row">
            <Link to="/" aria-label="Back to Chronix home">
              <img src={logo} alt="Chronix" style={{ height: 110, width: 110, objectFit: 'contain', margin: '-39px 0', display: 'block' }} />
            </Link>
            <button type="button" className="banano-toggle" onClick={toggleTheme}>
              <span>🍌</span>
              {theme === 'banano' ? 'Standard Mode' : 'Banano Mode'}
            </button>
          </div>
          {children}
        </div>
      </div>

      <div className="login-right-panel" style={{ position: 'relative', overflow: 'hidden', background: '#0a0d10' }}>
        {/* Background Scrolling Marquee */}
        <div className="hero-marquee" aria-hidden="true" style={{ opacity: 0.8, zIndex: 0 }}>
          <div className="hero-marquee-row hero-marquee-row--left">
            {[...MARQUEE_ROW_A, ...MARQUEE_ROW_A].map((src, i) => (
              <img src={src} alt="" key={i} loading="lazy" style={{ opacity: 0.9, filter: 'grayscale(0%)' }} />
            ))}
          </div>
          <div className="hero-marquee-row hero-marquee-row--right">
            {[...MARQUEE_ROW_B, ...MARQUEE_ROW_B].map((src, i) => (
              <img src={src} alt="" key={i} loading="lazy" style={{ opacity: 0.9, filter: 'grayscale(0%)' }} />
            ))}
          </div>
        </div>

        {/* Soft, dark translucent scrim to preserve white text contrast */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(10, 13, 16, 0.45)',
            zIndex: 1
          }}
        />

        <div style={{ color: '#fff', textAlign: 'center', maxWidth: 340, position: 'relative', zIndex: 2 }}>
          <img src={logoWhite} alt="Chronix" style={{ height: 125, width: 125, objectFit: 'contain', margin: '-45px auto -0.25rem', display: 'block' }} />

          <div className="auth-mockup-card">
            <div className="auth-mockup-row">
              {[
                { label: 'On-time', value: '94%', color: 'var(--success)' },
                { label: 'On shift now', value: '18', color: 'var(--chronix-navy)' },
              ].map((stat) => (
                <div key={stat.label} className="auth-mockup-stat">
                  <div style={{ color: stat.color, fontWeight: 800, fontSize: '1.35rem' }}>{stat.value}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="auth-mockup-list">
              {[
                { name: 'Gaelle Ephraim', action: 'Clocked In', color: 'var(--success)' },
                { name: 'Jean Pierre', action: 'Clocked In', color: 'var(--success)' },
                { name: 'Sarah Latour', action: 'Clocked Out', color: 'var(--danger)' },
              ].map((row) => (
                <div key={row.name} className="auth-mockup-list-row">
                  <span>{row.name}</span>
                  <span style={{ color: row.color, fontWeight: 700 }}>{row.action}</span>
                </div>
              ))}
            </div>
          </div>

          <p style={{ fontSize: '1rem', lineHeight: 1.6, marginTop: '1.75rem' }}>
            One shared system, two views. Everything your team does on the clock appears instantly on your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
