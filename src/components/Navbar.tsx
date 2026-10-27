import React, { useState, useEffect } from 'react';
import { Shield, Menu, X, Star, MessageSquarePlus, Info, Home } from 'lucide-react';

interface NavbarProps {
  onOpenAdmin: () => void;
  onNavigateToSection: (sectionId: string) => void;
  isAdminLoggedIn?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAdmin,
  onNavigateToSection,
  isAdminLoggedIn = false,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    onNavigateToSection(sectionId);
  };

  return (
    <header
      role="navigation"
      aria-label="Main Navigation"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        backgroundColor: isScrolled ? 'rgba(9, 9, 9, 0.88)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'none',
        borderBottom: isScrolled
          ? '1px solid rgba(255, 23, 68, 0.18)'
          : '1px solid transparent',
        boxShadow: isScrolled ? '0 10px 30px -10px rgba(0, 0, 0, 0.8)' : 'none',
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
          onClick={() => handleNavClick('hero')}
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
                // Fallback to absolute path or SVG icon if relative path fails
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
                boxShadow: '0 0 14px rgba(255, 23, 68, 0.5), inset 0 0 8px rgba(0, 0, 0, 0.6)',
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
                color: '#FFFFFF',
                display: 'inline-flex',
                alignItems: 'center',
                textShadow:
                  '0 1px 0 #FFFFFF, 0 2px 0 #CBD5E1, 0 3px 0 #850017, 0 4px 0 #52000D, 0 6px 12px rgba(0, 0, 0, 0.8), 0 0 15px rgba(255, 23, 68, 0.4)',
              }}
            >
              Évann<span style={{ color: 'var(--red-accent)', textShadow: '0 0 12px rgba(255, 23, 68, 0.8)' }}>_</span>stories
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '2rem',
          }}
          className="desktop-nav"
        >
          <button
            onClick={() => handleNavClick('hero')}
            style={navLinkStyle}
            aria-label="Navigate to Home"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('reviews-list')}
            style={navLinkStyle}
            aria-label="Navigate to Customer Reviews"
          >
            Reviews
          </button>
          <button
            onClick={() => handleNavClick('submit-review')}
            style={navLinkStyle}
            aria-label="Navigate to Submit a Review"
          >
            Leave a Review
          </button>
          <button
            onClick={() => handleNavClick('trust-process')}
            style={navLinkStyle}
            aria-label="Navigate to Verification Process and Trust"
          >
            About & Trust
          </button>

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
                : '1px solid rgba(255, 255, 255, 0.08)',
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

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '42px',
            height: '42px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 23, 68, 0.2)',
            backgroundColor: 'rgba(15, 15, 18, 0.7)',
            color: '#FFFFFF',
          }}
          className="mobile-toggle"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Animated Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'rgba(9, 9, 12, 0.98)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderBottom: '1px solid rgba(255, 23, 68, 0.25)',
            boxShadow: '0 25px 40px rgba(0, 0, 0, 0.9)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <button
            onClick={() => handleNavClick('hero')}
            style={mobileNavLinkStyle}
          >
            <Home size={18} color="var(--red-accent)" />
            <span>Home</span>
          </button>
          <button
            onClick={() => handleNavClick('reviews-list')}
            style={mobileNavLinkStyle}
          >
            <Star size={18} color="var(--red-accent)" />
            <span>Reviews</span>
          </button>
          <button
            onClick={() => handleNavClick('submit-review')}
            style={mobileNavLinkStyle}
          >
            <MessageSquarePlus size={18} color="var(--red-accent)" />
            <span>Leave a Review</span>
          </button>
          <button
            onClick={() => handleNavClick('trust-process')}
            style={mobileNavLinkStyle}
          >
            <Info size={18} color="var(--red-accent)" />
            <span>About & Trust</span>
          </button>
          <div
            style={{
              height: '1px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
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
        @media (min-width: 820px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
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
  color: 'var(--text-secondary)',
  transition: 'color 200ms ease',
  padding: '6px 0',
  position: 'relative',
};

const mobileNavLinkStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  fontFamily: 'var(--font-tech)',
  fontSize: '1.05rem',
  color: '#FFFFFF',
  padding: '0.6rem 0.5rem',
  textAlign: 'left',
  width: '100%',
};
