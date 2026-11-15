// The launch switch. Demo is the default; live runs only when Hunter launches.
export const SITE_MODE: 'demo' | 'live' = process.env.NEXT_PUBLIC_SITE_MODE === 'live' ? 'live' : 'demo';
export const IS_LIVE = SITE_MODE === 'live';
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
export const absUrl = (path = '/') => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
