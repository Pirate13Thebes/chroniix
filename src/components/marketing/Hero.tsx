import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { DemoVideoModal } from './DemoVideoModal';
import { LiveClockPreview } from './LiveClockPreview';

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

export function Hero() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [showDemo, setShowDemo] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);

  const SLIDESHOW_IMAGES = [
    hospitality1,
    construction1,
    retail1,
    manufacturing1,
    logistics1,
    agriculture1,
    healthcare1,
    education1,
    bpo1,
    financial1,
    foodbeverage1,
    security1,
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % SLIDESHOW_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [SLIDESHOW_IMAGES.length]);

  return (
    <header className="hero" id="home" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '6.5rem 5% 5rem' }}>
      {/* Full-screen Cross-fading Slideshow Background */}
      <div className="hero-slideshow" aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
        {SLIDESHOW_IMAGES.map((src, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: i === bgIndex ? 0.35 : 0,
              transition: 'opacity 1.2s ease-in-out',
            }}
          />
        ))}
        {/* Smooth left-to-right fade overlay to ensure text on the left is highly legible */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, var(--bg-page) 35%, rgba(253, 251, 247, 0.7) 70%, rgba(253, 251, 247, 0.2) 100%)',
            zIndex: 1
          }}
        />
      </div>

      <div style={{ display: 'flex', width: '100%', maxWidth: '1200px', alignItems: 'center', justifyContent: 'space-between', gap: '3rem', zIndex: 2, flexWrap: 'wrap', padding: '0 1rem' }}>
        {/* Left Column: Copy */}
        <div style={{ flex: '1 1 500px', textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: '320px' }}>
          {/* Smart Attendance Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 210, 0, 0.12)', border: '1px solid rgba(255, 210, 0, 0.3)', borderRadius: '20px', padding: '0.4rem 1rem', marginBottom: '1.5rem', fontSize: '0.82rem', fontWeight: 700, color: 'var(--chronix-navy)' }}>
            <span>🛡️</span> {lang === 'en' ? 'Smart Attendance. Strong Business.' : 'Présence Intelligente. Entreprise Forte.'}
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.4rem)', lineHeight: 1.15, marginBottom: '1.25rem', letterSpacing: '-1px', fontWeight: 800, color: 'var(--chronix-navy)' }}>
            Manage Your Business <span className="amber-text" style={{ display: 'block' }}>Smarter and Faster</span>
          </h1>
          
          <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(1rem, 2.6vw, 1.15rem)', marginBottom: '2rem', maxWidth: '520px', lineHeight: 1.6, fontWeight: 500 }}>
            {t('heroSubtext')}
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            <button className="btn btn-primary-amber btn-lg" onClick={() => navigate('/signup')} style={{ padding: 'clamp(0.7rem, 2vw, 0.85rem) clamp(1.5rem, 5vw, 2.25rem)', fontSize: 'clamp(0.92rem, 2vw, 1.05rem)', fontWeight: 600 }}>
              🚀 {t('getStartedNow')}
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => setShowDemo(true)} style={{ padding: 'clamp(0.7rem, 2vw, 0.85rem) clamp(1.5rem, 5vw, 2.25rem)', fontSize: 'clamp(0.92rem, 2vw, 1.05rem)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>▶</span> {t('watchDemo')}
            </button>
          </div>

          {/* Bottom horizontal features list */}
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', borderTop: '1px solid var(--border)', paddingTop: '1.5rem', width: '100%' }}>
            {[
              { icon: '🛡️', label: lang === 'en' ? 'Accurate Attendance' : 'Présence Précise' },
              { icon: '🕒', label: lang === 'en' ? 'Real-Time Tracking' : 'Suivi en Temps Réel' },
              { icon: '📊', label: lang === 'en' ? 'Payroll-Ready Reports' : 'Rapports Prêts pour la Paie' }
            ].map((feat) => (
              <div key={feat.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                <span>{feat.icon}</span> {feat.label}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Clock Preview */}
        <div style={{ flex: '0 1 340px', minWidth: '300px', display: 'flex', justifyContent: 'center' }}>
          <LiveClockPreview />
        </div>
      </div>

      {/* Smooth upward bottom curve mask */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px', background: 'var(--bg-page)', borderRadius: '100% 100% 0 0', transform: 'scaleX(1.2) translateY(20px)', zIndex: 1 }} />

      {showDemo && <DemoVideoModal onClose={() => setShowDemo(false)} />}
    </header>
  );
}
