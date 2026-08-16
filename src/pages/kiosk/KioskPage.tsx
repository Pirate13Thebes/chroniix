// Shared-terminal check-in — turns any tablet/computer at a site entrance
// into a check-in station employees use without a personal login. Physical
// access to the device is the trust boundary here, same as a real punch
// clock or badge reader: whoever is standing at it taps their own name.
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, LogOut, CheckCircle2, Fingerprint, Delete, Info, ArrowRight, Lock } from 'lucide-react';
import { useStore, useStoreActions } from '../../hooks/useStore';
import { useLanguage } from '../../hooks/useLanguage';
import { Avatar } from '../../components/common/Avatar';
import logoWhite from '../../assets/chronix_logo_white.png';
import type { Employee } from '../../types';

export function KioskPage() {
  const { state } = useStore();
  const { clockIn, clockOut } = useStoreActions();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  const [now, setNow] = useState(() => new Date());
  const [pin, setPin] = useState('');
  const [activeEmployee, setActiveEmployee] = useState<Employee | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<{ name: string; action: 'in' | 'out' } | null>(null);

  const isFr = lang === 'fr';

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!confirmed) return;
    const tId = window.setTimeout(() => setConfirmed(null), 2500);
    return () => window.clearTimeout(tId);
  }, [confirmed]);

  // Shared verification logic — takes the pin value explicitly so it can be
  // called the instant the 4th digit is typed, without waiting on a state
  // round-trip (see handleNumberPress).
  function verifyPin(value: string) {
    if (value.length < 4) {
      setError(isFr ? 'Veuillez entrer un PIN à 4 chiffres.' : 'Please enter a 4-digit PIN.');
      return;
    }
    const emp = state.employees.find(
      (e) => e.status !== 'terminated' && e.allowedCheckInMethods.includes('kiosk') && (e.kioskPin === value || e.credential === value)
    );
    if (!emp) {
      setError(isFr ? 'Code PIN incorrect. Veuillez réessayer.' : 'Invalid PIN. Please check and try again.');
      setPin('');
      return;
    }
    setActiveEmployee(emp);
    setError(null);
  }

  // Handle PIN verification (Verify button / Enter key — reads current state)
  function handleVerify() {
    verifyPin(pin);
  }

  // Handle number pad button click
  function handleNumberPress(num: number) {
    if (pin.length >= 4) return;
    const next = pin + String(num);
    setPin(next);
    setError(null);
    if (next.length === 4) verifyPin(next);
  }

  // Handle Backspace
  function handleBackspace() {
    setPin((prev) => prev.slice(0, -1));
    setError(null);
  }

  // Handle Clear
  function handleClear() {
    setPin('');
    setError(null);
  }

  // Keydown event listener for physical keyboard support
  useEffect(() => {
    if (activeEmployee || confirmed) return;
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
  }, [pin, activeEmployee, confirmed]);

  // Trigger clock action from option modal
  function handleClockAction(action: 'in' | 'out') {
    if (!activeEmployee) return;
    const employeeId = activeEmployee.id;
    if (action === 'out') {
      clockOut(employeeId);
      setConfirmed({ name: activeEmployee.firstName, action: 'out' });
    } else {
      const workLocationId = activeEmployee.workLocationId ?? state.settings.workLocations[0]?.id ?? '';
      clockIn(employeeId, 'kiosk', workLocationId);
      setConfirmed({ name: activeEmployee.firstName, action: 'in' });
    }
    setActiveEmployee(null);
    setPin('');
  }

  // Compute greetings based on hours
  const hour = now.getHours();
  const greeting =
    hour < 12
      ? t('goodMorning')
      : hour < 18
      ? (isFr ? 'Bon Après-midi' : 'Good Afternoon')
      : (isFr ? 'Bonsoir' : 'Good Evening');

  const timeString = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
  const timeMain = timeString.replace(/ (AM|PM)/, '');
  const timeSuffix = timeString.slice(-2);

  return (
    <div className="kiosk-container">
      {confirmed ? (
        <div 
          style={{ 
            background: 'rgba(12, 28, 44, 0.75)', 
            backdropFilter: 'blur(20px)', 
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 24, 
            padding: '3rem', 
            textAlign: 'center', 
            boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
            width: '100%',
            maxWidth: 440,
            boxSizing: 'border-box',
            animation: 'fadeInUp 0.3s ease-out'
          }}
        >
          <CheckCircle2 size={56} color="var(--success)" style={{ marginBottom: '1.25rem', margin: '0 auto 1.25rem' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: '#fff' }}>
            {confirmed.name}, {isFr ? "vous êtes enregistré !" : "you're clocked " + (confirmed.action === 'in' ? 'in' : 'out') + "!"}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>
            {confirmed.action === 'in' 
              ? (isFr ? 'Passez une bonne journée de travail.' : 'Have a great shift.') 
              : (isFr ? 'Reposez-vous bien.' : 'Have a great rest.')}
          </p>
        </div>
      ) : activeEmployee ? (
        <div 
          style={{ 
            background: 'rgba(12, 28, 44, 0.75)', 
            backdropFilter: 'blur(20px)', 
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 24, 
            padding: '2.5rem 3rem', 
            textAlign: 'center', 
            boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
            width: '100%',
            maxWidth: 440,
            boxSizing: 'border-box',
            animation: 'fadeInUp 0.3s ease-out'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <Avatar src={activeEmployee.avatarUrl} name={`${activeEmployee.firstName} ${activeEmployee.lastName}`} size={72} />
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.25rem', color: '#fff' }}>
                {activeEmployee.firstName} {activeEmployee.lastName}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', fontWeight: 600 }}>
                {activeEmployee.role.toUpperCase()} · {activeEmployee.department}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button
              type="button"
              onClick={() => handleClockAction('in')}
              className="btn"
              style={{
                width: '100%',
                background: 'var(--success)',
                color: '#fff',
                padding: '1.1rem',
                borderRadius: '14px',
                fontSize: '1.05rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(39, 201, 63, 0.25)'
              }}
            >
              <LogIn size={18} /> {isFr ? 'ENREGISTRER ENTRÉE' : 'CLOCK IN'}
            </button>

            <button
              type="button"
              onClick={() => handleClockAction('out')}
              className="btn"
              style={{
                width: '100%',
                background: 'var(--chronix-navy)',
                color: '#fff',
                padding: '1.1rem',
                borderRadius: '14px',
                fontSize: '1.05rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                cursor: 'pointer',
              }}
            >
              <LogOut size={18} /> {isFr ? 'ENREGISTRER SORTIE' : 'CLOCK OUT'}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveEmployee(null);
                setPin('');
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.5)',
                marginTop: '1rem',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              {isFr ? 'Annuler' : 'Cancel'}
            </button>
          </div>
        </div>
      ) : (
        <div className="kiosk-layout-grid">
          {/* Left Column: Greeting copy */}
          <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <img src={logoWhite} alt="Chronix" onClick={() => navigate('/')} style={{ height: '36px', width: 'auto', objectFit: 'contain', margin: '0 0 2rem', cursor: 'pointer', display: 'block' }} />

            <div style={{ width: '40px', height: '4px', background: 'var(--chronix-amber)', borderRadius: '2px', marginBottom: '1rem' }} />
            
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 800, color: '#fff', lineHeight: 1.1, marginBottom: '0.5rem', letterSpacing: '-1.5px' }}>
              {greeting}
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '3rem', fontWeight: 500 }}>
              {isFr ? 'Bienvenue chez Chronix Business' : 'Welcome to Chronix Business'}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.92rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', marginBottom: '3.5rem' }}>
              <Lock size={18} style={{ color: 'var(--chronix-amber)' }} />
              <span>{isFr ? 'Entrez votre PIN pour continuer' : 'Enter your PIN to continue'}</span>
            </div>

            {/* Info Badge */}
            <div style={{ display: 'flex', gap: '0.75rem', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '1rem 1.25rem', maxWidth: '340px', boxSizing: 'border-box' }}>
              <Info size={18} style={{ color: 'var(--chronix-amber)', flexShrink: 0, marginTop: '2px' }} />
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.5, textAlign: 'left' }}>
                {isFr ? (
                  <>Après vérification du PIN, vos options de <span style={{ color: 'var(--chronix-amber)', fontWeight: 700 }}>Clock In</span> et <span style={{ color: 'var(--chronix-amber)', fontWeight: 700 }}>Clock Out</span> apparaîtront.</>
                ) : (
                  <>After PIN verification, your <span style={{ color: 'var(--chronix-amber)', fontWeight: 700 }}>Clock In</span> and <span style={{ color: 'var(--chronix-amber)', fontWeight: 700 }}>Clock Out</span> options will appear.</>
                )}
              </p>
            </div>
          </div>

          {/* Center Column: Keypad Panel */}
          <div 
            style={{ 
              background: 'rgba(12, 28, 44, 0.65)', 
              backdropFilter: 'blur(16px)', 
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              padding: '2rem',
              boxShadow: '0 30px 60px rgba(0, 0, 0, 0.4)',
              width: '100%',
              maxWidth: '360px',
              margin: '0 auto',
              boxSizing: 'border-box'
            }}
          >
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.8)', marginBottom: '1.25rem' }}>
              {isFr ? <>Entrez votre <span style={{ color: 'var(--chronix-amber)', fontWeight: 700 }}>Code PIN à 4 chiffres</span></> : <>Enter your <span style={{ color: 'var(--chronix-amber)', fontWeight: 700 }}>4-digit PIN</span></>}
            </p>

            {/* Error Message */}
            {error && (
              <div style={{ color: 'var(--danger)', fontSize: '0.82rem', fontWeight: 600, marginBottom: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.5rem', borderRadius: '8px' }}>
                {error}
              </div>
            )}

            {/* Pin dots */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`kiosk-dot-indicator ${pin.length > i ? 'kiosk-dot-indicator--filled' : ''}`}
                >
                  {pin.length > i && (
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--chronix-amber)' }} />
                  )}
                </div>
              ))}
            </div>

            {/* Keypad */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleNumberPress(num)}
                  className="kiosk-keypad-btn"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={handleBackspace}
                className="kiosk-keypad-btn"
              >
                <Delete size={22} />
              </button>
              <button
                type="button"
                onClick={() => handleNumberPress(0)}
                className="kiosk-keypad-btn"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="kiosk-keypad-btn"
                style={{ fontSize: '1rem' }}
              >
                Clear
              </button>
            </div>

            {/* Verify Button */}
            <button
              type="button"
              onClick={handleVerify}
              style={{
                width: '100%',
                background: 'linear-gradient(to right, #ffb300, #ff8f00)',
                border: 'none',
                borderRadius: '16px',
                color: 'var(--chronix-navy)',
                padding: '1rem',
                fontSize: '1.05rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 8px 24px rgba(255, 179, 0, 0.25)',
                transition: 'all 0.2s',
              }}
            >
              {isFr ? 'Vérifier PIN' : 'Verify PIN'} <ArrowRight size={18} />
            </button>
          </div>

          {/* Right Column: Dynamic Live Clock */}
          <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', borderLeft: '1px solid rgba(255,255,255,0.08)', paddingLeft: '3.5rem' }} className="kiosk-clock-col">
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255, 210, 0, 0.08)', border: '1px solid rgba(255, 210, 0, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--chronix-amber)', marginBottom: '1.5rem' }}>
              <Fingerprint size={20} />
            </div>

            <div style={{ fontSize: '4.5rem', fontWeight: 850, color: '#fff', letterSpacing: '-2px', lineHeight: 1, marginBottom: '0.5rem' }}>
              {timeMain}
              <span style={{ fontSize: '1.75rem', color: 'var(--chronix-amber)', marginLeft: '6px', fontWeight: 800, verticalAlign: 'super' }}>{timeSuffix}</span>
            </div>

            <div style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
              {now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
