import { Link, useNavigate } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { FacebookIcon, InstagramIcon, LinkedinIcon } from '../common/SocialIcons';
import logoWhite from '../../assets/chronix_logo_white.png';

const FOOTER_COLUMNS = [
  {
    heading: 'Product',
    description: 'Everything Chronix does, in one place.',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Industries', href: '#industries' },
      { label: 'FAQ', href: '#faq' },
    ],
  },
  {
    heading: 'Industries',
    description: 'Built for the sectors driving Mauritius forward.',
    links: [
      { label: 'Hospitality', href: '/?industry=Hospitality#industries' },
      { label: 'Construction', href: '/?industry=Construction#industries' },
      { label: 'Retail', href: '/?industry=Retail#industries' },
      { label: 'Manufacturing', href: '/?industry=Manufacturing#industries' },
      { label: 'Logistics', href: '/?industry=Logistics#industries' },
      { label: 'Healthcare', href: '/?industry=Healthcare#industries' },
      { label: 'Education', href: '/?industry=Education#industries' },
      { label: 'Financial Services', href: '/?industry=Financial%20Services#industries' },
    ],
  },
  {
    heading: 'Company',
    description: 'A Mauritian product, built for Mauritian teams.',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    heading: 'Legal',
    description: 'The fine print, kept plain and short.',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
];

const SOCIAL_LINKS = [
  { icon: FacebookIcon, label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61590746107633' },
  { icon: LinkedinIcon, label: 'LinkedIn', href: 'https://www.linkedin.com/company/chronixx/' },
  { icon: InstagramIcon, label: 'Instagram', href: 'https://www.instagram.com/chronix.mu/' },
];

export function Footer() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-cta">
        <div>
          <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.35rem' }}>Ready to get started?</h3>
          <p style={{ fontSize: '0.9rem' }}>Join Mauritian businesses already tracking attendance the smart way.</p>
        </div>
        <button className="btn btn-primary-amber" onClick={() => navigate('/signup')}>
          {t('getStartedNow')}
        </button>
      </div>

      <div className="footer-grid">
        <div className="footer-brand">
          <div style={{ display: 'inline-flex', marginBottom: '1.1rem' }}>
            <img src={logoWhite} alt="Chronix" style={{ height: 100, width: 100, objectFit: 'contain', margin: '-38px 0', display: 'block' }} />
          </div>
          <p style={{ fontSize: '0.85rem', maxWidth: 320, marginBottom: '1.1rem' }}>{t('footerTagline')}</p>

          <div className="footer-contact">
            <div className="footer-contact-row">
              <MapPin size={15} />
              <span>Beau Plan, Pamplemousses, Mauritius</span>
            </div>
            <div className="footer-contact-row">
              <Mail size={15} />
              <a href="mailto:chronix.mu@gmail.com">chronix.mu@gmail.com</a>
            </div>
            <div className="footer-contact-row">
              <Phone size={15} />
              <a href="tel:+23054737793">+230 5473 7793</a>
            </div>
          </div>

          <div className="footer-social">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="footer-social-icon"
              >
                <social.icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {FOOTER_COLUMNS.map((column) => (
          <div className="footer-column" key={column.heading}>
            <h4>{column.heading}</h4>
            <p className="footer-column-desc">{column.description}</p>
            {column.links.map((link) => {
              if (link.href.startsWith('/')) {
                return (
                  <Link to={link.href} key={link.label}>
                    {link.label}
                  </Link>
                );
              }
              return (
                <a href={link.href} key={link.label}>
                  {link.label}
                </a>
              );
            })}
          </div>
        ))}
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Chronix. All rights reserved.</p>
        <p>Made for Mauritian businesses.</p>
      </div>
    </footer>
  );
}
