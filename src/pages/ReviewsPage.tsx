import React from 'react';
import { PublicReviewsList } from '../components/PublicReviewsList';
import { ReviewStatsOverview } from '../components/ReviewStatsOverview';
import { Review, ReviewStats, ReactionType, NewReviewSubmission } from '../types/database';
import { useRouter } from '../routes/router';
import { MessageSquarePlus, Sparkles, ShieldCheck, Compass } from 'lucide-react';
import { useReviewerGuide } from '../context/ReviewerGuideContext';
import { ReviewSubmissionForm } from '../components/ReviewSubmissionForm';

interface ReviewsPageProps {
  reviews: Review[];
  stats: ReviewStats;
  loading: boolean;
  onReact: (reviewId: string, reactionType: ReactionType) => Promise<void>;
  onReviewSubmit?: (submission: NewReviewSubmission) => Promise<{ success: boolean; error?: string }>;
}

export const ReviewsPage: React.FC<ReviewsPageProps> = ({
  reviews,
  stats,
  loading,
  onReact,
  onReviewSubmit,
}) => {
  const { navigate } = useRouter();
  const { startGuide } = useReviewerGuide();

  const handleScrollToSubmit = () => {
    const el = document.getElementById('submit-review');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

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

          {/* Quick Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={onReviewSubmit ? handleScrollToSubmit : () => navigate('home', 'submit-review')}
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

            {/* How to Leave a Review Guide Button */}
            <button
              onClick={() => startGuide(0)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                borderRadius: '8px',
                backgroundColor: 'rgba(37, 99, 235, 0.16)',
                color: '#93C5FD',
                fontFamily: 'var(--font-tech)',
                fontWeight: 600,
                fontSize: '0.88rem',
                letterSpacing: '0.05em',
                border: '1px solid rgba(59, 130, 246, 0.45)',
                boxShadow: '0 0 15px rgba(37, 99, 235, 0.2)',
                transition: 'all 200ms ease',
                cursor: 'pointer',
              }}
              className="reviews-guide-btn"
            >
              <Compass size={16} color="#93C5FD" />
              <span>How to Leave a Review</span>
            </button>
          </div>
        </header>

        {/* Real Review Overview & Distribution Metrics */}
        <ReviewStatsOverview stats={stats} loading={loading} />

        {/* Review Submission Form on Reviews Page (Allows direct submission & seamless guide tour) */}
        {onReviewSubmit && (
          <div style={{ margin: '2rem 0' }}>
            <ReviewSubmissionForm onSubmit={onReviewSubmit} />
          </div>
        )}

        {/* Dedicated Public Reviews List */}
        <PublicReviewsList
          reviews={reviews}
          loading={loading}
          onReact={onReact}
          onOpenSubmitForm={onReviewSubmit ? handleScrollToSubmit : () => navigate('home', 'submit-review')}
        />
      </div>
    </div>
  );
};
