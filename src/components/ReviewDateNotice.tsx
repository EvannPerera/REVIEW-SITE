import React from 'react';
import { Info } from 'lucide-react';

export const ReviewDateNotice: React.FC = () => {
  return (
    <div
      className="review-date-notice"
      role="region"
      aria-label="A Note About Our Review Dates"
      style={{
        maxWidth: '840px',
        margin: '0 auto 2.5rem',
        padding: '1.25rem 1.5rem',
        borderRadius: '12px',
        backgroundColor: 'rgba(18, 18, 22, 0.85)',
        border: '1px solid rgba(255, 215, 0, 0.28)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25), 0 0 15px rgba(255, 215, 0, 0.06)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px',
        textAlign: 'left',
      }}
    >
      {/* Icon Badge */}
      <div
        className="review-date-notice-icon-box"
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          backgroundColor: 'rgba(255, 215, 0, 0.12)',
          border: '1px solid rgba(255, 215, 0, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: '2px',
        }}
      >
        <Info size={19} color="#FFD700" className="review-date-notice-icon" />
      </div>

      {/* Content Container */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Header Title */}
        <h4
          className="review-date-notice-title"
          style={{
            fontFamily: 'var(--font-tech)',
            fontSize: '0.80rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#FFD700',
            margin: '0 0 0.5rem 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>A Note About Our Review Dates</span>
        </h4>

        {/* Informational Paragraphs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <p
            className="review-date-notice-text"
            style={{
              margin: 0,
              fontSize: '0.90rem',
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
            }}
          >
            Évann Stories has been operating since 2020. This website and its public review platform were officially launched in November 2026. After the launch, we invited previous customers who had successfully completed deals with us in the past, as well as recent customers, to share their experiences.
          </p>

          <p
            className="review-date-notice-text"
            style={{
              margin: 0,
              fontSize: '0.90rem',
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
            }}
          >
            Therefore, you may notice several reviews published around similar or recent dates. This is because previous customers were given the opportunity to submit reviews when the platform became available. The review publication date does not necessarily represent the date of the original transaction.
          </p>
        </div>
      </div>
    </div>
  );
};

