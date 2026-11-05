import React, { useState } from 'react';
import { ABOUT_AND_POLICIES_DATA } from '../config/policyContent';
import {
  ShieldCheck,
  ShieldAlert,
  Clock,
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

              {/* Introduction */}
              <div
                style={{
                  marginTop: '1.25rem',
                  padding: '1.1rem 1.25rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 23, 68, 0.05)',
                  border: '1px solid rgba(255, 23, 68, 0.22)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}
              >
                <AlertTriangle size={18} color="var(--red-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <span
                    style={{
                      fontFamily: 'var(--font-tech)',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'var(--red-accent)',
                      display: 'block',
                      marginBottom: '0.25rem',
                    }}
                  >
                    Introduction & Terms Acknowledgement
                  </span>
                  <p style={{ margin: 0, fontSize: '0.94rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                    {ABOUT_AND_POLICIES_DATA.refundAndCancellation.introduction}
                  </p>
                </div>
              </div>

              {/* Four Distinct Policy Categories */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
                  gap: '1.25rem',
                  marginTop: '1.5rem',
                }}
              >
                {ABOUT_AND_POLICIES_DATA.refundAndCancellation.categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="policy-category-card"
                    style={{
                      padding: '1.5rem',
                      borderRadius: '12px',
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 220ms cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    <div>
                      {/* Category Header with Distinct Number Badge and Title */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '28px',
                            height: '28px',
                            borderRadius: '7px',
                            backgroundColor: 'rgba(255, 23, 68, 0.12)',
                            border: '1px solid rgba(255, 23, 68, 0.35)',
                            color: 'var(--red-accent)',
                            fontFamily: 'var(--font-tech)',
                            fontSize: '0.82rem',
                            fontWeight: 800,
                            flexShrink: 0,
                          }}
                        >
                          {cat.number}
                        </span>
                        <h3
                          style={{
                            fontFamily: 'var(--font-heading)',
                            fontWeight: 700,
                            fontSize: '1.08rem',
                            color: 'var(--heading-color)',
                            margin: 0,
                            lineHeight: 1.3,
                          }}
                        >
                          {cat.title}
                        </h3>
                      </div>

                      {/* Primary Text */}
                      <p
                        style={{
                          fontSize: '0.92rem',
                          color: 'var(--text-primary)',
                          lineHeight: 1.6,
                          marginBottom: '0.75rem',
                          fontWeight: 500,
                        }}
                      >
                        {cat.primaryText}
                      </p>

                      {/* Secondary Text */}
                      {cat.secondaryText && (
                        <p
                          style={{
                            fontSize: '0.88rem',
                            color: 'var(--text-secondary)',
                            lineHeight: 1.6,
                            marginBottom: cat.warning || cat.securityWarning || cat.actionNote ? '0.75rem' : 0,
                          }}
                        >
                          {cat.secondaryText}
                        </p>
                      )}

                      {/* Category 1 Warning: Cancellation Prior to Processing */}
                      {cat.warning && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            backgroundColor: 'rgba(255, 23, 68, 0.08)',
                            border: '1px solid rgba(255, 23, 68, 0.25)',
                            marginTop: '0.75rem',
                          }}
                        >
                          <AlertTriangle size={15} color="var(--red-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span style={{ fontSize: '0.84rem', color: 'var(--text-primary)', lineHeight: 1.5, fontWeight: 500 }}>
                            {cat.warning}
                          </span>
                        </div>
                      )}

                      {/* Category 2 Action Note: Non-Delivery or Payment Delay */}
                      {cat.actionNote && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            backgroundColor: 'rgba(59, 130, 246, 0.08)',
                            border: '1px solid rgba(59, 130, 246, 0.25)',
                            marginTop: '0.75rem',
                          }}
                        >
                          <HelpCircle size={15} color="#60A5FA" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span style={{ fontSize: '0.84rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                            {cat.actionNote}
                          </span>
                        </div>
                      )}

                      {/* Category 3 Highlighted Warning: IMPORTANT SECURITY INSTRUCTION */}
                      {cat.securityWarning && (
                        <div
                          style={{
                            padding: '0.9rem 1.1rem',
                            borderRadius: '8px',
                            backgroundColor: 'rgba(255, 23, 68, 0.1)',
                            border: '1px solid rgba(255, 23, 68, 0.45)',
                            marginTop: '0.75rem',
                            marginBottom: '0.75rem',
                            boxShadow: '0 0 15px rgba(255, 23, 68, 0.12)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.35rem' }}>
                            <ShieldAlert size={16} color="var(--red-accent)" />
                            <span
                              style={{
                                fontFamily: 'var(--font-tech)',
                                fontSize: '0.78rem',
                                fontWeight: 800,
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                color: 'var(--red-accent)',
                              }}
                            >
                              {cat.securityWarning.title}
                            </span>
                          </div>
                          <p
                            style={{
                              margin: 0,
                              fontSize: '0.88rem',
                              color: 'var(--text-primary)',
                              fontWeight: 600,
                              lineHeight: 1.55,
                            }}
                          >
                            {cat.securityWarning.instruction}
                          </p>
                        </div>
                      )}

                      {/* Category 3 Follow-up Guidance */}
                      {cat.followUpNote && (
                        <p
                          style={{
                            margin: 0,
                            fontSize: '0.84rem',
                            color: 'var(--text-secondary)',
                            lineHeight: 1.55,
                            fontStyle: 'italic',
                          }}
                        >
                          {cat.followUpNote}
                        </p>
                      )}

                      {/* Category 4 Turnaround Timeframe Badge */}
                      {cat.timeframeBadge && (
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '5px 12px',
                            borderRadius: '9999px',
                            backgroundColor: 'rgba(34, 197, 94, 0.1)',
                            border: '1px solid rgba(34, 197, 94, 0.3)',
                            color: '#22C55E',
                            fontFamily: 'var(--font-tech)',
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                            marginTop: '0.75rem',
                          }}
                        >
                          <Clock size={13} color="#22C55E" />
                          <span>{cat.timeframeBadge} Processing Window</span>
                        </div>
                      )}
                    </div>
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

              <p style={{ ...paragraphStyle, marginTop: '1rem', fontSize: '0.98rem', lineHeight: 1.7 }}>
                {ABOUT_AND_POLICIES_DATA.customerSupport.instructions}
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                  gap: '1.25rem',
                  marginTop: '1.75rem',
                }}
              >
                {ABOUT_AND_POLICIES_DATA.customerSupport.channels.map((chan) => (
                  <div
                    key={chan.name}
                    className="support-channel-card"
                    style={{
                      padding: '1.4rem',
                      borderRadius: '12px',
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 220ms cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.9rem' }}>
                        <div
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '10px',
                            backgroundColor: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid var(--border-glass)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {chan.platformId === 'whatsapp' && (
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true">
                              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm0 1.67c2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.53c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.01-1.24-.74-.66-1.24-1.48-1.39-1.73-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.53.61.19 1.16.17 1.6.1 0 0 .5-.2 1.03-.84.53-.63.53-1.18.37-1.31-.15-.13-.39-.2-.64-.33z" />
                            </svg>
                          )}
                          {chan.platformId === 'instagram' && (
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E1306C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                            </svg>
                          )}
                          {chan.platformId === 'telegram' && (
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="#229ED9" aria-hidden="true">
                              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.953z" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <h3
                            style={{
                              fontFamily: 'var(--font-heading)',
                              fontWeight: 700,
                              fontSize: '1.1rem',
                              color: 'var(--heading-color)',
                              margin: 0,
                              lineHeight: 1.25,
                            }}
                          >
                            {chan.name}
                          </h3>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              fontSize: '0.74rem',
                              fontFamily: 'var(--font-tech)',
                              color: '#10B981',
                              marginTop: '3px',
                            }}
                          >
                            <span
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor: '#10B981',
                                display: 'inline-block',
                              }}
                            />
                            Official Support
                          </span>
                        </div>
                      </div>

                      <p
                        style={{
                          fontSize: '0.88rem',
                          color: 'var(--text-secondary)',
                          lineHeight: 1.55,
                          marginBottom: '1.25rem',
                        }}
                      >
                        {chan.description}
                      </p>
                    </div>

                    <a
                      href={chan.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="support-contact-btn"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        width: '100%',
                        padding: '11px 16px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(255, 23, 68, 0.12)',
                        border: '1px solid rgba(255, 23, 68, 0.35)',
                        color: 'var(--red-accent)',
                        fontFamily: 'var(--font-tech)',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        letterSpacing: '0.04em',
                        textDecoration: 'none',
                        transition: 'all 200ms ease',
                        cursor: 'pointer',
                        boxShadow: '0 0 12px rgba(255, 23, 68, 0.12)',
                      }}
                    >
                      <span>{chan.buttonLabel}</span>
                      <ExternalLink size={14} />
                    </a>
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
        <style>{`
          .policy-category-card:hover {
            transform: translateY(-2px);
            border-color: rgba(255, 23, 68, 0.35) !important;
            box-shadow: 0 8px 20px -4px rgba(0, 0, 0, 0.4), 0 0 15px rgba(255, 23, 68, 0.08) !important;
          }
          .support-channel-card:hover {
            transform: translateY(-3px);
            border-color: rgba(255, 23, 68, 0.45) !important;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 23, 68, 0.12) !important;
          }
          .support-contact-btn:hover {
            background-color: var(--red-accent) !important;
            color: #FFFFFF !important;
            border-color: var(--red-accent) !important;
            box-shadow: 0 0 20px rgba(255, 23, 68, 0.5) !important;
            transform: translateY(-1px);
          }
        `}</style>
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
