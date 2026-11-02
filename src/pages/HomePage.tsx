import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { ReviewStatsOverview } from '../components/ReviewStatsOverview';
import { ReviewSubmissionForm } from '../components/ReviewSubmissionForm';
import { TrustSection } from '../components/TrustSection';
import { Review, ReviewStats, NewReviewSubmission } from '../types/database';
import { useRouter } from '../routes/router';
import { useReviewerGuide } from '../context/ReviewerGuideContext';

interface HomePageProps {
  stats: ReviewStats;
  loading: boolean;
  onReviewSubmit: (submission: NewReviewSubmission) => Promise<{ success: boolean; error?: string }>;
}

export const HomePage: React.FC<HomePageProps> = ({
  stats,
  loading,
  onReviewSubmit,
}) => {
  const { navigate, targetSection, clearTargetSection } = useRouter();
  const { startGuide } = useReviewerGuide();

  const handleScrollToSubmit = React.useCallback(() => {
    const el = document.getElementById('submit-review');
    if (el) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    }
  }, []);

  // Handle in-page scrolling when navigating back with targetSection or hash
  React.useEffect(() => {
    if (targetSection === 'submit-review') {
      const timer = setTimeout(() => {
        handleScrollToSubmit();
        clearTargetSection();
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [targetSection, clearTargetSection, handleScrollToSubmit]);

  return (
    <div className="home-page">
      {/* 1. Hero Section with Screen-Filling 3D Typography & Action Buttons */}
      <HeroSection
        onExploreReviews={() => navigate('reviews')}
        onLeaveReview={handleScrollToSubmit}
        onNavigateToAbout={() => navigate('about')}
        onNavigateToSocials={() => navigate('socials')}
        onStartGuide={() => startGuide(0)}
      />

      {/* 2. Key Metrics Snapshot */}
      <ReviewStatsOverview stats={stats} loading={loading} />

      {/* 3. Submit Review Form (The ONLY review section on homepage) */}
      <ReviewSubmissionForm onSubmit={onReviewSubmit} />

      {/* 4. Quick Verification & Trust Highlights */}
      <TrustSection />
    </div>
  );
};
