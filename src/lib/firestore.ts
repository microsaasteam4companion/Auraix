import {
  doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc,
  collection, query, where, orderBy, limit, increment, serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { UserProfile, BioPage, BioLink, SlugEntry, PageAnalytics } from '@/types';

// ── User Operations ──────────────────────────────────────────

export async function createUserProfile(uid: string, data: Partial<UserProfile>) {
  const isSpecialUser = data.email?.toLowerCase() === 'komalsiddharth814@gmail.com';
  const ref = doc(db, 'users', uid);
  await setDoc(ref, {
    uid,
    email: data.email || '',
    displayName: data.displayName || '',
    photoURL: data.photoURL || '',
    plan: isSpecialUser ? 'pro' : 'free',
    pagesUsed: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    ...data,
  }, { merge: true });
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  const data = snap.data();
  
  // Manual grant for special user
  if (data.email?.toLowerCase() === 'komalsiddharth814@gmail.com' && data.plan !== 'pro') {
    await updateDoc(doc(db, 'users', uid), { plan: 'pro' });
    data.plan = 'pro';
  }

  return {
    ...data,
    createdAt: data.createdAt?.toDate?.() || new Date(),
    updatedAt: data.updatedAt?.toDate?.() || new Date(),
  } as UserProfile;
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
  await updateDoc(doc(db, 'users', uid), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// ── Page Operations ──────────────────────────────────────────

export async function createBioPage(data: Omit<BioPage, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ref = doc(collection(db, 'pages'));
  const pageId = ref.id;

  await setDoc(ref, {
    ...data,
    id: pageId,
    totalViews: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // Create slug lookup
  await setDoc(doc(db, 'slugs', data.slug), {
    pageId,
    userId: data.userId,
  });

  // Increment user's page count (safe even if doc doesn't have pagesUsed yet)
  try {
    await updateDoc(doc(db, 'users', data.userId), {
      pagesUsed: increment(1),
    });
  } catch {
    // If updateDoc fails (e.g., doc doesn't exist), use setDoc with merge
    await setDoc(doc(db, 'users', data.userId), {
      pagesUsed: 1,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  }

  return pageId;
}

export async function getBioPage(pageId: string): Promise<BioPage | null> {
  const snap = await getDoc(doc(db, 'pages', pageId));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    ...data,
    createdAt: data.createdAt?.toDate?.() || new Date(),
    updatedAt: data.updatedAt?.toDate?.() || new Date(),
    publishAt: data.publishAt?.toDate?.() || undefined,
  } as BioPage;
}

export async function getBioPageBySlug(slug: string): Promise<BioPage | null> {
  const slugSnap = await getDoc(doc(db, 'slugs', slug));
  if (!slugSnap.exists()) return null;
  const { pageId } = slugSnap.data() as SlugEntry;
  return getBioPage(pageId);
}

export async function getUserPages(userId: string): Promise<BioPage[]> {
  const q = query(
    collection(db, 'pages'),
    where('userId', '==', userId)
  );
  const snap = await getDocs(q);
  const pages = snap.docs.map(d => {
    const data = d.data();
    return {
      ...data,
      createdAt: data.createdAt?.toDate?.() || new Date(),
      updatedAt: data.updatedAt?.toDate?.() || new Date(),
    } as BioPage;
  });
  // Sort client-side to avoid requiring a composite index
  return pages.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export async function updateBioPage(pageId: string, data: Partial<BioPage>) {
  const updateData: Record<string, unknown> = { ...data, updatedAt: serverTimestamp() };
  // Clean undefined fields
  Object.keys(updateData).forEach(k => updateData[k] === undefined && delete updateData[k]);
  await updateDoc(doc(db, 'pages', pageId), updateData);
}

export async function deleteBioPage(pageId: string, slug: string, userId: string) {
  await deleteDoc(doc(db, 'pages', pageId));
  await deleteDoc(doc(db, 'slugs', slug));
  await updateDoc(doc(db, 'users', userId), {
    pagesUsed: increment(-1),
  });
}

export async function isSlugAvailable(slug: string): Promise<boolean> {
  const snap = await getDoc(doc(db, 'slugs', slug));
  return !snap.exists();
}

// ── Analytics Operations ─────────────────────────────────────

export async function recordPageView(pageId: string, device: 'desktop' | 'mobile', referrer: string) {
  const today = new Date().toISOString().split('T')[0];
  const ref = doc(db, 'pages', pageId, 'analytics', today);

  // Increment total views on the page
  await updateDoc(doc(db, 'pages', pageId), {
    totalViews: increment(1),
  });

  // Upsert daily analytics
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const data = snap.data();
    await updateDoc(ref, {
      views: increment(1),
      [`devices.${device}`]: increment(1),
      [`referrers.${referrer || 'direct'}`]: increment(1),
    });
  } else {
    await setDoc(ref, {
      date: today,
      views: 1,
      clicks: {},
      devices: { desktop: device === 'desktop' ? 1 : 0, mobile: device === 'mobile' ? 1 : 0 },
      referrers: { [referrer || 'direct']: 1 },
    });
  }
}

export async function recordLinkClick(pageId: string, linkId: string) {
  const today = new Date().toISOString().split('T')[0];
  const ref = doc(db, 'pages', pageId, 'analytics', today);

  const snap = await getDoc(ref);
  if (snap.exists()) {
    await updateDoc(ref, {
      [`clicks.${linkId}`]: increment(1),
    });
  } else {
    await setDoc(ref, {
      date: today,
      views: 0,
      clicks: { [linkId]: 1 },
      devices: { desktop: 0, mobile: 0 },
      referrers: {},
    });
  }
}

export async function getPageAnalytics(pageId: string, days: number = 30): Promise<PageAnalytics[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startStr = startDate.toISOString().split('T')[0];

  const q = query(
    collection(db, 'pages', pageId, 'analytics'),
    where('date', '>=', startStr),
    orderBy('date', 'asc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as PageAnalytics);
}
