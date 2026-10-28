import React from 'react';
import { PublicReviewsList } from '../components/PublicReviewsList';
import { ReviewStatsOverview } from '../components/ReviewStatsOverview';
import { Review, ReviewStats, ReactionType } from '../types/database';
import { useRouter } from '../routes/router';
import { MessageSquarePlus, Sparkles, ShieldCheck } from 'lucide-react';

interface ReviewsPageProps {
  reviews: Review[];
  stats: ReviewStats;
  loading: boolean;
  onReact: (reviewId: string, reactionType: ReactionType) => Promise<void>;
}

export const ReviewsPage: React.FC<ReviewsPageProps> = ({
  reviews,
  stats,
  loading,
  onReact,
}) => {
  const { navigate } = useRouter();

  return (
    <div
      className="reviews-page"
      style={{
        paddingTop: '6.5rem',
        paddingBottom: '4rem',
        minHeight: '85vh',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div className="container">
        {/* Page Banner Header */}
        <header className="section-header-cinema" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 23, 68, 0.08)',
              border: '1px solid rgba(255, 23, 68, 0.25)',
              marginBottom: '1rem',
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
              Audited Community Feedback
            </span>
          </div>

          <h1
            className="cinema-section-heading"
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              marginBottom: '0.75rem',
            }}
          >
            Customer Reviews & Chronicles
          </h1>

          <p
            className="cinema-section-subtitle"
            style={{
              maxWidth: '650px',
              margin: '0 auto 1.75rem',
              fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
              lineHeight: 1.6,
            }}
          >
            Real feedback from verified transactions across Discord, WhatsApp, Instagram, and more.
            Every submission is checked; verified badges are awarded only through audited purchase records.
          </p>

          {/* Quick Action Button to Submit Review */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('home', 'submit-review')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '8px',
                backgroundColor: 'var(--red-accent)',
                color: '#FFFFFF',
                fontFamily: 'var(--font-tech)',
                fontWeight: 700,
                fontSize: '0.9rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                boxShadow: '0 0 20px rgba(255, 23, 68, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 200ms ease',
                cursor: 'pointer',
              }}
            >
              <MessageSquarePlus size={16} />
              <span>Leave Your Review</span>
            </button>
          </div>
        </header>

        {/* Real Review Overview & Distribution Metrics */}
        <ReviewStatsOverview stats={stats} loading={loading} />

        {/* Dedicated Public Reviews List */}
        <PublicReviewsList
          reviews={reviews}
          loading={loading}
          onReact={onReact}
          onOpenSubmitForm={() => navigate('home', 'submit-review')}
        />
      </div>
    </div>
  );
};
