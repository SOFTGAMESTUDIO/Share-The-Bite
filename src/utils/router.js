// ============================================================================
// HASH ROUTER UTILITY
// Enables clean URL navigation (e.g. #/listings, #/admin?tab=database),
// browser Back/Forward history support, and deep-linking without 404s.
// ============================================================================

import { useState, useEffect } from 'react';

export function parseHash() {
  const hash = window.location.hash || '#/report';
  const clean = hash.replace(/^#\/?/, ''); // e.g. "admin?tab=database" or "listings/102"
  const [pathPart, queryPart] = clean.split('?');

  const segments = pathPart ? pathPart.split('/').filter(Boolean) : [];
  const route = segments[0] || 'report';
  const subRoute = segments[1] || null;

  const query = {};
  if (queryPart) {
    const searchParams = new URLSearchParams(queryPart);
    for (const [key, value] of searchParams.entries()) {
      query[key] = value;
    }
  }

  return { route, subRoute, query, fullPath: clean };
}

export function navigateTo(route, queryParams = {}) {
  let newHash = `#/${route}`;
  const keys = Object.keys(queryParams);
  if (keys.length > 0) {
    const searchParams = new URLSearchParams();
    for (const key of keys) {
      if (queryParams[key] !== undefined && queryParams[key] !== null && queryParams[key] !== '') {
        searchParams.set(key, queryParams[key]);
      }
    }
    const qStr = searchParams.toString();
    if (qStr) {
      newHash += `?${qStr}`;
    }
  }

  if (window.location.hash !== newHash) {
    window.location.hash = newHash;
  }
}

export function useHashRoute() {
  const [currentRoute, setCurrentRoute] = useState(parseHash());

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(parseHash());
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);

    // Ensure initial hash exists
    if (!window.location.hash) {
      window.location.hash = '#/report';
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  return {
    ...currentRoute,
    navigate: navigateTo
  };
}

