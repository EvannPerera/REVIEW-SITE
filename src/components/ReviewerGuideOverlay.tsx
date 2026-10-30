import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useReviewerGuide } from '../context/ReviewerGuideContext';
import { useRouter } from '../routes/router';
import {
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Sparkles,
  Compass,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import gsap from 'gsap';

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
  bottom: number;
  right: number;
}

export const ReviewerGuideOverlay: React.FC = () => {
  const {
    isGuideActive,
    currentStep,
    nextStep,
    prevStep,
    quitGuide,
    restartGuide,
    showIntroPrompt,
    startGuide,
    dismissIntroPrompt,
  } = useReviewerGuide();

  const { currentRoute } = useRouter();

  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [bubblePos, setBubblePos] = useState<{
    top: number;
    left: number;
    placement: 'top' | 'bottom' | 'left' | 'right' | 'center';
    pointerOffset: number;
  }>({
    top: 0,
    left: 0,
    placement: 'center',
    pointerOffset: 32,
  });

  const bubbleRef = useRef<HTMLDivElement>(null);
  const promptRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  // Position calculation helper: prioritizes beside or above, never covers interactive elements
  const updatePosition = useCallback(() => {
    if (!isGuideActive || !currentStep) return;

    // Center placement for completion, bottom-right for intro
    if (!currentStep.targetSelector || currentStep.preferredPlacement === 'center') {
      setTargetRect(null);
      if (currentStep.id === 'intro') {
        // Positioned via CSS in bottom-right
        setBubblePos({
          top: 0,
          left: 0,
          placement: 'center',
          pointerOffset: 0,
        });
        return;
      }
      setBubblePos({
        top: Math.max(80, (window.innerHeight - 260) / 2),
        left: Math.max(16, (window.innerWidth - 380) / 2),
        placement: 'center',
        pointerOffset: 0,
      });
      return;
    }

    const targetEl = document.querySelector(currentStep.targetSelector) as HTMLElement | null;

    if (!targetEl) {
      setTargetRect(null);
      setBubblePos({
        top: Math.max(80, (window.innerHeight - 260) / 2),
        left: Math.max(16, (window.innerWidth - 380) / 2),
        placement: 'center',
        pointerOffset: 0,
      });
      return;
    }

    const rect = targetEl.getBoundingClientRect();
    const newTargetRect: TargetRect = {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      bottom: rect.bottom,
      right: rect.right,
    };
    setTargetRect(newTargetRect);

    const bubbleEl = bubbleRef.current;
    const bubbleW = bubbleEl ? bubbleEl.offsetWidth : 350;
    const bubbleH = bubbleEl ? bubbleEl.offsetHeight : 210;
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    const isMobile = viewportW < 640;
    const NAVBAR_OFFSET = isMobile ? 60 : 80; // Buffer for sticky top navbar (compact on mobile)
    const SPACING = 18; // Gap between target and bubble
    const MARGIN = 16; // Screen edge margin

    let placement: 'top' | 'bottom' | 'left' | 'right' | 'center' = 'bottom';
    let top = 0;
    let left = 0;
    let pointerOffset = 32;

    const spaceRight = viewportW - rect.right;
    const spaceLeft = rect.left;
    const spaceTop = rect.top - NAVBAR_OFFSET;
    const spaceBottom = viewportH - rect.bottom;

    if (!isMobile) {
      // Desktop: Prefer Beside (Right or Left), then Above, then Below
      if (spaceRight >= bubbleW + SPACING + MARGIN) {
        // Place Beside on the Right
        placement = 'right';
        left = rect.right + SPACING;
        top = rect.top + rect.height / 2 - bubbleH / 2;
        // Clamp top so bubble stays fully in viewport below navbar
        top = Math.max(NAVBAR_OFFSET + 10, Math.min(viewportH - bubbleH - MARGIN, top));
        pointerOffset = Math.max(24, Math.min(bubbleH - 24, (rect.top + rect.height / 2) - top));
      } else if (spaceLeft >= bubbleW + SPACING + MARGIN) {
        // Place Beside on the Left
        placement = 'left';
        left = rect.left - bubbleW - SPACING;
        top = rect.top + rect.height / 2 - bubbleH / 2;
        top = Math.max(NAVBAR_OFFSET + 10, Math.min(viewportH - bubbleH - MARGIN, top));
        pointerOffset = Math.max(24, Math.min(bubbleH - 24, (rect.top + rect.height / 2) - top));
      } else if (spaceTop >= bubbleH + SPACING) {
        // Place Above
        placement = 'top';
        top = rect.top - bubbleH - SPACING;
        left = rect.left + rect.width / 2 - bubbleW / 2;
        left = Math.max(MARGIN, Math.min(viewportW - bubbleW - MARGIN, left));
        pointerOffset = Math.max(24, Math.min(bubbleW - 24, (rect.left + rect.width / 2) - left));
      } else {
        // Place Below
        placement = 'bottom';
        top = rect.bottom + SPACING;
        left = rect.left + rect.width / 2 - bubbleW / 2;
        left = Math.max(MARGIN, Math.min(viewportW - bubbleW - MARGIN, left));
        pointerOffset = Math.max(24, Math.min(bubbleW - 24, (rect.left + rect.width / 2) - left));
      }
    } else {
      // Mobile (< 640px): Form inputs span full screen width, so place Above or Below
      left = Math.max(MARGIN, (viewportW - bubbleW) / 2);
      if (spaceTop >= bubbleH + SPACING) {
        placement = 'top';
        top = rect.top - bubbleH - SPACING;
      } else {
        placement = 'bottom';
        top = rect.bottom + SPACING;
      }
      pointerOffset = Math.max(24, Math.min(bubbleW - 24, (rect.left + rect.width / 2) - left));
    }

    setBubblePos({ top, left, placement, pointerOffset });
  }, [isGuideActive, currentStep]);

  // Auto-scroll target smoothly into view on step change
  useEffect(() => {
    if (!isGuideActive || !currentStep || !currentStep.targetSelector) return;

    let attempts = 0;
    const checkAndScroll = () => {
      const el = document.querySelector(currentStep.targetSelector) as HTMLElement | null;
      if (el) {
        const rect = el.getBoundingClientRect();
        // Check if element is comfortably visible in the viewport
        const isInView = rect.top >= 120 && rect.bottom <= window.innerHeight - 80;
        if (!isInView) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        updatePosition();
      } else if (attempts < 8) {
        attempts++;
        setTimeout(checkAndScroll, 100);
      }
    };

    const timer = setTimeout(checkAndScroll, 60);
    return () => clearTimeout(timer);
  }, [isGuideActive, currentStep, currentRoute, updatePosition]);

  // Keep bubble and target ring aligned on page scroll and window resize
  useEffect(() => {
    if (!isGuideActive) return;

    const handleScrollOrResize = () => {
      requestAnimationFrame(updatePosition);
    };

    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isGuideActive, updatePosition]);

  // GSAP animation for bubble step transitions
  useEffect(() => {
    if (!isGuideActive || !bubbleRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    gsap.fromTo(
      bubbleRef.current,
      { opacity: 0, scale: 0.95, y: 8 },
      { opacity: 1, scale: 1, y: 0, duration: 0.28, ease: 'power2.out' }
    );
  }, [isGuideActive, currentStep?.id]);

  // GSAP animation for intro prompt
  useEffect(() => {
    if (!showIntroPrompt || !promptRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    gsap.fromTo(
      promptRef.current,
      { opacity: 0, y: 25, scale: 0.94 },
      { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.4)' }
    );
  }, [showIntroPrompt]);

  // Keyboard accessibility (Escape to quit walkthrough)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isGuideActive) return;
      if (e.key === 'Escape') {
        quitGuide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGuideActive, quitGuide]);

  // Automatically advance tour when user clicks the highlighted hero Submit Review button
  useEffect(() => {
    if (!isGuideActive || currentStep?.id !== 'find-review-page') return;

    const targetEl = document.querySelector('[data-guide="submit-review-hero-btn"]');
    if (!targetEl) return;

    const handleTargetClick = () => {
      setTimeout(() => {
        nextStep();
      }, 150);
    };

    targetEl.addEventListener('click', handleTargetClick);
    return () => targetEl.removeEventListener('click', handleTargetClick);
  }, [isGuideActive, currentStep?.id, nextStep]);

  return (
    <>
      {/* 1. First-Time Visitor Dismissible Introductory Prompt (Clean, crisp, no blur) */}
      {showIntroPrompt && !isGuideActive && (
        <div
          ref={promptRef}
          role="region"
          aria-label="New Reviewer Guide Offer"
          className="reviewer-guide-intro-prompt"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            maxWidth: '380px',
            width: 'calc(100% - 48px)',
            zIndex: 900,
            backgroundColor: '#1D4ED8',
            backgroundImage: 'linear-gradient(135deg, #1E40AF 0%, #2563EB 100%)',
            color: '#FFFFFF',
            borderRadius: '16px',
            padding: '18px 20px',
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.45), 0 0 25px rgba(37, 99, 235, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.18)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Compass size={20} color="#FFFFFF" />
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '1rem',
                  lineHeight: 1.25,
                  marginBottom: '4px',
                  color: '#FFFFFF',
                }}
              >
                New to ÉVANN_STORIES? 👋
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.84rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                  lineHeight: 1.45,
                  margin: 0,
                }}
              >
                Would you like a friendly, 1-minute walkthrough on how to submit your authenticated review?
              </p>
            </div>

            <button
              onClick={dismissIntroPrompt}
              aria-label="Close guide offer"
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.7)',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
                transition: 'color 150ms ease',
              }}
              className="guide-close-btn"
            >
              <X size={18} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '14px', justifyContent: 'flex-end' }}>
            <button
              onClick={dismissIntroPrompt}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.14)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                fontFamily: 'var(--font-tech)',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
              className="guide-secondary-action"
            >
              Maybe Later
            </button>
            <button
              onClick={() => startGuide(0)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                color: '#1D4ED8',
                border: 'none',
                fontFamily: 'var(--font-tech)',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 150ms ease',
              }}
              className="guide-primary-action"
            >
              <span>Show Me How</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* 2. Interactive Guided Walkthrough Mode (NON-BLOCKING, ZERO BLUR, ZERO DARK OVERLAY) */}
      {isGuideActive && currentStep && (
        <div
          role="region"
          aria-label="New Reviewer Guidance Walkthrough"
          className="reviewer-guide-system"
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 970,
          }}
        >
          {/* Subtle Blue Target Ring: Sits 6px outside target, 0 inner shadow, 100% click-through */}
          {targetRect && (
            <div
              ref={highlightRef}
              className="reviewer-guide-target-ring"
              style={{
                position: 'fixed',
                top: targetRect.top - 6,
                left: targetRect.left - 6,
                width: targetRect.width + 12,
                height: targetRect.height + 12,
                borderRadius: '12px',
                border: '2px solid #3B82F6',
                boxShadow: '0 0 16px rgba(59, 130, 246, 0.45)',
                pointerEvents: 'none',
                zIndex: 960,
                transition: 'top 180ms cubic-bezier(0.16, 1, 0.3, 1), left 180ms cubic-bezier(0.16, 1, 0.3, 1), width 180ms cubic-bezier(0.16, 1, 0.3, 1), height 180ms cubic-bezier(0.16, 1, 0.3, 1)',
                animation: 'guidePulse 2.5s infinite ease-in-out',
              }}
            />
          )}

          {/* The Rich Blue-and-White Guidance Bubble */}
          <div
            ref={bubbleRef}
            className={`reviewer-guide-bubble reviewer-guide-bubble--${bubblePos.placement}`}
            style={{
              position: 'fixed',
              ...(currentStep.id === 'intro'
                ? {
                    bottom: '24px',
                    right: '24px',
                    top: 'auto',
                    left: 'auto',
                  }
                : {
                    top: `${bubblePos.top}px`,
                    left: `${bubblePos.left}px`,
                  }),
              width:
                currentStep.id === 'intro'
                  ? 'clamp(300px, 90vw, 380px)'
                  : bubblePos.placement === 'center'
                  ? 'clamp(320px, 90vw, 440px)'
                  : 'clamp(290px, 92vw, 360px)',
              maxWidth: 'calc(100vw - 28px)',
              backgroundColor: '#1D4ED8',
              backgroundImage: 'linear-gradient(135deg, #1E40AF 0%, #2563EB 100%)',
              color: '#FFFFFF',
              borderRadius: '16px',
              padding: '20px 22px',
              boxShadow: '0 14px 38px rgba(0, 0, 0, 0.42), 0 0 25px rgba(37, 99, 235, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.26)',
              zIndex: 980,
              fontFamily: 'var(--font-body)',
              boxSizing: 'border-box',
              pointerEvents: 'auto',
            }}
          >
            {/* Dynamic Speech Bubble Pointer (Aiming precisely toward the target) */}
            {bubblePos.placement !== 'center' && (
              <div
                className={`guide-bubble-pointer guide-bubble-pointer--${bubblePos.placement}`}
                style={
                  bubblePos.placement === 'top' || bubblePos.placement === 'bottom'
                    ? { left: `${bubblePos.pointerOffset}px` }
                    : { top: `${bubblePos.pointerOffset}px` }
                }
                aria-hidden="true"
              />
            )}

            {/* Bubble Header: Step Counter & Close Button */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '10px',
              }}
            >
              {/* Step Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(255, 255, 255, 0.18)',
                  border: '1px solid rgba(255, 255, 255, 0.28)',
                  fontSize: '0.74rem',
                  fontFamily: 'var(--font-tech)',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#FFFFFF',
                }}
              >
                {currentStep.stepNumber === 0 ? (
                  <>
                    <Sparkles size={12} color="#93C5FD" />
                    <span>Tutorial</span>
                  </>
                ) : currentStep.stepNumber === 8 ? (
                  <>
                    <CheckCircle size={12} color="#86EFAC" />
                    <span>Complete</span>
                  </>
                ) : (
                  <>
                    <Compass size={12} color="#93C5FD" />
                    <span>Step {currentStep.stepNumber} of {currentStep.totalDisplaySteps}</span>
                  </>
                )}
              </div>

              {/* Accessible Close / Quit Button */}
              <button
                onClick={quitGuide}
                aria-label="Exit guide"
                title="Exit Guide"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.75)',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 150ms ease, background-color 150ms ease',
                }}
                className="guide-exit-icon-btn"
              >
                <X size={18} />
              </button>
            </div>

            {/* Bubble Title */}
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: currentStep.preferredPlacement === 'center' ? '1.25rem' : '1.1rem',
                fontWeight: 700,
                color: '#FFFFFF',
                margin: '0 0 8px',
                lineHeight: 1.3,
                letterSpacing: '-0.01em',
              }}
            >
              {currentStep.title}
            </h3>

            {/* Bubble Body Content */}
            <p
              style={{
                fontSize: '0.9rem',
                lineHeight: 1.55,
                color: 'rgba(255, 255, 255, 0.95)',
                margin: '0 0 14px',
              }}
            >
              {currentStep.content}
            </p>

            {/* Optional Small Note (e.g., approval policy explanation) */}
            {currentStep.actionNote && (
              <div
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(0, 0, 0, 0.22)',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  fontSize: '0.78rem',
                  lineHeight: 1.4,
                  color: '#DBEAFE',
                  marginBottom: '14px',
                }}
              >
                💡 {currentStep.actionNote}
              </div>
            )}

            {/* Footer Navigation Controls */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '10px',
                borderTop: '1px solid rgba(255, 255, 255, 0.18)',
                gap: '8px',
                flexWrap: 'wrap',
              }}
            >
              {/* Left Side: Quit Guide Text Button */}
              {currentStep.id !== 'completion' && (
                <button
                  onClick={quitGuide}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.72)',
                    fontFamily: 'var(--font-tech)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    transition: 'color 150ms ease',
                  }}
                  className="guide-quit-text-btn"
                >
                  Quit Guide
                </button>
              )}

              {/* Right Side: Back & Next / Finish Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
                {/* Back Button (Only on intermediate steps) */}
                {currentStep.stepNumber > 1 && currentStep.stepNumber < 8 && (
                  <button
                    onClick={prevStep}
                    aria-label="Previous step"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.16)',
                      color: '#FFFFFF',
                      border: '1px solid rgba(255, 255, 255, 0.22)',
                      fontFamily: 'var(--font-tech)',
                      fontWeight: 600,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      transition: 'all 150ms ease',
                    }}
                    className="guide-back-btn"
                  >
                    <ChevronLeft size={16} />
                    <span>Back</span>
                  </button>
                )}

                {/* Step 0: Let's Start */}
                {currentStep.id === 'intro' && (
                  <button
                    onClick={nextStep}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '9px 18px',
                      borderRadius: '8px',
                      backgroundColor: '#FFFFFF',
                      color: '#1D4ED8',
                      border: 'none',
                      fontFamily: 'var(--font-tech)',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      letterSpacing: '0.02em',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                      transition: 'all 150ms ease',
                    }}
                    className="guide-primary-btn"
                  >
                    <span>Let's Start</span>
                    <ArrowRight size={15} />
                  </button>
                )}

                {/* Steps 1 to 7: Next Step */}
                {currentStep.stepNumber >= 1 && currentStep.stepNumber < 8 && (
                  <button
                    onClick={nextStep}
                    aria-label="Next step"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '9px 18px',
                      borderRadius: '8px',
                      backgroundColor: '#FFFFFF',
                      color: '#1D4ED8',
                      border: 'none',
                      fontFamily: 'var(--font-tech)',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      letterSpacing: '0.02em',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                      transition: 'all 150ms ease',
                    }}
                    className="guide-primary-btn"
                  >
                    <span>{currentStep.id === 'find-review-page' ? 'Open Review Section' : 'Next'}</span>
                    <ChevronRight size={16} />
                  </button>
                )}

                {/* Step 8 (Completion): Finish & Start Again */}
                {currentStep.id === 'completion' && (
                  <div style={{ display: 'flex', gap: '8px', width: '100%', justifyContent: 'space-between' }}>
                    <button
                      onClick={restartGuide}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '9px 16px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.18)',
                        color: '#FFFFFF',
                        border: '1px solid rgba(255, 255, 255, 0.28)',
                        fontFamily: 'var(--font-tech)',
                        fontWeight: 600,
                        fontSize: '0.86rem',
                        cursor: 'pointer',
                        transition: 'all 150ms ease',
                      }}
                      className="guide-restart-btn"
                    >
                      <RotateCcw size={15} />
                      <span>Start Again</span>
                    </button>
                    <button
                      onClick={quitGuide}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '9px 20px',
                        borderRadius: '8px',
                        backgroundColor: '#FFFFFF',
                        color: '#1D4ED8',
                        border: 'none',
                        fontFamily: 'var(--font-tech)',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                        transition: 'all 150ms ease',
                      }}
                      className="guide-primary-btn"
                    >
                      <span>Finish</span>
                      <CheckCircle size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Embedded Styles for Non-Blocking Guidance System */}
      <style>{`
        @keyframes guidePulse {
          0%, 100% {
            border-color: #3B82F6;
            box-shadow: 0 0 16px rgba(59, 130, 246, 0.45);
          }
          50% {
            border-color: #60A5FA;
            box-shadow: 0 0 24px rgba(59, 130, 246, 0.7);
          }
        }

        /* Speech Bubble Pointers (Sharp triangles centered on pointerOffset) */
        .guide-bubble-pointer {
          position: absolute;
          width: 0;
          height: 0;
        }

        /* Pointer at Top (when bubble is below target, pointing UP) */
        .guide-bubble-pointer--bottom {
          top: -10px;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-bottom: 10px solid #1E40AF;
          transform: translateX(-50%);
        }

        /* Pointer at Bottom (when bubble is above target, pointing DOWN) */
        .guide-bubble-pointer--top {
          bottom: -10px;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 10px solid #2563EB;
          transform: translateX(-50%);
        }

        /* Pointer at Left (when bubble is to right of target, pointing LEFT) */
        .guide-bubble-pointer--right {
          left: -10px;
          border-top: 10px solid transparent;
          border-bottom: 10px solid transparent;
          border-right: 10px solid #1E40AF;
          transform: translateY(-50%);
        }

        /* Pointer at Right (when bubble is to left of target, pointing RIGHT) */
        .guide-bubble-pointer--left {
          right: -10px;
          border-top: 10px solid transparent;
          border-bottom: 10px solid transparent;
          border-left: 10px solid #2563EB;
          transform: translateY(-50%);
        }

        /* Hover states */
        .guide-primary-btn:hover,
        .guide-primary-action:hover {
          background-color: #EFF6FF !important;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3) !important;
        }
        .guide-back-btn:hover,
        .guide-secondary-action:hover,
        .guide-restart-btn:hover {
          background-color: rgba(255, 255, 255, 0.26) !important;
        }
        .guide-quit-text-btn:hover {
          color: #FFFFFF !important;
          text-decoration: underline;
        }
        .guide-close-btn:hover,
        .guide-exit-icon-btn:hover {
          color: #FFFFFF !important;
          background-color: rgba(255, 255, 255, 0.15) !important;
        }
      `}</style>
    </>
  );
};
