import React, { useState, useRef } from 'react';
import {
  Star,
  Upload,
  X,
  ShieldAlert,
  CheckCircle,
  AlertCircle,
  Loader2,
  Lock,
  Send,
  Image as ImageIcon,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { NewReviewSubmission, ReviewPlatform } from '../types/database';
import { CountrySelect } from './CountrySelect';
import { Country } from '../data/countries';

interface ReviewSubmissionFormProps {
  onSubmit: (submission: NewReviewSubmission) => Promise<{ success: boolean; error?: string }>;
}

export const ReviewSubmissionForm: React.FC<ReviewSubmissionFormProps> = ({ onSubmit }) => {
  // Form fields
  const [customerName, setCustomerName] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [countryName, setCountryName] = useState('');
  const [platform, setPlatform] = useState<ReviewPlatform>('Discord');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [codmUid, setCodmUid] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [consentChecked, setConsentChecked] = useState(false);

  // Status and submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const platforms: ReviewPlatform[] = [
    'Discord',
    'WhatsApp',
    'Instagram',
    'Facebook',
    'TikTok',
    'Other',
  ];

  // Handle screenshot file selection & validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type (JPG, PNG, WebP)
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setFormError('Screenshot must be a valid JPG, PNG, or WebP image file.');
      return;
    }

    // Validate size (max 5 MB = 5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setFormError('Screenshot file size exceeds 5MB limit.');
      return;
    }

    setFormError(null);
    setScreenshotFile(file);

    // Create local object URL for preview
    const objectUrl = URL.createObjectURL(file);
    setScreenshotPreview(objectUrl);
  };

  const handleRemoveScreenshot = () => {
    setScreenshotFile(null);
    if (screenshotPreview) {
      URL.revokeObjectURL(screenshotPreview);
      setScreenshotPreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Form submit handler with rigorous client-side validation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validate Customer Name (2-60 chars)
    const trimmedName = customerName.trim();
    if (trimmedName.length < 2 || trimmedName.length > 60) {
      setFormError('Customer name must be between 2 and 60 characters.');
      return;
    }

    // Validate Country (Required field)
    if (!countryCode || !countryName) {
      setFormError('Please select your country before submitting.');
      return;
    }

    // Validate Rating (1-5)
    if (!rating || rating < 1 || rating > 5) {
      setFormError('Please select a star rating between 1 and 5.');
      return;
    }

    // Validate Review Text (20-1000 chars)
    const trimmedText = reviewText.trim();
    if (trimmedText.length < 20) {
      setFormError('Review text must be at least 20 characters in length.');
      return;
    }
    if (trimmedText.length > 1000) {
      setFormError('Review text cannot exceed 1,000 characters.');
      return;
    }

    // Validate CODM UID (Required private verification field)
    const trimmedUid = codmUid.trim();
    if (!trimmedUid || trimmedUid.length < 6 || trimmedUid.length > 32) {
      setFormError(
        'Please enter a valid CODM Account UID (6–32 characters) for transaction verification.'
      );
      return;
    }

    // Validate Consent
    if (!consentChecked) {
      setFormError('You must agree to the transaction verification and moderation policy.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await onSubmit({
        customer_name: trimmedName,
        country_code: countryCode,
        country_name: countryName,
        platform,
        rating,
        review_text: trimmedText,
        codm_uid_private: trimmedUid,
        screenshot_file: screenshotFile,
      });

      if (!result.success) {
        setFormError(result.error || 'Failed to submit review. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Success celebration
      setIsSubmittedSuccess(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FF1744', '#B00020', '#FFFFFF'],
      });

      // Reset form
      setCustomerName('');
      setCountryCode('');
      setCountryName('');
      setPlatform('Discord');
      setRating(5);
      setReviewText('');
      setCodmUid('');
      handleRemoveScreenshot();
      setConsentChecked(false);
    } catch (err: any) {
      setFormError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="submit-review"
      style={{
        position: 'relative',
        padding: '4rem 0',
        zIndex: 2,
      }}
    >
      <div className="container" style={{ maxWidth: '820px' }}>
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
            Share Your Experience
          </span>
          <h2
            className="cinema-section-heading"
            style={{
              fontSize: 'clamp(2rem, 3.8vw, 2.8rem)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
          >
            Submit an Authenticated Review
          </h2>
          <p
            className="cinema-section-subtitle"
            style={{
              fontSize: '0.98rem',
              maxWidth: '540px',
              margin: '0.5rem auto 0',
            }}
          >
            Your feedback directly shapes ÉVANN_STORIES. All submissions are privately audited
            to maintain authentic reputation.
          </p>
        </div>

        {/* Success Modal / State */}
        {isSubmittedSuccess ? (
          <div
            className="glass-panel"
            style={{
              padding: '3rem 2rem',
              textAlign: 'center',
              border: '1px solid rgba(255, 23, 68, 0.4)',
              boxShadow: '0 0 30px rgba(255, 23, 68, 0.2)',
            }}
          >
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 23, 68, 0.12)',
                border: '1px solid var(--red-accent)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <CheckCircle size={36} color="var(--red-accent)" />
            </div>

            <h3
              style={{
                fontSize: '1.6rem',
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                color: 'var(--heading-color)',
                marginBottom: '0.75rem',
              }}
            >
              Review Received & In Moderation
            </h3>

            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1rem',
                lineHeight: 1.6,
                maxWidth: '520px',
                margin: '0 auto 1.75rem',
              }}
            >
              Thank you for sharing your experience. To protect our community from spam and fraudulent
              ratings, your review is placed in our private queue. Once the administrator confirms
              your transaction details, it will appear publicly on the platform.
            </p>

            <button
              onClick={() => setIsSubmittedSuccess(false)}
              style={{
                padding: '12px 28px',
                borderRadius: '8px',
                backgroundColor: 'var(--red-accent)',
                color: '#FFFFFF',
                fontFamily: 'var(--font-tech)',
                fontWeight: 700,
                fontSize: '0.9rem',
                letterSpacing: '0.04em',
                boxShadow: '0 0 20px rgba(255, 23, 68, 0.4)',
              }}
            >
              Submit Another Review
            </button>
          </div>
        ) : (
          /* Main Review Form */
          <form
            onSubmit={handleSubmit}
            className="glass-panel"
            style={{
              padding: 'clamp(1.1rem, 3.5vw, 2.8rem)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}
            noValidate
          >
            {/* Error Banner */}
            {formError && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 23, 68, 0.12)',
                  border: '1px solid rgba(255, 23, 68, 0.4)',
                  color: '#FF6B8B',
                  fontSize: '0.9rem',
                }}
              >
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{formError}</span>
              </div>
            )}

            {/* 1. Star Rating Selector */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  letterSpacing: '0.02em',
                  color: 'var(--heading-color)',
                  marginBottom: '0.5rem',
                }}
              >
                Overall Experience Rating <span style={{ color: 'var(--red-accent)' }}>*</span>
              </label>

              <div
                style={{
                  display: 'inline-flex',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                }}
                role="radiogroup"
                aria-label="Star rating selection"
              >
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled =
                    hoverRating !== null ? star <= hoverRating : star <= rating;

                  return (
                    <button
                      key={star}
                      type="button"
                      role="radio"
                      aria-checked={rating === star}
                      aria-label={`${star} Stars`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        transition: 'transform 150ms ease',
                        transform: isFilled ? 'scale(1.15)' : 'scale(1)',
                      }}
                    >
                      <Star
                        size={28}
                        fill={isFilled ? 'var(--red-accent)' : 'transparent'}
                        color={isFilled ? 'var(--red-accent)' : 'rgba(255, 255, 255, 0.25)'}
                        style={{
                          filter: isFilled
                            ? 'drop-shadow(0 0 8px rgba(255, 23, 68, 0.6))'
                            : 'none',
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Customer Name, Country & Platform Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
                gap: '1.25rem',
              }}
            >
              {/* Customer Display Name */}
              <div>
                <label
                  htmlFor="customer_name"
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    letterSpacing: '0.02em',
                    color: 'var(--heading-color)',
                    marginBottom: '0.4rem',
                  }}
                >
                  Customer Display Name <span style={{ color: 'var(--red-accent)' }}>*</span>
                </label>
                <input
                  id="customer_name"
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Liam V. or Phoenix"
                  maxLength={60}
                  required
                  style={inputStyle}
                />
                <span style={inputHelpStyle}>
                  Your preferred public display name (2–60 characters)
                </span>
              </div>

              {/* Required Country Selector */}
              <div>
                <CountrySelect
                  id="review_country"
                  value={countryCode}
                  required={true}
                  onChange={(c: Country) => {
                    setCountryCode(c.code);
                    setCountryName(c.name);
                    if (formError && formError.includes('country')) {
                      setFormError(null);
                    }
                  }}
                />
                <span style={inputHelpStyle}>Country or territory of origin</span>
              </div>

              {/* Contact Platform Selector */}
              <div>
                <label
                  htmlFor="review_platform"
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    letterSpacing: '0.02em',
                    color: 'var(--heading-color)',
                    marginBottom: '0.4rem',
                  }}
                >
                  Transaction Platform <span style={{ color: 'var(--red-accent)' }}>*</span>
                </label>
                <select
                  id="review_platform"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as ReviewPlatform)}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  {platforms.map((p) => (
                    <option key={p} value={p} style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>
                      {p}
                    </option>
                  ))}
                </select>
                <span style={inputHelpStyle}>Platform used for communication</span>
              </div>
            </div>

            {/* 3. Review Narrative */}
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: '0.4rem',
                }}
              >
                <label
                  htmlFor="review_text"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    letterSpacing: '0.02em',
                    color: 'var(--heading-color)',
                  }}
                >
                  Review Narrative <span style={{ color: 'var(--red-accent)' }}>*</span>
                </label>
                <span
                  style={{
                    fontSize: '0.76rem',
                    fontFamily: 'var(--font-mono)',
                    color:
                      reviewText.length > 1000
                        ? 'var(--red-accent)'
                        : 'var(--text-muted)',
                  }}
                >
                  {reviewText.length}/1000
                </span>
              </div>

              <textarea
                id="review_text"
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience regarding delivery speed, communication, item delivery, and reliability..."
                maxLength={1000}
                required
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                  minHeight: '110px',
                  lineHeight: 1.5,
                }}
              />
              <span style={inputHelpStyle}>Minimum 20 characters</span>
            </div>

            {/* 4. Private CODM Account UID (Crucial Security Isolation) */}
            <div
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-glass)',
                borderRadius: '10px',
                padding: '1.2rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '0.5rem',
                }}
              >
                <Lock size={16} color="var(--red-accent)" />
                <label
                  htmlFor="codm_uid"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    color: 'var(--heading-color)',
                  }}
                >
                  CODM Account UID (Strictly Private Verification Field){' '}
                  <span style={{ color: 'var(--red-accent)' }}>*</span>
                </label>
              </div>

              <input
                id="codm_uid"
                type="text"
                value={codmUid}
                onChange={(e) => setCodmUid(e.target.value.trim())}
                placeholder="e.g. 6749321854930219485"
                maxLength={32}
                required
                style={inputStyle}
              />

              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '6px',
                  marginTop: '0.5rem',
                  fontSize: '0.78rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.45,
                }}
              >
                <ShieldAlert size={14} color="var(--red-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  <strong>Privacy Guarantee:</strong> Your UID is stored in a secured column never
                  exposed to public visitors. It is strictly inspected by the administrator to compare
                  with order receipts for purchase verification.
                </span>
              </div>
            </div>

            {/* 5. Optional Purchase Screenshot Evidence */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  letterSpacing: '0.02em',
                  color: 'var(--heading-color)',
                  marginBottom: '0.4rem',
                }}
              >
                Purchase Evidence Screenshot (Optional)
              </label>

              {!screenshotPreview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: '1px dashed var(--border-glass)',
                    borderRadius: '10px',
                    padding: '1.75rem 1rem',
                    textAlign: 'center',
                    backgroundColor: 'var(--bg-elevated)',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                  }}
                  className="upload-dropzone"
                >
                  <Upload size={28} color="var(--red-accent)" style={{ marginBottom: '8px' }} />
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 500,
                      fontSize: '0.88rem',
                      color: 'var(--heading-color)',
                    }}
                  >
                    Click or drag & drop purchase proof
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Supports JPG, PNG, or WebP (Max 5MB)
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    position: 'relative',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid var(--border-glass)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 14px',
                    backgroundColor: 'var(--bg-elevated)',
                  }}
                >
                  <ImageIcon size={20} color="var(--red-accent)" />
                  <span
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 500,
                      fontSize: '0.85rem',
                      color: 'var(--heading-color)',
                    }}
                  >
                    {screenshotFile?.name}
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveScreenshot}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    aria-label="Remove uploaded screenshot"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* 6. Consent Notice Checkbox */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                marginTop: '0.5rem',
              }}
            >
              <input
                id="consent_check"
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                required
                style={{
                  marginTop: '4px',
                  width: '16px',
                  height: '16px',
                  accentColor: 'var(--red-accent)',
                  cursor: 'pointer',
                }}
              />
              <label
                htmlFor="consent_check"
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.45,
                  cursor: 'pointer',
                }}
              >
                I confirm that this evaluation represents my genuine experience. I consent to my review
                text and display name being publicly displayed upon administrator approval. I acknowledge
                that my UID remains private for transaction verification.
              </label>
            </div>

            {/* 7. Submit Action Button */}
            <div style={{ marginTop: '0.5rem' }}>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--red-accent)',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-tech)',
                  fontWeight: 700,
                  fontSize: '0.98rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 0 25px rgba(255, 23, 68, 0.45)',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.75 : 1,
                  transition: 'all 200ms ease',
                }}
                className="submit-review-btn"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Encrypting & Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Submit Review for Verification</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      <style>{`
        .upload-dropzone:hover {
          border-color: var(--red-accent) !important;
          background-color: rgba(255, 23, 68, 0.05) !important;
        }
        .submit-review-btn:hover:not(:disabled) {
          background-color: #FF2E5B !important;
          box-shadow: 0 0 35px rgba(255, 23, 68, 0.65) !important;
          transform: translateY(-2px);
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </section>
  );
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: '8px',
  backgroundColor: 'var(--input-bg)',
  border: '1px solid var(--input-border)',
  color: 'var(--input-text)',
  fontSize: '0.92rem',
  fontFamily: 'var(--font-body)',
  outline: 'none',
  transition: 'border-color 200ms ease, box-shadow 200ms ease',
};

const inputHelpStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.74rem',
  color: 'var(--text-muted)',
  marginTop: '4px',
};
