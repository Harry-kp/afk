/**
 * Analytics wrapper - provides typed analytics tracking for product decisions
 * All events are designed to help understand user behavior and improve the product
 */

import mixpanel from 'mixpanel-browser';

let isInitialized = false;
let userId: string | null = null;

// Initialize Mixpanel (optional - only if token is provided)
const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN;

// Generate or retrieve anonymous user ID
function getOrCreateUserId(): string {
  const stored = localStorage.getItem('afk_user_id');
  if (stored) return stored;
  
  const newId = crypto.randomUUID();
  localStorage.setItem('afk_user_id', newId);
  return newId;
}

// Get app version from Tauri
async function getAppVersion(): Promise<string> {
  try {
    if (window.__TAURI__?.core?.invoke) {
      return await window.__TAURI__.core.invoke('get_app_version') || '1.0.0';
    }
  } catch {
    // Ignore
  }
  return '1.0.0';
}

// Initialize analytics
if (MIXPANEL_TOKEN) {
  try {
    mixpanel.init(MIXPANEL_TOKEN, {
      debug: import.meta.env.DEV,
      track_pageview: false,
      persistence: 'localStorage',
    });
    
    userId = getOrCreateUserId();
    mixpanel.identify(userId);
    
    // Set super properties (included with every event)
    getAppVersion().then(version => {
      mixpanel.register({
        app_version: version,
        platform: 'macos',
        source: 'desktop',
      });
    });
    
    isInitialized = true;
  } catch (e) {
    console.warn('Failed to initialize analytics:', e);
  }
}

/**
 * Track an analytics event safely
 */
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

// ============================================================================
// TYPED EVENT HELPERS - For consistent tracking across the app
// ============================================================================

/**
 * Lifecycle Events - Track app usage patterns
 */
export const Lifecycle = {
  /** App was launched */
  appOpened: (isFirstLaunch: boolean) => {
    track('app_opened', {
      is_first_launch: isFirstLaunch,
      timestamp: new Date().toISOString(),
    });
    
    if (isFirstLaunch) {
      localStorage.setItem('afk_first_launch_time', Date.now().toString());
    }
  },
  
  /** App went to background */
  appBackgrounded: (sessionActive: boolean) => {
    track('app_backgrounded', {
      session_active: sessionActive,
    });
  },
};

/**
 * Session Events - Understand work patterns
 */
export const Session = {
  /** User started a new work session */
  started: (durationMins: number, source: 'ui' | 'tray' | 'auto') => {
    const firstLaunchTime = localStorage.getItem('afk_first_launch_time');
    const isFirstSession = !localStorage.getItem('afk_first_session_completed');
    
    track('session_started', {
      duration_mins: durationMins,
      source,
      is_first_session: isFirstSession,
    });
    
    // Track activation time for first session
    if (isFirstSession && firstLaunchTime) {
      const timeToActivate = Math.floor((Date.now() - parseInt(firstLaunchTime)) / 1000);
      track('first_session_started', {
        seconds_since_install: timeToActivate,
      });
    }
  },
  
  /** Session completed naturally (break was shown) */
  completed: (stats: { 
    durationMins: number; 
    breaksTaken: number; 
    breaksSkipped: number;
  }) => {
    track('session_completed', {
      duration_mins: stats.durationMins,
      breaks_taken: stats.breaksTaken,
      breaks_skipped: stats.breaksSkipped,
    });
    
    localStorage.setItem('afk_first_session_completed', 'true');
  },
  
  /** User paused the session */
  paused: (remainingMins: number) => {
    track('session_paused', {
      remaining_mins: remainingMins,
    });
  },
  
  /** User resumed a paused session */
  resumed: (remainingMins: number) => {
    track('session_resumed', {
      remaining_mins: remainingMins,
    });
  },
  
  /** User ended session early */
  endedEarly: (remainingMins: number, breaksTaken: number) => {
    track('session_ended_early', {
      remaining_mins: remainingMins,
      breaks_taken: breaksTaken,
    });
  },
};

/**
 * Break Events - Track break engagement
 */
export const Break = {
  /** Break screen was shown */
  shown: (isLongBreak: boolean, breakNumber: number) => {
    track('break_shown', {
      is_long_break: isLongBreak,
      break_number: breakNumber,
    });
  },
  
  /** User completed the full break */
  completed: (durationSecs: number, isLongBreak: boolean) => {
    track('break_completed', {
      duration_secs: durationSecs,
      is_long_break: isLongBreak,
    });
  },
  
  /** User skipped the break */
  skipped: (secondsRemaining: number) => {
    track('break_skipped', {
      seconds_remaining: secondsRemaining,
    });
  },
  
  /** User snoozed the break */
  snoozed: (snoozeCount: number) => {
    track('break_snoozed', {
      snooze_count: snoozeCount,
    });
  },
  
  /** User started break early */
  startedEarly: (secondsRemaining: number) => {
    track('break_started_early', {
      seconds_remaining: secondsRemaining,
    });
  },
};

/**
 * Settings Events - Track feature adoption
 */
export const Settings = {
  /** A setting was changed */
  changed: (setting: string, oldValue: unknown, newValue: unknown) => {
    track('setting_changed', {
      setting,
      old_value: oldValue,
      new_value: newValue,
    });
  },
  
  /** A feature was toggled on/off */
  featureToggled: (feature: string, enabled: boolean) => {
    track('feature_toggled', {
      feature,
      enabled,
    });
  },
  
  /** Settings page was opened */
  opened: (source: 'ui' | 'tray') => {
    track('settings_opened', {
      source,
    });
  },
};

/**
 * Engagement Events - Track overall engagement
 */
export const Engagement = {
  /** Track daily active */
  dailyActive: () => {
    const today = new Date().toISOString().split('T')[0];
    const lastActive = localStorage.getItem('afk_last_active_day');
    
    if (lastActive !== today) {
      track('daily_active', {
        previous_active_day: lastActive,
        days_since_last: lastActive 
          ? Math.floor((Date.now() - new Date(lastActive).getTime()) / (1000 * 60 * 60 * 24))
          : null,
      });
      localStorage.setItem('afk_last_active_day', today);
    }
  },
};

// Export all analytics modules
export const Analytics = {
  track,
  Lifecycle,
  Session,
  Break,
  Settings,
  Engagement,
};

export default Analytics;
