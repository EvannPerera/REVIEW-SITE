import React from 'react';
import { ShieldCheck, UserCheck, EyeOff, FileText, CheckCircle } from 'lucide-react';

export const TrustSection: React.FC = () => {
  return (
    <section
      id="trust-process"
      style={{
        position: 'relative',
        padding: '4.5rem 0',
        zIndex: 2,
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-tech)',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--red-accent)',
              display: 'inline-block',
              marginBottom: '0.5rem',
            }}
          >
            Integrity Standard
          </span>
          <h2
            style={{
              fontSize: 'clamp(2rem, 3.8vw, 2.8rem)',
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
            }}
          >
            Verification Protocol & Trust
          </h2>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '1rem',
              maxWidth: '580px',
              margin: '0.5rem auto 0',
            }}
          >
            Transparent moderation guidelines. We believe honesty builds lasting reputations.
          </p>
        </div>

        {/* 3 Pillar Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.75rem',
            marginBottom: '3rem',
          }}
        >
          {/* Pillar 1 */}
          <div
            className="glass-panel"
            style={{
              padding: '2rem 1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 23, 68, 0.1)',
                border: '1px solid rgba(255, 23, 68, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <UserCheck size={24} color="var(--red-accent)" />
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                color: '#FFFFFF',
              }}
            >
              Manual Human Moderation
            </h3>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.92rem',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              No bots or automatic scrapers. Every submission is individually checked by the
              administrator for genuine customer language, absence of hate speech, and spam prevention
              before being granted visibility.
            </p>
          </div>

          {/* Pillar 2 */}
          <div
            className="glass-panel"
            style={{
              padding: '2rem 1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 23, 68, 0.1)',
                border: '1px solid rgba(255, 23, 68, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={24} color="var(--red-accent)" />
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                color: '#FFFFFF',
              }}
            >
              Verified Purchase Badge
            </h3>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.92rem',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              The "Verified Purchase" badge is applied only when the administrator cross-checks the
              client's private CODM UID with recorded transaction receipts. Supplying a UID does not
              automatically award a badge.
            </p>
          </div>

          {/* Pillar 3 */}
          <div
            className="glass-panel"
            style={{
              padding: '2rem 1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 23, 68, 0.1)',
                border: '1px solid rgba(255, 23, 68, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <EyeOff size={24} color="var(--red-accent)" />
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                color: '#FFFFFF',
              }}
            >
              Zero Privacy Exposure
            </h3>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.92rem',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              We never ask for emails, passwords, or phone numbers. Private UIDs and private payment
              evidence are protected behind strict Row Level Security policies and are never delivered
              to public API consumers.
            </p>
          </div>
        </div>

        {/* Clear Policy Notice */}
        <div
          style={{
            backgroundColor: 'rgba(9, 9, 12, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem',
          }}
        >
          <FileText size={20} color="var(--red-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <strong style={{ color: '#FFFFFF' }}>Transparency Notice:</strong> While we perform
            rigorous manual reviews, an online testimonial, username, screenshot, or UID does not
            constitute legal proof of identity. ÉVANN_STORIES maintains strict impartiality and will
            never manufacture false reviews or manipulate community ratings.
          </div>
        </div>
      </div>
    </section>
  );
};
