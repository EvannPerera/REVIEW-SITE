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
  const { navigate } = useRouter();
  const { startGuide } = useReviewerGuide();

  const handleScrollToSubmit = () => {
    const el = document.getElementById('submit-review');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
