import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type AppRoute = 'home' | 'reviews' | 'about' | 'socials' | 'admin';

interface RouterContextType {
  currentRoute: AppRoute;
  navigate: (route: AppRoute, sectionId?: string) => void;
  targetSection?: string | null;
  clearTargetSection: () => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

// Route to hash mapping
const ROUTE_TO_HASH: Record<AppRoute, string> = {
  home: '#/',
  reviews: '#/reviews',
  about: '#/about',
  socials: '#/socials',
  admin: '#/admin',
};

const parseHashToRoute = (hash: string): { route: AppRoute; sectionId?: string } => {
  const cleanHash = hash.replace(/^#/, '');
  const [path, section] = cleanHash.split('?');

  if (path === '/reviews' || path === 'reviews') {
    return { route: 'reviews', sectionId: section };
  }
  if (path === '/about' || path === 'about') {
    return { route: 'about', sectionId: section };
  }
  if (path === '/socials' || path === 'socials') {
    return { route: 'socials', sectionId: section };
  }
  if (path === '/admin' || path === 'admin') {
    return { route: 'admin', sectionId: section };
  }

  // Also check standard pathname if hash is empty (e.g. user arrived via direct link)
  if (typeof window !== 'undefined' && (!hash || hash === '' || hash === '#/')) {
    const pathname = window.location.pathname.toLowerCase();
    if (pathname.endsWith('/reviews')) return { route: 'reviews' };
    if (pathname.endsWith('/about')) return { route: 'about' };
    if (pathname.endsWith('/socials')) return { route: 'socials' };
    if (pathname.endsWith('/admin')) return { route: 'admin' };
  }

  return { route: 'home', sectionId: section };
};

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() => {
    if (typeof window !== 'undefined') {
      return parseHashToRoute(window.location.hash).route;
    }
    return 'home';
  });

  const [targetSection, setTargetSection] = useState<string | null>(null);

  // Sync with browser back/forward and hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const parsed = parseHashToRoute(window.location.hash);
      setCurrentRoute(parsed.route);
      if (parsed.sectionId) {
        setTargetSection(parsed.sectionId);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = useCallback((route: AppRoute, sectionId?: string) => {
    setCurrentRoute(route);
    setTargetSection(sectionId || null);

    const hash = ROUTE_TO_HASH[route];
    const fullHash = sectionId ? `${hash}?${sectionId}` : hash;

    if (window.location.hash !== fullHash) {
      window.location.hash = fullHash;
    }

    // Scroll to top when changing route unless target section specified
    if (!sectionId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const clearTargetSection = useCallback(() => {
    setTargetSection(null);
  }, []);

  // Update page title dynamically for SEO and UX
  useEffect(() => {
    const titleMap: Record<AppRoute, string> = {
      home: 'ÉVANN_STORIES — Cinematic Verified Customer Reviews',
      reviews: 'Customer Reviews — ÉVANN_STORIES',
      about: 'About Évann & Service Policies — ÉVANN_STORIES',
      socials: 'My Socials & Official Hubs — ÉVANN_STORIES',
      admin: 'Admin Verification Portal — ÉVANN_STORIES',
    };
    document.title = titleMap[currentRoute] || 'ÉVANN_STORIES';
  }, [currentRoute]);

  return (
    <RouterContext.Provider
      value={{ currentRoute, navigate, targetSection, clearTargetSection }}
    >
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = (): RouterContextType => {
  const ctx = useContext(RouterContext);
  if (!ctx) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return ctx;
};
