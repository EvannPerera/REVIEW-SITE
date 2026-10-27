import React, { useState } from 'react';
import { Shield, FileCheck, Lock, X } from 'lucide-react';

interface FooterProps {
  onNavigateToSection: (sectionId: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateToSection,
  onOpenAdmin,
}) => {
  const currentYear = new Date().getFullYear();
  const [modalType, setModalType] = useState<'privacy' | 'guidelines' | null>(null);

  return (
    <footer
      style={{
        position: 'relative',
        backgroundColor: '#030303',
        borderTop: '1px solid rgba(255, 23, 68, 0.15)',
        padding: '3.5rem 0 2rem',
        zIndex: 2,
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '2.5rem',
            paddingBottom: '2.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          {/* Brand Info */}
          <div style={{ maxWidth: '380px' }}>
            <div
              className="text-3d-brand"
              style={{
                fontFamily: 'var(--font-brand)',
                fontWeight: 900,
                fontSize: '1.45rem',
                letterSpacing: '-0.01em',
                color: '#FFFFFF',
                marginBottom: '0.75rem',
              }}
            >
              Évann<span style={{ color: 'var(--red-accent)' }}>_</span>stories
            </div>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.88rem',
                lineHeight: 1.6,
              }}
            >
              The premier cinematic customer review and transaction verification platform.
              Uncompromising authenticity, transparent moderation, and audited satisfaction.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-tech)',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--red-accent)',
                marginBottom: '1rem',
              }}
            >
              Navigation
            </h4>
            <ul
              style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
                fontSize: '0.88rem',
                fontFamily: 'var(--font-tech)',
                color: 'var(--text-secondary)',
              }}
            >
              <li>
                <button
                  onClick={() => onNavigateToSection('hero')}
                  style={footerLinkStyle}
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToSection('review-overview')}
                  style={footerLinkStyle}
                >
                  Overview & Stats
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToSection('reviews-list')}
                  style={footerLinkStyle}
                >
                  Client Reviews
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToSection('submit-review')}
                  style={footerLinkStyle}
                >
                  Submit a Review
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToSection('trust-process')}
                  style={footerLinkStyle}
                >
                  Trust & Verification
                </button>
              </li>
            </ul>
          </div>

          {/* Legal / Policy Links */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-tech)',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--red-accent)',
                marginBottom: '1rem',
              }}
            >
              Policies & Legal
            </h4>
            <ul
              style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
                fontSize: '0.88rem',
                fontFamily: 'var(--font-tech)',
                color: 'var(--text-secondary)',
              }}
            >
              <li>
                <button
                  onClick={() => setModalType('privacy')}
                  style={footerLinkStyle}
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setModalType('guidelines')}
                  style={footerLinkStyle}
                >
                  Review Guidelines
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  style={{
                    ...footerLinkStyle,
                    color: 'var(--red-accent)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Shield size={12} />
                  <span>Admin Verification Portal</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            paddingTop: '1.5rem',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-tech)',
          }}
        >
          <div>
            © {currentYear} ÉVANN_STORIES. All rights reserved.
          </div>
          <div>
            Designed with cinematic excellence. Non-commercial gaming transaction verification.
          </div>
        </div>
      </div>

      {/* Policy Modals */}
      {modalType && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setModalType(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(5, 5, 5, 0.88)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            zIndex: 110,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass-panel"
            style={{
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
              padding: '2rem',
              position: 'relative',
              border: '1px solid rgba(255, 23, 68, 0.35)',
            }}
          >
            <button
              onClick={() => setModalType(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                color: 'var(--text-muted)',
              }}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {modalType === 'privacy' ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                  <Lock size={22} color="var(--red-accent)" />
                  <h3 style={{ fontFamily: 'var(--font-display)', color: '#FFFFFF', fontSize: '1.4rem' }}>
                    Privacy Notice
                  </h3>
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.65, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <p>
                    <strong>1. Private Data Isolation:</strong> Your CODM Account UID and transaction evidence are stored
                    in encrypted database tables protected by PostgreSQL Row Level Security (RLS). Public visitors can never
                    query or view your UID.
                  </p>
                  <p>
                    <strong>2. Public Information:</strong> Only your chosen Customer Display Name, contact platform, star rating,
                    and review narrative are rendered publicly upon approval.
                  </p>
                  <p>
                    <strong>3. Data Retention:</strong> Unapproved or rejected submissions and their associated screenshot files are
                    purged periodically in accordance with our data safety policy.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                  <FileCheck size={22} color="var(--red-accent)" />
                  <h3 style={{ fontFamily: 'var(--font-display)', color: '#FFFFFF', fontSize: '1.4rem' }}>
                    Review Guidelines
                  </h3>
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.65, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <p>
                    <strong>1. Genuine Transactions:</strong> Submissions must relate directly to an actual transaction or service
                    encounter with ÉVANN_STORIES.
                  </p>
                  <p>
                    <strong>2. Civil Language:</strong> Profanity, harassment, hate speech, and spam links are strictly prohibited
                    and will lead to immediate rejection.
                  </p>
                  <p>
                    <strong>3. Verification Protocol:</strong> The "Verified Purchase" badge is applied manually only after the administrator
                    verifies the order against private sales logs.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </footer>
  );
};

const footerLinkStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  color: 'inherit',
  fontFamily: 'inherit',
  fontSize: 'inherit',
  textAlign: 'left',
  transition: 'color 180ms ease',
};
