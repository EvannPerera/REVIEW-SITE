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
        {/* Brand Wordmark & Founder Avatar */}
        <button
          onClick={() => handleRouteClick('home')}
          aria-label="Évann_stories Home"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            textAlign: 'left',
          }}
        >
          {/* Founder Avatar with Glowing Crimson Ring */}
          <div
            style={{
              position: 'relative',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              flexShrink: 0,
            }}
          >
            <img
              src="./evann-avatar.jpg"
              alt="Évann Avatar"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes('evann-avatar.jpg')) return;
                target.src = '/evann-avatar.jpg';
              }}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--red-accent)',
                boxShadow: '0 0 14px var(--red-glow)',
                display: 'block',
              }}
            />
            {/* Live Status Pulse Dot */}
            <span
              style={{
                position: 'absolute',
                bottom: '0px',
                right: '0px',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#00E676',
                border: '2px solid #090909',
                boxShadow: '0 0 8px #00E676',
              }}
              title="Verified Online Moderator"
            />
          </div>

          {/* 3D Brand Title in Nexa Round */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              className="text-3d-brand"
              style={{
                fontFamily: 'var(--font-brand)',
                fontWeight: 900,
                fontSize: '1.35rem',
                letterSpacing: '-0.01em',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              Évann<span style={{ color: 'var(--red-accent)' }}>_</span>stories
            </span>
          </div>
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

      {/* Embedded CSS for responsive media query */}
      <style>{`
        @media (min-width: 860px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-controls {
            display: none !important;
          }
        }
        .nav-item:hover {
          color: var(--red-accent) !important;
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
