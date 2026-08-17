import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  CheckCircle2,
  Lock,
  Unlock,
  Clock,
  Search,
  RefreshCw,
  ArrowLeft,
} from 'lucide-react';
import logo from '../../assets/chronix_logo.png';
import type { PlanType } from '../../types';

interface SuperAdminBizInfo {
  id: string;
  companyName: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  employeeCount: number;
  plan: PlanType;
  trialStartedAt: string | null;
  trialCancelled: boolean;
  isLocked: boolean;
  billingStatus: 'none' | 'awaiting_confirmation' | 'confirmed';
  paymentMethod: string | null;
  paymentReference: string | null;
  joinedAt: string | null;
}



export function SuperAdminPage() {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState<SuperAdminBizInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'trialing' | 'locked' | 'confirmed'>('all');
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [saKey, setSaKey] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return window.sessionStorage.getItem('chronix_sa_key');
    }
    return null;
  });
  const [authError, setAuthError] = useState(false);

  const fetchBusinesses = async (key: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/super-admin/businesses', {
        headers: { 'x-super-admin-key': key },
      });
      if (res.status === 403) {
        setAuthError(true);
        setLoading(false);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setBusinesses(data);
        setAuthError(false);
      }
    } catch (err) {
      console.error('Failed to fetch businesses for Super Admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!saKey) {
      const entered = window.prompt('Enter the Super Admin Access Key:');
      if (!entered) {
        navigate('/');
        return;
      }
      window.sessionStorage.setItem('chronix_sa_key', entered);
      setSaKey(entered);
      fetchBusinesses(entered);
    } else {
      fetchBusinesses(saKey);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleUpdateStatus = async (
    businessId: string,
    updates: Partial<{ isLocked: boolean; trialCancelled: boolean; plan: PlanType; billingStatus: string }>
  ) => {
    if (!saKey) return;
    try {
      const res = await fetch(`/api/super-admin/business/${businessId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-super-admin-key': saKey },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        setActionMessage('Company status updated successfully!');
        setTimeout(() => setActionMessage(null), 3000);
        fetchBusinesses(saKey);
      }
    } catch (err) {
      console.error('Failed to update company status:', err);
    }
  };

  const filteredBusinesses = useMemo(() => {
    return businesses.filter((b) => {
      const matchesSearch =
        b.companyName.toLowerCase().includes(search.toLowerCase()) ||
        b.ownerName.toLowerCase().includes(search.toLowerCase()) ||
        b.ownerEmail.toLowerCase().includes(search.toLowerCase()) ||
        b.ownerPhone.includes(search);

      if (!matchesSearch) return false;

      if (filter === 'locked') return b.isLocked;
      if (filter === 'trialing') return !b.trialCancelled && b.billingStatus !== 'confirmed';
      if (filter === 'confirmed') return b.billingStatus === 'confirmed';
      return true;
    });
  }, [businesses, search, filter]);

  const stats = useMemo(() => {
    return {
      total: businesses.length,
      locked: businesses.filter((b) => b.isLocked).length,
      confirmed: businesses.filter((b) => b.billingStatus === 'confirmed').length,
      awaiting: businesses.filter((b) => b.billingStatus === 'awaiting_confirmation').length,
    };
  }, [businesses]);

  if (authError) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-page)' }}>
        <div className="card" style={{ maxWidth: 420, textAlign: 'center', padding: '2.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--danger)' }}>Access Denied</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Invalid Super Admin key. You are not authorized to view this page.</p>
          <button className="btn btn-primary-navy" onClick={() => { window.sessionStorage.removeItem('chronix_sa_key'); setSaKey(null); setAuthError(false); navigate('/'); }}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', padding: '2rem 5%' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <img src={logo} alt="Chronix" style={{ height: 36, objectFit: 'contain' }} />
              <span className="status-badge status-badge--pending" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1 }}>
                Super Admin Portal
              </span>
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--chronix-navy)', margin: 0 }}>
              Company Access & Platform Control
            </h1>
          </div>
          <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ArrowLeft size={16} /> Exit to Admin Portal
          </button>
        </div>

        {actionMessage && (
          <div style={{ background: 'var(--success-bg)', border: '1px solid var(--success)', color: 'var(--success)', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} /> {actionMessage}
          </div>
        )}

        {/* Metrics Grid */}
        <div className="responsive-grid-1-1-1-1" style={{ marginBottom: '2rem' }}>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(12, 28, 44, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--chronix-navy)' }}>
              <Building2 size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Companies</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{stats.total}</div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Paid & Confirmed</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{stats.confirmed}</div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--warning-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b7791f' }}>
              <Clock size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Awaiting Payment</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{stats.awaiting}</div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}>
              <Lock size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Locked / Suspended</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{stats.locked}</div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', flex: '1 1 300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search company, owner name, email or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`btn ${filter === 'all' ? 'btn-primary-navy' : 'btn-outline'}`}
              onClick={() => setFilter('all')}
            >
              All Companies
            </button>
            <button
              type="button"
              className={`btn ${filter === 'confirmed' ? 'btn-primary-navy' : 'btn-outline'}`}
              onClick={() => setFilter('confirmed')}
            >
              Confirmed Paid
            </button>
            <button
              type="button"
              className={`btn ${filter === 'trialing' ? 'btn-primary-navy' : 'btn-outline'}`}
              onClick={() => setFilter('trialing')}
            >
              Trialing
            </button>
            <button
              type="button"
              className={`btn ${filter === 'locked' ? 'btn-primary-navy' : 'btn-outline'}`}
              onClick={() => setFilter('locked')}
            >
              Locked
            </button>
            <button type="button" className="btn btn-outline" onClick={() => saKey && fetchBusinesses(saKey)} title="Refresh">
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading registered companies...</div>
          ) : filteredBusinesses.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No companies found matching criteria.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-page)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '1rem' }}>Company</th>
                    <th style={{ padding: '1rem' }}>Owner / Contact</th>
                    <th style={{ padding: '1rem' }}>Plan</th>
                    <th style={{ padding: '1rem' }}>Status</th>
                    <th style={{ padding: '1rem' }}>Employees</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBusinesses.map((biz) => {
                    return (
                      <tr key={biz.id} style={{ borderBottom: '1px solid var(--border)', background: biz.isLocked ? 'rgba(239, 68, 68, 0.03)' : 'transparent' }}>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ fontWeight: 700, fontSize: '1rem' }}>{biz.companyName}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>ID: {biz.id}</div>
                        </td>

                        <td style={{ padding: '1rem' }}>
                          <div style={{ fontWeight: 600 }}>{biz.ownerName}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{biz.ownerEmail}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{biz.ownerPhone}</div>
                        </td>

                        <td style={{ padding: '1rem' }}>
                          <select
                            className="form-select"
                            style={{ padding: '0.35rem 0.5rem', fontSize: '0.85rem' }}
                            value={biz.plan || 'starter'}
                            onChange={(e) => handleUpdateStatus(biz.id, { plan: e.target.value as PlanType })}
                          >
                            <option value="starter">Starter (MUR 1,500)</option>
                            <option value="silver">Silver (MUR 2,500)</option>
                            <option value="gold">Gold (MUR 4,000)</option>
                            <option value="platinum">Platinum (MUR 6,000)</option>
                            <option value="platinum_plus">Platinum Plus (MUR 8,500)</option>
                            <option value="diamond">Diamond (MUR 12,000)</option>
                          </select>
                        </td>

                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'flex-start' }}>
                            {biz.isLocked ? (
                              <span className="status-badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)' }}>
                                🔒 Locked
                              </span>
                            ) : biz.billingStatus === 'confirmed' ? (
                              <span className="status-badge status-badge--approved">
                                ✓ Paid Access
                              </span>
                            ) : biz.billingStatus === 'awaiting_confirmation' ? (
                              <span className="status-badge status-badge--pending">
                                ⏳ Payment Pending ({biz.paymentReference || 'N/A'})
                              </span>
                            ) : biz.trialCancelled ? (
                              <span className="status-badge" style={{ background: '#f3f4f6', color: '#6b7280' }}>
                                Trial Expired
                              </span>
                            ) : (
                              <span className="status-badge status-badge--in_review">
                                🎁 Free Trial Active
                              </span>
                            )}
                          </div>
                        </td>

                        <td style={{ padding: '1rem', fontWeight: 700 }}>
                          {biz.employeeCount} staff
                        </td>

                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                            {biz.isLocked ? (
                              <button
                                type="button"
                                className="btn btn-primary-amber"
                                style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                                onClick={() => handleUpdateStatus(biz.id, { isLocked: false, billingStatus: 'confirmed' })}
                              >
                                <Unlock size={14} /> Unlock Access
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="btn btn-outline"
                                style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}
                                onClick={() => handleUpdateStatus(biz.id, { isLocked: true })}
                              >
                                <Lock size={14} /> Lock Access
                              </button>
                            )}

                            {biz.billingStatus !== 'confirmed' ? (
                              <button
                                type="button"
                                className="btn btn-primary-navy"
                                style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                                onClick={() => handleUpdateStatus(biz.id, { billingStatus: 'confirmed', isLocked: false })}
                              >
                                Grant Full Access
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="btn btn-outline"
                                style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                                onClick={() => handleUpdateStatus(biz.id, { billingStatus: 'none', trialCancelled: true })}
                              >
                                End Paid Access
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
