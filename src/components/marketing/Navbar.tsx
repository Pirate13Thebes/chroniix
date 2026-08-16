import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import logo from '../../assets/chronix_logo.png';

const SECTION_LINKS = [
  { id: 'home', key: 'navHomeLink' as const },
  { id: 'industries', key: null, label: 'Industries' },
  { id: 'features', key: 'navFeatures' as const },
  { id: 'pricing', key: 'navPricing' as const },
  { id: 'faq', key: 'navFaq' as const },
];

export function Navbar() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // These are anchors into sections of the marketing home page. A plain
  // href="#id" only works while already sitting on that page — from /about
  // or /contact it just rewrites the URL hash with nothing on the page to
  // scroll to. Navigate home first (if needed), then scroll once it's there.
  function goToSection(e: React.MouseEvent, id: string) {
    e.preventDefault();
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    navigate(`/#${id}`);
  }

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <img src={logo} alt="Chronix" style={{ height: 110, width: 110, objectFit: 'contain', margin: '-40px 0', display: 'block' }} />
      <div className="navbar-links">
        {SECTION_LINKS.map((link) => (
          <a key={link.id} href={`#${link.id}`} onClick={(e) => goToSection(e, link.id)}>
            {link.key ? t(link.key) : link.label}
          </a>
        ))}
      </div>
      <div className="navbar-actions">
        <a href="#" className="navbar-login-link" onClick={(e) => { e.preventDefault(); navigate('/login'); }} style={{ fontWeight: 600, fontSize: '0.9rem' }}>
          {t('loginButton')}
        </a>
        <button className="btn btn-primary-amber" onClick={() => navigate('/signup')}>
          {t('signUp')}
        </button>
      </div>
    </nav>
  );
}
