import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, User, Fingerprint } from 'lucide-react';
import { useLiveClock } from '../../hooks/useLiveClock';

export function LiveClockPreview() {
  const now = useLiveClock(1000);
  const navigate = useNavigate();
  const [clockedIn, setClockedIn] = useState(false);

  function handleClockIn() {
    if (clockedIn) return;
    setClockedIn(true);
    setTimeout(() => navigate('/login'), 700);
  }

  const timeString = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
  const timeMain = timeString.replace(/ (AM|PM)/, '');
  const timeSuffix = timeString.slice(-2);

  return (
    <div className="live-clock-preview">
      {/* Time Clock Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--chronix-navy)' }}>Chronix</span>
        </div>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Time Clock</span>
      </div>

      {/* Welcome Box */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(39, 201, 63, 0.08)', border: '1px solid rgba(39, 201, 63, 0.2)', borderRadius: '12px', padding: '0.75rem 1rem', marginBottom: '1.25rem' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(39, 201, 63, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#27c93f', flexShrink: 0 }}>
          <User size={18} />
        </div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--chronix-navy)', fontWeight: 700 }}>Welcome back</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            {clockedIn ? 'Clocking in…' : 'Ready to clock in'}
          </div>
        </div>
      </div>

      {/* Clock Time */}
      <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--chronix-navy)', letterSpacing: '-1px', margin: '1rem 0 0.25rem', textAlign: 'left' }}>
        {timeMain}
        <span style={{ fontSize: '1rem', marginLeft: '4px', fontWeight: 700 }}>{timeSuffix}</span>
      </div>
      
      {/* Date */}
      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontWeight: 500, textAlign: 'left' }}>
        {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
      </div>

      {/* Clock Button */}
      <button
        type="button"
        className="btn"
        style={{ width: '100%', background: 'var(--success)', color: '#fff', padding: '0.8rem 1rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', border: 'none', cursor: 'pointer', opacity: clockedIn ? 0.8 : 1 }}
        onClick={handleClockIn}
      >
        {clockedIn ? (
          <>
            <Check size={16} /> CLOCKED IN
          </>
        ) : (
          <>
            <Fingerprint size={16} /> CLOCK IN
          </>
        )}
      </button>
    </div>
  );
}
