import React, { useState, useEffect } from 'react';
import { Shield, Menu, X, Star, MessageSquarePlus, Info, Home, Share2, FileText } from 'lucide-react';
import { useRouter, AppRoute } from '../routes/router';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  onOpenAdmin: () => void;
  isAdminLoggedIn?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAdmin,
  isAdminLoggedIn = false,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentRoute, navigate } = useRouter();

  // Compute Base URL compatible with GitHub Pages (/REVIEW-SITE/) and local development
  const rawBase = import.meta.env.BASE_URL || './';
  const baseUrl = rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase;
  const logoSrc = `${baseUrl}/videos/codm.PNG`;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRouteClick = (route: AppRoute, sectionId?: string) => {
    setMobileMenuOpen(false);
    navigate(route, sectionId);
  };

  const navItems: { label: string; route: AppRoute; sectionId?: string; isCTA?: boolean }[] = [
    { label: 'Home', route: 'home' },
    { label: 'Reviews', route: 'reviews' },
    { label: 'Submit Review', route: 'home', sectionId: 'submit-review' },
    { label: 'About Évann', route: 'about' },
    { label: 'My Socials', route: 'socials' },
  ];

  return (
    <header
      role="banner"
      aria-label="Main Navigation"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        backgroundColor: isScrolled ? 'var(--nav-bg)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'none',
        borderBottom: isScrolled
          ? '1px solid var(--border-glass)'
          : '1px solid transparent',
        boxShadow: isScrolled ? 'var(--shadow-subtle)' : 'none',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: isScrolled ? '68px' : '82px',
          transition: 'height 300ms ease',
        }}
      >
        {/* Brand Wordmark & Official COD:M Emblem Logo */}
        <button
          onClick={() => handleRouteClick('home')}
          aria-label="ÉVANN_STORIES Home"
          className="navbar-brand-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 0',
            textAlign: 'left',
          }}
        >
          {/* Official Call of Duty Mobile Logo Emblem */}
          <div
            className="navbar-logo-wrapper"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <img
              src={logoSrc}
              alt="ÉVANN_STORIES Official Logo"
              className="navbar-logo-img"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.endsWith('videos/codm.PNG')) {
                  target.src = './videos/codm.PNG';
                }
              }}
              style={{
                width: '40px',
                height: '40px',
                objectFit: 'contain',
                borderRadius: '8px',
                display: 'block',
                filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.6)) drop-shadow(0 0 10px rgba(255, 23, 68, 0.25))',
                transition: 'transform 200ms ease, filter 200ms ease',
              }}
            />
          </div>

          {/* Clean, Sharp, Professional ÉVANN_STORIES Brand Wordmark */}
          <span className="navbar-brand-name">
            ÉVANN<span className="navbar-brand-accent">_</span>STORIES
          </span>
        </button>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '1.6rem',
          }}
          className="desktop-nav"
          aria-label="Desktop Navigation Links"
        >
          {navItems.map((item) => {
            const isActive = currentRoute === item.route && !item.sectionId;

            return (
              <button
                key={item.label}
                onClick={() => handleRouteClick(item.route, item.sectionId)}
                style={{
                  ...navLinkStyle,
                  color: isActive ? 'var(--red-accent)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '-4px',
                      left: '0',
                      right: '0',
                      height: '2px',
                      backgroundColor: 'var(--red-accent)',
                      borderRadius: '2px',
                      boxShadow: '0 0 8px var(--red-accent)',
                    }}
                  />
                )}
              </button>
            );
          })}

          {/* Theme Toggle (Light / Dark Mode) */}
          <div style={{ marginLeft: '0.4rem' }}>
            <ThemeToggle size="md" />
          </div>

          {/* Discreet Admin Portal Link */}
          <button
            onClick={onOpenAdmin}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.82rem',
              fontFamily: 'var(--font-tech)',
              letterSpacing: '0.04em',
              color: isAdminLoggedIn ? 'var(--red-accent)' : 'var(--text-muted)',
              border: isAdminLoggedIn
                ? '1px solid rgba(255, 23, 68, 0.4)'
                : '1px solid var(--border-subtle)',
              backgroundColor: isAdminLoggedIn ? 'rgba(255, 23, 68, 0.08)' : 'transparent',
              transition: 'all 200ms ease',
            }}
            aria-label="Discreet Admin Login Portal"
            title="Administrator Portal"
          >
            <Shield size={14} color={isAdminLoggedIn ? '#FF1744' : 'currentColor'} />
            <span>{isAdminLoggedIn ? 'Admin Active' : 'Portal'}</span>
          </button>
        </nav>

        {/* Mobile Right Controls: Theme Toggle & Hamburger */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
          className="mobile-controls"
        >
          <div className="mobile-theme-btn" style={{ display: 'flex' }}>
            <ThemeToggle size="sm" />
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              border: '1px solid var(--border-glass)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)',
            }}
            className="mobile-toggle"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Animated Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'var(--nav-drawer-bg)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderBottom: '1px solid var(--border-glass)',
            boxShadow: 'var(--shadow-subtle)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
          }}
        >
          <button
            onClick={() => handleRouteClick('home')}
            style={{
              ...mobileNavLinkStyle,
              color: currentRoute === 'home' ? 'var(--red-accent)' : 'var(--text-primary)',
            }}
          >
            <Home size={18} color="var(--red-accent)" />
            <span>Home</span>
          </button>

          <button
            onClick={() => handleRouteClick('reviews')}
            style={{
              ...mobileNavLinkStyle,
              color: currentRoute === 'reviews' ? 'var(--red-accent)' : 'var(--text-primary)',
            }}
          >
            <Star size={18} color="var(--red-accent)" />
            <span>Reviews</span>
          </button>

          <button
            onClick={() => handleRouteClick('home', 'submit-review')}
            style={mobileNavLinkStyle}
          >
            <MessageSquarePlus size={18} color="var(--red-accent)" />
            <span>Submit a Review</span>
          </button>

          <button
            onClick={() => handleRouteClick('about')}
            style={{
              ...mobileNavLinkStyle,
              color: currentRoute === 'about' ? 'var(--red-accent)' : 'var(--text-primary)',
            }}
          >
            <FileText size={18} color="var(--red-accent)" />
            <span>About Évann</span>
          </button>

          <button
            onClick={() => handleRouteClick('socials')}
            style={{
              ...mobileNavLinkStyle,
              color: currentRoute === 'socials' ? 'var(--red-accent)' : 'var(--text-primary)',
            }}
          >
            <Share2 size={18} color="var(--red-accent)" />
            <span>My Socials</span>
          </button>

          <div
            style={{
              height: '1px',
              backgroundColor: 'var(--border-subtle)',
              margin: '0.5rem 0',
            }}
          />

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAdmin();
            }}
            style={{
              ...mobileNavLinkStyle,
              color: 'var(--red-accent)',
              border: '1px solid rgba(255, 23, 68, 0.3)',
              borderRadius: '8px',
              padding: '0.8rem 1rem',
              backgroundColor: 'rgba(255, 23, 68, 0.06)',
            }}
          >
            <Shield size={18} color="var(--red-accent)" />
            <span>Administrator Portal</span>
          </button>
        </div>
      )}

      {/* Embedded CSS for responsive media query and brand styling */}
      <style>{`
        @media (min-width: 860px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-controls {
            display: none !important;
          }
        .nav-item:hover {
          color: var(--red-accent) !important;
        }
        [data-theme="light"] header[role="banner"] {
          background-color: var(--nav-bg) !important;
          backdrop-filter: blur(16px) !important;
          -webkit-backdrop-filter: blur(16px) !important;
          border-bottom: 1px solid var(--border-glass) !important;
        }

        /* Navbar Brand Wordmark & Logo */
        .navbar-brand-btn {
          outline: none;
        }
        .navbar-brand-btn:hover .navbar-logo-img {
          transform: scale(1.05);
          filter: drop-shadow(0 3px 12px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 16px rgba(255, 23, 68, 0.5)) !important;
        }
        .navbar-brand-name {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 1.25rem;
          letter-spacing: 0.05em;
          color: #FFFFFF;
          text-transform: uppercase;
          display: inline-flex;
          align-items: baseline;
          line-height: 1;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8), 0 0 1px rgba(255, 255, 255, 0.4);
          transition: color 200ms ease, opacity 200ms ease;
        }
        [data-theme="light"] .navbar-brand-name {
          color: #0F172A;
          text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
        }
        .navbar-brand-btn:hover .navbar-brand-name {
          opacity: 0.95;
        }
        .navbar-brand-accent {
          color: var(--red-accent);
          margin: 0 1px;
          text-shadow: 0 0 10px rgba(255, 23, 68, 0.6);
        }
        @media (max-width: 640px) {
          .navbar-brand-name {
            font-size: 1.12rem;
            letter-spacing: 0.03em;
          }
        }
        @media (max-width: 400px) {
          .navbar-logo-img {
            width: 33px !important;
            height: 33px !important;
          }
          .navbar-brand-name {
            font-size: 0.98rem;
            letter-spacing: 0.02em;
          }
        }
        @media (max-width: 340px) {
          .navbar-logo-img {
            width: 29px !important;
            height: 29px !important;
          }
          .navbar-brand-name {
            font-size: 0.86rem;
            letter-spacing: 0.01em;
          }
        }
      `}</style>
    </header>
  );
};

const navLinkStyle: React.CSSProperties = {
  fontFamily: 'var(--font-tech)',
  fontSize: '0.9rem',
  letterSpacing: '0.04em',
  transition: 'color 200ms ease',
  padding: '6px 0',
  position: 'relative',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
};

const mobileNavLinkStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  fontFamily: 'var(--font-tech)',
  fontSize: '1.05rem',
  color: 'var(--text-primary)',
  padding: '0.6rem 0.5rem',
  textAlign: 'left',
  width: '100%',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
};
