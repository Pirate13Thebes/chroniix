import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, Settings } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { ADMIN_SETTINGS_SECTIONS } from '../../data/settingsSections';

// The admin topbar search used to be a decorative input with no state or
// handler at all — typing into it did nothing. This wires it to actually
// search employees and settings sections, with a real results dropdown.
export function GlobalSearch() {
  const { state } = useStore();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const q = query.trim().toLowerCase();
  const employeeMatches = q
    ? state.employees.filter((e) => `${e.firstName} ${e.lastName} ${e.email} ${e.department}`.toLowerCase().includes(q)).slice(0, 5)
    : [];
  const settingsMatches = q
    ? ADMIN_SETTINGS_SECTIONS.filter((s) => s.title.toLowerCase().includes(q)).slice(0, 5)
    : [];
  const hasResults = employeeMatches.length > 0 || settingsMatches.length > 0;

  function goToEmployee() {
    setOpen(false);
    setQuery('');
    navigate('/admin/attendance');
  }

  function goToSettings(id: string) {
    setOpen(false);
    setQuery('');
    navigate(`/admin/settings/${id}`);
  }

  return (
    <div style={{ position: 'relative', flex: 1, maxWidth: 420 }}>
      <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
      <input
        className="form-input"
        style={{ paddingLeft: '2.25rem' }}
        placeholder="Search people, reports, or settings…"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      />

      {open && q && (
        <div
          style={{
            position: 'absolute',
            top: '110%',
            left: 0,
            right: 0,
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--card-radius)',
            boxShadow: 'var(--card-shadow-hover)',
            zIndex: 200,
            maxHeight: 340,
            overflowY: 'auto',
          }}
        >
          {!hasResults && <div className="empty-state" style={{ padding: '1rem' }}>No matches for "{query}".</div>}

          {employeeMatches.length > 0 && (
            <div>
              <div style={{ padding: '0.5rem 1rem', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>People</div>
              {employeeMatches.map((emp) => (
                <button
                  key={emp.id}
                  type="button"
                  onMouseDown={goToEmployee}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', width: '100%', textAlign: 'left', padding: '0.6rem 1rem', background: 'transparent', border: 'none', cursor: 'pointer' }}
                >
                  <User size={14} color="var(--text-secondary)" />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{emp.firstName} {emp.lastName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{emp.department || emp.role} · {emp.email}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {settingsMatches.length > 0 && (
            <div>
              <div style={{ padding: '0.5rem 1rem', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Settings</div>
              {settingsMatches.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onMouseDown={() => goToSettings(s.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', width: '100%', textAlign: 'left', padding: '0.6rem 1rem', background: 'transparent', border: 'none', cursor: 'pointer' }}
                >
                  <Settings size={14} color="var(--text-secondary)" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{s.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
