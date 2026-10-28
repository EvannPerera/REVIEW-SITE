import React, { useState } from 'react';
import {
  Shield,
  Lock,
  LogOut,
  Check,
  X,
  AlertTriangle,
  MessageSquare,
  Search,
  ExternalLink,
  Trash2,
  CheckCircle,
  Eye,
  RefreshCw,
  ThumbsUp,
  Heart,
  KeyRound,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { Review, ReviewStatus } from '../types/database';
import { getCountryByCode } from '../data/countries';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  // Auth state
  isAdminLoggedIn: boolean;
  onLogin: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  onLogout: () => Promise<void>;
  // Moderation operations
  reviews: Review[];
  onApproveReview: (reviewId: string) => Promise<boolean>;
  onRejectReview: (reviewId: string) => Promise<boolean>;
  onToggleVerifiedPurchase: (reviewId: string, currentStatus: boolean) => Promise<boolean>;
  onUpdateAdminReply: (reviewId: string, replyText: string) => Promise<boolean>;
  onDeleteReview: (reviewId: string) => Promise<boolean>;
  onRefreshData: () => Promise<void>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  isAdminLoggedIn,
  onLogin,
  onLogout,
  reviews,
  onApproveReview,
  onRejectReview,
  onToggleVerifiedPurchase,
  onUpdateAdminReply,
  onDeleteReview,
  onRefreshData,
}) => {
  // Login credentials state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard filtering & tabs
  const [currentTab, setCurrentTab] = useState<ReviewStatus>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Active review inspection modal (inspecting private UID & screenshot)
  const [inspectReview, setInspectReview] = useState<Review | null>(null);

  // Admin reply modal state
  const [replyingReview, setReplyingReview] = useState<Review | null>(null);
  const [replyInputText, setReplyInputText] = useState('');
  const [isSavingReply, setIsSavingReply] = useState(false);

  // Confirmation dialogs
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle Login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const res = await onLogin(email.trim(), password);
      if (!res.success) {
        setLoginError(res.error || 'Authentication failed. Please verify your credentials.');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Login failed.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Filter reviews by status and search query (name or private UID!)
  const tabReviews = reviews.filter((r) => r.status === currentTab);
  const filteredTabReviews = tabReviews.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const nameMatch = r.customer_name.toLowerCase().includes(q);
    const textMatch = r.review_text.toLowerCase().includes(q);
    const uidMatch = r.codm_uid_private
      ? r.codm_uid_private.toLowerCase().includes(q)
      : false;
    const countryMatch =
      (r.country_name && r.country_name.toLowerCase().includes(q)) ||
      (r.country_code && r.country_code.toLowerCase().includes(q));
    return nameMatch || textMatch || uidMatch || countryMatch;
  });

  const pendingCount = reviews.filter((r) => r.status === 'pending').length;
  const approvedCount = reviews.filter((r) => r.status === 'approved').length;
  const rejectedCount = reviews.filter((r) => r.status === 'rejected').length;

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await onRefreshData();
    setIsRefreshing(false);
  };

  const handleSaveReply = async () => {
    if (!replyingReview) return;
    setIsSavingReply(true);
    await onUpdateAdminReply(replyingReview.id, replyInputText.trim());
    setIsSavingReply(false);
    setReplyingReview(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="ÉVANN_STORIES Administrator Control Center"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(3, 3, 5, 0.94)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Top Bar */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.85rem clamp(1rem, 3vw, 2rem)',
          backgroundColor: '#070709',
          borderBottom: '1px solid rgba(255, 23, 68, 0.25)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              padding: '6px',
              borderRadius: '6px',
              backgroundColor: 'rgba(255, 23, 68, 0.15)',
              border: '1px solid var(--red-accent)',
            }}
          >
            <Shield size={20} color="var(--red-accent)" />
          </div>
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)',
                fontWeight: 700,
                color: '#FFFFFF',
                letterSpacing: '0.02em',
                margin: 0,
              }}
            >
              ÉVANN_STORIES Moderator Console
            </h2>
            <span
              style={{
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-tech)',
              }}
            >
              PostgreSQL Row Level Security Enforcement
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isAdminLoggedIn && (
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#FFFFFF',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-tech)',
              }}
              title="Refresh reviews from database"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
          )}

          {isAdminLoggedIn && (
            <button
              onClick={onLogout}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                backgroundColor: 'rgba(176, 0, 32, 0.15)',
                border: '1px solid rgba(255, 23, 68, 0.3)',
                color: 'var(--red-accent)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-tech)',
              }}
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          )}

          <button
            onClick={onClose}
            style={{
              padding: '6px',
              borderRadius: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#FFFFFF',
            }}
            aria-label="Close Administrator Console"
          >
            <X size={18} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 'clamp(1rem, 3vw, 2rem)' }}>
        <div className="container" style={{ maxWidth: '1200px', padding: 0 }}>
          {!isAdminLoggedIn ? (
            /* --- Admin Login Form --- */
            <div
              style={{
                maxWidth: '440px',
                margin: 'clamp(1.5rem, 5vw, 4rem) auto',
                padding: 'clamp(1.25rem, 5vw, 2.5rem)',
                backgroundColor: '#09090C',
                border: '1px solid rgba(255, 23, 68, 0.35)',
                borderRadius: '12px',
                boxShadow: '0 0 40px rgba(0, 0, 0, 0.9), 0 0 20px rgba(255, 23, 68, 0.15)',
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 23, 68, 0.12)',
                    border: '1px solid var(--red-accent)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  <Lock size={26} color="var(--red-accent)" />
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    color: '#FFFFFF',
                  }}
                >
                  Administrator Access
                </h3>
                <p
                  style={{
                    fontSize: '0.82rem',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-tech)',
                    marginTop: '4px',
                  }}
                >
                  Supabase Auth Protected Gateway
                </p>
              </div>

              {loginError && (
                <div
                  style={{
                    padding: '10px 14px',
                    backgroundColor: 'rgba(255, 23, 68, 0.12)',
                    border: '1px solid rgba(255, 23, 68, 0.4)',
                    borderRadius: '8px',
                    color: '#FF7388',
                    fontSize: '0.84rem',
                    marginBottom: '1.25rem',
                  }}
                >
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.82rem',
                      fontFamily: 'var(--font-tech)',
                      color: 'var(--text-secondary)',
                      marginBottom: '0.4rem',
                    }}
                  >
                    Administrator Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@evannstories.com"
                    required
                    style={modalInputStyle}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.82rem',
                      fontFamily: 'var(--font-tech)',
                      color: 'var(--text-secondary)',
                      marginBottom: '0.4rem',
                    }}
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    style={modalInputStyle}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--red-accent)',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-tech)',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    border: 'none',
                    cursor: isLoggingIn ? 'not-allowed' : 'pointer',
                    boxShadow: '0 0 20px rgba(255, 23, 68, 0.4)',
                    marginTop: '0.5rem',
                  }}
                >
                  {isLoggingIn ? 'Authenticating...' : 'Sign In to Moderator Console'}
                </button>
              </form>

              <div
                style={{
                  marginTop: '1.5rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.5,
                  textAlign: 'center',
                }}
              >
                Zero hardcoded credentials. Authorization is verified server-side via Supabase Auth
                and database roles.
              </div>
            </div>
          ) : (
            /* --- Authenticated Moderator Dashboard --- */
            <div>
              {/* Tab Selector & Search Bar */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '2rem',
                }}
              >
                {/* Tabs */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    backgroundColor: 'rgba(5, 5, 8, 0.7)',
                    padding: '4px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <button
                    onClick={() => setCurrentTab('pending')}
                    style={tabBtnStyle(currentTab === 'pending')}
                  >
                    <span>Pending Queue</span>
                    <span
                      style={{
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: pendingCount > 0 ? 'var(--red-accent)' : 'rgba(255, 255, 255, 0.1)',
                        color: '#FFFFFF',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                      }}
                    >
                      {pendingCount}
                    </span>
                  </button>

                  <button
                    onClick={() => setCurrentTab('approved')}
                    style={tabBtnStyle(currentTab === 'approved')}
                  >
                    <span>Approved</span>
                    <span style={tabCountStyle}>{approvedCount}</span>
                  </button>

                  <button
                    onClick={() => setCurrentTab('rejected')}
                    style={tabBtnStyle(currentTab === 'rejected')}
                  >
                    <span>Rejected</span>
                    <span style={tabCountStyle}>{rejectedCount}</span>
                  </button>
                </div>

                {/* Search Bar for Admin (Supports Customer Name, Text, or private UID!) */}
                <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
                  <Search
                    size={16}
                    color="var(--text-muted)"
                    style={{ position: 'absolute', left: '10px', top: '11px' }}
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name, text, or private UID..."
                    style={{
                      ...modalInputStyle,
                      paddingLeft: '34px',
                      fontSize: '0.85rem',
                    }}
                  />
                </div>
              </div>

              {/* Reviews Table / List */}
              {filteredTabReviews.length === 0 ? (
                <div
                  className="glass-panel"
                  style={{
                    padding: '3rem',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                  }}
                >
                  No {currentTab} reviews found.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {filteredTabReviews.map((review) => (
                    <div
                      key={review.id}
                      className="glass-panel"
                      style={{
                        padding: '1.25rem 1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        borderLeft:
                          review.status === 'pending'
                            ? '4px solid #FFA000'
                            : review.status === 'approved'
                            ? '4px solid #00E676'
                            : '4px solid #D50000',
                      }}
                    >
                      {/* Review Summary Row */}
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          gap: '1rem',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <h4
                              style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                color: '#FFFFFF',
                                margin: 0,
                              }}
                            >
                              {review.customer_name}
                            </h4>
                            <span
                              style={{
                                padding: '2px 8px',
                                borderRadius: '4px',
                                backgroundColor: 'var(--bg-elevated)',
                                fontSize: '0.72rem',
                                fontFamily: 'var(--font-tech)',
                                color: 'var(--text-secondary)',
                              }}
                            >
                              {review.platform}
                            </span>
                            {(review.country_code || review.country_name) && (
                              <span
                                style={{
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  backgroundColor: 'var(--bg-elevated)',
                                  fontSize: '0.72rem',
                                  fontFamily: 'var(--font-tech)',
                                  color: 'var(--text-secondary)',
                                }}
                              >
                                {getCountryByCode(review.country_code)?.flag || '🌐'} {review.country_name || review.country_code}
                              </span>
                            )}
                            <span
                              style={{
                                fontSize: '0.74rem',
                                color: 'var(--text-muted)',
                                fontFamily: 'var(--font-tech)',
                              }}
                            >
                              {new Date(review.created_at).toLocaleString()}
                            </span>
                          </div>

                          {/* Star Rating */}
                          <div style={{ display: 'flex', gap: '2px', margin: '4px 0' }}>
                            {[1, 2, 3, 4, 5].map((s) => (
                              <span
                                key={s}
                                style={{
                                  color: s <= review.rating ? 'var(--red-accent)' : 'rgba(255,255,255,0.2)',
                                  fontSize: '0.85rem',
                                }}
                              >
                                ★
                              </span>
                            ))}
                          </div>

                          {/* Private CODM UID (ADMIN ONLY PRIVILEGE) */}
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              backgroundColor: 'rgba(255, 23, 68, 0.08)',
                              border: '1px solid rgba(255, 23, 68, 0.25)',
                              fontSize: '0.75rem',
                              fontFamily: 'var(--font-mono)',
                              color: '#FF7388',
                              marginTop: '2px',
                            }}
                          >
                            <Lock size={12} />
                            <span>Private UID: {review.codm_uid_private || 'Confidential / Hidden'}</span>
                          </div>
                        </div>

                        {/* Status Badges */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {review.purchase_verified ? (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                backgroundColor: 'rgba(0, 230, 118, 0.12)',
                                border: '1px solid rgba(0, 230, 118, 0.35)',
                                color: '#00E676',
                                fontSize: '0.72rem',
                                fontFamily: 'var(--font-tech)',
                              }}
                            >
                              <ShieldCheck size={13} />
                              <span>Verified Purchase</span>
                            </span>
                          ) : (
                            <span
                              style={{
                                padding: '3px 8px',
                                borderRadius: '4px',
                                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                                color: 'var(--text-muted)',
                                fontSize: '0.72rem',
                                fontFamily: 'var(--font-tech)',
                              }}
                            >
                              Unverified
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Review Text */}
                      <p
                        style={{
                          fontSize: '0.92rem',
                          color: 'var(--text-primary)',
                          lineHeight: 1.55,
                          margin: 0,
                        }}
                      >
                        {review.review_text}
                      </p>

                      {/* Administrator Reply if exists */}
                      {review.admin_reply && (
                        <div
                          style={{
                            padding: '8px 12px',
                            backgroundColor: 'rgba(255, 23, 68, 0.06)',
                            borderLeft: '2px solid var(--red-accent)',
                            borderRadius: '0 6px 6px 0',
                            fontSize: '0.84rem',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          <strong style={{ color: 'var(--red-accent)' }}>Your Reply:</strong>{' '}
                          "{review.admin_reply}"
                        </div>
                      )}

                      {/* Action Buttons Row */}
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.75rem',
                          paddingTop: '0.75rem',
                          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                        }}
                      >
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {/* Evidence Inspector Button */}
                          {review.screenshot_url && (
                            <button
                              onClick={() => setInspectReview(review)}
                              style={actionBtnStyle}
                            >
                              <Eye size={14} color="var(--red-accent)" />
                              <span>Inspect Evidence</span>
                            </button>
                          )}

                          {/* Toggle Verified Purchase Status */}
                          <button
                            onClick={() =>
                              onToggleVerifiedPurchase(review.id, review.purchase_verified)
                            }
                            style={{
                              ...actionBtnStyle,
                              color: review.purchase_verified ? '#00E676' : 'var(--text-secondary)',
                            }}
                            title="Toggle whether client order is verified against sales records"
                          >
                            <ShieldCheck size={14} />
                            <span>
                              {review.purchase_verified ? 'Mark Unverified' : 'Verify Purchase'}
                            </span>
                          </button>

                          {/* Reply Button */}
                          <button
                            onClick={() => {
                              setReplyingReview(review);
                              setReplyInputText(review.admin_reply || '');
                            }}
                            style={actionBtnStyle}
                          >
                            <MessageSquare size={14} />
                            <span>{review.admin_reply ? 'Edit Reply' : 'Add Official Reply'}</span>
                          </button>
                        </div>

                        {/* Approval / Rejection Actions */}
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {review.status !== 'approved' && (
                            <button
                              onClick={() => onApproveReview(review.id)}
                              style={{
                                ...actionBtnStyle,
                                backgroundColor: 'rgba(0, 230, 118, 0.15)',
                                borderColor: 'rgba(0, 230, 118, 0.35)',
                                color: '#00E676',
                              }}
                            >
                              <Check size={14} />
                              <span>Approve</span>
                            </button>
                          )}

                          {review.status !== 'rejected' && (
                            <button
                              onClick={() => onRejectReview(review.id)}
                              style={{
                                ...actionBtnStyle,
                                backgroundColor: 'rgba(213, 0, 0, 0.15)',
                                borderColor: 'rgba(213, 0, 0, 0.35)',
                                color: '#FF5252',
                              }}
                            >
                              <X size={14} />
                              <span>Reject</span>
                            </button>
                          )}

                          {/* Delete Review */}
                          <button
                            onClick={() => setConfirmDeleteId(review.id)}
                            style={{
                              ...actionBtnStyle,
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                              color: 'var(--text-muted)',
                            }}
                            title="Permanently remove review from database"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Reply Modal */}
      {replyingReview && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(3, 3, 5, 0.85)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 250,
            padding: '1.5rem',
          }}
        >
          <div
            className="glass-panel"
            style={{
              maxWidth: '540px',
              width: '100%',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, color: '#FFFFFF', fontSize: '1.2rem' }}>
                Administrator Reply to {replyingReview.customer_name}
              </h3>
              <button onClick={() => setReplyingReview(null)} style={{ color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            <textarea
              rows={4}
              value={replyInputText}
              onChange={(e) => setReplyInputText(e.target.value)}
              placeholder="Write your official response to this review..."
              maxLength={500}
              style={{ ...modalInputStyle, resize: 'vertical' }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                onClick={() => setReplyingReview(null)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-tech)',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveReply}
                disabled={isSavingReply}
                style={{
                  padding: '8px 20px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--red-accent)',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-tech)',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {isSavingReply ? 'Saving...' : 'Publish Reply'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(3, 3, 5, 0.85)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 250,
            padding: '1.5rem',
          }}
        >
          <div
            className="glass-panel"
            style={{
              maxWidth: '440px',
              width: '100%',
              padding: '1.75rem',
              textAlign: 'center',
            }}
          >
            <AlertTriangle size={36} color="var(--red-accent)" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, color: '#FFFFFF', marginBottom: '0.5rem' }}>
              Delete Review Permanently?
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              This will permanently delete this review from the database. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button
                onClick={() => setConfirmDeleteId(null)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-tech)',
                }}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await onDeleteReview(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
                style={{
                  padding: '8px 18px',
                  borderRadius: '6px',
                  backgroundColor: '#B00020',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-tech)',
                  fontWeight: 700,
                  border: 'none',
                }}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Private Evidence Inspector Modal */}
      {inspectReview && inspectReview.screenshot_url && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setInspectReview(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.92)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 260,
            padding: '2rem',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '900px',
              maxHeight: '90vh',
              borderRadius: '10px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 23, 68, 0.4)',
            }}
          >
            <button
              onClick={() => setInspectReview(null)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: '#FFFFFF',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>
            <img
              src={inspectReview.screenshot_url}
              alt="Private transaction screenshot evidence"
              style={{ maxWidth: '100%', maxHeight: '85vh', display: 'block', objectFit: 'contain' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const modalInputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '8px',
  backgroundColor: 'var(--input-bg)',
  border: '1px solid var(--input-border)',
  color: 'var(--input-text)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.9rem',
  outline: 'none',
};

const tabBtnStyle = (isActive: boolean): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '6px 14px',
  borderRadius: '6px',
  backgroundColor: isActive ? 'rgba(255, 23, 68, 0.15)' : 'transparent',
  border: isActive ? '1px solid rgba(255, 23, 68, 0.35)' : '1px solid transparent',
  color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
  fontFamily: 'var(--font-tech)',
  fontSize: '0.84rem',
  fontWeight: isActive ? 600 : 400,
  cursor: 'pointer',
  transition: 'all 150ms ease',
});

const tabCountStyle: React.CSSProperties = {
  padding: '2px 6px',
  borderRadius: '4px',
  backgroundColor: 'rgba(255, 255, 255, 0.08)',
  color: 'var(--text-secondary)',
  fontSize: '0.72rem',
};

const actionBtnStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 12px',
  borderRadius: '6px',
  backgroundColor: 'rgba(255, 255, 255, 0.04)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  color: 'var(--text-secondary)',
  fontSize: '0.78rem',
  fontFamily: 'var(--font-tech)',
  cursor: 'pointer',
  transition: 'all 180ms ease',
};
