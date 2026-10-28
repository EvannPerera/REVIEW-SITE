export interface SocialPlatformConfig {
  id: string;
  name: string;
  handleOrCommunity: string;
  url: string; // Set your real destination URL here
  description: string;
  actionText: string;
  category: 'channel' | 'messaging' | 'community' | 'social';
  badge?: string;
  color: string;
  accentGlow: string;
}

/**
 * ==============================================================================
 * ÉVANN_STORIES SOCIAL MEDIA CONFIGURATION
 * ==============================================================================
 * Replace the placeholder URLs and handles below with your actual channels and profiles.
 * When a visitor clicks a card on the /socials page, it will open the destination in a new tab.
 */
export const SOCIAL_PLATFORMS: SocialPlatformConfig[] = [
  {
    id: 'youtube',
    name: 'YouTube',
    handleOrCommunity: '@Évann_stories [ADD YOUR YOUTUBE HANDLE]',
    url: 'https://youtube.com/@[ADD_YOUR_YOUTUBE_HANDLE]',
    description: 'Cinematic game highlights, gameplay clips, customer transaction walkthroughs, and official announcements.',
    actionText: 'Open Channel',
    category: 'channel',
    badge: 'Video & Streams',
    color: '#FF0000',
    accentGlow: 'rgba(255, 0, 0, 0.35)',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    handleOrCommunity: '@evann_stories [ADD YOUR INSTAGRAM HANDLE]',
    url: 'https://instagram.com/[ADD_YOUR_INSTAGRAM_HANDLE]',
    description: 'Direct stories, daily transaction proofs, feedback highlights, and instant DM customer support.',
    actionText: 'Visit Profile',
    category: 'social',
    badge: 'Daily Updates',
    color: '#E1306C',
    accentGlow: 'rgba(225, 48, 108, 0.35)',
  },
  {
    id: 'discord',
    name: 'Discord Community',
    handleOrCommunity: 'ÉVANN_STORIES Official Discord [ADD SERVER INVITE]',
    url: 'https://discord.gg/[ADD_YOUR_DISCORD_INVITE_CODE]',
    description: 'Join our verified gaming community for real-time drop alerts, vouch threads, and 24/7 direct support.',
    actionText: 'Join Community',
    category: 'community',
    badge: 'Live Hub',
    color: '#5865F2',
    accentGlow: 'rgba(88, 101, 242, 0.35)',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    handleOrCommunity: '+[ADD YOUR WHATSAPP NUMBER]',
    url: 'https://wa.me/[ADD_YOUR_WHATSAPP_NUMBER_WITHOUT_PLUS]',
    description: 'Private 1-on-1 transaction coordination, order queries, payment receipts, and immediate assistance.',
    actionText: 'Chat on WhatsApp',
    category: 'messaging',
    badge: 'Instant Support',
    color: '#25D366',
    accentGlow: 'rgba(37, 211, 102, 0.35)',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    handleOrCommunity: '@evann_stories [ADD YOUR TIKTOK HANDLE]',
    url: 'https://tiktok.com/@[ADD_YOUR_TIKTOK_HANDLE]',
    description: 'Fast viral gameplay edits, account showcases, unboxing mythics, and community highlights.',
    actionText: 'Watch on TikTok',
    category: 'channel',
    badge: 'Shorts & Edits',
    color: '#00F2FE',
    accentGlow: 'rgba(0, 242, 254, 0.35)',
  },
  {
    id: 'facebook',
    name: 'Facebook Page',
    handleOrCommunity: 'Évann Stories [ADD YOUR FACEBOOK PAGE]',
    url: 'https://facebook.com/[ADD_YOUR_FACEBOOK_PAGE]',
    description: 'Official announcements, customer vouchers, service discussions, and community posts.',
    actionText: 'Visit Page',
    category: 'social',
    badge: 'Community',
    color: '#1877F2',
    accentGlow: 'rgba(24, 119, 242, 0.35)',
  },
  {
    id: 'telegram',
    name: 'Telegram Channel',
    handleOrCommunity: '@evann_stories_news [OPTIONAL TELEGRAM LINK]',
    url: 'https://t.me/[ADD_YOUR_TELEGRAM_LINK_OR_LEAVE_BLANK]',
    description: 'Instant broadcast alerts, stock drops, price announcements, and direct notices.',
    actionText: 'Join Telegram',
    category: 'messaging',
    badge: 'Alerts',
    color: '#229ED9',
    accentGlow: 'rgba(34, 158, 217, 0.35)',
  },
];
