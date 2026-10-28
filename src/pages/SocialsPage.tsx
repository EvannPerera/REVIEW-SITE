import React from 'react';
import { SOCIAL_PLATFORMS, SocialPlatformConfig } from '../config/socialLinks';
import { ExternalLink, Sparkles, Share2 } from 'lucide-react';

export const SocialsPage: React.FC = () => {
  const getPlatformIcon = (id: string, color: string) => {
    switch (id) {
      case 'youtube':
        return (
          <svg width="26" height="26" viewBox="0 0 24 24" fill={color}>
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        );
      case 'instagram':
        return (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        );
      case 'discord':
        return (
          <svg width="26" height="26" viewBox="0 0 24 24" fill={color}>
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
          </svg>
        );
      case 'whatsapp':
        return (
          <svg width="26" height="26" viewBox="0 0 24 24" fill={color}>
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm0 1.67c2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.53c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.01-1.24-.74-.66-1.24-1.48-1.39-1.73-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.53.61.19 1.16.17 1.6.1 0 0 .5-.2 1.03-.84.53-.63.53-1.18.37-1.31-.15-.13-.39-.2-.64-.33z" />
          </svg>
        );
      case 'tiktok':
        return (
          <svg width="26" height="26" viewBox="0 0 24 24" fill={color}>
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.89 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.45a6.33 6.33 0 0 0-.79-.05A6.34 6.34 0 0 0 3 15.74a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.08a8.28 8.28 0 0 0 3.91 1.07V6.69z" />
          </svg>
        );
      case 'facebook':
        return (
          <svg width="26" height="26" viewBox="0 0 24 24" fill={color}>
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        );
      case 'telegram':
        return (
          <svg width="26" height="26" viewBox="0 0 24 24" fill={color}>
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.941z" />
          </svg>
        );
      default:
        return <Share2 size={26} color={color} />;
    }
  };

  return (
    <div
      className="socials-page"
      style={{
        paddingTop: '6.5rem',
        paddingBottom: '4.5rem',
        minHeight: '85vh',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div className="container">
        {/* Page Banner Header */}
        <header className="section-header-cinema" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 23, 68, 0.08)',
              border: '1px solid rgba(255, 23, 68, 0.25)',
              marginBottom: '1rem',
            }}
          >
            <Sparkles size={14} color="var(--red-accent)" />
            <span
              style={{
                fontFamily: 'var(--font-tech)',
                fontSize: '0.78rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--red-accent)',
              }}
            >
              Official Verified Destinations
            </span>
          </div>

          <h1
            className="cinema-section-heading"
            style={{
              fontSize: 'clamp(2.4rem, 5.5vw, 4rem)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              marginBottom: '0.75rem',
            }}
          >
            Connect With ÉVANN_STORIES
          </h1>

          <p
            className="cinema-section-subtitle"
            style={{
              maxWidth: '680px',
              margin: '0 auto',
              fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
              lineHeight: 1.65,
            }}
          >
            Access our official gaming channels, community hubs, and direct customer support.
            Always confirm you are interacting with our verified handles.
          </p>
        </header>

        {/* Social Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: '1.5rem',
            marginBottom: '3.5rem',
          }}
        >
          {SOCIAL_PLATFORMS.map((platform: SocialPlatformConfig) => {
            const isPlaceholder = platform.url.includes('[ADD_') || platform.url.includes('placeholder');

            return (
              <a
                key={platform.id}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-panel social-card"
                aria-label={`Open ${platform.name} (${platform.handleOrCommunity}) in a new tab`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: 'clamp(1.2rem, 3.5vw, 1.75rem)',
                  textDecoration: 'none',
                  borderRadius: '14px',
                  border: '1px solid var(--border-glass)',
                  backgroundColor: 'var(--bg-card)',
                  transition: 'all 280ms cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Top Row: Icon + Badge */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <div
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--bg-elevated)',
                        border: `1px solid ${platform.color}44`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 0 15px ${platform.accentGlow}`,
                      }}
                    >
                      {getPlatformIcon(platform.id, platform.color)}
                    </div>

                    {platform.badge && (
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontFamily: 'var(--font-tech)',
                          fontWeight: 600,
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          backgroundColor: 'var(--bg-elevated)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-secondary)',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {platform.badge}
                      </span>
                    )}
                  </div>

                  {/* Platform Name & Handle */}
                  <h2
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.35rem',
                      fontWeight: 600,
                      color: 'var(--heading-color)',
                      marginBottom: '0.35rem',
                    }}
                  >
                    {platform.name}
                  </h2>

                  <div
                    style={{
                      fontSize: '0.85rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--red-accent)',
                      marginBottom: '0.85rem',
                      fontWeight: 500,
                    }}
                  >
                    {platform.handleOrCommunity}
                  </div>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: '0.92rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                      marginBottom: '1.5rem',
                    }}
                  >
                    {platform.description}
                  </p>
                </div>

                {/* Bottom Action Row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--border-subtle)',
                    marginTop: 'auto',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-tech)',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      color: 'var(--heading-color)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>{platform.actionText}</span>
                  </span>

                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--bg-elevated)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--red-accent)',
                      border: '1px solid var(--border-subtle)',
                      transition: 'transform 200ms ease',
                    }}
                    className="card-arrow"
                  >
                    <ExternalLink size={15} />
                  </div>
                </div>

                {/* Configuration notice if placeholder */}
                {isPlaceholder && (
                  <div
                    style={{
                      marginTop: '0.75rem',
                      fontSize: '0.72rem',
                      fontFamily: 'var(--font-mono)',
                      color: '#F59E0B',
                      backgroundColor: 'rgba(245, 158, 11, 0.08)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: '1px dashed rgba(245, 158, 11, 0.3)',
                      textAlign: 'center',
                    }}
                  >
                    ⚠️ Configurable: Replace link in src/config/socialLinks.ts
                  </div>
                )}
              </a>
            );
          })}
        </div>

        {/* Central Configuration Notice Box */}
        <aside
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-glass)',
            borderRadius: '12px',
            padding: '1.5rem 2rem',
            textAlign: 'center',
            maxWidth: '780px',
            margin: '0 auto',
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.1rem',
              fontWeight: 600,
              color: 'var(--heading-color)',
              marginBottom: '0.4rem',
            }}
          >
            Social Link Configuration Notice
          </h3>
          <p
            style={{
              fontSize: '0.88rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            All social destinations are centralized in <code style={{ color: 'var(--red-accent)', fontFamily: 'var(--font-mono)' }}>src/config/socialLinks.ts</code>.
            Update your URLs and handles there to update every link across the site instantaneously.
          </p>
        </aside>
      </div>

      <style>{`
        .social-card:hover {
          transform: translateY(-4px);
          border-color: var(--border-glass-hover) !important;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3), var(--shadow-neon) !important;
        }
        .social-card:hover .card-arrow {
          transform: translateX(2px) translateY(-2px);
          background-color: var(--red-accent) !important;
          color: #FFFFFF !important;
        }
      `}</style>
    </div>
  );
};
