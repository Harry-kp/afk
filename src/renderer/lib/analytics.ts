/**
 * Analytics wrapper - no-op unless VITE_MIXPANEL_TOKEN is set
 */

import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN;
let isInitialized = false;

// Anonymous, per-install id
function getOrCreateUserId(): string {
  const stored = localStorage.getItem('afk_user_id');
  if (stored) return stored;

  const newId = crypto.randomUUID();
  localStorage.setItem('afk_user_id', newId);
  return newId;
}

if (MIXPANEL_TOKEN) {
  try {
    mixpanel.init(MIXPANEL_TOKEN, {
      debug: import.meta.env.DEV,
      track_pageview: false,
      persistence: 'localStorage',
    });
    mixpanel.identify(getOrCreateUserId());
    mixpanel.register({ platform: 'macos', source: 'desktop' });
    isInitialized = true;
  } catch (e) {
    console.warn('Failed to initialize analytics:', e);
  }
}

export function track(event: string, properties?: Record<string, unknown>): void {
  if (!isInitialized) {
    if (import.meta.env.DEV) {
      console.log('[Analytics]', event, properties);
    }
    return;
  }

  try {
    mixpanel.track(event, properties);
  } catch (e) {
    console.warn('Failed to track event:', e);
  }
}
