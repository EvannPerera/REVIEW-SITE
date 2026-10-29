import React, { useEffect, useRef, useState } from 'react';

/**
 * GlobalVideoBackground
 * Persistent, top-level cinematic Call of Duty Mobile video background.
 * Mounts ONCE in the application layout and stays active across all routes
 * (Home, Reviews, Submit Review, About, Socials, Admin Dashboard)
 * with continuous playback timeline progression.
 */
export const GlobalVideoBackground: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  // Compute Base URL compatible with GitHub Pages subpath and root deployments
  const rawBase = import.meta.env.BASE_URL || './';
  const baseUrl = rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase;
  const videoSrc = `${baseUrl}/videos/codm-cinematic.mp4`;
  const posterSrc = `${baseUrl}/videos/codm-cinematic-poster.jpg`;

  useEffect(() => {
    // Respect prefers-reduced-motion and data-saving preferences
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSaveData =
      typeof navigator !== 'undefined' &&
      Boolean((navigator as any)?.connection?.saveData);

    if (prefersReducedMotion || isSaveData) {
      setShouldLoadVideo(false);
    } else {
      setShouldLoadVideo(true);
    }
  }, []);

  // Ensure autoplay playback is initiated cleanly without audio
  useEffect(() => {
    if (shouldLoadVideo && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay may be deferred or blocked by browser battery-saver policy
      });
    }
  }, [shouldLoadVideo]);

  return (
    <div
      id="global-cinematic-bg"
      className="global-video-bg-container"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 0,
        pointerEvents: 'none',
        userSelect: 'none',
      }}
      aria-hidden="true"
    >
      {/* High-quality Static Fallback Poster Image */}
      <img
        src={posterSrc}
        alt=""
        loading="eager"
        decoding="async"
        className="global-cinematic-media"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: shouldLoadVideo && !videoError ? 0.35 : 0.88,
          transition: 'opacity 800ms ease',
          pointerEvents: 'none',
          display: 'block',
          filter: 'brightness(1.20) contrast(1.08) saturate(1.10)',
        }}
      />

      {/* Full-Viewport Continuous Video Layer */}
      {shouldLoadVideo && !videoError && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          controls={false}
          preload="metadata"
          poster={posterSrc}
          onError={() => setVideoError(true)}
          className="global-cinematic-media"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            pointerEvents: 'none',
            display: 'block',
            filter: 'brightness(1.20) contrast(1.08) saturate(1.10)',
          }}
        >
          <source src={videoSrc} type="video/mp4" />
          <source src={`${baseUrl}/videos/codm-cinematic.mp4.mp4`} type="video/mp4" />
        </video>
      )}

      {/* Fixed Dark Black Overlay with Subtle Red Tint (Lightened for enhanced action & character visibility) */}
      <div
        className="global-cinematic-overlay"
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(circle at 50% 35%, rgba(176, 0, 32, 0.10) 0%, rgba(5, 5, 8, 0.38) 60%, rgba(3, 3, 5, 0.72) 100%),
            linear-gradient(180deg, rgba(5, 5, 8, 0.48) 0%, rgba(18, 2, 6, 0.20) 45%, rgba(5, 5, 8, 0.70) 100%)
          `,
          pointerEvents: 'none',
        }}
      />

      {/* Edge Vignette */}
      <div
        className="global-cinematic-vignette"
        style={{
          position: 'absolute',
          inset: 0,
          boxShadow: 'inset 0 0 85px rgba(0, 0, 0, 0.55)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
