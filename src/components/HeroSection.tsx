import React, { useEffect, useRef } from 'react';
import { InteractiveTypography } from './InteractiveTypography';
import { ArrowDown, MessageSquarePlus, ShieldCheck, SquarePen, Compass } from 'lucide-react';
import gsap from 'gsap';
import sriLankaFlag from '../assets/sri-lanka-flag.svg';

interface HeroSectionProps {
  onExploreReviews: () => void;
  onLeaveReview: () => void;
  onNavigateToAbout: () => void;
  onNavigateToSocials: () => void;
  onStartGuide?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreReviews,
  onLeaveReview,
  onNavigateToAbout,
  onNavigateToSocials,
  onStartGuide,
}) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const ctaContainerRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        badgeRef.current,
        { opacity: 0, y: -20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, delay: 0.2 }
      )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.9 },
          '-=0.4'
        )
        .fromTo(
          ctaContainerRef.current?.children || [],
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.1, duration: 0.8 },
          '-=0.5'
        )
        .fromTo(
          scrollIndicatorRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1 },
          '-=0.3'
        );

      // Subtle float animation on scroll indicator
      if (scrollIndicatorRef.current) {
        gsap.to(scrollIndicatorRef.current, {
          y: 8,
          repeat: -1,
          yoyo: true,
          duration: 1.4,
          ease: 'power1.inOut',
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      style={{
        position: 'relative',
        minHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '6rem',
        paddingBottom: '3.5rem',
        textAlign: 'center',
        overflow: 'hidden',
        zIndex: 1,
      }}
    >
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Premium Brand Badge: 🇱🇰 SRI LANKA'S #1 ACCOUNTS SELLER */}
        <div
          ref={badgeRef}
          className="hero-brand-badge"
          role="status"
          aria-label="Sri Lanka's #1 Accounts Seller"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 23, 68, 0.08)',
            border: '1px solid rgba(255, 23, 68, 0.28)',
            marginBottom: '1.25rem',
            boxShadow: '0 0 20px rgba(255, 23, 68, 0.16)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            userSelect: 'none',
          }}
        >
          {/* Crisp Sri Lankan National Flag Vector */}
          <img
            src={sriLankaFlag}
            alt="Sri Lanka Flag"
            width={21}
            height={16}
            className="hero-brand-badge-flag"
            style={{
              width: '21px',
              height: '15.75px',
              borderRadius: '2.5px',
              objectFit: 'cover',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              display: 'inline-block',
              verticalAlign: 'middle',
              flexShrink: 0,
            }}
          />

          {/* Prominent "SRI LANKA'S #1" with subtle crimson-red accent */}
          <span
            className="hero-brand-badge-primary"
            style={{
              fontFamily: 'var(--font-tech)',
              fontSize: '0.80rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#FFFFFF',
              display: 'inline-flex',
              alignItems: 'center',
              lineHeight: 1,
            }}
          >
            SRI LANKA'S&nbsp;
            <span
              className="hero-brand-badge-accent"
              style={{
                color: 'var(--red-accent)',
                fontWeight: 800,
                textShadow: '0 0 10px rgba(255, 23, 68, 0.45)',
              }}
            >
              #1
            </span>
          </span>

          {/* Subtle Accent Dot Separator */}
          <span
            className="hero-brand-badge-dot"
            aria-hidden="true"
            style={{
              display: 'inline-block',
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              backgroundColor: 'var(--red-accent)',
              opacity: 0.8,
              flexShrink: 0,
            }}
          />

          {/* Clearly readable "ACCOUNTS SELLER" in off-white */}
          <span
            className="hero-brand-badge-secondary"
            style={{
              fontFamily: 'var(--font-tech)',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
              color: '#CBD5E1',
              display: 'inline-flex',
              alignItems: 'center',
              lineHeight: 1,
            }}
          >
            ACCOUNTS SELLER
          </span>
        </div>

        {/* Main Interactive Brand Typography (Full Screen Dominance) */}
        <div
          className="hero-typography-container"
          style={{
            margin: '0.5rem auto 1.25rem',
            width: '100%',
            maxWidth: '100%',
            display: 'flex',
            justifyContent: 'center',
            overflow: 'visible',
          }}
        >
          <InteractiveTypography />
        </div>

        {/* Cinematic Subtitle / Introduction: Heading + Description */}
        <div
          ref={subtitleRef}
          className="hero-intro-block"
          style={{
            maxWidth: '700px',
            margin: '0 auto 2.2rem',
            padding: '0 0.75rem',
            textAlign: 'center',
          }}
        >
          <h2
            className="hero-intro-heading"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.15rem, 2.4vw, 1.55rem)',
              fontWeight: 700,
              letterSpacing: '-0.015em',
              color: '#FFFFFF',
              lineHeight: 1.35,
              marginBottom: '0.85rem',
              textShadow: '0 2px 16px rgba(0, 0, 0, 0.95), 0 0 24px rgba(0, 0, 0, 0.7)',
            }}
          >
            Trusted Since <span className="hero-heading-accent" style={{ color: 'var(--red-accent)', textShadow: '0 0 14px rgba(255, 23, 68, 0.45)' }}>2020</span>. Built Through Social Media.
          </h2>
          <p
            className="hero-intro-description"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.92rem, 1.5vw, 1.05rem)',
              color: '#CBD5E1',
              lineHeight: 1.65,
              fontWeight: 400,
              textShadow: '0 2px 14px rgba(0, 0, 0, 0.9)',
              margin: 0,
            }}
          >
            From humble beginnings to a growing online presence, we've built our reputation through years of experience and <span className="hero-desc-highlight" style={{ color: '#FFFFFF', fontWeight: 600 }}>500+ accounts sold</span>. Every transaction is handled with care, transparency, and a commitment to customer satisfaction.
          </p>
        </div>

        {/* 4 Action Buttons as requested */}
        <div
          ref={ctaContainerRef}
          className="hero-cta-group"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.85rem',
            marginBottom: '2.5rem',
          }}
        >
          {/* Button 1: View Reviews / Customer Reviews */}
          <button
            onClick={onExploreReviews}
            data-guide="customer-reviews-btn"
            className="hero-primary-btn"
            title="Explore verified customer reviews"
            aria-label="View Customer Reviews"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '13px 24px',
              borderRadius: '10px',
              backgroundColor: 'var(--red-accent)',
              color: '#FFFFFF',
              fontFamily: 'var(--font-tech)',
              fontWeight: 700,
              fontSize: '0.92rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 0 25px rgba(255, 23, 68, 0.45)',
              transition: 'all 250ms cubic-bezier(0.16, 1, 0.3, 1)',
              cursor: 'pointer',
            }}
          >
            <SquarePen size={17} className="hero-btn-icon" />
            <span>Customer Reviews</span>
          </button>

          {/* Button 2: Submit a Review (Scrolls down on homepage) */}
          <button
            onClick={onLeaveReview}
            data-guide="submit-review-hero-btn"
            className="hero-secondary-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '13px 24px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-tech)',
              fontWeight: 600,
              fontSize: '0.92rem',
              letterSpacing: '0.06em',
              border: '1px solid var(--border-glass)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              transition: 'all 250ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <MessageSquarePlus size={17} color="var(--red-accent)" />
            <span>Submit a Review</span>
          </button>

          {/* Button 3: About Évann */}
          <button
            onClick={onNavigateToAbout}
            className="hero-tertiary-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '13px 24px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-tech)',
              fontWeight: 600,
              fontSize: '0.92rem',
              letterSpacing: '0.06em',
              border: '1px solid var(--border-subtle)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              transition: 'all 250ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <span>About Évann</span>
          </button>

          {/* Button 4: My Socials */}
          <button
            onClick={onNavigateToSocials}
            className="hero-socials-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '13px 24px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 23, 68, 0.1)',
              color: 'var(--red-accent)',
              fontFamily: 'var(--font-tech)',
              fontWeight: 700,
              fontSize: '0.92rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              border: '1px solid rgba(255, 23, 68, 0.4)',
              boxShadow: '0 0 15px rgba(255, 23, 68, 0.18)',
              transition: 'all 250ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <span>MY SOCIALS</span>
          </button>

          {/* Button 5: How to Leave a Review (Interactive Guide) */}
          {onStartGuide && (
            <button
              onClick={onStartGuide}
              className="hero-guide-btn"
              title="Learn how to leave an authenticated review step-by-step"
              aria-label="Start How to Leave a Review guide"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '13px 22px',
                borderRadius: '10px',
                backgroundColor: 'rgba(37, 99, 235, 0.16)',
                color: '#93C5FD',
                fontFamily: 'var(--font-tech)',
                fontWeight: 700,
                fontSize: '0.9rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                border: '1px solid rgba(59, 130, 246, 0.45)',
                boxShadow: '0 0 20px rgba(37, 99, 235, 0.25)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                transition: 'all 250ms cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'pointer',
              }}
            >
              <Compass size={17} className="hero-guide-icon" />
              <span>How to Leave a Review</span>
            </button>
          )}
        </div>

        {/* Trust Highlight Under Buttons */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.82rem',
            fontFamily: 'var(--font-tech)',
            color: '#CBD5E1',
            letterSpacing: '0.02em',
            textShadow: '0 1px 8px rgba(0, 0, 0, 0.85)',
          }}
        >
          <ShieldCheck size={16} color="var(--red-accent)" />
          <span>Zero fabricated accounts. Unbiased transaction audits.</span>
        </div>
      </div>

      {/* Floating Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        onClick={onExploreReviews}
        style={{
          position: 'absolute',
          bottom: '1.8rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          cursor: 'pointer',
          color: '#CBD5E1',
          textShadow: '0 1px 8px rgba(0, 0, 0, 0.85)',
          transition: 'color 200ms ease',
        }}
        aria-label="Scroll down to view reviews"
      >
        <span
          style={{
            fontFamily: 'var(--font-tech)',
            fontSize: '0.72rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          Scroll Down
        </span>
        <ArrowDown size={16} color="var(--red-accent)" />
      </div>

      {/* Button Hover Micro-interactions */}
      <style>{`
        .hero-primary-btn:hover {
          background-color: #FF2E5B !important;
          transform: translateY(-2px);
          box-shadow: 0 0 35px rgba(255, 23, 68, 0.65) !important;
        }
        .hero-secondary-btn:hover {
          background-color: var(--bg-card-hover) !important;
          border-color: var(--red-accent) !important;
          transform: translateY(-2px);
          box-shadow: 0 0 20px var(--red-glow) !important;
        }
        .hero-tertiary-btn:hover {
          background-color: var(--bg-card-hover) !important;
          border-color: var(--border-glass-hover) !important;
          transform: translateY(-2px);
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.15) !important;
        }
        .hero-primary-btn .hero-btn-icon {
          transition: transform 260ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hero-primary-btn:hover .hero-btn-icon {
          transform: rotate(-12deg) scale(1.18);
        }
        .hero-guide-btn {
          cursor: pointer;
        }
        .hero-guide-btn .hero-guide-icon {
          transition: transform 260ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hero-guide-btn:hover {
          background-color: rgba(37, 99, 235, 0.28) !important;
          border-color: #60A5FA !important;
          color: #FFFFFF !important;
          transform: translateY(-2px);
          box-shadow: 0 0 25px rgba(59, 130, 246, 0.5) !important;
        }
        .hero-guide-btn:hover .hero-guide-icon {
          transform: rotate(35deg) scale(1.15);
        }
        .hero-socials-btn:hover {
          background-color: rgba(255, 23, 68, 0.2) !important;
          border-color: var(--red-accent) !important;
          transform: translateY(-2px);
          box-shadow: 0 0 25px rgba(255, 23, 68, 0.4) !important;
        }
      `}</style>
    </section>
  );
};
