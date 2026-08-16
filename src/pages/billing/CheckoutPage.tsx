import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Copy, Clock, MessageCircle, LogIn, Building2, Landmark } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useStore, useStoreActions } from '../../hooks/useStore';
import logo from '../../assets/chronix_logo.png';

const SUPPORT_PHONE = '23054737793';

type PlanId = 'starter' | 'growth' | 'enterprise';
type PayMethod = 'juice' | 'bank_transfer';

const PLANS: Record<PlanId, { name: string; price: number; tagline: string; features: string[] }> = {
  starter: {
    name: 'Starter',
    price: 800,
    tagline: 'Best for small teams getting started.',
    features: ['QR code clock-in', 'Shift scheduling', 'Attendance reports', 'Payroll CSV export', 'Email support', '2 admin seats'],
  },
  growth: {
    name: 'Growth',
    price: 1100,
    tagline: 'For growing businesses with advanced needs.',
    features: ['Everything in Starter, plus:', 'Leave management', 'Reimbursements', 'Department reports', 'Priority support', '5 admin seats'],
  },
  enterprise: {
    name: 'Enterprise',
    price: 1400,
    tagline: 'For large operations that need full control.',
    features: ['Everything in Growth, plus:', 'Permit tracking', 'Custom integrations', 'Dedicated manager', '4-hour response SLA', 'Unlimited admin seats'],
  },
};

const STEP_LABELS = ['Choose Plan', 'Payment Method', 'Payment Details', 'Confirmation'];

function generatePaymentReference() {
  return `CHX-${Math.random().toString(16).slice(2, 6).toUpperCase()}`;
}

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch(() => {});
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 0', borderBottom: '1px solid var(--border)' }}>
      <div>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</div>
        <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{value}</div>
      </div>
      <button type="button" className="icon-btn" onClick={handleCopy} aria-label={`Copy ${label}`}>
        {copied ? <Check size={16} color="var(--success)" /> : <Copy size={16} />}
      </button>
    </div>
  );
}

export function CheckoutPage() {
  const { theme, toggleTheme } = useTheme();
  const { state } = useStore();
  const { updateSettings } = useStoreActions();
  const navigate = useNavigate();

  const realEmployeeCount = state.employees.filter((e) => e.status !== 'terminated').length;

  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('starter');
  const [employeeCount, setEmployeeCount] = useState(String(realEmployeeCount || 1));
  const [payMethod, setPayMethod] = useState<PayMethod>('juice');
  const [paymentReference] = useState(() => state.settings.paymentReference || generatePaymentReference());

  const total = (Number(employeeCount) || 0) * PLANS[selectedPlan].price;

  function handleBack() {
    if (step === 1) {
      navigate('/admin/settings/billing');
    } else {
      setStep(step - 1);
    }
  }

  function handleSendReceipt() {
    const message = `Hi Chronix, I've completed my ${PLANS[selectedPlan].name} plan payment.\nAmount: MUR ${total.toLocaleString('en-US')}\nReference: ${paymentReference}\nI'm sending my payment receipt now.`;
    window.open(`https://wa.me/${SUPPORT_PHONE}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
    updateSettings({
      plan: selectedPlan,
      billingStatus: 'awaiting_confirmation',
      paymentMethod: payMethod,
      paymentReference,
      employeeCount: Number(employeeCount) || state.settings.employeeCount,
    });
    setStep(4);
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', padding: '2rem 1.5rem' }}>
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <button
            type="button"
            onClick={handleBack}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', background: 'none', border: 'none', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer', padding: 0 }}
          >
            <ArrowLeft size={16} /> Back
          </button>
          <button type="button" className="banano-toggle" onClick={toggleTheme}>
            <span>🍌</span>
            {theme === 'banano' ? 'Standard Mode' : 'Banano Mode'}
          </button>
        </div>

        <Link to="/admin/dashboard" aria-label="Chronix" style={{ display: 'inline-block', marginBottom: '1.5rem' }}>
          <img src={logo} alt="Chronix" style={{ height: 40, objectFit: 'contain' }} />
        </Link>

        <div className="progress-tracker">
          {STEP_LABELS.map((label, idx) => {
            const stepNum = idx + 1;
            return (
              <div key={label} className={`tracker-step tracker-step--${stepNum <= step ? 'done' : 'upcoming'}`}>
                <div className="tracker-connector" />
                <div className="tracker-step-dot">{stepNum < step ? '✓' : stepNum}</div>
                <div className="tracker-step-label">{label}</div>
              </div>
            );
          })}
        </div>

        {step === 1 && (
          <div>
            <h1 style={{ fontSize: '1.7rem', textAlign: 'center', marginTop: '1.5rem' }}>Choose your Chronix plan</h1>
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2rem' }}>Simple pricing. No hidden fees.</p>

            <div className="pricing-grid" style={{ marginBottom: '1.5rem' }}>
              {(Object.keys(PLANS) as PlanId[]).map((planId) => {
                const plan = PLANS[planId];
                const active = selectedPlan === planId;
                return (
                  <button
                    type="button"
                    key={planId}
                    onClick={() => setSelectedPlan(planId)}
                    className="card"
                    style={{
                      textAlign: 'left',
                      cursor: 'pointer',
                      border: active ? '2px solid var(--chronix-amber)' : '1px solid var(--border)',
                      background: active ? 'rgba(243, 174, 44, 0.06)' : 'var(--bg-card)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                      <span
                        style={{
                          width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                          border: active ? '5px solid var(--chronix-amber)' : '2px solid var(--border)',
                        }}
                      />
                      <h3 style={{ fontSize: '1.1rem' }}>{plan.name}</h3>
                      {planId === 'starter' && (
                        <span className="status-badge status-badge--approved" style={{ marginLeft: 'auto' }}>Recommended</span>
                      )}
                    </div>
                    <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--chronix-navy)' }}>
                      MUR {plan.price.toLocaleString('en-US')}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>/ employee / month</div>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                      {plan.tagline}
                    </p>
                    <ul className="pricing-features-list">
                      {plan.features.map((f) => (
                        <li key={f} className="pricing-feature-item">{f}</li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>

            <div className="card" style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Employees</div>
                <input
                  className="form-input"
                  type="number"
                  min="1"
                  value={employeeCount}
                  onChange={(e) => setEmployeeCount(e.target.value)}
                  style={{ width: 90, fontSize: '1.3rem', fontWeight: 800, border: 'none', padding: 0 }}
                />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Price per employee</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>MUR {PLANS[selectedPlan].price.toLocaleString('en-US')}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total to pay / month</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--chronix-amber)' }}>MUR {total.toLocaleString('en-US')}</div>
              </div>
            </div>

            <button type="button" className="btn btn-primary-amber" style={{ width: '100%' }} onClick={() => setStep(2)}>
              Continue to payment <ArrowRight size={16} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <h1 style={{ fontSize: '1.7rem', textAlign: 'center', marginTop: '1.5rem' }}>How would you like to pay?</h1>
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2rem' }}>Choose your preferred payment method.</p>

            <div className="responsive-grid-1-1" style={{ marginBottom: '1.5rem' }}>
              <button
                type="button"
                className="card"
                onClick={() => setPayMethod('juice')}
                style={{ textAlign: 'center', cursor: 'pointer', border: payMethod === 'juice' ? '2px solid var(--chronix-amber)' : '1px solid var(--border)' }}
              >
                <Building2 size={40} color="var(--chronix-amber)" style={{ margin: '0 auto 0.75rem' }} />
                <h3 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>Pay with Juice</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Send payment through Juice and submit your receipt on WhatsApp.</p>
              </button>
              <button
                type="button"
                className="card"
                onClick={() => setPayMethod('bank_transfer')}
                style={{ textAlign: 'center', cursor: 'pointer', border: payMethod === 'bank_transfer' ? '2px solid var(--chronix-amber)' : '1px solid var(--border)' }}
              >
                <Landmark size={40} color="var(--chronix-navy)" style={{ margin: '0 auto 0.75rem' }} />
                <h3 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>Bank Transfer / Manual Payment</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Make a manual payment via bank transfer and submit your receipt.</p>
              </button>
            </div>

            <div className="empty-state" style={{ background: 'var(--warning-bg)', color: '#92660b', marginBottom: '1.5rem', textAlign: 'left' }}>
              Your Chronix workspace will be activated after our team confirms your payment.
            </div>

            <button type="button" className="btn btn-primary-amber" style={{ width: '100%' }} onClick={() => setStep(3)}>
              Continue <ArrowRight size={16} />
            </button>
          </div>
        )}

        {step === 3 && (
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <h1 style={{ fontSize: '1.7rem', textAlign: 'center', marginTop: '1.5rem' }}>
              Complete your {payMethod === 'juice' ? 'Juice' : 'Bank Transfer'} payment
            </h1>
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2rem' }}>Follow the steps below to complete your payment.</p>

            <div className="responsive-grid-1-1" style={{ marginBottom: '1.5rem', alignItems: 'start' }}>
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ background: 'var(--warning-bg)', padding: '1.25rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#92660b' }}>Amount to pay</div>
                  <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--chronix-amber)' }}>MUR {total.toLocaleString('en-US')}</div>
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                    {payMethod === 'juice' ? 'Juice payment details' : 'Bank transfer details'}
                  </h4>
                  {payMethod === 'juice' ? (
                    <>
                      <CopyField label="Juice number" value="+230 5473 7793" />
                      <CopyField label="Account name" value="Chronix Ltd" />
                      <CopyField label="Payment reference" value={paymentReference} />
                    </>
                  ) : (
                    <>
                      <CopyField label="Bank" value="MCB Ltd" />
                      <CopyField label="Account number" value="000123456789" />
                      <CopyField label="Account name" value="Chronix Ltd" />
                      <CopyField label="Payment reference" value={paymentReference} />
                    </>
                  )}
                </div>
              </div>

              <div className="card">
                {[
                  payMethod === 'juice' ? 'Send the exact amount through Juice.' : 'Send the exact amount via bank transfer.',
                  'Use your Chronix payment reference.',
                  'Take a screenshot of the successful payment.',
                  'Send the receipt through WhatsApp.',
                ].map((text, idx) => (
                  <div key={text} style={{ display: 'flex', gap: '0.85rem', paddingBottom: idx < 3 ? '1rem' : 0, marginBottom: idx < 3 ? '1rem' : 0, borderBottom: idx < 3 ? '1px solid var(--border)' : 'none' }}>
                    <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--chronix-amber)', color: 'var(--chronix-navy)', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {idx + 1}
                    </span>
                    <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="btn"
              style={{ width: '100%', background: 'var(--success)', color: '#fff', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              onClick={handleSendReceipt}
            >
              <MessageCircle size={18} /> Send receipt on WhatsApp
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Your payment is secure and only used for verification.
            </p>
          </div>
        )}

        {step === 4 && (
          <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ width: 140, height: 140, borderRadius: '50%', background: 'rgba(243, 174, 44, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '2rem auto 1.5rem' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Check size={36} color="#fff" strokeWidth={3} />
              </div>
            </div>
            <h1 style={{ fontSize: '1.6rem', marginBottom: '0.75rem' }}>Payment submitted successfully! 🎉</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              We have received your payment proof. Our team will verify it and activate your Chronix workspace shortly.
            </p>
            <div className="status-badge status-badge--pending" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.75rem', fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
              <Clock size={14} /> Awaiting payment confirmation
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/dashboard')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <LogIn size={16} /> Go to Dashboard
              </button>
              <button
                type="button"
                className="btn btn-primary-navy"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                onClick={() => window.open(`https://wa.me/${SUPPORT_PHONE}?text=${encodeURIComponent('Hi, I need help with my Chronix payment.')}`, '_blank', 'noopener')}
              >
                <MessageCircle size={16} /> Contact Chronix support
              </button>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '1.5rem' }}>
              Need immediate help? <strong>Chat with our team</strong> on WhatsApp.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
