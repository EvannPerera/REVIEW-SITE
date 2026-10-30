import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from '../routes/router';

export interface GuideStepConfig {
  id: string;
  stepNumber: number; // Display step number
  totalDisplaySteps: number;
  title: string;
  content: string;
  actionNote?: string;
  targetSelector: string;
  targetRoute?: 'home' | 'reviews';
  preferredPlacement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

export const GUIDE_STEPS: GuideStepConfig[] = [
  {
    id: 'intro',
    stepNumber: 0,
    totalDisplaySteps: 7,
    title: 'Welcome to ÉVANN_STORIES! 👋',
    content: "New here? No worries. I'll guide you through submitting your review in just a few simple steps.",
    targetSelector: '',
    preferredPlacement: 'center',
  },
  {
    id: 'find-review-page',
    stepNumber: 1,
    totalDisplaySteps: 7,
    title: 'Submit Review',
    content: "First, let's open the review section. Click the Submit a Review button to go directly to where you can share your experience with ÉVANN_STORIES.",
    targetSelector: '[data-guide="submit-review-hero-btn"]',
    targetRoute: 'home',
    preferredPlacement: 'bottom',
  },
  {
    id: 'explain-notice',
    stepNumber: 2,
    totalDisplaySteps: 7,
    title: 'Review Information Notice',
    content: "You're in the right place! Before you start, take a quick look at the information notice at the top of the form. We'll ask for some details to help record and verify transactions if an issue arises.",
    targetSelector: '[data-guide="info-notice"]',
    targetRoute: 'reviews',
    preferredPlacement: 'bottom',
  },
  {
    id: 'star-rating',
    stepNumber: 3,
    totalDisplaySteps: 7,
    title: 'Overall Experience Rating',
    content: 'Choose a rating from 1 to 5 stars to show how satisfied you were with your transaction.',
    targetSelector: '[data-guide="rating-field"]',
    preferredPlacement: 'bottom',
  },
  {
    id: 'customer-info',
    stepNumber: 4,
    totalDisplaySteps: 7,
    title: 'Reviewer Display Name & Country',
    content: "Enter the name you'd like associated with your review and select your country so your review has the correct regional badge.",
    targetSelector: '[data-guide="name-country-grid"]',
    preferredPlacement: 'bottom',
  },
  {
    id: 'review-message',
    stepNumber: 5,
    totalDisplaySteps: 7,
    title: 'Review Narrative',
    content: 'Tell others about your experience. Honest, clear feedback helps future customers (minimum 20 characters).',
    targetSelector: '[data-guide="review-text-field"]',
    preferredPlacement: 'top',
  },
  {
    id: 'private-uid-consent',
    stepNumber: 6,
    totalDisplaySteps: 7,
    title: 'Private Verification UID & Consent',
    content: 'Provide your CODM Account UID. This is strictly private and used by the administrator to verify purchases against order receipts. Then check the consent box to confirm.',
    targetSelector: '[data-guide="uid-card"]',
    preferredPlacement: 'top',
  },
  {
    id: 'submit-button',
    stepNumber: 7,
    totalDisplaySteps: 7,
    title: 'Submit for Audit & Approval',
    content: "Almost done! Once you've completed the required fields, click Submit Review to send your review for approval.",
    actionNote: "Your review will follow the website's existing review approval process before it becomes public.",
    targetSelector: '[data-guide="submit-btn"]',
    preferredPlacement: 'top',
  },
  {
    id: 'completion',
    stepNumber: 8,
    totalDisplaySteps: 7,
    title: "That's it! 🎉",
    content: "You're ready to share your experience with ÉVANN_STORIES. Thanks for taking the time to leave a review!",
    targetSelector: '',
    preferredPlacement: 'center',
  },
];

interface ReviewerGuideContextType {
  isGuideActive: boolean;
  currentStepIndex: number;
  currentStep: GuideStepConfig | null;
  totalDisplaySteps: number;
  showIntroPrompt: boolean;
  startGuide: (fromStepIndex?: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  quitGuide: () => void;
  restartGuide: () => void;
  dismissIntroPrompt: () => void;
}

const ReviewerGuideContext = createContext<ReviewerGuideContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'evann_stories_reviewer_guide_seen';

export const ReviewerGuideProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentRoute, navigate } = useRouter();
  const [isGuideActive, setIsGuideActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showIntroPrompt, setShowIntroPrompt] = useState(false);

  // Check if first-time visitor
  useEffect(() => {
    try {
      const hasSeen = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!hasSeen) {
        // Show gentle intro prompt after short initial delay
        const timer = setTimeout(() => {
          setShowIntroPrompt(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore localStorage errors (e.g. private browsing restrictions)
    }
  }, []);

  const markGuideAsSeen = () => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
    } catch {
      // Ignore storage errors
    }
    setShowIntroPrompt(false);
  };

  const startGuide = useCallback(
    (fromStepIndex = 0) => {
      markGuideAsSeen();
      setCurrentStepIndex(fromStepIndex);
      setIsGuideActive(true);

      // If starting from step 0 or 1 on a non-home route, navigate to home
      if (fromStepIndex <= 1 && currentRoute !== 'home') {
        navigate('home');
      }
    },
    [currentRoute, navigate]
  );

  const dismissIntroPrompt = useCallback(() => {
    markGuideAsSeen();
  }, []);

  const quitGuide = useCallback(() => {
    setIsGuideActive(false);
    markGuideAsSeen();
  }, []);

  const restartGuide = useCallback(() => {
    setCurrentStepIndex(0);
    setIsGuideActive(true);
    if (currentRoute !== 'home') {
      navigate('home');
    }
  }, [currentRoute, navigate]);

  const nextStep = useCallback(() => {
    const nextIdx = currentStepIndex + 1;
    if (nextIdx >= GUIDE_STEPS.length) {
      // Completed!
      quitGuide();
      return;
    }

    const nextConfig = GUIDE_STEPS[nextIdx];

    // Check if moving to step that requires route transition (e.g. Step 2 -> Step 3)
    if (nextConfig.id === 'explain-notice' && currentRoute !== 'reviews') {
      navigate('reviews');
    }

    setCurrentStepIndex(nextIdx);
  }, [currentStepIndex, currentRoute, navigate, quitGuide]);

  const prevStep = useCallback(() => {
    const prevIdx = Math.max(0, currentStepIndex - 1);
    const prevConfig = GUIDE_STEPS[prevIdx];

    if (prevConfig.id === 'find-review-page' && currentRoute !== 'home') {
      navigate('home');
    }

    setCurrentStepIndex(prevIdx);
  }, [currentStepIndex, currentRoute, navigate]);

  const currentStep = isGuideActive ? GUIDE_STEPS[currentStepIndex] || null : null;

  return (
    <ReviewerGuideContext.Provider
      value={{
        isGuideActive,
        currentStepIndex,
        currentStep,
        totalDisplaySteps: 7,
        showIntroPrompt,
        startGuide,
        nextStep,
        prevStep,
        quitGuide,
        restartGuide,
        dismissIntroPrompt,
      }}
    >
      {children}
    </ReviewerGuideContext.Provider>
  );
};

export const useReviewerGuide = (): ReviewerGuideContextType => {
  const context = useContext(ReviewerGuideContext);
  if (!context) {
    throw new Error('useReviewerGuide must be used within a ReviewerGuideProvider');
  }
  return context;
};
