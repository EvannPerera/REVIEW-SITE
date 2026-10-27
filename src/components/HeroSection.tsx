import React, { useEffect, useRef } from 'react';
import { InteractiveTypography } from './InteractiveTypography';
import { ArrowDown, MessageSquarePlus, Sparkles, ShieldCheck } from 'lucide-react';
import gsap from 'gsap';

interface HeroSectionProps {
  onExploreReviews: () => void;
  onLeaveReview: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreReviews,
  onLeaveReview,
}) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
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
          { opacity: 1, y: 0, stagger: 0.15, duration: 0.8 },
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
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '6rem',
        paddingBottom: '4rem',
        textAlign: 'center',
        overflow: 'hidden',
        zIndex: 1,
      }}
    >
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Cinematic Badge */}
        <div
          ref={badgeRef}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 23, 68, 0.08)',
            border: '1px solid rgba(255, 23, 68, 0.25)',
            marginBottom: '1.25rem',
            boxShadow: '0 0 20px rgba(255, 23, 68, 0.15)',
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
            Verified Client Chronicles
          </span>
          <span
            style={{
              display: 'inline-block',
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.4)',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-tech)',
              fontSize: '0.74rem',
              color: 'var(--text-secondary)',
              letterSpacing: '0.04em',
            }}
          >
            Manual Authentication
          </span>
        </div>

        {/* Main Interactive Brand Typography (Full Screen Dominance) */}
        <div
          style={{
            margin: '0.75rem calc(-50vw + 50%) 1.5rem',
            width: '100vw',
            display: 'flex',
            justifyContent: 'center',
            overflow: 'visible',
          }}
        >
          <InteractiveTypography />
        </div>

        {/* Cinematic Subtitle */}
        <p
          ref={subtitleRef}
          style={{
            maxWidth: '680px',
            margin: '0 auto 2.5rem',
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1.05rem, 2vw, 1.3rem)',
            color: 'var(--text-secondary)',
            lineHeight: 1.65,
            fontWeight: 400,
          }}
        >
          Authentic customer narratives, privately verified transactions, and
          unfiltered experiences. Every word reviewed; every purchase manually confirmed.
        </p>

        {/* Dual Call to Actions */}
        <div
          ref={ctaContainerRef}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.25rem',
            marginBottom: '3rem',
          }}
        >
          <button
            onClick={onExploreReviews}
            className="hero-primary-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 28px',
              borderRadius: '10px',
              backgroundColor: 'var(--red-accent)',
              color: '#FFFFFF',
              fontFamily: 'var(--font-tech)',
              fontWeight: 700,
              fontSize: '0.95rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 0 25px rgba(255, 23, 68, 0.45)',
              transition: 'all 250ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <ArrowDown size={18} />
            <span>Explore Reviews</span>
          </button>

          <button
            onClick={onLeaveReview}
            className="hero-secondary-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 28px',
              borderRadius: '10px',
              backgroundColor: 'rgba(15, 15, 18, 0.7)',
              color: '#F5F5F5',
              fontFamily: 'var(--font-tech)',
              fontWeight: 600,
              fontSize: '0.95rem',
              letterSpacing: '0.06em',
              border: '1px solid rgba(255, 23, 68, 0.3)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              transition: 'all 250ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <MessageSquarePlus size={18} color="var(--red-accent)" />
            <span>Leave Your Review</span>
          </button>
        </div>

        {/* Trust Highlight Under Buttons */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.82rem',
            fontFamily: 'var(--font-tech)',
            color: 'var(--text-muted)',
            letterSpacing: '0.02em',
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
          color: 'var(--text-muted)',
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
          background-color: rgba(30, 20, 24, 0.9) !important;
          border-color: rgba(255, 23, 68, 0.6) !important;
          transform: translateY(-2px);
          box-shadow: 0 0 20px rgba(255, 23, 68, 0.2) !important;
        }
      `}</style>
    </section>
  );
};
