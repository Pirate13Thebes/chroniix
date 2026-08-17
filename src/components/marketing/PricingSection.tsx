import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { Check } from 'lucide-react';

const PLANS_LIST = [
  {
    id: 'starter',
    name: 'Starter',
    price: 'MUR 1,500',
    period: '/month',
    employees: 'Up to 20 employees',
    desc: 'For small teams that need a simple, reliable way to manage attendance and payroll.',
    popular: true,
    features: [
      'Full access to all Chronix features',
      'Up to 20 employees',
      '2 admin accounts (owner + one manager)',
      'Email support',
    ],
  },
  {
    id: 'silver',
    name: 'Silver',
    price: 'MUR 2,500',
    period: '/month',
    employees: 'Up to 30 employees',
    desc: 'For growing businesses that need more capacity without losing control of day-to-day operations.',
    popular: false,
    features: [
      'Full access to all Chronix features',
      'Up to 30 employees',
      '5 admin accounts (owner, HR, up to 3 managers)',
      'Email & WhatsApp support (replies within 1 business day)',
    ],
  },
  {
    id: 'gold',
    name: 'Gold',
    price: 'MUR 4,000',
    period: '/month',
    employees: 'Up to 60 employees',
    desc: 'For medium-sized businesses that need stronger team management and room to scale.',
    popular: false,
    features: [
      'Full access to all Chronix features',
      'Up to 60 employees',
      '10 admin accounts (for multi-department teams)',
      'Priority WhatsApp support (within 2 hrs, business hours)',
      'On-site training available (paid add-on)',
    ],
  },
  {
    id: 'platinum',
    name: 'Platinum',
    price: 'MUR 6,000',
    period: '/month',
    employees: 'Up to 120 employees',
    desc: 'For larger businesses that need higher capacity, dedicated support, and hands-on setup.',
    popular: false,
    features: [
      'Full access to all Chronix features',
      'Up to 120 employees',
      'Unlimited admins (across every site & department)',
      'Dedicated support (named contact, same-day response)',
      'On-site training included',
      'Custom integrations available (paid add-on)',
    ],
  },
  {
    id: 'platinum_plus',
    name: 'Platinum Plus',
    price: 'MUR 8,500',
    period: '/month',
    employees: 'Up to 200 employees',
    desc: 'For established businesses that have outgrown Business but don\'t need a fully custom setup.',
    popular: false,
    features: [
      'Full access to all Chronix features',
      'Up to 200 employees',
      'Unlimited admins (across every site & department)',
      'Dedicated support (named contact, same-day response)',
      'On-site training included',
      'Custom integrations available (paid add-on)',
    ],
  },
  {
    id: 'diamond',
    name: 'Diamond',
    price: 'MUR 12,000',
    period: '/month',
    employees: 'Unlimited employees',
    desc: 'For large organisations that need custom setup, integrations built into the price, and a dedicated account manager.',
    popular: false,
    features: [
      'Full access to all Chronix features',
      'Unlimited employees',
      'Unlimited admins',
      'Dedicated account manager',
      'On-site training included',
      'Custom integrations included',
    ],
  },
];

export function PricingSection() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const revealRef = useScrollReveal<HTMLElement>();

  return (
    <section className="section reveal" id="pricing" ref={revealRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <h2 className="section-title" style={{ textAlign: 'center' }}>{t('pricingTitle')}</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', textAlign: 'center', maxWidth: '600px' }}>
        Simple, transparent plans designed to scale with your Mauritian business.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '1.5rem', width: '100%', maxWidth: '1200px' }}>
        {PLANS_LIST.map((plan) => (
          <div
            key={plan.id}
            className={`card ${plan.popular ? 'pricing-card--popular' : ''}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              border: plan.popular ? '2px solid var(--chronix-amber)' : '1px solid var(--border)',
            }}
          >
            {plan.popular && (
              <div className="popular-badge">RECOMMENDED</div>
            )}

            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--chronix-navy)', margin: '0.5rem 0 0.25rem 0' }}>
                {plan.name}
              </h3>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--chronix-amber)', marginBottom: '0.75rem' }}>
                {plan.employees}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', minHeight: '48px', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                {plan.desc}
              </p>

              <div style={{ fontSize: '2rem', fontWeight: 850, color: 'var(--chronix-navy)', marginBottom: '1.25rem' }}>
                {plan.price}
                <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)' }}>{plan.period}</span>
              </div>

              <ul className="pricing-features-list" style={{ marginBottom: '1.5rem', paddingLeft: 0, listStyle: 'none' }}>
                {plan.features.map((feat, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-main)', marginBottom: '0.6rem' }}>
                    <Check size={16} color="var(--success)" style={{ flexShrink: 0, marginTop: 3 }} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              className={`btn ${plan.popular ? 'btn-primary-amber' : 'btn-outline'}`}
              style={{ width: '100%', marginTop: 'auto' }}
              onClick={() => navigate('/signup')}
            >
              Start 7-Day Free Trial
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
