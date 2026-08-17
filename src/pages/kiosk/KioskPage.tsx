import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Lock, Check, Delete, ArrowRight, CheckCircle2, Clock, LogIn, LogOut, Edit2 } from 'lucide-react';
import { useStore, useStoreActions } from '../../hooks/useStore';
import { useLanguage } from '../../hooks/useLanguage';
import { Avatar } from '../../components/common/Avatar';
import logo from '../../assets/chronix_logo.png';
import type { Employee } from '../../types';

export function KioskPage() {
  const { state } = useStore();
  const { clockIn, clockOut } = useStoreActions();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  const companyName = state.settings?.companyName || 'CX';

  const [now, setNow] = useState(() => new Date());
  const [search, setSearch] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [verifiedEmployee, setVerifiedEmployee] = useState<Employee | null>(null);
  const [confirmed, setConfirmed] = useState<{ name: string; action: 'in' | 'out' } | null>(null);

  const activeEmployees = useMemo(() => {
    return state.employees.filter((e) => e.status !== 'terminated');
  }, [state.employees]);

  // Set default selected employee if none selected
  useEffect(() => {
    if (!selectedEmployee && activeEmployees.length > 0) {
      setSelectedEmployee(activeEmployees[0]);
    }
  }, [activeEmployees, selectedEmployee]);

  const filteredEmployees = useMemo(() => {
    if (!search.trim()) return activeEmployees;
    const q = search.toLowerCase();
    return activeEmployees.filter(
      (e) =>
        e.firstName.toLowerCase().includes(q) ||
        e.lastName.toLowerCase().includes(q) ||
        (e.department && e.department.toLowerCase().includes(q)) ||
        e.id.toLowerCase().includes(q)
    );
  }, [activeEmployees, search]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!confirmed) return;
    const tId = window.setTimeout(() => setConfirmed(null), 2500);
    return () => window.clearTimeout(tId);
  }, [confirmed]);

  const handleVerify = useCallback(() => {
    if (!selectedEmployee) return;
    if (pin.length < 4) {
      setError('Please enter your 4-digit PIN.');
      return;
    }

    const isValid = selectedEmployee.kioskPin === pin || selectedEmployee.credential === pin;
    if (!isValid) {
      setError('Invalid PIN. Please try again.');
      setPin('');
      return;
    }

    setError(null);
    setVerifiedEmployee(selectedEmployee);
  }, [selectedEmployee, pin]);

  const handleNumberPress = useCallback((num: number) => {
    setPin((prev) => {
      if (prev.length >= 4) return prev;
      const next = prev + String(num);
      setError(null);
      return next;
    });
  }, []);

  const handleBackspace = useCallback(() => {
    setPin((prev) => prev.slice(0, -1));
    setError(null);
  }, []);

  const handleClear = useCallback(() => {
    setPin('');
    setError(null);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (verifiedEmployee || confirmed) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key >= '0' && e.key <= '9') {
        handleNumberPress(parseInt(e.key));
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        handleClear();
      } else if (e.key === 'Enter') {
        handleVerify();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [verifiedEmployee, confirmed, handleNumberPress, handleBackspace, handleClear, handleVerify]);

  const handleClockAction = (action: 'in' | 'out') => {
    if (!verifiedEmployee) return;
    if (action === 'out') {
      clockOut(verifiedEmployee.id);
      setConfirmed({ name: verifiedEmployee.firstName, action: 'out' });
    } else {
      const locId = verifiedEmployee.workLocationId || state.settings.workLocations[0]?.id || '';
      clockIn(verifiedEmployee.id, 'kiosk', locId);
      setConfirmed({ name: verifiedEmployee.firstName, action: 'in' });
    }
    setVerifiedEmployee(null);
    setPin('');
  };

  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const timeFormatted = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const dateFormatted = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', color: '#0F172A', display: 'flex', flexDirection: 'column', padding: '1.5rem 3%' }}>
      {/* Top Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <img src={logo} alt="Chronix" style={{ height: 38, objectFit: 'contain' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '0.5rem 1rem', borderRadius: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <Clock size={16} color="var(--chronix-amber)" />
          <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A' }}>{timeFormatted}</span>
          <span style={{ fontSize: '0.82rem', color: '#64748B' }}>{dateFormatted}</span>
        </div>
      </div>

      {confirmed ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ maxWidth: 440, textAlign: 'center', padding: '3rem 2rem', border: '1px solid #E2E8F0' }}>
            <CheckCircle2 size={64} color="var(--success)" style={{ margin: '0 auto 1.25rem' }} />
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              {confirmed.name}, you are clocked {confirmed.action === 'in' ? 'IN' : 'OUT'}!
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
              {confirmed.action === 'in' ? 'Have a productive shift.' : 'Have a great rest!'}
            </p>
          </div>
        </div>
      ) : verifiedEmployee ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ maxWidth: 440, width: '100%', textAlign: 'center', padding: '2.5rem 2rem', border: '1px solid #E2E8F0' }}>
            <Avatar src={verifiedEmployee.avatarUrl} name={`${verifiedEmployee.firstName} ${verifiedEmployee.lastName}`} size={80} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '1rem', marginBottom: '0.25rem' }}>
              {verifiedEmployee.firstName} {verifiedEmployee.lastName}
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.88rem', fontWeight: 600, marginBottom: '2rem' }}>
              {verifiedEmployee.department || 'General'} · {verifiedEmployee.role.toUpperCase()}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button
                type="button"
                className="btn"
                style={{ width: '100%', background: 'var(--success)', color: '#fff', padding: '1rem', borderRadius: 14, fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                onClick={() => handleClockAction('in')}
              >
                <LogIn size={20} /> CLOCK IN
              </button>
              <button
                type="button"
                className="btn"
                style={{ width: '100%', background: 'var(--chronix-navy)', color: '#fff', padding: '1rem', borderRadius: 14, fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                onClick={() => handleClockAction('out')}
              >
                <LogOut size={20} /> CLOCK OUT
              </button>
              <button
                type="button"
                className="btn btn-outline"
                style={{ marginTop: '0.5rem' }}
                onClick={() => {
                  setVerifiedEmployee(null);
                  setPin('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Main Layout Grid matching Page 7 Screenshot */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem', flex: 1, alignItems: 'center' }}>
          {/* Left Column: Greeting & Employee Card Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 850, color: '#0F172A', marginBottom: '0.25rem', letterSpacing: '-0.5px' }}>
                {greeting},{' '}
                <span style={{ color: 'var(--chronix-amber)', fontWeight: 850 }}>{companyName}</span>
              </h1>
              <p style={{ color: '#64748B', fontSize: '0.95rem', fontWeight: 500, margin: 0 }}>
                Select your profile or search to continue
              </p>
            </div>

            {/* Search Input Bar */}
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                className="form-input"
                style={{ paddingLeft: '2.75rem', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, height: 48, fontSize: '0.95rem' }}
                placeholder="Search by name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Profiles Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', maxHeight: '52vh', overflowY: 'auto', paddingRight: '0.25rem' }}>
              {filteredEmployees.map((emp) => {
                const isSelected = selectedEmployee?.id === emp.id;
                return (
                  <button
                    key={emp.id}
                    type="button"
                    onClick={() => {
                      setSelectedEmployee(emp);
                      setPin('');
                      setError(null);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.85rem 1rem',
                      background: isSelected ? '#FFFFFF' : '#FFFFFF',
                      border: isSelected ? '2px solid var(--chronix-amber)' : '1px solid #E2E8F0',
                      borderRadius: 16,
                      textAlign: 'left',
                      cursor: 'pointer',
                      position: 'relative',
                      boxShadow: isSelected ? '0 8px 20px rgba(243, 174, 44, 0.15)' : '0 2px 6px rgba(0,0,0,0.02)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Avatar src={emp.avatarUrl} name={`${emp.firstName} ${emp.lastName}`} size={42} />
                    <div style={{ overflow: 'hidden', flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {emp.firstName} {emp.lastName.slice(0, 1)}.
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {emp.department || emp.role}
                      </div>
                    </div>
                    {isSelected && (
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--chronix-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Check size={12} color="#0F172A" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600 }}>
              Powered by <strong style={{ color: '#0F172A' }}>Chronix</strong>
            </div>
          </div>

          {/* Right Column: Keypad Panel matching Page 7 Mockup */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              className="card"
              style={{
                maxWidth: 380,
                width: '100%',
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: 24,
                padding: '2rem',
                boxShadow: '0 20px 40px rgba(15, 23, 42, 0.06)',
                textAlign: 'center',
              }}
            >
              {selectedEmployee ? (
                <>
                  <div style={{ position: 'relative', display: 'inline-block', marginBottom: '0.75rem' }}>
                    <Avatar src={selectedEmployee.avatarUrl} name={`${selectedEmployee.firstName} ${selectedEmployee.lastName}`} size={68} />
                    <div style={{ position: 'absolute', right: -4, top: -4, background: 'var(--chronix-amber)', width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Edit2 size={12} color="#0F172A" />
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.15rem' }}>
                    {selectedEmployee.firstName} {selectedEmployee.lastName}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, marginBottom: '1.25rem' }}>
                    {selectedEmployee.department || 'Staff Member'}
                  </div>

                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748B', marginBottom: '1rem' }}>
                    Enter your 4-digit PIN
                  </div>

                  {error && (
                    <div style={{ color: 'var(--danger)', background: 'rgba(239,68,68,0.1)', padding: '0.5rem', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                      {error}
                    </div>
                  )}

                  {/* 4 PIN Dots */}
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 12,
                          border: pin.length > i ? '2px solid var(--chronix-amber)' : '1px solid #E2E8F0',
                          background: pin.length > i ? 'rgba(243, 174, 44, 0.08)' : '#F8FAFC',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {pin.length > i && (
                          <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--chronix-amber)' }} />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Keypad 3x4 Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => handleNumberPress(n)}
                        style={{
                          height: 52,
                          borderRadius: 14,
                          border: '1px solid #E2E8F0',
                          background: '#F8FAFC',
                          fontSize: '1.25rem',
                          fontWeight: 700,
                          color: '#0F172A',
                          cursor: 'pointer',
                        }}
                      >
                        {n}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={handleBackspace}
                      style={{ height: 52, borderRadius: 14, border: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B' }}
                    >
                      <Delete size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNumberPress(0)}
                      style={{ height: 52, borderRadius: 14, border: '1px solid #E2E8F0', background: '#F8FAFC', fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', cursor: 'pointer' }}
                    >
                      0
                    </button>
                    <button
                      type="button"
                      onClick={handleClear}
                      style={{ height: 52, borderRadius: 14, border: '1px solid #E2E8F0', background: '#F8FAFC', fontSize: '0.85rem', fontWeight: 700, color: '#64748B', cursor: 'pointer' }}
                    >
                      Clear
                    </button>
                  </div>

                  {/* Verify PIN Button */}
                  <button
                    type="button"
                    onClick={handleVerify}
                    className="btn btn-primary-amber"
                    style={{ width: '100%', height: 48, borderRadius: 14, fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginBottom: '1.25rem' }}
                  >
                    Verify PIN <ArrowRight size={16} />
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600 }}>
                    <Lock size={12} color="var(--chronix-amber)" /> Secure. Private. Trusted.
                  </div>
                </>
              ) : (
                <div style={{ padding: '2rem 1rem', color: '#64748B' }}>
                  Please select an employee profile from the left list.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
