import React, { useState } from 'react';
import { ABOUT_AND_POLICIES_DATA } from '../config/policyContent';
import {
  ShieldCheck,
  FileText,
  CreditCard,
  RotateCcw,
  Lock,
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  BookOpen,
  Sparkles,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useRouter } from '../routes/router';

export const AboutPage: React.FC = () => {
  const { navigate } = useRouter();
  const [activeTab, setActiveTab] = useState<string>('about');

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const navItems = [
    { id: 'sec-about', label: 'A. About Évann' },
    { id: 'sec-services', label: 'B. Services' },
    { id: 'sec-payment', label: 'C. Purchase & Payment' },
    { id: 'sec-refund', label: 'D. Refund & Cancellation' },
    { id: 'sec-security', label: 'E. Account Security' },
    { id: 'sec-limitations', label: 'F. Service Limitations' },
    { id: 'sec-support', label: 'G. Customer Support' },
    { id: 'sec-verification', label: 'H. Reviews & Badges' },
    { id: 'sec-privacy', label: 'I. Privacy Policy' },
  ];

  return (
    <div
      className="about-page"
      style={{
        paddingTop: '6.5rem',
        paddingBottom: '5rem',
        minHeight: '85vh',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div className="container">
        {/* Page Banner Header */}
        <header className="section-header-cinema" style={{ textAlign: 'center', marginBottom: '3rem' }}>
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
              Platform Documentation & Standards
            </span>
          </div>

          <h1
            className="cinema-section-heading"
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              marginBottom: '0.75rem',
            }}
          >
            About Évann & Service Policies
          </h1>

          <p
            className="cinema-section-subtitle"
            style={{
              maxWidth: '680px',
              margin: '0 auto',
              fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
              lineHeight: 1.65,
            }}
          >
            Clear terms, security expectations, verification rules, and service guidelines.
            Everything you need to know before initiating a transaction.
          </p>
        </header>

        {/* 2-Column Layout with Quick Navigation TOC */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr)',
            gap: '2.5rem',
          }}
          className="about-grid-layout"
        >
          {/* Quick Horizontal Jump Bar on all screens */}
          <nav
            aria-label="Table of contents"
            style={{
              position: 'sticky',
              top: '80px',
              zIndex: 30,
              backgroundColor: 'var(--bg-card)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid var(--border-glass)',
              borderRadius: '12px',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              overflowX: 'auto',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
            }}
          >
            <span
              style={{
                fontSize: '0.75rem',
                fontFamily: 'var(--font-tech)',
                fontWeight: 700,
                color: 'var(--red-accent)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginRight: '6px',
                flexShrink: 0,
              }}
            >
              Jump to:
            </span>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontFamily: 'var(--font-tech)',
                  whiteSpace: 'nowrap',
                  backgroundColor:
                    activeTab === item.id ? 'var(--red-accent)' : 'var(--bg-elevated)',
                  color: activeTab === item.id ? '#FFFFFF' : 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                  flexShrink: 0,
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Main Content Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {/* SECTION A: About Évann */}
            <section id="sec-about" className="glass-panel" style={sectionBoxStyle}>
              <div style={sectionHeaderStyle}>
                <div style={iconBadgeStyle}>
                  <BookOpen size={22} color="var(--red-accent)" />
                </div>
                <div>
                  <span style={sectionSubTitleStyle}>Section A</span>
                  <h2 style={sectionTitleStyle}>{ABOUT_AND_POLICIES_DATA.about.title}</h2>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.25rem' }}>
                {ABOUT_AND_POLICIES_DATA.about.description.map((p, idx) => (
                  <p key={idx} style={paragraphStyle}>
                    {p}
                  </p>
                ))}
              </div>

              <div
                style={{
                  marginTop: '1.75rem',
                  padding: '1.25rem',
                  backgroundColor: 'var(--bg-elevated)',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--font-tech)',
                    fontSize: '0.95rem',
                    color: 'var(--heading-color)',
                    marginBottom: '0.75rem',
                  }}
                >
                  Our Core Pillars:
                </h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {ABOUT_AND_POLICIES_DATA.about.philosophy.map((item, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      <ShieldCheck size={16} color="var(--red-accent)" style={{ flexShrink: 0, marginTop: '3px' }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* SECTION B: Services */}
            <section id="sec-services" className="glass-panel" style={sectionBoxStyle}>
              <div style={sectionHeaderStyle}>
                <div style={iconBadgeStyle}>
                  <ShieldCheck size={22} color="var(--red-accent)" />
                </div>
                <div>
                  <span style={sectionSubTitleStyle}>Section B</span>
                  <h2 style={sectionTitleStyle}>{ABOUT_AND_POLICIES_DATA.services.title}</h2>
                </div>
              </div>

              {/* Legal Disclaimer Box */}
              <div
                style={{
                  margin: '1.25rem 0',
                  padding: '1rem 1.25rem',
                  backgroundColor: 'rgba(255, 23, 68, 0.06)',
                  border: '1px solid rgba(255, 23, 68, 0.25)',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                }}
              >
                <strong style={{ color: 'var(--red-accent)' }}>Impartiality Disclaimer:</strong>{' '}
                {ABOUT_AND_POLICIES_DATA.services.disclaimer}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '1.25rem', marginTop: '1.25rem' }}>
                {ABOUT_AND_POLICIES_DATA.services.items.map((svc, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '1.25rem',
                      borderRadius: '10px',
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.6rem',
                    }}
                  >
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '1.1rem', color: 'var(--heading-color)' }}>
                      {svc.title}
                    </h3>
                    <p style={{ ...paragraphStyle, margin: 0, fontSize: '0.88rem' }}>{svc.description}</p>
                    <div style={placeholderTagStyle}>{svc.note}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION C: Purchase & Payment Policy */}
            <section id="sec-payment" className="glass-panel" style={sectionBoxStyle}>
              <div style={sectionHeaderStyle}>
                <div style={iconBadgeStyle}>
                  <CreditCard size={22} color="var(--red-accent)" />
                </div>
                <div>
                  <span style={sectionSubTitleStyle}>Section C</span>
                  <h2 style={sectionTitleStyle}>{ABOUT_AND_POLICIES_DATA.purchaseAndPayment.title}</h2>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.5rem' }}>
                {ABOUT_AND_POLICIES_DATA.purchaseAndPayment.sections.map((sec, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '1.25rem',
                      borderRadius: '10px',
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '1.1rem', color: 'var(--heading-color)', marginBottom: '0.4rem' }}>
                      {sec.heading}
                    </h3>
                    <p style={{ ...paragraphStyle, marginBottom: '0.75rem', fontSize: '0.88rem' }}>{sec.guidance}</p>
                    <div style={placeholderTagStyle}>{sec.placeholder}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION D: Refund & Cancellation Policy */}
            <section id="sec-refund" className="glass-panel" style={sectionBoxStyle}>
              <div style={sectionHeaderStyle}>
                <div style={iconBadgeStyle}>
                  <RotateCcw size={22} color="var(--red-accent)" />
                </div>
                <div>
                  <span style={sectionSubTitleStyle}>Section D</span>
                  <h2 style={sectionTitleStyle}>{ABOUT_AND_POLICIES_DATA.refundAndCancellation.title}</h2>
                </div>
              </div>

              <p style={{ ...paragraphStyle, marginTop: '1rem' }}>
                {ABOUT_AND_POLICIES_DATA.refundAndCancellation.highlight}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '1.25rem', marginTop: '1.25rem' }}>
                {ABOUT_AND_POLICIES_DATA.refundAndCancellation.rules.map((rule, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '1.25rem',
                      borderRadius: '10px',
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '1.05rem', color: 'var(--heading-color)', marginBottom: '0.5rem' }}>
                      {rule.title}
                    </h3>
                    <div style={placeholderTagStyle}>{rule.detail}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION E: Account Security & Responsibility */}
            <section id="sec-security" className="glass-panel" style={sectionBoxStyle}>
              <div style={sectionHeaderStyle}>
                <div style={iconBadgeStyle}>
                  <Lock size={22} color="var(--red-accent)" />
                </div>
                <div>
                  <span style={sectionSubTitleStyle}>Section E</span>
                  <h2 style={sectionTitleStyle}>{ABOUT_AND_POLICIES_DATA.accountSecurity.title}</h2>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1.25rem' }}>
                {ABOUT_AND_POLICIES_DATA.accountSecurity.corePrinciples.map((point, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '1rem',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <ShieldCheck size={18} color="var(--red-accent)" style={{ flexShrink: 0, marginTop: '3px' }} />
                    <span style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{point}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION F: Service Limitations */}
            <section id="sec-limitations" className="glass-panel" style={sectionBoxStyle}>
              <div style={sectionHeaderStyle}>
                <div style={iconBadgeStyle}>
                  <AlertTriangle size={22} color="var(--red-accent)" />
                </div>
                <div>
                  <span style={sectionSubTitleStyle}>Section F</span>
                  <h2 style={sectionTitleStyle}>{ABOUT_AND_POLICIES_DATA.serviceLimitations.title}</h2>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1.25rem' }}>
                {ABOUT_AND_POLICIES_DATA.serviceLimitations.points.map((pt, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      padding: '1rem',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.92rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                    }}
                  >
                    <span style={{ color: 'var(--red-accent)', fontWeight: 800 }}>•</span>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION G: Customer Support and Disputes */}
            <section id="sec-support" className="glass-panel" style={sectionBoxStyle}>
              <div style={sectionHeaderStyle}>
                <div style={iconBadgeStyle}>
                  <HelpCircle size={22} color="var(--red-accent)" />
                </div>
                <div>
                  <span style={sectionSubTitleStyle}>Section G</span>
                  <h2 style={sectionTitleStyle}>{ABOUT_AND_POLICIES_DATA.customerSupport.title}</h2>
                </div>
              </div>

              <p style={{ ...paragraphStyle, marginTop: '1rem' }}>
                {ABOUT_AND_POLICIES_DATA.customerSupport.instructions}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '1.25rem', marginTop: '1.25rem' }}>
                {ABOUT_AND_POLICIES_DATA.customerSupport.channels.map((chan, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '1.25rem',
                      borderRadius: '10px',
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '1.05rem', color: 'var(--heading-color)', marginBottom: '0.4rem' }}>
                      {chan.name}
                    </h3>
                    <div style={placeholderTagStyle}>{chan.placeholder}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-tech)', marginTop: '0.5rem' }}>
                      Response Window: {chan.availability}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION H: Reviews & Verification Policy */}
            <section id="sec-verification" className="glass-panel" style={sectionBoxStyle}>
              <div style={sectionHeaderStyle}>
                <div style={iconBadgeStyle}>
                  <CheckCircle2 size={22} color="var(--red-accent)" />
                </div>
                <div>
                  <span style={sectionSubTitleStyle}>Section H</span>
                  <h2 style={sectionTitleStyle}>{ABOUT_AND_POLICIES_DATA.reviewAndVerification.title}</h2>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1.25rem' }}>
                {ABOUT_AND_POLICIES_DATA.reviewAndVerification.terms.map((term, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      padding: '0.9rem 1.1rem',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.9rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                    }}
                  >
                    <ShieldCheck size={16} color="var(--red-accent)" style={{ flexShrink: 0, marginTop: '4px' }} />
                    <span>{term}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION I: Privacy Policy */}
            <section id="sec-privacy" className="glass-panel" style={sectionBoxStyle}>
              <div style={sectionHeaderStyle}>
                <div style={iconBadgeStyle}>
                  <FileText size={22} color="var(--red-accent)" />
                </div>
                <div>
                  <span style={sectionSubTitleStyle}>Section I</span>
                  <h2 style={sectionTitleStyle}>{ABOUT_AND_POLICIES_DATA.privacyPolicy.title}</h2>
                </div>
              </div>

              <p style={{ ...paragraphStyle, marginTop: '1rem' }}>
                {ABOUT_AND_POLICIES_DATA.privacyPolicy.summary}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.25rem' }}>
                {ABOUT_AND_POLICIES_DATA.privacyPolicy.sections.map((sec, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '1.25rem',
                      borderRadius: '10px',
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '1.05rem', color: 'var(--heading-color)', marginBottom: '0.5rem' }}>
                      {sec.heading}
                    </h3>
                    <p style={{ ...paragraphStyle, margin: 0, fontSize: '0.9rem' }}>{sec.body}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

const sectionBoxStyle: React.CSSProperties = {
  padding: 'clamp(1.5rem, 3.5vw, 2.5rem)',
  borderRadius: '14px',
  scrollMarginTop: '90px',
};

const sectionHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  paddingBottom: '1rem',
  borderBottom: '1px solid var(--border-subtle)',
};

const iconBadgeStyle: React.CSSProperties = {
  width: '46px',
  height: '46px',
  borderRadius: '10px',
  backgroundColor: 'rgba(255, 23, 68, 0.1)',
  border: '1px solid var(--border-glass)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const sectionSubTitleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-tech)',
  fontSize: '0.75rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: 'var(--red-accent)',
  display: 'block',
};

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-heading)',
  fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)',
  fontWeight: 700,
  color: 'var(--heading-color)',
  letterSpacing: '-0.015em',
  margin: 0,
};

const paragraphStyle: React.CSSProperties = {
  color: 'var(--text-secondary)',
  fontSize: '0.95rem',
  lineHeight: 1.65,
};

const placeholderTagStyle: React.CSSProperties = {
  fontSize: '0.78rem',
  fontFamily: 'var(--font-mono)',
  color: '#F59E0B',
  backgroundColor: 'rgba(245, 158, 11, 0.08)',
  padding: '6px 10px',
  borderRadius: '6px',
  border: '1px dashed rgba(245, 158, 11, 0.35)',
  lineHeight: 1.5,
};
