import { useState, useEffect } from 'react';
import { CheckCircle2, User, Phone, LogIn, LogOut, ShieldCheck } from 'lucide-react';
import { useStore, useStoreActions } from '../../hooks/useStore';
import logo from '../../assets/chronix_logo.png';
import type { TemporaryWorkerRecord } from '../../types';

export function TempCheckInPage() {
  const { state } = useStore();
  const { clockInTemp, clockOutTemp } = useStoreActions();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [activeWorker, setActiveWorker] = useState<TemporaryWorkerRecord | null>(null);
  const [submitted, setSubmitted] = useState<{ action: 'in' | 'out'; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Auto-search for existing worker when phone/name is typed to check status
  useEffect(() => {
    if (!name.trim()) {
      setActiveWorker(null);
      return;
    }
    const list = state.temporaryWorkers || [];
    const match = list.find(
      (t) =>
        t.status === 'clocked_in' &&
        t.name.trim().toLowerCase() === name.trim().toLowerCase() &&
        (!phone.trim() || t.phone.trim() === phone.trim())
    );
    setActiveWorker(match || null);
  }, [name, phone, state.temporaryWorkers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !phone.trim()) {
      setError('Please enter your full name and phone number.');
      return;
    }

    if (activeWorker) {
      // Clock out
      clockOutTemp(activeWorker.id);
      setSubmitted({ action: 'out', name: activeWorker.name });
    } else {
      // Clock in
      clockInTemp(name.trim(), phone.trim(), 0);
      setSubmitted({ action: 'in', name: name.trim() });
    }
  };

  const handleReset = () => {
    setSubmitted(null);
    setName('');
    setPhone('');
    setActiveWorker(null);
  };

  const companyName = state.settings?.companyName || 'Chronix Business';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ maxWidth: 460, width: '100%', boxSizing: 'border-box' }}>
        {/* Top Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <img src={logo} alt="Chronix" style={{ height: 38, objectFit: 'contain', marginBottom: '0.75rem' }} />
          <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, color: 'var(--chronix-amber)' }}>
            Temporary Worker Check-In Portal
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--chronix-navy)', margin: '0.25rem 0' }}>
            {companyName}
          </h1>
        </div>

        {submitted ? (
          <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)', margin: '0 auto 1.25rem' }}>
              <CheckCircle2 size={36} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--chronix-navy)', marginBottom: '0.5rem' }}>
              {submitted.action === 'in' ? 'Clocked In Successfully!' : 'Clocked Out Successfully!'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.75rem' }}>
              Thank you, <strong>{submitted.name}</strong>. Your attendance record has been logged.
            </p>
            <button type="button" className="btn btn-primary-amber" style={{ width: '100%' }} onClick={handleReset}>
              Done / Return to Check-In
            </button>
          </div>
        ) : (
          <div className="card" style={{ border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              <ShieldCheck size={16} color="var(--chronix-amber)" />
              <span>Scan QR Code Check-in System</span>
            </div>

            {error && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.75rem', borderRadius: 8, fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 600 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div className="form-field" style={{ marginBottom: 0 }}>
                <label className="form-label">Your Full Name (First & Last)</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                    type="text"
                    required
                    placeholder="e.g. Jean Dupont"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-field" style={{ marginBottom: 0 }}>
                <label className="form-label">Contact Phone / WhatsApp</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                    type="tel"
                    required
                    placeholder="e.g. 54737793"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              {activeWorker ? (
                <div style={{ background: 'rgba(243, 174, 44, 0.1)', border: '1px solid var(--chronix-amber)', borderRadius: 12, padding: '1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.85rem', color: '#92660b', fontWeight: 700, marginBottom: '0.25rem' }}>
                    Currently Clocked In since {new Date(activeWorker.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <button
                    type="submit"
                    className="btn"
                    style={{ width: '100%', background: 'var(--chronix-navy)', color: '#fff', padding: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 700, marginTop: '0.5rem' }}
                  >
                    <LogOut size={18} /> Clock Out Now
                  </button>
                </div>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary-amber"
                  style={{ width: '100%', padding: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 700, marginTop: '0.5rem' }}
                >
                  <LogIn size={18} /> Clock In Now
                </button>
              )}
            </form>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          Powered by <strong>Chronix Workforce Intelligence</strong>
        </div>
      </div>
    </div>
  );
}
