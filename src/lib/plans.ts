import { PlanConfig } from '@/types';

export const PLAN_LIMITS: Record<string, PlanConfig> = {
  free: {
    pages: 1,
    analytics: true,
    customDomain: false,
    removeBranding: false,
    themes: 3, // Only first 3 classic themes
    price: 0,
    name: 'Free',
    description: 'Get started with basics',
    productId: 'free',
  },
  pro: {
    pages: 100, // Effectively unlimited
    analytics: true,
    customDomain: true,
    removeBranding: true,
    themes: 100, // All themes
    price: 9,
    name: 'Paid (Pro)',
    description: 'Unlock everything, dominate your niche.',
    productId: process.env.NEXT_PUBLIC_DODO_PRODUCT_ID_PRO || 'pdt_0Nc6um6Et65g1HiItZtPN',
  },
};

export function canCreatePage(plan: string, pagesUsed: number): boolean {
  const config = PLAN_LIMITS[plan];
  return config ? pagesUsed < config.pages : false;
}

export function getPlanFeatures(plan: string): PlanConfig {
  return PLAN_LIMITS[plan] || PLAN_LIMITS.free;
}
