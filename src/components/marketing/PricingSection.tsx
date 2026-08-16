import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const PRICING_DATA = {
  en: {
    badge: 'MOST POPULAR',
    starter: {
      name: 'Starter',
      price: 'MUR 800',
      period: '/employee/month',
      desc: 'Everything a growing Mauritian business needs to track attendance and run shifts properly.',
      limit: '',
      features: [
        { text: 'QR code clock-in kiosks', enabled: true },
        { text: 'Daily shift scheduler', enabled: true },
        { text: 'Attendance registry & standard reports', enabled: true },
        { text: 'MCB & ABSA payroll CSV exports', enabled: true },
        { text: 'EN/FR interface', enabled: true },
        { text: 'Email support', enabled: true },
        { text: '2 administrator seats', enabled: true },
      ]
    },
    growth: {
      name: 'Growth',
      price: 'MUR 1,100',
      period: '/employee/month',
      desc: 'For multi-branch operations that need proper leave, reimbursement, and team management workflows.',
      limit: '',
      features: [
        { text: 'Everything in Starter, plus:', enabled: true },
        { text: 'Multi-branch management', enabled: true },
        { text: 'Leave & absence workflows', enabled: true },
        { text: 'Reimbursement claims & receipts', enabled: true },
        { text: 'Supervisor group clock-in', enabled: true },
        { text: 'WhatsApp & SMS employee onboarding', enabled: true },
        { text: 'Department performance reports', enabled: true },
        { text: 'Priority email + WhatsApp support', enabled: true },
        { text: '5 administrator seats', enabled: true },
      ]
    },
    enterprise: {
      name: 'Enterprise',
      price: 'MUR 1,400',
      period: '/employee/month',
      desc: 'For large hotels, factories, and retail chains that need white-glove service.',
      limit: '',
      features: [
        { text: 'Everything in Growth, plus:', enabled: true },
        { text: 'Migrant worker permit tracking with 30-day expiry alerts', enabled: true },
        { text: 'Custom payroll CSV formats beyond MCB/ABSA', enabled: true },
        { text: 'Dedicated account manager', enabled: true },
        { text: '4-hour response SLA', enabled: true },
        { text: '99.9% uptime SLA', enabled: true },
        { text: 'Guided onboarding & on-site HR training', enabled: true },
        { text: 'Unlimited administrator seats', enabled: true },
      ]
    },
    contactSales: 'Contact Sales',
    startTrial: 'Start Free Trial',
  },
  fr: {
    badge: 'LE PLUS POPULAIRE',
    starter: {
      name: 'Starter',
      price: 'MUR 800',
      period: '/employé/mois',
      desc: 'Tout ce dont une entreprise mauricienne en croissance a besoin pour suivre la présence et gérer les horaires correctement.',
      limit: '',
      features: [
        { text: 'Bornes de pointage par code QR', enabled: true },
        { text: 'Planificateur d\'horaire quotidien', enabled: true },
        { text: 'Registre de présence & rapports standards', enabled: true },
        { text: 'Exports CSV de paie MCB & ABSA', enabled: true },
        { text: 'Interface EN/FR', enabled: true },
        { text: 'Support par e-mail', enabled: true },
        { text: '2 comptes administrateur', enabled: true },
      ]
    },
    growth: {
      name: 'Growth',
      price: 'MUR 1 100',
      period: '/employé/mois',
      desc: 'Pour les opérations multi-succursales ayant besoin de vrais flux de congés, remboursements et gestion d\'équipe.',
      limit: '',
      features: [
        { text: 'Tout ce qui est dans Starter, plus :', enabled: true },
        { text: 'Gestion multi-succursales', enabled: true },
        { text: 'Flux de congés & absences', enabled: true },
        { text: 'Notes de frais & reçus', enabled: true },
        { text: 'Pointage de groupe par superviseur', enabled: true },
        { text: 'Intégration des employés par WhatsApp & SMS', enabled: true },
        { text: 'Rapports de performance par département', enabled: true },
        { text: 'Support prioritaire e-mail + WhatsApp', enabled: true },
        { text: '5 comptes administrateur', enabled: true },
      ]
    },
    enterprise: {
      name: 'Enterprise',
      price: 'MUR 1 400',
      period: '/employé/mois',
      desc: 'Pour les grands hôtels, usines et chaînes de magasins ayant besoin d\'un service haut de gamme.',
      limit: '',
      features: [
        { text: 'Tout ce qui est dans Growth, plus :', enabled: true },
        { text: 'Suivi des permis de travail des travailleurs migrants avec alertes d\'expiration à 30 jours', enabled: true },
        { text: 'Formats CSV de paie personnalisés au-delà de MCB/ABSA', enabled: true },
        { text: 'Gestionnaire de compte dédié', enabled: true },
        { text: 'SLA de réponse de 4 heures', enabled: true },
        { text: 'SLA de disponibilité de 99,9 %', enabled: true },
        { text: 'Onboarding guidé & formation RH sur site', enabled: true },
        { text: 'Comptes administrateur illimités', enabled: true },
      ]
    },
    contactSales: 'Contacter le Support',
    startTrial: 'Démarrer l\'essai gratuit',
  }
} as const;

export function PricingSection() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const revealRef = useScrollReveal<HTMLElement>();

  const data = PRICING_DATA[lang === 'fr' ? 'fr' : 'en'];

  return (
    <section className="section reveal" id="pricing" ref={revealRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 className="section-title" style={{ textAlign: 'center' }}>{t('pricingTitle')}</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', textAlign: 'center', maxWidth: '600px' }}>
        {t('pricingSubtitle')}
      </p>

      <div className="pricing-grid">
        {/* Starter Plan Card (Featured) */}
        <div className="card pricing-card--popular" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className="popular-badge">{data.badge}</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0.5rem 0 0.5rem 0' }}>{data.starter.name}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', minHeight: '60px', margin: '0 0 1rem 0' }}>
            {data.starter.desc}
          </p>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: 'var(--chronix-navy)' }}>
            {data.starter.price}
            <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--text-secondary)' }}>{data.starter.period}</span>
          </div>

          <ul className="pricing-features-list" style={{ flexGrow: 1 }}>
            {data.starter.features.map((f, idx) => (
              <li key={idx} className={`pricing-feature-item ${f.enabled ? '' : 'disabled'}`}>
                {f.text}
              </li>
            ))}
          </ul>

          <button className="btn btn-primary-amber" style={{ width: '100%', marginTop: '1.5rem' }} onClick={() => navigate('/signup')}>
            {data.startTrial}
          </button>
        </div>

        {/* Growth Plan Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>{data.growth.name}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', minHeight: '60px', margin: '0 0 1rem 0' }}>
            {data.growth.desc}
          </p>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: 'var(--chronix-navy)' }}>
            {data.growth.price}
            <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--text-secondary)' }}>{data.growth.period}</span>
          </div>

          <ul className="pricing-features-list" style={{ flexGrow: 1 }}>
            {data.growth.features.map((f, idx) => (
              <li key={idx} className={`pricing-feature-item ${f.enabled ? '' : 'disabled'}`}>
                {f.text}
              </li>
            ))}
          </ul>

          <button className="btn btn-outline" style={{ width: '100%', marginTop: '1.5rem' }} onClick={() => navigate('/signup')}>
            {data.startTrial}
          </button>
        </div>

        {/* Enterprise Plan Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>{data.enterprise.name}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', minHeight: '60px', margin: '0 0 1rem 0' }}>
            {data.enterprise.desc}
          </p>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: 'var(--chronix-navy)' }}>
            {data.enterprise.price}
            <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--text-secondary)' }}>{data.enterprise.period}</span>
          </div>

          <ul className="pricing-features-list" style={{ flexGrow: 1 }}>
            {data.enterprise.features.map((f, idx) => (
              <li key={idx} className={`pricing-feature-item ${f.enabled ? '' : 'disabled'}`}>
                {f.text}
              </li>
            ))}
          </ul>

          <button className="btn btn-outline" style={{ width: '100%', marginTop: '1.5rem' }} onClick={() => navigate('/contact')}>
            {data.contactSales}
          </button>
        </div>
      </div>
    </section>
  );
}
