import React, { useState, useMemo } from 'react';
import {
  Star,
  ShieldCheck,
  Search,
  ThumbsUp,
  Heart,
  CheckCircle2,
  Maximize2,
  X,
  Globe,
} from 'lucide-react';
import type { Review, ReviewPlatform, ReactionType } from '../types/database';
import { getCountryByCode } from '../data/countries';

interface PublicReviewsListProps {
  reviews: Review[];
  loading?: boolean;
  onReact: (reviewId: string, reactionType: ReactionType) => Promise<void>;
  onOpenSubmitForm: () => void;
}

export const PublicReviewsList: React.FC<PublicReviewsListProps> = ({
  reviews,
  loading = false,
  onReact,
  onOpenSubmitForm,
}) => {
  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [starFilter, setStarFilter] = useState<string>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'highest'>('newest');

  // Available countries derived from reviews
  const availableCountries = useMemo(() => {
    const map = new Map<string, { code: string; name: string; flag: string }>();
    reviews.forEach((r) => {
      if (r.country_code) {
        const countryInfo = getCountryByCode(r.country_code);
        map.set(r.country_code, {
          code: r.country_code,
          name: r.country_name || countryInfo?.name || r.country_code,
          flag: countryInfo?.flag || '🌐',
        });
      }
    });
    return Array.from(map.values());
  }, [reviews]);

  // Pagination state
  const [visibleCount, setVisibleCount] = useState(6);

  // Screenshot modal preview state
  const [activeScreenshot, setActiveScreenshot] = useState<string | null>(null);

  // Local reacting state for button animations
  const [reactingIds, setReactingIds] = useState<Record<string, boolean>>({});

  // Filter & Sort calculation
  const filteredReviews = useMemo(() => {
    let result = [...reviews];

    // Search query filter (safe string matching)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.customer_name.toLowerCase().includes(q) ||
          r.review_text.toLowerCase().includes(q) ||
          (r.country_name && r.country_name.toLowerCase().includes(q))
      );
    }

    // Platform filter
    if (platformFilter !== 'all') {
      result = result.filter((r) => r.platform === platformFilter);
    }

    // Country filter
    if (countryFilter !== 'all') {
      result = result.filter((r) => r.country_code?.toUpperCase() === countryFilter.toUpperCase());
    }

    // Star filter
    if (starFilter !== 'all') {
      const targetStars = parseInt(starFilter, 10);
      result = result.filter((r) => r.rating === targetStars);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'highest') {
        return b.rating - a.rating;
      }
      // 'newest' default
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return result;
  }, [reviews, searchQuery, platformFilter, starFilter, countryFilter, sortBy]);

  const displayedReviews = filteredReviews.slice(0, visibleCount);
  const canLoadMore = visibleCount < filteredReviews.length;

  const handleReactionClick = async (reviewId: string, type: ReactionType) => {
    const key = `${reviewId}-${type}`;
    if (reactingIds[key]) return;

    setReactingIds((prev) => ({ ...prev, [key]: true }));
    try {
      await onReact(reviewId, type);
    } finally {
      setTimeout(() => {
        setReactingIds((prev) => ({ ...prev, [key]: false }));
      }, 350);
    }
  };

  const platforms: ReviewPlatform[] = [
    'Discord',
    'WhatsApp',
    'Instagram',
    'Facebook',
    'TikTok',
    'Other',
  ];

  return (
    <section
      id="reviews-list"
      style={{
        position: 'relative',
        padding: '4rem 0',
        zIndex: 2,
      }}
    >
      <div className="container">
        {/* Section Header */}
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
            Verified Client Feedback
          </span>
          <h2
            className="cinema-section-heading"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
          >
            Real Stories. Real Proof.
          </h2>
          <p
            className="cinema-section-subtitle"
            style={{
              fontSize: '1rem',
              maxWidth: '560px',
              margin: '0.5rem auto 0',
            }}
          >
            Explore experiences submitted by our community and confirmed through our
            manual moderation protocol.
          </p>
        </div>

        {/* Filters and Search Bar Container */}
        <div
          className="glass-panel"
          style={{
            padding: '1.25rem',
            marginBottom: '2.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Search Input */}
          <div
            style={{
              flex: '1 1 260px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Search
              size={18}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: '12px' }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client name or keyword..."
              aria-label="Search reviews"
              style={{
                width: '100%',
                padding: '10px 12px 10px 38px',
                backgroundColor: 'var(--input-bg)',
                border: '1px solid var(--input-border)',
                borderRadius: '8px',
                color: 'var(--input-text)',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  color: 'var(--text-muted)',
                }}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Controls: Platform, Rating, Sort */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              alignItems: 'center',
            }}
          >
            {/* Platform Selector */}
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              aria-label="Filter by platform"
              style={selectStyle}
            >
              <option value="all" style={optionStyle}>
                All Platforms
              </option>
              {platforms.map((p) => (
                <option key={p} value={p} style={optionStyle}>
                  {p}
                </option>
              ))}
            </select>

            {/* Country Selector (if practical) */}
            {availableCountries.length > 0 && (
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                aria-label="Filter by country"
                style={selectStyle}
              >
                <option value="all" style={optionStyle}>
                  All Countries ({availableCountries.length})
                </option>
                {availableCountries.map((c) => (
                  <option key={c.code} value={c.code} style={optionStyle}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            )}

            {/* Star Rating Selector */}
            <select
              value={starFilter}
              onChange={(e) => setStarFilter(e.target.value)}
              aria-label="Filter by star rating"
              style={selectStyle}
            >
              <option value="all" style={optionStyle}>
                All Ratings
              </option>
              <option value="5" style={optionStyle}>
                5 Stars
              </option>
              <option value="4" style={optionStyle}>
                4 Stars
              </option>
              <option value="3" style={optionStyle}>
                3 Stars
              </option>
              <option value="2" style={optionStyle}>
                2 Stars
              </option>
              <option value="1" style={optionStyle}>
                1 Star
              </option>
            </select>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'highest')}
              aria-label="Sort reviews"
              style={selectStyle}
            >
              <option value="newest" style={optionStyle}>
                Newest First
              </option>
              <option value="highest" style={optionStyle}>
                Highest Rated
              </option>
            </select>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
              gap: '1.5rem',
            }}
          >
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="glass-panel"
                style={{
                  height: '240px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.5,
                }}
              >
                <span
                  style={{
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-tech)',
                    fontSize: '0.88rem',
                  }}
                >
                  Loading verified chronicles...
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Reviews Grid */}
        {!loading && displayedReviews.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
              gap: '1.5rem',
            }}
          >
            {displayedReviews.map((review) => {
              const formattedDate = new Date(review.created_at).toLocaleDateString(
                'en-US',
                {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                }
              );

              return (
                <article
                  key={review.id}
                  className="glass-panel review-card"
                  style={{
                    padding: 'clamp(1.1rem, 3vw, 1.6rem)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    transition:
                      'transform 250ms cubic-bezier(0.16, 1, 0.3, 1), border-color 250ms, box-shadow 250ms',
                  }}
                >
                  {/* Top Bar: Customer Info + Verified Badge */}
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        marginBottom: '0.75rem',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <h3
                            style={{
                              fontSize: '1.15rem',
                              fontWeight: 600,
                              fontFamily: 'var(--font-heading)',
                              color: 'var(--heading-color)',
                              letterSpacing: '0.01em',
                              margin: 0,
                            }}
                          >
                            {review.customer_name}
                          </h3>

                          {/* Country Badge */}
                          {(review.country_code || review.country_name) && (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                backgroundColor: 'var(--bg-elevated)',
                                border: '1px solid var(--border-subtle)',
                                fontSize: '0.74rem',
                                fontFamily: 'var(--font-tech)',
                                color: 'var(--text-secondary)',
                              }}
                              title={`Customer from ${review.country_name || review.country_code}`}
                            >
                              <span>{getCountryByCode(review.country_code)?.flag || '🌐'}</span>
                              <span>{review.country_name || getCountryByCode(review.country_code)?.name || review.country_code}</span>
                            </span>
                          )}
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginTop: '6px',
                          }}
                        >
                          {/* Platform Pill */}
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              backgroundColor: 'rgba(255, 255, 255, 0.06)',
                              fontSize: '0.72rem',
                              fontFamily: 'var(--font-tech)',
                              color: 'var(--text-secondary)',
                              letterSpacing: '0.04em',
                            }}
                          >
                            {review.platform}
                          </span>

                          {/* Date */}
                          <time
                            dateTime={review.created_at}
                            style={{
                              fontSize: '0.75rem',
                              color: 'var(--text-muted)',
                              fontFamily: 'var(--font-tech)',
                            }}
                          >
                            {formattedDate}
                          </time>
                        </div>
                      </div>

                      {/* Verified Badge — ONLY rendered if purchase_verified is TRUE! */}
                      {review.purchase_verified && (
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(255, 23, 68, 0.12)',
                            border: '1px solid rgba(255, 23, 68, 0.35)',
                            color: 'var(--red-accent)',
                            fontSize: '0.72rem',
                            fontFamily: 'var(--font-tech)',
                            fontWeight: 600,
                            letterSpacing: '0.04em',
                            flexShrink: 0,
                            boxShadow: '0 0 10px rgba(255, 23, 68, 0.2)',
                          }}
                          title="Verified Purchase manually authenticated by administrator"
                        >
                          <ShieldCheck size={13} />
                          <span>Verified Purchase</span>
                        </div>
                      )}
                    </div>

                    {/* Star Rating Display */}
                    <div
                      style={{
                        display: 'flex',
                        gap: '3px',
                        margin: '0.75rem 0',
                      }}
                      aria-label={`Rating: ${review.rating} out of 5 stars`}
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          fill={
                            star <= review.rating ? 'var(--red-accent)' : 'transparent'
                          }
                          color={
                            star <= review.rating
                              ? 'var(--red-accent)'
                              : 'rgba(255, 255, 255, 0.2)'
                          }
                          style={{
                            filter:
                              star <= review.rating
                                ? 'drop-shadow(0 0 4px rgba(255, 23, 68, 0.4))'
                                : 'none',
                          }}
                        />
                      ))}
                    </div>

                    {/* Review Text with Safe Sanitized Presentation */}
                    <p
                      style={{
                        color: 'var(--text-primary)',
                        fontSize: '0.94rem',
                        lineHeight: 1.65,
                        margin: '0.8rem 0 1.2rem',
                        whiteSpace: 'pre-line',
                        wordBreak: 'break-word',
                      }}
                    >
                      {review.review_text}
                    </p>

                    {/* Optional Approved Screenshot Thumbnail */}
                    {review.screenshot_url && (
                      <div style={{ marginBottom: '1.2rem' }}>
                        <button
                          onClick={() => setActiveScreenshot(review.screenshot_url || null)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 23, 68, 0.25)',
                            color: '#FFFFFF',
                            fontSize: '0.78rem',
                            fontFamily: 'var(--font-tech)',
                            transition: 'all 200ms ease',
                          }}
                          className="screenshot-thumb-btn"
                          aria-label="View verified purchase screenshot proof"
                        >
                          <Maximize2 size={13} color="var(--red-accent)" />
                          <span>View Purchase Evidence</span>
                        </button>
                      </div>
                    )}

                    {/* Administrator Official Reply (if present) */}
                    {review.admin_reply && (
                      <div
                        style={{
                          backgroundColor: 'rgba(176, 0, 32, 0.08)',
                          borderLeft: '3px solid var(--red-accent)',
                          padding: '0.9rem 1rem',
                          borderRadius: '0 8px 8px 0',
                          marginBottom: '1.2rem',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            marginBottom: '4px',
                          }}
                        >
                          <span
                            style={{
                              fontFamily: 'var(--font-display)',
                              fontWeight: 800,
                              fontSize: '0.76rem',
                              color: 'var(--red-accent)',
                              letterSpacing: '0.08em',
                              textTransform: 'uppercase',
                            }}
                          >
                            ÉVANN_STORIES Response
                          </span>
                          <span
                            style={{
                              display: 'inline-block',
                              width: '4px',
                              height: '4px',
                              borderRadius: '50%',
                              backgroundColor: 'rgba(255, 23, 68, 0.5)',
                            }}
                          />
                          <span
                            style={{
                              fontSize: '0.7rem',
                              color: 'var(--text-muted)',
                              fontFamily: 'var(--font-tech)',
                            }}
                          >
                            Official Administrator
                          </span>
                        </div>
                        <p
                          style={{
                            fontSize: '0.86rem',
                            color: 'var(--text-secondary)',
                            lineHeight: 1.55,
                            margin: 0,
                            fontStyle: 'italic',
                          }}
                        >
                          "{review.admin_reply}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Reaction Controls (Helpful, Heart, Thumbs Up) */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      paddingTop: '0.8rem',
                      borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    <button
                      onClick={() => handleReactionClick(review.id, 'helpful')}
                      disabled={reactingIds[`${review.id}-helpful`]}
                      style={reactionBtnStyle(review.user_reacted?.helpful)}
                      aria-label="React with Helpful"
                    >
                      <CheckCircle2
                        size={14}
                        color={
                          review.user_reacted?.helpful
                            ? 'var(--red-accent)'
                            : 'currentColor'
                        }
                      />
                      <span>Helpful</span>
                      <span style={reactionCountBadgeStyle}>
                        {review.reactions?.helpful || 0}
                      </span>
                    </button>

                    <button
                      onClick={() => handleReactionClick(review.id, 'heart')}
                      disabled={reactingIds[`${review.id}-heart`]}
                      style={reactionBtnStyle(review.user_reacted?.heart)}
                      aria-label="React with Heart"
                    >
                      <Heart
                        size={14}
                        fill={review.user_reacted?.heart ? '#FF1744' : 'transparent'}
                        color={
                          review.user_reacted?.heart
                            ? 'var(--red-accent)'
                            : 'currentColor'
                        }
                      />
                      <span style={reactionCountBadgeStyle}>
                        {review.reactions?.heart || 0}
                      </span>
                    </button>

                    <button
                      onClick={() => handleReactionClick(review.id, 'thumbs_up')}
                      disabled={reactingIds[`${review.id}-thumbs_up`]}
                      style={reactionBtnStyle(review.user_reacted?.thumbs_up)}
                      aria-label="React with Thumbs Up"
                    >
                      <ThumbsUp
                        size={14}
                        fill={
                          review.user_reacted?.thumbs_up ? '#FF1744' : 'transparent'
                        }
                        color={
                          review.user_reacted?.thumbs_up
                            ? 'var(--red-accent)'
                            : 'currentColor'
                        }
                      />
                      <span style={reactionCountBadgeStyle}>
                        {review.reactions?.thumbs_up || 0}
                      </span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Empty State when no reviews match filters */}
        {!loading && filteredReviews.length === 0 && (
          <div
            className="glass-panel"
            style={{
              padding: '3rem 1.5rem',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1.05rem',
                marginBottom: '1rem',
              }}
            >
              No reviews match the selected filter criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setPlatformFilter('all');
                setStarFilter('all');
              }}
              style={{
                padding: '8px 18px',
                borderRadius: '6px',
                border: '1px solid rgba(255, 23, 68, 0.4)',
                backgroundColor: 'rgba(255, 23, 68, 0.1)',
                color: 'var(--heading-color)',
                fontFamily: 'var(--font-heading)',
                fontSize: '0.85rem',
              }}
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Load More Button */}
        {canLoadMore && (
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              style={{
                padding: '12px 32px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-glass)',
                color: 'var(--heading-color)',
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                fontSize: '0.9rem',
                letterSpacing: '0.04em',
                boxShadow: 'var(--shadow-subtle)',
                transition: 'all 200ms ease',
              }}
              className="load-more-btn"
            >
              Load More Reviews ({filteredReviews.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </div>

      {/* Screenshot Zoom Modal */}
      {activeScreenshot && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged Purchase Evidence Preview"
          onClick={() => setActiveScreenshot(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(5, 5, 5, 0.92)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '900px',
              maxHeight: '90vh',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 23, 68, 0.35)',
              boxShadow: '0 0 40px rgba(0, 0, 0, 0.9)',
            }}
          >
            <button
              onClick={() => setActiveScreenshot(null)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                cursor: 'pointer',
                zIndex: 10,
              }}
              aria-label="Close screenshot preview"
            >
              <X size={18} />
            </button>
            <img
              src={activeScreenshot}
              alt="Verified customer transaction evidence"
              style={{
                maxWidth: '100%',
                maxHeight: '85vh',
                display: 'block',
                objectFit: 'contain',
              }}
            />
          </div>
        </div>
      )}

      {/* Hover & Card Styles */}
      <style>{`
        .review-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 23, 68, 0.45);
          box-shadow: 0 12px 30px -5px rgba(0, 0, 0, 0.8), 0 0 20px rgba(255, 23, 68, 0.15) !important;
        }
        .screenshot-thumb-btn:hover {
          background-color: rgba(255, 23, 68, 0.12) !important;
          border-color: rgba(255, 23, 68, 0.5) !important;
        }
        .load-more-btn:hover {
          border-color: var(--red-accent) !important;
          box-shadow: 0 0 20px rgba(255, 23, 68, 0.35) !important;
        }
      `}</style>
    </section>
  );
};

const selectStyle: React.CSSProperties = {
  backgroundColor: 'var(--input-bg)',
  border: '1px solid var(--input-border)',
  borderRadius: '8px',
  color: 'var(--input-text)',
  padding: '10px 14px',
  fontSize: '0.88rem',
  fontFamily: 'var(--font-tech)',
  outline: 'none',
  cursor: 'pointer',
};

const optionStyle: React.CSSProperties = {
  backgroundColor: 'var(--bg-elevated)',
  color: 'var(--text-primary)',
};

const reactionBtnStyle = (isActive?: boolean): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 10px',
  borderRadius: '6px',
  border: isActive
    ? '1px solid rgba(255, 23, 68, 0.45)'
    : '1px solid rgba(255, 255, 255, 0.08)',
  backgroundColor: isActive ? 'rgba(255, 23, 68, 0.12)' : 'rgba(255, 255, 255, 0.03)',
  color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
  fontSize: '0.78rem',
  fontFamily: 'var(--font-tech)',
  cursor: 'pointer',
  transition: 'all 180ms ease',
});

const reactionCountBadgeStyle: React.CSSProperties = {
  fontSize: '0.74rem',
  opacity: 0.85,
  fontWeight: 600,
};
