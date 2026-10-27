import React, { useEffect, useRef, useState, useCallback } from 'react';
import anime from 'animejs';

interface LetterItem {
  char: string;
  isSpecial?: boolean;
}

const BRAND_TEXT = 'ÉVANN_STORIES';

export const InteractiveTypography: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  // Targets and current values for smooth spring interpolation
  const letterStates = useRef<
    {
      currentScale: number;
      targetScale: number;
      currentGlow: number;
      targetGlow: number;
      currentY: number;
      targetY: number;
    }[]
  >([]);

  const [activeFocusIdx, setActiveFocusIdx] = useState<number | null>(null);

  // Parse characters
  const letters: LetterItem[] = BRAND_TEXT.split('').map((char) => ({
    char,
    isSpecial: char === 'É' || char === '_',
  }));

  // Initialize state arrays
  useEffect(() => {
    letterStates.current = letters.map(() => ({
      currentScale: 1,
      targetScale: 1,
      currentGlow: 0,
      targetGlow: 0,
      currentY: 0,
      targetY: 0,
    }));
  }, [letters.length]);

  // Spring animation loop
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const updatePhysics = () => {
      let isSettled = true;

      letterRefs.current.forEach((el, index) => {
        if (!el) return;
        const state = letterStates.current[index];
        if (!state) return;

        // Smooth spring lerp
        state.currentScale = lerp(state.currentScale, state.targetScale, 0.16);
        state.currentGlow = lerp(state.currentGlow, state.targetGlow, 0.16);
        state.currentY = lerp(state.currentY, state.targetY, 0.16);

        // Check if movement is still occurring
        if (
          Math.abs(state.currentScale - state.targetScale) > 0.001 ||
          Math.abs(state.currentGlow - state.targetGlow) > 0.001 ||
          Math.abs(state.currentY - state.targetY) > 0.05
        ) {
          isSettled = false;
        }

        // Apply transforms directly via hardware accelerated styling
        const glowOpacity = state.currentGlow;
        const textShadow =
          glowOpacity > 0.02
            ? `0 0 ${15 * glowOpacity}px rgba(255, 23, 68, ${0.8 * glowOpacity}), 0 0 ${30 * glowOpacity}px rgba(176, 0, 32, ${0.5 * glowOpacity})`
            : 'none';

        el.style.transform = `translate3d(0, ${state.currentY}px, 0) scale(${state.currentScale})`;
        el.style.textShadow = textShadow;

        if (state.currentScale > 1.05) {
          el.style.color = '#FFFFFF';
        } else {
          el.style.color = '';
        }
      });

      animationFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animationFrameRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Proximity calculation based on cursor Euclidean distance
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const maxDistance = window.innerWidth < 768 ? 90 : 160; // Interaction radius

    letterRefs.current.forEach((el, index) => {
      if (!el) return;
      const state = letterStates.current[index];
      if (!state) return;

      const rect = el.getBoundingClientRect();
      const letterCenterX = rect.left + rect.width / 2;
      const letterCenterY = rect.top + rect.height / 2;

      const distance = Math.hypot(mouseX - letterCenterX, mouseY - letterCenterY);

      if (distance < maxDistance) {
        // Non-linear cubic falloff for magnetic feeling
        const normalized = 1 - distance / maxDistance;
        const intensity = Math.pow(normalized, 1.8);

        state.targetScale = 1 + intensity * 0.32; // Up to 1.32x scale
        state.targetGlow = intensity;
        state.targetY = -intensity * 14; // Slight magnetic lift
      } else {
        state.targetScale = 1;
        state.targetGlow = 0;
        state.targetY = 0;
      }
    });
  }, []);

  const handlePointerLeave = useCallback(() => {
    letterStates.current.forEach((state) => {
      state.targetScale = 1;
      state.targetGlow = 0;
      state.targetY = 0;
    });
  }, []);

  // Touch support for mobile: elastic pulse on tap using anime.js
  const handleTouchStart = (index: number) => {
    const el = letterRefs.current[index];
    if (!el) return;

    anime.remove(el);
    anime({
      targets: el,
      scale: [1, 1.35, 1],
      translateY: [0, -12, 0],
      duration: 650,
      easing: 'easeOutElastic(1, .5)',
    });
  };

  // Keyboard accessibility: Tab focus triggers elastic animation
  const handleFocus = (index: number) => {
    setActiveFocusIdx(index);
    const el = letterRefs.current[index];
    if (!el) return;

    const state = letterStates.current[index];
    if (state) {
      state.targetScale = 1.28;
      state.targetGlow = 1;
      state.targetY = -10;
    }

    anime({
      targets: el,
      textShadow: [
        '0 0 0px rgba(255, 23, 68, 0)',
        '0 0 25px rgba(255, 23, 68, 0.9)',
      ],
      duration: 400,
      easing: 'easeOutQuad',
    });
  };

  const handleBlur = (index: number) => {
    if (activeFocusIdx === index) {
      setActiveFocusIdx(null);
    }
    const state = letterStates.current[index];
    if (state) {
      state.targetScale = 1;
      state.targetGlow = 0;
      state.targetY = 0;
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="interactive-brand-typography-wrapper"
      role="banner"
      aria-label="ÉVANN_STORIES Brand Logo"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        userSelect: 'none',
        touchAction: 'none',
        maxWidth: '100%',
        padding: '1.5rem 0',
      }}
    >
      <h1
        className="interactive-brand-title"
        style={{
          display: 'flex',
          flexWrap: 'nowrap',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 0,
          padding: 0,
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          fontSize: 'clamp(2.4rem, 8.4vw, 7.8rem)',
          letterSpacing: 'clamp(0.04em, 0.15vw, 0.12em)',
          lineHeight: 1,
          color: '#F5F5F5',
        }}
      >
        {letters.map((item, index) => {
          const isUnderscore = item.char === '_';
          const isEAccent = item.char === 'É';

          return (
            <span
              key={`${item.char}-${index}`}
              ref={(el) => {
                letterRefs.current[index] = el;
              }}
              tabIndex={0}
              role="presentation"
              onFocus={() => handleFocus(index)}
              onBlur={() => handleBlur(index)}
              onTouchStart={() => handleTouchStart(index)}
              style={{
                display: 'inline-block',
                position: 'relative',
                transformOrigin: '50% 80%',
                willChange: 'transform, text-shadow, color',
                cursor: 'default',
                color: isUnderscore ? 'var(--red-accent)' : undefined,
                transition: 'color 150ms ease',
                padding: isUnderscore ? '0 0.05em' : '0 0.015em',
                outline: 'none',
              }}
              aria-hidden="true"
            >
              {isUnderscore ? (
                <span
                  style={{
                    color: 'var(--red-accent)',
                    textShadow: '0 0 16px rgba(255, 23, 68, 0.8)',
                    display: 'inline-block',
                  }}
                >
                  _
                </span>
              ) : isEAccent ? (
                <span style={{ position: 'relative' }}>
                  <span
                    style={{
                      color: 'var(--red-accent)',
                      position: 'absolute',
                      top: '-0.12em',
                      left: '0.22em',
                      fontSize: '0.55em',
                      filter: 'drop-shadow(0 0 8px rgba(255,23,68,0.7))',
                    }}
                  >
                    ´
                  </span>
                  E
                </span>
              ) : (
                item.char
              )}
            </span>
          );
        })}
      </h1>

      {/* Visually hidden screen reader fallback */}
      <span
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        ÉVANN STORIES
      </span>
    </div>
  );
};
