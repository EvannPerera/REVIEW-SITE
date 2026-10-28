import React from 'react';
import { Shield } from 'lucide-react';
import { useRouter } from '../routes/router';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const currentYear = new Date().getFullYear();
  const { navigate } = useRouter();

  return (
    <footer
      style={{
        position: 'relative',
        backgroundColor: 'var(--bg-elevated)',
        borderTop: '1px solid var(--border-glass)',
        padding: '3.5rem 0 2rem',
        zIndex: 2,
        transition: 'background-color 300ms ease',
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
            borderBottom: '1px solid var(--border-subtle)',
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
                  onClick={() => navigate('home')}
                  style={footerLinkStyle}
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('reviews')}
                  style={footerLinkStyle}
                >
                  Client Reviews
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('home', 'submit-review')}
                  style={footerLinkStyle}
                >
                  Submit a Review
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('about')}
                  style={footerLinkStyle}
                >
                  About Évann
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('socials')}
                  style={footerLinkStyle}
                >
                  My Socials
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
              Policies & Standards
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
                  onClick={() => navigate('about', 'sec-privacy')}
                  style={footerLinkStyle}
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('about', 'sec-verification')}
                  style={footerLinkStyle}
                >
                  Review & Verification Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('about', 'sec-payment')}
                  style={footerLinkStyle}
                >
                  Purchase & Payment Terms
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('about', 'sec-refund')}
                  style={footerLinkStyle}
                >
                  Refund & Cancellation Policy
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
    </footer>
  );
};

const footerLinkStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  padding: 0,
  fontFamily: 'inherit',
  fontSize: 'inherit',
  color: 'inherit',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'color 150ms ease',
};
