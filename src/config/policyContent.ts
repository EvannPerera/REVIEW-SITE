export interface PolicySection {
  id: string;
  title: string;
  subtitle: string;
  content: string[];
  placeholderNotice?: string;
  subsections?: {
    title: string;
    items: string[];
  }[];
}

export const ABOUT_AND_POLICIES_DATA = {
  about: {
    title: 'About ÉVANN_STORIES',
    subtitle: 'Authenticity, Integrity & Gaming Community Excellence',
    description: [
      'ÉVANN_STORIES was established with a singular vision: to bring complete transparency, verified authenticity, and uncompromising honesty to the digital gaming service space.',
      'In an ecosystem crowded with anonymous middlemen, unverified testimonials, and unfulfilled promises, ÉVANN_STORIES stands apart by maintaining a publicly auditable, manually verified ledger of genuine client experiences.',
      'Every review published on this platform represents a real client narrative. Transactions are cross-referenced directly with private account records before a verification badge is granted.',
    ],
    philosophy: [
      'Unbiased Transparency: Client feedback is preserved with integrity. We never fabricate reviews or inflate satisfaction scores.',
      'Manual Human Authentication: Every purchase record and UID is reviewed by human eyes, not automated bots.',
      'Zero Privacy Exposure: We collect only the minimum required verification data, strictly isolated from public visibility via enterprise-grade Row Level Security.',
    ],
  },

  services: {
    title: 'Services & Digital Offerings',
    disclaimer: 'ÉVANN_STORIES operates as an independent community facilitator. We are NOT officially affiliated with, endorsed by, or partnered with Activision, Tencent, TiMi Studios, or Call of Duty: Mobile.',
    items: [
      {
        title: 'CODM Account Services & In-Game Assistance',
        description:
          'Assistance with account consultations, safe progression guidance, and digital community transactions within Call of Duty: Mobile.',
        note: '[ADD YOUR SPECIFIC CODM SERVICE PACKAGES AND DETAILS HERE]',
      },
      {
        title: 'Account Listings & Digital Marketplace Facilitation',
        description:
          'Peer-to-peer listing facilitation and transfer security audits for verified community members looking to acquire or showcase accounts.',
        note: '[ADD YOUR SPECIFIC LISTING CRITERIA AND GUIDELINES HERE]',
      },
      {
        title: 'Legitimate Account Access & Unlinking Guidance',
        description:
          'Advisory guidance for legitimate platform unlinking and credential hygiene, where officially supported by game publishers.',
        note: '[ADD YOUR SPECIFIC ACCESS OR UNLINKING SCOPE HERE]',
      },
      {
        title: 'Community Gaming & Digital Resources',
        description:
          'Community hubs, tournaments, strategy discussions, and real-time updates for competitive mobile gamers.',
        note: '[ADD DETAILS OF ANY TOURNAMENTS OR COMMUNITY BENEFITS HERE]',
      },
    ],
  },

  purchaseAndPayment: {
    title: 'Purchase & Payment Policy',
    sections: [
      {
        heading: 'Accepted Payment Methods',
        placeholder: '[ADD YOUR ACCEPTED PAYMENT METHODS HERE - e.g. Binance Pay, Crypto, Bank Transfer, PayPal, Wise]',
        guidance: 'Ensure you verify the exact payment address or account name provided in direct communication before dispatching any payment.',
      },
      {
        heading: 'Payment Confirmation & Verification',
        placeholder: '[ADD YOUR PAYMENT CONFIRMATION PROCESS HERE - e.g. Send screenshot of transaction ID to WhatsApp or Discord]',
        guidance: 'All transactions require verifiable receipt data (Transaction Hash, Reference Number, or Bank Receipt).',
      },
      {
        heading: 'Pricing & Additional Fees',
        placeholder: '[ADD YOUR PRICING STRUCTURE AND ANY APPLICABLE NETWORK/SERVICE FEES HERE]',
        guidance: 'Prices are transparently discussed prior to transaction confirmation. Network transaction fees are typically the responsibility of the sender.',
      },
      {
        heading: 'Service Delivery & Turnaround Time',
        placeholder: '[ADD YOUR EXPECTED DELIVERY TIMEFRAMES HERE - e.g. 5 minutes to 2 hours depending on queue]',
        guidance: 'Delivery commences once payment verification has cleared on the blockchain or recipient banking portal.',
      },
      {
        heading: 'Delayed Transactions Protocol',
        placeholder: '[ADD YOUR STEP-BY-STEP DELAY RESOLUTION INSTRUCTIONS HERE]',
        guidance: 'If your delivery exceeds the estimated timeframe, open a ticket on Discord or message Évann directly on WhatsApp with your Order Reference.',
      },
    ],
  },

  refundAndCancellation: {
    title: 'Refund & Cancellation Policy',
    highlight: 'Please review these terms carefully prior to initiating transactions.',
    rules: [
      {
        title: 'Cancellation Prior to Processing',
        detail: '[ADD YOUR CANCELLATION RULES BEFORE ORDER PROCESSING COMMENCES]',
      },
      {
        title: 'Non-Delivery or Service Failure Refund Terms',
        detail: '[ADD YOUR REFUND POLICY IN CASE OF SERVICE INABILITY OR NON-DELIVERY]',
      },
      {
        title: 'Completed Service Policy',
        detail: '[ADD YOUR POLICY REGARDING COMPLETED DIGITAL SERVICES AND TRANSFERS]',
      },
      {
        title: 'Processing Time for Approved Refunds',
        detail: '[ADD YOUR REFUND PROCESSING TIMEFRAME - e.g. 24–48 hours to original payment method]',
      },
    ],
  },

  accountSecurity: {
    title: 'Account Security & Customer Responsibility',
    corePrinciples: [
      'Never Share Passwords: ÉVANN_STORIES will NEVER ask for your game password, email login credentials, or multi-factor authentication (2FA) SMS codes on this review site.',
      'Private UID Usage: The CODM Account UID requested in the review form is used strictly to cross-reference our internal sales records. It is never exposed publicly.',
      'Two-Factor Authentication: Customers are strongly advised to enable 2FA on Activision and platform accounts at all times.',
      'No Security Bypass: We strictly condemn and will never participate in unauthorized account cracking, credential stuffing, or bypassing platform security mechanisms.',
    ],
  },

  serviceLimitations: {
    title: 'Service Limitations & Impartiality',
    points: [
      'Platform Dependency: Services are subject to publisher terms of service, server maintenance schedules, and platform status.',
      'No Guaranteed In-Game Outcomes: We do not guarantee arbitrary game rank retention, ban immunity, or publisher policy exemptions.',
      'Third-Party Actions: We cannot be held liable for unilateral platform changes implemented by Activision, Apple, or Google after service completion.',
    ],
  },

  customerSupport: {
    title: 'Customer Support & Dispute Resolution',
    instructions:
      'For prompt assistance, reach out through one of our official support channels listed below. Please have your transaction reference or CODM UID ready.',
    channels: [
      {
        name: 'WhatsApp Business Support',
        placeholder: '[ADD YOUR OFFICIAL WHATSAPP SUPPORT NUMBER OR LINK]',
        availability: '[ADD YOUR WORKING HOURS - e.g. 10:00 AM - 10:00 PM GMT+5:30]',
      },
      {
        name: 'Discord Support Tickets',
        placeholder: '[ADD YOUR DISCORD SUPPORT SERVER / TICKET CHANNEL LINK]',
        availability: '[ADD YOUR DISCORD RESPONSE TIME - e.g. Under 1 hour]',
      },
      {
        name: 'Instagram Direct Support',
        placeholder: '[ADD YOUR OFFICIAL INSTAGRAM DM LINK]',
        availability: '[ADD YOUR INSTAGRAM RESPONSE TIME]',
      },
    ],
  },

  reviewAndVerification: {
    title: 'Reviews & Verification Policy',
    terms: [
      'Pre-Publication Moderation: To ensure community safety and prevent malicious spam, all customer reviews enter a private moderation queue upon submission.',
      'Rejection Grounds: Reviews containing hate speech, offensive slurs, confidential credentials, external promotional links, or unsubstantiated claims will be rejected.',
      'Verified Purchase Badge: The "Verified Purchase" badge is manually applied only after the administrator verifies that the submitted CODM UID and transaction proof match valid transaction records.',
      'Impartial Testimonials: Supplying a negative rating or honest critique does NOT prevent review approval. Constructive feedback is welcome.',
      'No Third-Party Endorsement: The verified purchase badge signifies internal transaction confirmation only and does not imply third-party corporate endorsement.',
      'Public vs Private Data: Display names, platforms, star ratings, and review texts are publicly visible upon approval. Private UIDs and evidence screenshots are NEVER displayed publicly.',
    ],
  },

  privacyPolicy: {
    title: 'Privacy Policy',
    lastUpdated: 'October 2026',
    summary:
      'This Privacy Policy describes in plain language how ÉVANN_STORIES collects, uses, and safeguards information submitted through our customer review platform.',
    sections: [
      {
        heading: 'Information We Collect',
        body: 'When you submit a review, we collect: (1) Your chosen Display Name, (2) Your Country of residence, (3) The Platform through which you transacted, (4) Your Star Rating & Written Review, (5) Your CODM Account UID (used exclusively for private transaction verification), and (6) Optional screenshot evidence of the transaction.',
      },
      {
        heading: 'How Information is Protected (Supabase Architecture)',
        body: 'Our platform is backed by Supabase with PostgreSQL Row Level Security (RLS). Public visitors can only query approved reviews through a restricted view that excludes private UIDs. Screenshot evidence is stored in a private Supabase Storage bucket accessible solely by verified administrators.',
      },
      {
        heading: 'No Sensitive Account Credentials',
        body: 'We do not collect passwords, email account passwords, credit card numbers, or two-factor authentication codes. Do not provide sensitive passwords in the review form.',
      },
      {
        heading: 'Cookies & Local Storage',
        body: 'We use browser LocalStorage strictly to preserve your selected UI theme (Dark/Light Mode) and to log your review reactions (Helpful / Heart / Thumbs Up) without requiring an account login.',
      },
      {
        heading: 'Data Deletion & Inquiries',
        body: 'If you wish to remove or update a previously submitted review, please contact the site administrator via WhatsApp or Discord with your original transaction reference. [ADD YOUR DEDICATED PRIVACY CONTACT EMAIL IF APPLICABLE]',
      },
    ],
  },
};
