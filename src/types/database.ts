export type ReviewPlatform =
  | 'Discord'
  | 'WhatsApp'
  | 'Instagram'
  | 'Facebook'
  | 'TikTok'
  | 'Other';

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export type ReactionType = 'helpful' | 'heart' | 'thumbs_up';

export interface Review {
  id: string;
  customer_name: string;
  platform: ReviewPlatform;
  rating: number;
  review_text: string;
  codm_uid_private?: string; // Only populated for authorized admin
  screenshot_storage_path?: string | null;
  status: ReviewStatus;
  purchase_verified: boolean;
  admin_reply?: string | null;
  admin_replied_at?: string | null;
  created_at: string;
  updated_at: string;
  approved_at?: string | null;
  moderated_by?: string | null;
  // Computed / joined fields
  reactions?: Record<ReactionType, number>;
  user_reacted?: Record<ReactionType, boolean>;
  screenshot_url?: string | null;
}

export interface NewReviewSubmission {
  customer_name: string;
  platform: ReviewPlatform;
  rating: number;
  review_text: string;
  codm_uid_private: string;
  screenshot_file?: File | null;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  verifiedCount: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface ReviewFilterState {
  searchQuery: string;
  ratingFilter: number | 'all';
  platformFilter: ReviewPlatform | 'all';
  sortBy: 'newest' | 'highest_rating';
}
