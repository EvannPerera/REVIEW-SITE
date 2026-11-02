export interface SocialPlatformConfig {
  id: string;
  displayName: string;
  label: string;
  url: string;
  description: string;
  actionText: string;
  category: 'messaging' | 'social' | 'channel' | 'community';
  badge?: string;
  color: string;
  accentGlow: string;
  isPrivateAccess?: boolean;
  privateNote?: string;
}

/**
 * ==============================================================================
 * ÉVANN_STORIES OFFICIAL SOCIAL MEDIA & COMMUNITY DESTINATIONS
 * ==============================================================================
 * All official links verified. Every card consistently displays "Evann Stories".
 * Discord and WhatsApp Community access are provided privately via WhatsApp Business.
 */
export const SOCIAL_PLATFORMS: SocialPlatformConfig[] = [
  {
    id: 'whatsapp-business',
    displayName: 'Evann Stories',
    label: 'WhatsApp Business',
    url: 'https://wa.me/message/J5GD7AI5QQCIF1',
    description: 'Private 1-on-1 customer support, order verification, transaction receipts, and direct assistance.',
    actionText: 'Chat on WhatsApp',
    category: 'messaging',
    badge: 'Direct Support',
    color: '#25D366',
    accentGlow: 'rgba(37, 211, 102, 0.35)',
  },
  {
    id: 'facebook',
    displayName: 'Evann Stories',
    label: 'Facebook',
    url: 'https://www.facebook.com/share/16RLu5K5cGx/?mibextid=wwXIfr',
    description: 'Official announcements, customer vouchers, service discussions, and community posts.',
    actionText: 'Visit Facebook Page',
    category: 'social',
    badge: 'Official Page',
    color: '#1877F2',
    accentGlow: 'rgba(24, 119, 242, 0.35)',
  },
  {
    id: 'instagram',
    displayName: 'Evann Stories',
    label: 'Instagram',
    url: 'https://www.instagram.com/accounts.with_evann?exln=MWJhdXprdXRuZ2g0ZA%3D%3D&utm_source=qr',
    description: 'Daily stories, verified transaction proofs, feedback highlights, and instant DM customer support.',
    actionText: 'View Instagram Profile',
    category: 'social',
    badge: 'Daily Updates',
    color: '#E1306C',
    accentGlow: 'rgba(225, 48, 108, 0.35)',
  },
  {
    id: 'telegram',
    displayName: 'Evann Stories',
    label: 'Telegram',
    url: 'https://t.me/Evann_stories',
    description: 'Direct messaging, instant broadcast alerts, stock drop notices, and community communication.',
    actionText: 'Open Telegram Profile',
    category: 'messaging',
    badge: 'Direct Contact',
    color: '#229ED9',
    accentGlow: 'rgba(34, 158, 217, 0.35)',
  },
  {
    id: 'youtube',
    displayName: 'Evann Stories',
    label: 'YouTube',
    url: 'https://youtube.com/@evann_stories?si=lN4RpWWIlDSfAJTv',
    description: 'Cinematic game highlights, gameplay clips, customer transaction walkthroughs, and official videos.',
    actionText: 'Visit YouTube Channel',
    category: 'channel',
    badge: 'Videos & Shorts',
    color: '#FF0000',
    accentGlow: 'rgba(255, 0, 0, 0.35)',
  },
  {
    id: 'tiktok',
    displayName: 'Evann Stories',
    label: 'TikTok',
    url: 'https://www.tiktok.com/@evann_stories?_r=1&_t=ZS-9B2uW7EE8QP',
    description: 'Fast viral gameplay edits, account showcases, unboxing mythics, and community highlights.',
    actionText: 'Watch on TikTok',
    category: 'channel',
    badge: 'Shorts & Edits',
    color: '#00F2FE',
    accentGlow: 'rgba(0, 242, 254, 0.35)',
  },
  {
    id: 'discord',
    displayName: 'Evann Stories',
    label: 'Discord Community',
    url: 'https://wa.me/message/J5GD7AI5QQCIF1',
    description: 'Want to join our Discord community? Contact us privately to request access.',
    actionText: 'Request Server Access',
    category: 'community',
    badge: 'Private Access',
    color: '#5865F2',
    accentGlow: 'rgba(88, 101, 242, 0.35)',
    isPrivateAccess: true,
    privateNote: 'Discord server invite is provided privately after request.',
  },
  {
    id: 'whatsapp-community',
    displayName: 'Evann Stories',
    label: 'WhatsApp Community',
    url: 'https://wa.me/message/J5GD7AI5QQCIF1',
    description: 'Our WhatsApp community is available through separate local and international groups. Contact us privately to request access to the appropriate group.',
    actionText: 'Request Group Access',
    category: 'community',
    badge: 'Private Access',
    color: '#25D366',
    accentGlow: 'rgba(37, 211, 102, 0.35)',
    isPrivateAccess: true,
    privateNote: 'Group invite link is provided privately for local or international groups.',
  },
];
