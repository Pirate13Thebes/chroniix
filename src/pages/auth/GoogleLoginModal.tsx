import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, ArrowLeft, X } from 'lucide-react';
import { useSession } from '../../hooks/useSession';
import { useLanguage } from '../../hooks/useLanguage';
import type { Employee } from '../../types';
import type { SessionView } from '../../types/session';

interface GoogleLoginModalProps {
  onClose: () => void;
}

const googleTranslations = {
  en: {
    chooseAccount: 'Choose an account',
    toContinue: 'to continue to Chronix',
    searchPlaceholder: 'Search accounts...',
    useAnotherAccount: 'Use another account',
    footerText: "To continue, Google will share your name, email address, language preference, and profile picture with Chronix. See Chronix's Privacy Policy and Terms of Service.",
    signingIn: 'Signing in...',
    enterEmailTitle: 'Sign in with Google',
    enterEmailSub: 'Use your Chronix email account',
    emailPlaceholder: 'Email address',
    next: 'Next',
    back: 'Back',
    userNotFound: 'Email not registered on Chronix.',
  },
  fr: {
    chooseAccount: 'Choisissez un compte',
    toContinue: 'pour continuer vers Chronix',
    searchPlaceholder: 'Rechercher des comptes...',
    useAnotherAccount: 'Utiliser un autre compte',
    footerText: "Pour continuer, Google partagera votre nom, votre adresse e-mail, votre préférence linguistique et votre photo de profil avec Chronix. Consultez la Politique de confidentialité et les Conditions d'utilisation de Chronix.",
    signingIn: 'Connexion en cours...',
    enterEmailTitle: 'Connexion avec Google',
    enterEmailSub: 'Utilisez votre compte e-mail Chronix',
    emailPlaceholder: 'Adresse e-mail',
    next: 'Suivant',
    back: 'Retour',
    userNotFound: 'E-mail non enregistré sur Chronix.',
  },
} as const;

export function GoogleLoginModal({ onClose }: GoogleLoginModalProps) {
  const navigate = useNavigate();
  const { loginAs } = useSession();
  const { lang } = useLanguage();

  const gt = googleTranslations[lang === 'fr' ? 'fr' : 'en'];

  // Component states
  const [searchQuery, setSearchQuery] = useState('');
  const [signingInUser, setSigningInUser] = useState<Employee | null>(null);
  const [view, setView] = useState<'chooser' | 'another'>('chooser');
  const [customEmail, setCustomEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [employees, setEmployees] = useState<{ emp: Employee; businessId: string }[]>([]);

  useEffect(() => {
    async function loadAdmins() {
      try {
        const response = await fetch('/api/auth/google-admins');
        if (response.ok) {
          const data = await response.json();
          setEmployees(data);
        }
      } catch (err) {
        console.error('Failed to load admins for Google login modal:', err);
      }
    }
    loadAdmins();
  }, []);

  // Filter employees based on search query
  const filteredEmployees = employees.filter(({ emp }) => {
    const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
    const email = emp.email.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || email.includes(query);
  });

  const handleSelectUser = (emp: Employee, businessId: string) => {
    setSigningInUser(emp);
    setTimeout(() => {
      const targetView: SessionView = ['admin', 'hr', 'supervisor'].includes(emp.role) ? 'admin' : 'employee';
      loginAs(targetView, emp, businessId);
      navigate(targetView === 'admin' ? '/admin' : '/employee');
    }, 1200);
  };

  const handleCustomEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = customEmail.trim().toLowerCase();
    if (!trimmedEmail) return;

    // Only ever sign in to an existing admin account — Google is a quick
    // access convenience for business owners, not a way to mint new accounts
    // or reach employee accounts. New businesses go through /signup.
    const match = employees.find(({ emp }) => emp.email.toLowerCase() === trimmedEmail);
    if (match) {
      setEmailError('');
      handleSelectUser(match.emp, match.businessId);
      return;
    }

    setEmailError(gt.userNotFound);
  };

  const getRoleColor = (role: Employee['role']) => {
    switch (role) {
      case 'admin':
        return { bg: 'var(--warning-bg)', text: '#b7791f' };
      case 'hr':
        return { bg: 'var(--info-bg)', text: 'var(--info)' };
      case 'supervisor':
        return { bg: 'var(--success-bg)', text: 'var(--success)' };
      default:
        return { bg: '#f3f4f6', text: '#4b5563' };
    }
  };

  const getRoleLabel = (role: Employee['role']) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'hr':
        return 'HR';
      case 'supervisor':
        return lang === 'fr' ? 'Superviseur' : 'Supervisor';
      default:
        return lang === 'fr' ? 'Employé' : 'Employee';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(25, 58, 91, 0.4)', // tint overlay with brand navy
        backdropFilter: 'blur(4px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #dadce0',
          width: '420px',
          maxWidth: '90%',
          minHeight: '480px',
          padding: '36px 40px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          color: '#202124',
          boxSizing: 'border-box',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#5f6368',
            padding: '4px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f1f3f4';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <X size={20} />
        </button>

        {/* Loading overlay for the modal content */}
        {signingInUser ? (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '40px 0',
            }}
          >
            {/* Google-like loading spinner */}
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #4285F4',
                animation: 'spin 1s linear infinite',
                marginBottom: '20px',
              }}
            />
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
            <h3 style={{ fontSize: '16px', fontWeight: 500, margin: '0 0 8px 0' }}>{gt.signingIn}</h3>
            <p style={{ fontSize: '13px', color: '#5f6368', margin: 0 }}>
              {signingInUser.firstName} {signingInUser.lastName} ({signingInUser.email})
            </p>
          </div>
        ) : (
          <>
            {/* Header: Google branding */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    fill="#EA4335"
                  />
                </svg>
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 400, margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
                {view === 'chooser' ? gt.chooseAccount : gt.enterEmailTitle}
              </h2>
              <p style={{ fontSize: '15px', color: '#5f6368', margin: 0 }}>
                {view === 'chooser' ? gt.toContinue : gt.enterEmailSub}
              </p>
            </div>

            {view === 'chooser' ? (
              // CHOOSER VIEW
              <>
                {/* Search Bar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #dadce0',
                    borderRadius: '4px',
                    padding: '8px 12px',
                    marginBottom: '16px',
                  }}
                >
                  <Search size={16} style={{ color: '#5f6368', marginRight: '8px' }} />
                  <input
                    type="text"
                    placeholder={gt.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      border: 'none',
                      outline: 'none',
                      flex: 1,
                      fontSize: '14px',
                      color: '#202124',
                    }}
                  />
                </div>

                {/* Account List */}
                <div
                  style={{
                    borderTop: '1px solid #dadce0',
                    borderBottom: '1px solid #dadce0',
                    maxHeight: '260px',
                    overflowY: 'auto',
                    margin: '0 -40px 16px -40px',
                    padding: '0 40px',
                  }}
                  className="google-account-list"
                >
                  {filteredEmployees.map(({ emp, businessId }) => {
                    const colors = getRoleColor(emp.role);
                    return (
                      <div
                        key={emp.id}
                        onClick={() => handleSelectUser(emp, businessId)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '12px 8px',
                          cursor: 'pointer',
                          borderRadius: '4px',
                          margin: '4px 0',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f8f9fa';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <img
                          src={emp.avatarUrl}
                          alt={emp.firstName}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            marginRight: '12px',
                            objectFit: 'cover',
                            border: '1px solid #e8eaed',
                          }}
                        />
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                          <span style={{ fontSize: '14px', fontWeight: 500, color: '#3c4043' }}>
                            {emp.firstName} {emp.lastName}
                          </span>
                          <span style={{ fontSize: '12px', color: '#5f6368' }}>{emp.email}</span>
                        </div>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: colors.bg,
                            color: colors.text,
                            marginLeft: '8px',
                          }}
                        >
                          {getRoleLabel(emp.role)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Use another account option */}
                <div
                  onClick={() => setView('another')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 8px',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    marginBottom: '20px',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      marginRight: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#f1f3f4',
                      color: '#5f6368',
                    }}
                  >
                    <UserPlus size={16} />
                  </div>
                  <div style={{ flex: 1, display: 'flex', textAlign: 'left' }}>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#1a73e8' }}>
                      {gt.useAnotherAccount}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              // ENTER EMAIL VIEW
              <form onSubmit={handleCustomEmailSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '24px', textAlign: 'left' }}>
                  <input
                    type="email"
                    required
                    placeholder={gt.emailPlaceholder}
                    value={customEmail}
                    onChange={(e) => {
                      setCustomEmail(e.target.value);
                      setEmailError('');
                    }}
                    style={{
                      width: '100%',
                      padding: '14px 12px',
                      fontSize: '15px',
                      border: emailError ? '1px solid #d93025' : '1px solid #dadce0',
                      borderRadius: '4px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => {
                      if (!emailError) e.currentTarget.style.borderColor = '#1a73e8';
                    }}
                    onBlur={(e) => {
                      if (!emailError) e.currentTarget.style.borderColor = '#dadce0';
                    }}
                  />
                  {emailError && (
                    <div style={{ color: '#d93025', fontSize: '12px', marginTop: '6px', display: 'flex', alignItems: 'center' }}>
                      {emailError}
                    </div>
                  )}
                </div>

                {/* Back / Next buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', marginBottom: '20px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setView('chooser');
                      setEmailError('');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: 'transparent',
                      border: 'none',
                      color: '#1a73e8',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      padding: '8px 12px',
                      borderRadius: '4px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f4f8fe';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <ArrowLeft size={16} style={{ marginRight: '6px' }} />
                    {gt.back}
                  </button>
                  <button
                    type="submit"
                    style={{
                      background: '#1a73e8',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '10px 24px',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#1557b0';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#1a73e8';
                    }}
                  >
                    {gt.next}
                  </button>
                </div>
              </form>
            )}

            {/* Footer terms */}
            <p
              style={{
                fontSize: '11px',
                lineHeight: '1.4',
                color: '#5f6368',
                margin: 0,
                textAlign: 'left',
                borderTop: view === 'another' ? '1px solid #f1f3f4' : 'none',
                paddingTop: view === 'another' ? '16px' : '0',
              }}
            >
              {gt.footerText}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
