import React, { useEffect, useState } from 'react';
import { Star, ShieldCheck, Award, TrendingUp } from 'lucide-react';
import { ReviewStats } from '../types/database';

interface ReviewStatsOverviewProps {
  stats: ReviewStats;
  loading?: boolean;
}

export const ReviewStatsOverview: React.FC<ReviewStatsOverviewProps> = ({
  stats,
  loading = false,
}) => {
  // Animated counter state
  const [displayedRating, setDisplayedRating] = useState(0);
  const [displayedTotal, setDisplayedTotal] = useState(0);

  useEffect(() => {
    if (loading) return;

    let start = 0;
    const targetRating = stats.averageRating;
    const targetTotal = stats.totalReviews;
    const duration = 900;
    const startTime = performance.now();

    const animateCounters = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);

      setDisplayedRating(Number((targetRating * ease).toFixed(1)));
      setDisplayedTotal(Math.floor(targetTotal * ease));

      if (progress < 1) {
        requestAnimationFrame(animateCounters);
      }
    };

    requestAnimationFrame(animateCounters);
  }, [stats.averageRating, stats.totalReviews, loading]);

  const hasReviews = stats.totalReviews > 0;

  return (
    <section
      id="review-overview"
      style={{
        position: 'relative',
        padding: '3rem 0',
        zIndex: 2,
      }}
    >
      <div className="container">
        {/* Section Heading */}
        <div className="section-header-cinema" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-tech)',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--red-accent)',
              display: 'inline-block',
              marginBottom: '0.5rem',
            }}
          >
            Audited Performance Metrics
          </span>
          <h2
            className="cinema-section-heading"
            style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
          >
            Review Metrics & Integrity
          </h2>
          <p
            className="cinema-section-subtitle"
            style={{
              fontSize: '0.98rem',
              maxWidth: '540px',
              margin: '0.5rem auto 0',
            }}
          >
            Calculated strictly from approved customer evaluations. No simulated scores.
          </p>
        </div>

        {/* Content Container */}
        <div
          className="glass-panel"
          style={{
            padding: 'clamp(1.5rem, 3vw, 2.5rem)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle background glow */}
          <div
            style={{
              position: 'absolute',
              top: '-30%',
              right: '-10%',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255, 23, 68, 0.08) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          {!hasReviews ? (
            /* Honest Empty State */
            <div
              style={{
                textAlign: 'center',
                padding: '2.5rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 23, 68, 0.08)',
                  border: '1px solid rgba(255, 23, 68, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Award size={28} color="var(--red-accent)" />
              </div>
              <h3
                style={{
                  fontSize: '1.35rem',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  color: 'var(--heading-color)',
                }}
              >
                No Customer Reviews Recorded Yet
              </h3>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  maxWidth: '480px',
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                }}
              >
                All ratings on ÉVANN_STORIES are transparently drawn from verified buyers.
                Be the inaugural client to experience our service and leave an authenticated review.
              </p>
            </div>
          ) : (
            /* Full Stats Grid */
            <div
              className="stats-grid-container"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
                gap: '2rem',
                alignItems: 'center',
              }}
            >
              {/* Score Display */}
              <div
                className="stats-score-column"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  borderRight: '1px solid var(--border-subtle)',
                  paddingRight: '1.5rem',
                }}
              >
                <div
                  style={{
                    fontSize: 'clamp(3.8rem, 6vw, 5rem)',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    lineHeight: 1,
                    color: 'var(--heading-color)',
                    textShadow: '0 0 25px rgba(255, 23, 68, 0.3)',
                  }}
                >
                  {displayedRating.toFixed(1)}
                </div>

                {/* Star visual */}
                <div
                  style={{
                    display: 'flex',
                    gap: '4px',
                    margin: '0.8rem 0 0.5rem',
                  }}
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={22}
                      fill={
                        star <= Math.round(stats.averageRating)
                          ? 'var(--red-accent)'
                          : 'transparent'
                      }
                      color={
                        star <= Math.round(stats.averageRating)
                          ? 'var(--red-accent)'
                          : 'rgba(255, 255, 255, 0.2)'
                      }
                      style={{
                        filter:
                          star <= Math.round(stats.averageRating)
                            ? 'drop-shadow(0 0 6px rgba(255, 23, 68, 0.5))'
                            : 'none',
                      }}
                    />
                  ))}
                </div>

                <div
                  style={{
                    fontFamily: 'var(--font-tech)',
                    fontSize: '0.92rem',
                    color: 'var(--text-secondary)',
                    letterSpacing: '0.04em',
                  }}
                >
                  Based on{' '}
                  <strong style={{ color: 'var(--heading-color)' }}>{displayedTotal}</strong>{' '}
                  approved {stats.totalReviews === 1 ? 'review' : 'reviews'}
                </div>

                {stats.verifiedCount > 0 && (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginTop: '0.8rem',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(255, 23, 68, 0.08)',
                      border: '1px solid rgba(255, 23, 68, 0.25)',
                      fontSize: '0.75rem',
                      color: 'var(--red-accent)',
                      fontFamily: 'var(--font-tech)',
                    }}
                  >
                    <ShieldCheck size={14} />
                    <span>
                      {Math.round((stats.verifiedCount / stats.totalReviews) * 100)}% Verified
                      Purchases
                    </span>
                  </div>
                )}
              </div>

              {/* Star Rating Distribution Bars */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  width: '100%',
                }}
              >
                {([5, 4, 3, 2, 1] as const).map((stars) => {
                  const count = stats.distribution[stars] || 0;
                  const percentage =
                    stats.totalReviews > 0
                      ? Math.round((count / stats.totalReviews) * 100)
                      : 0;

                  return (
                    <div
                      key={stars}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: '0.85rem',
                        fontFamily: 'var(--font-tech)',
                      }}
                    >
                      <span
                        style={{
                          width: '45px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {stars} <Star size={13} fill="currentColor" color="var(--red-accent)" />
                      </span>

                      {/* Bar track */}
                      <div
                        style={{
                          flex: 1,
                          height: '8px',
                          borderRadius: '4px',
                          backgroundColor: 'rgba(255, 255, 255, 0.06)',
                          overflow: 'hidden',
                          position: 'relative',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${percentage}%`,
                            backgroundColor:
                              percentage > 0 ? 'var(--red-accent)' : 'transparent',
                            boxShadow:
                              percentage > 0
                                ? '0 0 10px rgba(255, 23, 68, 0.6)'
                                : 'none',
                            borderRadius: '4px',
                            transition: 'width 800ms cubic-bezier(0.16, 1, 0.3, 1)',
                          }}
                        />
                      </div>

                      {/* Percentage label */}
                      <span
                        style={{
                          width: '40px',
                          textAlign: 'right',
                          color: 'var(--text-muted)',
                          fontSize: '0.8rem',
                        }}
                      >
                        {count} ({percentage}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
