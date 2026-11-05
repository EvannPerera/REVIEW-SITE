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
    disclaimer: {
      title: 'Impartiality Disclaimer',
      paragraphs: [
        'ÉVANN_STORIES operates independently as a community facilitator and digital gaming account service provider.',
        'We are NOT officially affiliated with, endorsed by, sponsored by, or partnered with Activision, Tencent, TiMi Studios, or Call of Duty: Mobile.',
        'All services are independently operated.',
      ],
    },
    buyingAndSelling: {
      id: 'buying-and-selling',
      number: '1',
      title: 'CODM Accounts Buying & Selling',
      intro:
        'ÉVANN_STORIES provides Call of Duty: Mobile (CODM) account buying and selling services.',
      offerings: [
        {
          label: 'Account Sales',
          description: 'Browse and purchase available CODM accounts from our current stock.',
        },
        {
          label: 'Account Purchases',
          description: 'We also buy CODM accounts from individuals looking to sell their accounts.',
        },
      ],
      description:
        'Whether you are looking to buy an account or sell one, contact ÉVANN_STORIES directly to discuss availability, account details, valuation, and transaction arrangements.',
      pricingNote:
        'All offers and prices are discussed individually before a transaction is confirmed.',
      cta: {
        label: 'Inquire About Buying or Selling',
        url: 'https://wa.me/message/J5GD7AI5QQCIF1',
      },
    },
    marketplaceListings: {
      id: 'marketplace-listings',
      number: '2',
      title: 'Account Listings & Digital Marketplace Facilitation',
      question:
        "Want to sell your CODM account but don't have the audience or reach to find a suitable buyer?",
      intro:
        'You can submit your account to ÉVANN_STORIES for promotional listing and marketplace facilitation.',
      description:
        'We help account owners showcase their accounts to potential buyers through our community and social media platforms.',
      requirementsTitle: 'Requirements for account listing:',
      requirements: [
        'You must have legitimate access and control of the account.',
        'You must understand and trust the agreed listing and selling process.',
        'You must clearly confirm that you intend to sell the account before the process begins.',
        'Once the listing and selling process has started, you must remain committed to the agreed selling arrangement.',
        "Do not change the account's credentials, listing details, or selling decision midway through an active transaction without communicating with ÉVANN_STORIES first.",
      ],
      feeNotice:
        'Account listings, promotional arrangements, and applicable service fees will be discussed before proceeding.',
      contactNote: 'Contact us privately to discuss listing your account.',
      cta: {
        label: 'Discuss Listing Your Account',
        url: 'https://wa.me/message/J5GD7AI5QQCIF1',
      },
    },
    accessAndUnlinking: {
      id: 'access-and-unlinking',
      number: '3',
      title: 'Legitimate Account Access & Unlinking Guidance',
      intro:
        'ÉVANN_STORIES provides account access assistance and paid unlinking-related services for supported account situations.',
      platformsIntro:
        'Our services may include assistance with account-linking issues involving:',
      platforms: ['Facebook', 'Google', 'LINE', 'Apple', 'Game Center', 'Activision'],
      investigationNote:
        'We also offer paid assistance for investigating and resolving unauthorized or unwanted linked-account situations, subject to account ownership verification, available platform procedures, and technical limitations.',
      conditionsTitle: 'Important conditions:',
      conditions: [
        'The customer must be the legitimate account owner or have proper authorization.',
        'Account ownership and relevant access must be verified before assistance begins.',
        'Unlinking or credential changes must be performed only through legitimate, authorized methods.',
        'We cannot guarantee that every platform or account-linking situation can be resolved.',
        'Some unlinking requests may be restricted by the game publisher or the relevant platform.',
      ],
      pricingNotice: 'Service availability and pricing depend on the specific issue.',
      cta: {
        label: 'Request Access & Unlinking Assistance',
        url: 'https://wa.me/message/J5GD7AI5QQCIF1',
      },
    },
    communityResources: {
      id: 'community-resources',
      number: '4',
      title: 'Community Gaming & Digital Resources',
      intro:
        'Join the ÉVANN_STORIES community to stay updated with CODM-related activities, announcements, and opportunities.',
      activitiesIntro: 'Our community activities include:',
      activities: [
        'Giveaways and special promotions.',
        'Community tournaments and competitive gaming events.',
        'CODM-related announcements and updates.',
        'Gaming discussions and community engagement.',
        'Special opportunities shared with our followers.',
      ],
      stayConnectedNotice: {
        title: 'Stay connected!',
        description:
          'Giveaways, tournaments, and important announcements are published across our social media platforms.',
        instruction:
          "Follow all our official social media channels so you don't miss announcements, participation opportunities, or community events.",
      },
      cta: {
        label: 'Follow All Official Social Channels',
        route: 'socials',
      },
    },
  },

  purchaseAndPayment: {
    title: 'Purchase & Payment Policy',
    introduction:
      'Please review the following payment conditions carefully before proceeding with a purchase.',
    paymentMethods: [
      { name: 'Binance Pay', id: 'binance-pay' },
      { name: 'Cryptocurrency (Crypto)', id: 'crypto' },
      { name: 'Bank Transfer', id: 'bank-transfer' },
      { name: 'PayPal', id: 'paypal' },
      { name: 'Wise', id: 'wise' },
      { name: 'Skrill', id: 'skrill' },
      { name: 'Remitly', id: 'remitly' },
    ],
    sections: [
      {
        id: 'accepted-methods',
        number: '1',
        title: 'Accepted Payment Methods',
        description: 'We currently accept the following payment methods:',
        securityNotice: {
          title: 'IMPORTANT PAYMENT SECURITY NOTICE',
          rules: [
            'Always verify the exact payment address, wallet address, or recipient account name provided through direct communication with Évann Stories before sending any payment.',
            'Do not rely on previously saved payment details or information provided by unauthorized individuals. Always confirm the payment instructions for each transaction.',
          ],
        },
      },
      {
        id: 'payment-confirmation',
        number: '2',
        title: 'Payment Confirmation & Verification',
        description: 'All transactions require verifiable proof of payment.',
        acceptedEvidenceIntro: 'Accepted verification evidence includes:',
        acceptedEvidence: [
          'Transaction verification screenshots.',
          'Bank payment receipts.',
          'Transaction IDs or payment references.',
        ],
        instructions:
          'After completing your payment, send a screenshot containing the transaction ID or relevant payment reference to the same communication platform used to arrange your purchase.',
        finalNote:
          'Your transaction will proceed only after the payment has been successfully verified.',
      },
      {
        id: 'pricing-and-fees',
        number: '3',
        title: 'Pricing & Additional Fees',
        description:
          'All prices will be transparently communicated and agreed upon before the transaction is confirmed.',
        feeNotice: {
          highlight:
            'All additional network, transaction, transfer, or payment service fees must be covered by the buyer.',
          details:
            'This includes any fees charged by banks, cryptocurrency networks, payment processors, or third-party transfer services.',
        },
        exclusionNote:
          'The agreed purchase price does not include additional fees unless explicitly stated otherwise.',
      },
      {
        id: 'service-delivery-time',
        number: '4',
        title: 'Service Delivery & Turnaround Time',
        description:
          'Delivery will commence once the payment has been successfully verified through the relevant blockchain network or recipient banking/payment portal.',
        availabilityWarning: {
          highlight: 'Please complete your payment promptly after confirming an offer.',
          details:
            'Account availability and pricing may change while payment is pending. Another buyer may make a higher offer during this period, so delays in payment may result in the account becoming unavailable.',
          finalNote:
            'A purchase is not considered confirmed until payment verification has been completed.',
        },
      },
      {
        id: 'delayed-transactions-protocol',
        number: '5',
        title: 'Delayed Transactions Protocol',
        description:
          'If your delivery exceeds the estimated timeframe communicated during the transaction, please contact Évann Stories directly.',
        optionsIntro: 'You can:',
        options: [
          'Open a support ticket through our Discord server.',
          'Message Évann Stories directly through WhatsApp Business.',
        ],
        orderRefNotice:
          'When contacting support, always provide your Order Reference and relevant transaction details so the issue can be investigated efficiently.',
        whatsappUrl: 'https://wa.me/message/J5GD7AI5QQCIF1',
        discordNote:
          'For Discord support, customers must request private server access.',
      },
    ],
  },

  refundAndCancellation: {
    title: 'Refund & Cancellation Policy',
    introduction:
      'Please review these terms carefully before initiating any transaction. By proceeding with a purchase, customers acknowledge and agree to the following conditions.',
    categories: [
      {
        id: 'cancellation-prior-to-processing',
        number: '1',
        title: 'Cancellation Prior to Processing',
        primaryText:
          'A deal becomes difficult to cancel once processing has started.',
        secondaryText:
          'Please make sure you are certain about your purchase before confirming the transaction. Once the processing stage begins, cancellation may no longer be possible.',
        warning:
          'Once the processing stage begins, cancellation may no longer be possible.',
      },
      {
        id: 'non-delivery-service-failure',
        number: '2',
        title: 'Non-Delivery or Service Failure Refund Terms',
        primaryText:
          'If an account is sold or becomes unavailable while your payment is delayed, we may be unable to proceed with the transaction.',
        secondaryText:
          'Please complete your payment promptly after confirming a deal. Account availability is not guaranteed during payment delays.',
        actionNote:
          'If the account becomes unavailable before the transaction is completed, contact us directly to discuss the available options.',
      },
      {
        id: 'completed-service-policy',
        number: '3',
        title: 'Completed Service Policy',
        primaryText:
          'Once the deal is completed and the account has been handed over, customers may log in and use the account.',
        securityWarning: {
          title: 'IMPORTANT SECURITY INSTRUCTION',
          instruction:
            'Do not attempt to log in, change passwords, modify account credentials, or make account-related changes until I explicitly instruct you to do so.',
        },
        followUpNote:
          'Please follow the instructions provided during the transaction to avoid account access or security issues.',
      },
      {
        id: 'refund-processing-time',
        number: '4',
        title: 'Processing Time for Approved Refunds',
        timeframeBadge: '24–48 Hours',
        primaryText:
          'Approved refunds will generally be processed within 24–48 hours and returned to the original payment method, where supported by the payment provider.',
        secondaryText:
          'Actual processing and settlement times may depend on the payment provider.',
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
      "Need help with a purchase, have a concern, or want to resolve a dispute? Contact Evann Stories directly through any of the official channels below. I'm here to help.",
    channels: [
      {
        name: 'WhatsApp Business',
        url: 'https://wa.me/message/J5GD7AI5QQCIF1',
        buttonLabel: 'Contact on WhatsApp',
        platformId: 'whatsapp',
        description: 'Instant direct messaging, order assistance, and dispute resolution.',
      },
      {
        name: 'Instagram',
        url: 'https://www.instagram.com/accounts.with_evann?exln=MWJhdXprdXRuZ2g0ZA%3D%3D&utm_source=qr',
        buttonLabel: 'Message on Instagram',
        platformId: 'instagram',
        description: 'Direct DM support, official story announcements, and order updates.',
      },
      {
        name: 'Telegram',
        url: 'https://t.me/Evann_stories',
        buttonLabel: 'Contact on Telegram',
        platformId: 'telegram',
        description: 'Fast, secure direct messaging and direct dispute resolution.',
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
