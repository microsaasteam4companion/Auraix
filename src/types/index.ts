// ============================================================
// Types for the Bio Link Builder application
// ============================================================

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  plan: Plan;
  pagesUsed: number;
  stripeCustomerId?: string;
  dodoCustomerId?: string;
  paymentId?: string;
  subscriptionId?: string;
  planUpdatedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type Plan = 'free' | 'pro';

export interface BioPage {
  id: string;
  userId: string;
  slug: string;
  title: string;
  displayName: string;
  bio: string;
  photoURL: string;
  links: BioLink[];
  theme: ThemeName;
  fontFamily?: string;
  buttonStyle?: 'pill' | 'rounded' | 'square' | 'outline' | 'glass';
  backgroundEffect?: 'none' | 'aurora' | 'particles' | 'mesh' | 'snow' | 'rain';
  customBgColor?: string;
  customDomain?: string;
  isPublished: boolean;
  publishAt?: Date;
  totalViews: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BioLink {
  id: string;
  title: string;
  url: string;
  icon?: string;
  clicks: number;
}

export type ThemeName =
  | 'light' | 'dark' | 'minimal' | 'soft' | 'classic'
  | 'basics' | 'carbon' | 'christmas' | 'pride' | 'glitch'
  | 'winter' | 'glassy' | 'chameleon' | 'rainynight' | 'neon' | 'summer' | 'retro';

export interface PageAnalytics {
  date: string; // YYYY-MM-DD
  views: number;
  clicks: Record<string, number>; // linkId -> count
  devices: {
    desktop: number;
    mobile: number;
  };
  referrers: Record<string, number>;
}

export interface SlugEntry {
  pageId: string;
  userId: string;
}

// Plan limits and features
export interface PlanConfig {
  pages: number;
  analytics: boolean;
  customDomain: boolean;
  removeBranding: boolean;
  themes: number;
  price: number;
  name: string;
  description: string;
  productId: string;
}

// AI Bio generation
export interface BioGenerationRequest {
  handle: string;
  platform: 'instagram' | 'twitter' | 'tiktok' | 'linkedin' | 'youtube';
  tone: 'professional' | 'casual' | 'witty' | 'inspirational';
}

export interface BioGenerationResponse {
  bio: string;
  error?: string;
}
