import { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle, Send } from 'lucide-react';
import { Navbar } from '../../components/marketing/Navbar';
import { Footer } from '../../components/marketing/Footer';
import { useLanguage } from '../../hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

export function ContactPage() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const isFr = lang === 'fr';

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    email: '',
    phone: '',
    employees: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    // Shoot some celebratory confetti for a premium experience
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-page)' }}>
      <Navbar />

      <main style={{ flexGrow: 1, padding: '4rem 5%', maxWidth: '1000px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--chronix-navy)', marginBottom: '1rem', letterSpacing: '-0.5px' }}>
          {isFr ? 'Contactez-nous' : 'Talk to us'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '3rem', maxWidth: '600px' }}>
          {isFr
            ? "Une question ? Envie de voir une démonstration en direct de Chronix ? Contactez-nous, un membre de l'équipe vous répondra directement."
            : "Have a question? Want to see Chronix working before you decide? Just reach out — a real person will answer."}
        </p>

        <div className="contact-grid">
          {/* Contact Details Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--warning-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b7791f' }}>
                  <Mail size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Email</div>
                  <a href="mailto:chronix.mu@gmail.com" style={{ fontSize: '1rem', color: 'var(--chronix-navy)', fontWeight: 600, textDecoration: 'none' }}>
                    chronix.mu@gmail.com
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
                  <Phone size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Phone / WhatsApp</div>
                  <a href="tel:+23054737793" style={{ fontSize: '1rem', color: 'var(--chronix-navy)', fontWeight: 600, textDecoration: 'none' }}>
                    +230 5473 7793
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--info-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--info)' }}>
                  <MapPin size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Office</div>
                  <span style={{ fontSize: '1rem', color: 'var(--chronix-navy)', fontWeight: 600 }}>
                    Beau Plan, Pamplemousses, Mauritius
                  </span>
                </div>
              </div>
            </div>

            {/* Support section card */}
            <div className="card" style={{ marginTop: '1rem', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--chronix-navy)', margin: '0 0 0.5rem 0' }}>
                {isFr ? 'Déjà client ?' : 'Already a customer?'}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, margin: '0 0 1.25rem 0' }}>
                {isFr
                  ? "Connectez-vous et cliquez sur « Contacter le Support » — ou appelez-nous directement. Nous sommes basés à Maurice et nous répondons."
                  : 'Log in and hit "Contact Support" — or just call us. We\'re in Mauritius, same time zone, and we answer.'}
              </p>
              <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => navigate('/login')}>
                {isFr ? 'Se Connecter' : 'Log In'}
              </button>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="card" style={{ border: '1px solid var(--border)' }}>
            {formSubmitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)', marginBottom: '1rem' }}>
                  <CheckCircle size={48} />
                </div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--chronix-navy)', marginBottom: '0.5rem' }}>
                  {isFr ? 'Message envoyé !' : 'Message sent!'}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
                  {isFr
                    ? "Merci pour votre message. Un conseiller de notre équipe vous contactera dans les plus brefs délais."
                    : "Thank you for reaching out. A real person from our Beau Plan office will get back to you shortly."}
                </p>
                <button className="btn btn-outline" style={{ marginTop: '1.5rem' }} onClick={() => setFormSubmitted(false)}>
                  {isFr ? 'Envoyer un autre message' : 'Send another message'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--chronix-navy)', margin: '0 0 0.5rem 0' }}>
                  {isFr ? 'Demander une démo' : 'Want a demo?'}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, margin: '0 0 0.5rem 0' }}>
                  {isFr
                    ? "Dites-nous en un peu plus sur votre entreprise (effectif, secteur) et nous vous montrerons comment Chronix peut vous simplifier la vie."
                    : "Tell us a bit about your business — how many employees, what industry — and we'll show you exactly how Chronix would work for your team."}
                </p>

                <div className="contact-form-row">
                  <div className="form-field" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>{isFr ? 'Nom complet' : 'Name'}</label>
                    <input 
                      className="form-input" 
                      type="text" 
                      required 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    />
                  </div>
                  <div className="form-field" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>{isFr ? "Nom de l'entreprise" : 'Business name'}</label>
                    <input 
                      className="form-input" 
                      type="text" 
                      required 
                      value={formData.businessName} 
                      onChange={(e) => setFormData({...formData, businessName: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="contact-form-row">
                  <div className="form-field" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Email</label>
                    <input 
                      className="form-input" 
                      type="email" 
                      required 
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    />
                  </div>
                  <div className="form-field" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>{isFr ? 'Téléphone' : 'Phone'}</label>
                    <input 
                      className="form-input" 
                      type="text" 
                      required 
                      value={formData.phone} 
                      onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="form-field" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>{isFr ? "Nombre d'employés" : 'Number of employees'}</label>
                  <input 
                    className="form-input" 
                    type="number" 
                    required 
                    min="1"
                    value={formData.employees} 
                    onChange={(e) => setFormData({...formData, employees: e.target.value})} 
                  />
                </div>

                <div className="form-field" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Message</label>
                  <textarea 
                    className="form-textarea" 
                    required 
                    rows={4}
                    value={formData.message} 
                    onChange={(e) => setFormData({...formData, message: e.target.value})} 
                  />
                </div>

                <button type="submit" className="btn btn-primary-amber" style={{ width: '100%', gap: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '0.5rem' }}>
                  <Send size={16} />
                  {isFr ? 'Envoyer le Message' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
