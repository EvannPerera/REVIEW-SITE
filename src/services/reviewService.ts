import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  Review,
  NewReviewSubmission,
  ReactionType,
  ReviewStatus,
} from '../types/database';

// Local storage key for persistent anonymous visitor identity
const VISITOR_ID_KEY = 'evann_stories_visitor_id';
const LOCAL_REVIEWS_STORAGE_KEY = 'evann_stories_local_dev_reviews';
const LOCAL_REACTIONS_KEY = 'evann_stories_local_reactions';

export const getVisitorId = (): string => {
  let id = localStorage.getItem(VISITOR_ID_KEY);
  if (!id) {
    id = `vis_${crypto.randomUUID().slice(0, 16)}`;
    localStorage.setItem(VISITOR_ID_KEY, id);
  }
  return id;
};

// Seed sample approved reviews only for local preview when Supabase is not yet connected
const getInitialLocalReviews = (): Review[] => {
  const stored = localStorage.getItem(LOCAL_REVIEWS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Fallback
    }
  }

  const initial: Review[] = [
    {
      id: 'rev-001',
      customer_name: 'Darius Thorne',
      platform: 'Discord',
      rating: 5,
      review_text:
        'Fast and seamless transaction! The CP credited to my CODM account in under 3 minutes after confirmation. ÉVANN is undeniably the most trustworthy seller in the community.',
      codm_uid_private: '6749321854930219485',
      status: 'approved',
      purchase_verified: true,
      admin_reply:
        'Thank you for your loyalty, Darius! Always a pleasure serving you with zero downtime.',
      admin_replied_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      approved_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      reactions: { helpful: 14, heart: 9, thumbs_up: 22 },
    },
    {
      id: 'rev-002',
      customer_name: 'Elena Rostova',
      platform: 'WhatsApp',
      rating: 5,
      review_text:
        'Initial skeptic here, but the manual verification was reassuring. Clean communication on WhatsApp and received receipt confirmation right away.',
      codm_uid_private: '6892301948201948201',
      status: 'approved',
      purchase_verified: true,
      admin_reply: 'Authenticity is our top priority. Welcome to ÉVANN_STORIES!',
      admin_replied_at: new Date(Date.now() - 3600000 * 12).toISOString(),
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 12).toISOString(),
      approved_at: new Date(Date.now() - 3600000 * 12).toISOString(),
      reactions: { helpful: 8, heart: 4, thumbs_up: 12 },
    },
    {
      id: 'rev-003',
      customer_name: 'Marcus Vance',
      platform: 'Instagram',
      rating: 5,
      review_text:
        'Top tier customer service. Will definitely be placing all my future Mythic and Legendary crate orders here.',
      codm_uid_private: '6948201948201948293',
      status: 'approved',
      purchase_verified: false,
      admin_reply: null,
      created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 6).toISOString(),
      approved_at: new Date(Date.now() - 3600000 * 6).toISOString(),
      reactions: { helpful: 3, heart: 2, thumbs_up: 7 },
    },
  ];

  localStorage.setItem(LOCAL_REVIEWS_STORAGE_KEY, JSON.stringify(initial));
  return initial;
};

// ==============================================================================
// 1. PUBLIC REVIEWS FETCH
// ==============================================================================
export const fetchPublicApprovedReviews = async (): Promise<Review[]> => {
  if (!isSupabaseConfigured) {
    const list = getInitialLocalReviews().filter((r) => r.status === 'approved');
    return attachLocalReactions(list);
  }

  try {
    // Query public_approved_reviews view (ensures private UID is excluded)
    const { data, error } = await supabase
      .from('public_approved_reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching public reviews:', error);
      // Fallback
      return attachLocalReactions(getInitialLocalReviews().filter((r) => r.status === 'approved'));
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Attach reactions
    const reviewIds = data.map((r: any) => r.id);
    const reactionsMap = await fetchReactionsForReviews(reviewIds);

    return data.map((r: any) => ({
      ...r,
      status: 'approved',
      reactions: reactionsMap[r.id]?.counts || { helpful: 0, heart: 0, thumbs_up: 0 },
      user_reacted: reactionsMap[r.id]?.userReacted || {
        helpful: false,
        heart: false,
        thumbs_up: false,
      },
      screenshot_url: r.screenshot_storage_path
        ? getScreenshotUrl(r.screenshot_storage_path)
        : null,
    }));
  } catch (err) {
    console.error('Public reviews query error:', err);
    return attachLocalReactions(getInitialLocalReviews().filter((r) => r.status === 'approved'));
  }
};

// ==============================================================================
// 2. ADMIN REVIEWS FETCH (Full Access with Private UIDs)
// ==============================================================================
export const fetchAdminAllReviews = async (): Promise<Review[]> => {
  if (!isSupabaseConfigured) {
    return getInitialLocalReviews();
  }

  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    if (!data) return [];

    const reviewIds = data.map((r: any) => r.id);
    const reactionsMap = await fetchReactionsForReviews(reviewIds);

    return data.map((r: any) => ({
      ...r,
      reactions: reactionsMap[r.id]?.counts || { helpful: 0, heart: 0, thumbs_up: 0 },
      screenshot_url: r.screenshot_storage_path
        ? getScreenshotUrl(r.screenshot_storage_path)
        : null,
    }));
  } catch (err) {
    console.error('Admin reviews query error:', err);
    return getInitialLocalReviews();
  }
};

// ==============================================================================
// 3. SUBMIT NEW REVIEW
// ==============================================================================
export const submitCustomerReview = async (
  input: NewReviewSubmission
): Promise<{ success: boolean; error?: string }> => {
  let uploadedPath: string | null = null;

  try {
    // 1. Upload screenshot if provided
    if (input.screenshot_file && isSupabaseConfigured) {
      const fileExt = input.screenshot_file.name.split('.').pop() || 'png';
      const cleanFileName = `evidence/${crypto.randomUUID()}-${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('review-evidence')
        .upload(cleanFileName, input.screenshot_file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.warn('Screenshot upload notice:', uploadError);
      } else if (uploadData) {
        uploadedPath = uploadData.path;
      }
    }

    // 2. Insert Review into database
    if (isSupabaseConfigured) {
      const { error: insertError } = await supabase.from('reviews').insert({
        customer_name: input.customer_name,
        platform: input.platform,
        rating: input.rating,
        review_text: input.review_text,
        codm_uid_private: input.codm_uid_private,
        screenshot_storage_path: uploadedPath,
        status: 'pending',
        purchase_verified: false,
        admin_reply: null,
      });

      if (insertError) {
        throw insertError;
      }
    } else {
      // Local preview fallback store
      const localReviews = getInitialLocalReviews();
      const newLocal: Review = {
        id: `rev-local-${Date.now()}`,
        customer_name: input.customer_name,
        platform: input.platform,
        rating: input.rating,
        review_text: input.review_text,
        codm_uid_private: input.codm_uid_private,
        status: 'pending', // Starts pending
        purchase_verified: false,
        admin_reply: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        reactions: { helpful: 0, heart: 0, thumbs_up: 0 },
      };
      localReviews.unshift(newLocal);
      localStorage.setItem(LOCAL_REVIEWS_STORAGE_KEY, JSON.stringify(localReviews));
    }

    return { success: true };
  } catch (err: any) {
    console.error('Error submitting review:', err);
    return { success: false, error: err.message || 'Submission error.' };
  }
};

// ==============================================================================
// 4. REACTION HANDLER
// ==============================================================================
export const submitReaction = async (
  reviewId: string,
  reactionType: ReactionType
): Promise<void> => {
  const visitorId = getVisitorId();

  // Save to local storage for instant feedback
  saveLocalReaction(reviewId, reactionType);

  if (!isSupabaseConfigured) {
    const list = getInitialLocalReviews();
    const target = list.find((r) => r.id === reviewId);
    if (target) {
      if (!target.reactions) target.reactions = { helpful: 0, heart: 0, thumbs_up: 0 };
      target.reactions[reactionType] = (target.reactions[reactionType] || 0) + 1;
      localStorage.setItem(LOCAL_REVIEWS_STORAGE_KEY, JSON.stringify(list));
    }
    return;
  }

  try {
    await supabase.from('review_reactions').insert({
      review_id: reviewId,
      reaction_type: reactionType,
      visitor_id: visitorId,
    });
  } catch (err) {
    // Duplicate reactions are caught by unique constraint
    console.info('Reaction logged locally.');
  }
};

// ==============================================================================
// 5. MODERATION ACTIONS (Admin Only)
// ==============================================================================
export const approveReview = async (reviewId: string): Promise<boolean> => {
  if (!isSupabaseConfigured) {
    const list = getInitialLocalReviews();
    const item = list.find((r) => r.id === reviewId);
    if (item) {
      item.status = 'approved';
      item.approved_at = new Date().toISOString();
      localStorage.setItem(LOCAL_REVIEWS_STORAGE_KEY, JSON.stringify(list));
    }
    return true;
  }

  const { error } = await supabase
    .from('reviews')
    .update({
      status: 'approved',
      approved_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', reviewId);

  return !error;
};

export const rejectReview = async (reviewId: string): Promise<boolean> => {
  if (!isSupabaseConfigured) {
    const list = getInitialLocalReviews();
    const item = list.find((r) => r.id === reviewId);
    if (item) {
      item.status = 'rejected';
      localStorage.setItem(LOCAL_REVIEWS_STORAGE_KEY, JSON.stringify(list));
    }
    return true;
  }

  const { error } = await supabase
    .from('reviews')
    .update({
      status: 'rejected',
      updated_at: new Date().toISOString(),
    })
    .eq('id', reviewId);

  return !error;
};

export const toggleVerifiedPurchase = async (
  reviewId: string,
  currentStatus: boolean
): Promise<boolean> => {
  const newStatus = !currentStatus;

  if (!isSupabaseConfigured) {
    const list = getInitialLocalReviews();
    const item = list.find((r) => r.id === reviewId);
    if (item) {
      item.purchase_verified = newStatus;
      localStorage.setItem(LOCAL_REVIEWS_STORAGE_KEY, JSON.stringify(list));
    }
    return true;
  }

  const { error } = await supabase
    .from('reviews')
    .update({
      purchase_verified: newStatus,
      updated_at: new Date().toISOString(),
    })
    .eq('id', reviewId);

  return !error;
};

export const updateAdminReply = async (
  reviewId: string,
  replyText: string
): Promise<boolean> => {
  if (!isSupabaseConfigured) {
    const list = getInitialLocalReviews();
    const item = list.find((r) => r.id === reviewId);
    if (item) {
      item.admin_reply = replyText || null;
      item.admin_replied_at = replyText ? new Date().toISOString() : null;
      localStorage.setItem(LOCAL_REVIEWS_STORAGE_KEY, JSON.stringify(list));
    }
    return true;
  }

  const { error } = await supabase
    .from('reviews')
    .update({
      admin_reply: replyText || null,
      admin_replied_at: replyText ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', reviewId);

  return !error;
};

export const deleteReview = async (reviewId: string): Promise<boolean> => {
  if (!isSupabaseConfigured) {
    const list = getInitialLocalReviews().filter((r) => r.id !== reviewId);
    localStorage.setItem(LOCAL_REVIEWS_STORAGE_KEY, JSON.stringify(list));
    return true;
  }

  const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
  return !error;
};

// ==============================================================================
// HELPERS
// ==============================================================================
const getScreenshotUrl = (storagePath: string): string => {
  const { data } = supabase.storage.from('review-evidence').getPublicUrl(storagePath);
  return data.publicUrl;
};

const fetchReactionsForReviews = async (reviewIds: string[]) => {
  const result: Record<
    string,
    { counts: Record<ReactionType, number>; userReacted: Record<ReactionType, boolean> }
  > = {};

  reviewIds.forEach((id) => {
    result[id] = {
      counts: { helpful: 0, heart: 0, thumbs_up: 0 },
      userReacted: { helpful: false, heart: false, thumbs_up: false },
    };
  });

  try {
    const { data } = await supabase.rpc('get_review_reactions', {
      p_review_ids: reviewIds,
    });

    if (data) {
      data.forEach((row: any) => {
        if (result[row.review_id] && row.reaction_type) {
          result[row.review_id].counts[row.reaction_type as ReactionType] = Number(row.count);
        }
      });
    }
  } catch (err) {
    // Fallback if RPC is not yet created
  }

  // Check visitor reactions
  const visitorId = getVisitorId();
  try {
    const { data: userReactions } = await supabase
      .from('review_reactions')
      .select('review_id, reaction_type')
      .eq('visitor_id', visitorId)
      .in('review_id', reviewIds);

    if (userReactions) {
      userReactions.forEach((r: any) => {
        if (result[r.review_id]) {
          result[r.review_id].userReacted[r.reaction_type as ReactionType] = true;
        }
      });
    }
  } catch {
    // Fallback to local storage
    reviewIds.forEach((id) => {
      const stored = getLocalReactions(id);
      if (stored) {
        result[id].userReacted = stored;
      }
    });
  }

  return result;
};

const saveLocalReaction = (reviewId: string, type: ReactionType) => {
  try {
    const all = JSON.parse(localStorage.getItem(LOCAL_REACTIONS_KEY) || '{}');
    if (!all[reviewId]) all[reviewId] = {};
    all[reviewId][type] = true;
    localStorage.setItem(LOCAL_REACTIONS_KEY, JSON.stringify(all));
  } catch {}
};

const getLocalReactions = (reviewId: string): Record<ReactionType, boolean> => {
  try {
    const all = JSON.parse(localStorage.getItem(LOCAL_REACTIONS_KEY) || '{}');
    return all[reviewId] || { helpful: false, heart: false, thumbs_up: false };
  } catch {
    return { helpful: false, heart: false, thumbs_up: false };
  }
};

const attachLocalReactions = (reviews: Review[]): Review[] => {
  return reviews.map((r) => ({
    ...r,
    user_reacted: getLocalReactions(r.id),
  }));
};
