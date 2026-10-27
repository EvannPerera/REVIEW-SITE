import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ThreeBackground } from './components/ThreeBackground';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ReviewStatsOverview } from './components/ReviewStatsOverview';
import { PublicReviewsList } from './components/PublicReviewsList';
import { ReviewSubmissionForm } from './components/ReviewSubmissionForm';
import { TrustSection } from './components/TrustSection';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import {
  Review,
  ReviewStats,
  ReactionType,
  NewReviewSubmission,
} from './types/database';
import {
  fetchPublicApprovedReviews,
  fetchAdminAllReviews,
  submitCustomerReview,
  submitReaction,
  approveReview,
  rejectReview,
  toggleVerifiedPurchase,
  updateAdminReply,
  deleteReview,
} from './services/reviewService';

export const App: React.FC = () => {
  // Public data
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Admin data & auth
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminReviews, setAdminReviews] = useState<Review[]>([]);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // 1. Initial Data Fetch & Supabase Auth Listener
  const loadPublicData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchPublicApprovedReviews();
      setReviews(data);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAdminData = useCallback(async () => {
    try {
      const data = await fetchAdminAllReviews();
      setAdminReviews(data);
    } catch (err) {
      console.error('Failed to load admin queue:', err);
    }
  }, []);

  useEffect(() => {
    loadPublicData();

    // Check existing Supabase session
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        const loggedIn = Boolean(session?.user);
        setIsAdminLoggedIn(loggedIn);
        if (loggedIn) {
          loadAdminData();
        }
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        const loggedIn = Boolean(session?.user);
        setIsAdminLoggedIn(loggedIn);
        if (loggedIn) {
          loadAdminData();
        }
      });

      return () => subscription.unsubscribe();
    } else {
      // Offline local preview check
      const localAdmin = localStorage.getItem('evann_stories_mock_admin_session') === 'true';
      setIsAdminLoggedIn(localAdmin);
      if (localAdmin) {
        loadAdminData();
      }
    }
  }, [loadPublicData, loadAdminData]);

  // 2. Computed Live Metrics from approved reviews
  const stats: ReviewStats = useMemo(() => {
    const total = reviews.length;
    if (total === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        verifiedCount: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }

    let sum = 0;
    let verified = 0;
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    reviews.forEach((r) => {
      sum += r.rating;
      if (r.purchase_verified) verified++;
      const star = Math.min(Math.max(r.rating, 1), 5) as 1 | 2 | 3 | 4 | 5;
      dist[star] = (dist[star] || 0) + 1;
    });

    return {
      averageRating: Number((sum / total).toFixed(1)),
      totalReviews: total,
      verifiedCount: verified,
      distribution: dist,
    };
  }, [reviews]);

  // 3. User Actions
  const handleReviewSubmit = async (submission: NewReviewSubmission) => {
    const res = await submitCustomerReview(submission);
    if (res.success) {
      showToast('Review submitted successfully! Placed in moderation queue.');
      if (isAdminLoggedIn) {
        await loadAdminData();
      }
    }
    return res;
  };

  const handleReact = async (reviewId: string, reactionType: ReactionType) => {
    // Optimistic UI update
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id !== reviewId) return r;
        const currentReactions = r.reactions || { helpful: 0, heart: 0, thumbs_up: 0 };
        const userReacted = r.user_reacted || { helpful: false, heart: false, thumbs_up: false };

        if (userReacted[reactionType]) {
          return r; // Already reacted
        }

        return {
          ...r,
          reactions: {
            ...currentReactions,
            [reactionType]: (currentReactions[reactionType] || 0) + 1,
          },
          user_reacted: {
            ...userReacted,
            [reactionType]: true,
          },
        };
      })
    );

    await submitReaction(reviewId, reactionType);
  };

  // 4. Admin Auth
  const handleAdminLogin = async (
    email: string,
    pass: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured) {
      // Local fallback for testing before user configures Supabase credentials
      if (email && pass.length >= 6) {
        setIsAdminLoggedIn(true);
        localStorage.setItem('evann_stories_mock_admin_session', 'true');
        await loadAdminData();
        showToast('Signed in to Moderator Console (Local Mode)');
        return { success: true };
      }
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        setIsAdminLoggedIn(true);
        await loadAdminData();
        showToast('Signed in to Moderator Console.');
        return { success: true };
      }

      return { success: false, error: 'Authentication failed.' };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const handleAdminLogout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem('evann_stories_mock_admin_session');
    }
    setIsAdminLoggedIn(false);
    showToast('Signed out of Moderator Console.');
  };

  // 5. Admin Moderation Actions
  const handleApprove = async (reviewId: string) => {
    const success = await approveReview(reviewId);
    if (success) {
      showToast('Review approved and published.');
      await loadAdminData();
      await loadPublicData();
    }
    return success;
  };

  const handleReject = async (reviewId: string) => {
    const success = await rejectReview(reviewId);
    if (success) {
      showToast('Review marked as rejected.');
      await loadAdminData();
      await loadPublicData();
    }
    return success;
  };

  const handleToggleVerified = async (reviewId: string, currentStatus: boolean) => {
    const success = await toggleVerifiedPurchase(reviewId, currentStatus);
    if (success) {
      showToast(
        !currentStatus
          ? 'Purchase marked as Verified.'
          : 'Purchase marked as Unverified.'
      );
      await loadAdminData();
      await loadPublicData();
    }
    return success;
  };

  const handleUpdateReply = async (reviewId: string, replyText: string) => {
    const success = await updateAdminReply(reviewId, replyText);
    if (success) {
      showToast('Administrator response published.');
      await loadAdminData();
      await loadPublicData();
    }
    return success;
  };

  const handleDelete = async (reviewId: string) => {
    const success = await deleteReview(reviewId);
    if (success) {
      showToast('Review permanently removed.');
      await loadAdminData();
      await loadPublicData();
    }
    return success;
  };

  // 6. Navigation Smooth Scroll
  const navigateToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="evann-stories-app" style={{ position: 'relative' }}>
      {/* Three.js Procedural Background */}
      <ThreeBackground />

      {/* Main Navigation */}
      <Navbar
        onOpenAdmin={() => setIsAdminOpen(true)}
        onNavigateToSection={navigateToSection}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      <main>
        {/* Hero Section with Interactive Typography */}
        <HeroSection
          onExploreReviews={() => navigateToSection('reviews-list')}
          onLeaveReview={() => navigateToSection('submit-review')}
        />

        {/* Real Review Overview & Distribution Metrics */}
        <ReviewStatsOverview stats={stats} loading={loading} />

        {/* Public Reviews List with Verified Badge, Reactions, and Filters */}
        <PublicReviewsList
          reviews={reviews}
          loading={loading}
          onReact={handleReact}
          onOpenSubmitForm={() => navigateToSection('submit-review')}
        />

        {/* Review Submission Form with UID & Evidence Upload */}
        <ReviewSubmissionForm onSubmit={handleReviewSubmit} />

        {/* Trust & Process Verification Details */}
        <TrustSection />
      </main>

      {/* Footer */}
      <Footer
        onNavigateToSection={navigateToSection}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Private Admin Dashboard Modal */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        isAdminLoggedIn={isAdminLoggedIn}
        onLogin={handleAdminLogin}
        onLogout={handleAdminLogout}
        reviews={adminReviews}
        onApproveReview={handleApprove}
        onRejectReview={handleReject}
        onToggleVerifiedPurchase={handleToggleVerified}
        onUpdateAdminReply={handleUpdateReply}
        onDeleteReview={handleDelete}
        onRefreshData={loadAdminData}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <aside
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#0E0E12',
            border: '1px solid var(--red-accent)',
            boxShadow: '0 0 25px rgba(255, 23, 68, 0.4)',
            borderRadius: '8px',
            padding: '12px 20px',
            color: '#FFFFFF',
            fontFamily: 'var(--font-tech)',
            fontSize: '0.9rem',
            zIndex: 300,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--red-accent)',
            }}
          />
          <span>{toastMessage}</span>
        </aside>
      )}
    </div>
  );
};

export default App;
