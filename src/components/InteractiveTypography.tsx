import React, { useEffect, useRef, useState, useCallback } from 'react';
import anime from 'animejs';

interface LetterItem {
  char: string;
  isSpecial?: boolean;
}

// User requested exact casing & name: "Évann_stories"
const BRAND_TEXT = 'Évann_stories';

export const InteractiveTypography: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  // Targets and current values for smooth spring physics & 3D tilt
  const letterStates = useRef<
    {
      currentScale: number;
      targetScale: number;
      currentGlow: number;
      targetGlow: number;
      currentY: number;
      targetY: number;
      currentZ: number;
      targetZ: number;
      currentRotateX: number;
      targetRotateX: number;
      currentRotateY: number;
      targetRotateY: number;
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
      currentZ: 0,
      targetZ: 0,
      currentRotateX: 0,
      targetRotateX: 0,
      currentRotateY: 0,
      targetRotateY: 0,
    }));
  }, [letters.length]);

  // Spring animation loop with 3D depth interpolation
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const updatePhysics = () => {
      letterRefs.current.forEach((el, index) => {
        if (!el) return;
        const state = letterStates.current[index];
        if (!state) return;

        // Smooth spring lerp
        state.currentScale = lerp(state.currentScale, state.targetScale, 0.18);
        state.currentGlow = lerp(state.currentGlow, state.targetGlow, 0.18);
        state.currentY = lerp(state.currentY, state.targetY, 0.18);
        state.currentZ = lerp(state.currentZ, state.targetZ, 0.18);
        state.currentRotateX = lerp(state.currentRotateX, state.targetRotateX, 0.18);
        state.currentRotateY = lerp(state.currentRotateY, state.targetRotateY, 0.18);

        // Calculate dynamic 3D layered shadow based on proximity lift
        const lift = state.currentGlow;
        const base3dShadow = `
          0 1px 0 #FFFFFF,
          0 2px 0 #E2E8F0,
          0 3px 0 #CBD5E1,
          0 ${4 + lift * 4}px 0 #850017,
          0 ${5 + lift * 5}px 0 #6B0012,
          0 ${6 + lift * 6}px 0 #52000D,
          0 ${7 + lift * 7}px 0 #390008,
          0 ${8 + lift * 8}px 1px rgba(0, 0, 0, ${0.6 + lift * 0.3}),
          0 ${12 + lift * 12}px ${16 + lift * 16}px rgba(0, 0, 0, 0.9),
          0 0 ${20 + lift * 30}px rgba(255, 23, 68, ${0.4 + lift * 0.5})
        `;

        el.style.transform = `translate3d(0, ${state.currentY}px, ${state.currentZ}px) rotateX(${state.currentRotateX}deg) rotateY(${state.currentRotateY}deg) scale(${state.currentScale})`;
        el.style.textShadow = base3dShadow;
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

    const maxDistance = window.innerWidth < 768 ? 80 : 140; // Interaction radius

    letterRefs.current.forEach((el, index) => {
      if (!el) return;
      const state = letterStates.current[index];
      if (!state) return;

      const rect = el.getBoundingClientRect();
      const letterCenterX = rect.left + rect.width / 2;
      const letterCenterY = rect.top + rect.height / 2;

      const distance = Math.hypot(mouseX - letterCenterX, mouseY - letterCenterY);

      if (distance < maxDistance) {
        const normalized = 1 - distance / maxDistance;
        const intensity = Math.pow(normalized, 1.6);

        // Controlled scaling (max 1.25x) so letters never break out of bounds
        state.targetScale = 1 + intensity * 0.24;
        state.targetGlow = intensity;
        state.targetY = -intensity * 12; // 3D lift upwards
        state.targetZ = intensity * 35; // True 3D pop towards camera

        // 3D tilt towards mouse angle
        const angleX = (mouseY - letterCenterY) / maxDistance;
        const angleY = -(mouseX - letterCenterX) / maxDistance;
        state.targetRotateX = angleX * 18 * intensity;
        state.targetRotateY = angleY * 18 * intensity;
      } else {
        state.targetScale = 1;
        state.targetGlow = 0;
        state.targetY = 0;
        state.targetZ = 0;
        state.targetRotateX = 0;
        state.targetRotateY = 0;
      }
    });
  }, []);

  const handlePointerLeave = useCallback(() => {
    letterStates.current.forEach((state) => {
      state.targetScale = 1;
      state.targetGlow = 0;
      state.targetY = 0;
      state.targetZ = 0;
      state.targetRotateX = 0;
      state.targetRotateY = 0;
    });
  }, []);

  // Touch support for mobile: elastic pulse on tap using anime.js
  const handleTouchStart = (index: number) => {
    const el = letterRefs.current[index];
    if (!el) return;

    anime.remove(el);
    anime({
      targets: el,
      scale: [1, 1.25, 1],
      translateY: [0, -10, 0],
      duration: 600,
      easing: 'easeOutElastic(1, .5)',
    });
  };

  // Keyboard accessibility
  const handleFocus = (index: number) => {
    setActiveFocusIdx(index);
    const state = letterStates.current[index];
    if (state) {
      state.targetScale = 1.22;
      state.targetGlow = 1;
      state.targetY = -8;
      state.targetZ = 30;
    }
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
      state.targetZ = 0;
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="interactive-brand-typography-wrapper"
      role="banner"
      aria-label="Évann_stories Brand Logo"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        userSelect: 'none',
        touchAction: 'none',
        width: '100%',
        maxWidth: '100%',
        padding: '1.25rem 0.5rem',
        perspective: '1200px',
        overflow: 'visible',
      }}
    >
      <h1
        className="interactive-brand-title text-3d-brand"
        style={{
          display: 'flex',
          flexWrap: 'nowrap',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 0,
          padding: '0 0.5rem',
          fontFamily: 'var(--font-brand)',
          fontWeight: 900,
          // Controlled clamp sizing: guarantees the text always fits cleanly inside the viewport without overflowing
          fontSize: 'clamp(1.75rem, 5.0vw, 4.6rem)',
          letterSpacing: 'clamp(0.01em, 0.04vw, 0.03em)',
          lineHeight: 1.15,
          color: '#FFFFFF',
          transformStyle: 'preserve-3d',
          maxWidth: '100%',
          overflow: 'visible',
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
                transformOrigin: '50% 85%',
                willChange: 'transform, text-shadow',
                cursor: 'default',
                color: isUnderscore ? 'var(--red-accent)' : '#FFFFFF',
                padding: isUnderscore ? '0 0.08em' : '0 0.01em',
                outline: 'none',
                transformStyle: 'preserve-3d',
              }}
              aria-hidden="true"
            >
              {isUnderscore ? (
                <span
                  style={{
                    color: 'var(--red-accent)',
                    display: 'inline-block',
                    filter: 'drop-shadow(0 0 12px rgba(255, 23, 68, 0.9))',
                  }}
                >
                  _
                </span>
              ) : isEAccent ? (
                <span style={{ position: 'relative', display: 'inline-block' }}>
                  É
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
        Évann_stories
      </span>
    </div>
  );
};
