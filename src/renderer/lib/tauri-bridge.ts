/**
 * Tauri Bridge - exposes window.electron for the renderer
 */

export interface SessionState {
  is_active: boolean;
  is_paused: boolean;
  end_time: string | null;
  remaining_secs: number;
  short_break_count: number;
}

// Statistics types
export interface DailyStats {
  date: string;
  total_focus_secs: number;
  breaks_taken: number;
  breaks_skipped: number;
}

export interface WeeklyStats {
  total_focus_secs: number;
  breaks_taken: number;
  avg_daily_focus_secs: number;
}

export interface StreakInfo {
  current: number;
  longest: number;
  last_active_date: string | null;
}

export interface AllTimeStats {
  total_focus_secs: number;
  total_breaks: number;
}

export interface StatsResponse {
  today: DailyStats;
  week: WeeklyStats;
  streak: StreakInfo;
  all_time: AllTimeStats;
  weekly_trend: DailyStats[];
}

// Type for Tauri's global object
declare global {
  interface Window {
    __TAURI__?: {
      core: {
        invoke: <T>(cmd: string, args?: Record<string, unknown>) => Promise<T>;
      };
    };
    electron: typeof electron;
  }
}

/**
 * Safe invoke wrapper that handles cases where Tauri isn't ready
 */
async function safeInvoke<T>(cmd: string, args?: Record<string, unknown>): Promise<T | null> {
  const invoke = window.__TAURI__?.core?.invoke;
  if (!invoke) {
    console.debug(`Tauri not available for command: ${cmd}`);
    return null;
  }

  try {
    return await invoke<T>(cmd, args);
  } catch (error) {
    console.warn(`Tauri invoke failed for ${cmd}:`, error);
    return null;
  }
}

const session = {
  start: () => safeInvoke('start_session'),
  pause: () => safeInvoke('pause_session'),
  resume: () => safeInvoke('resume_session'),
  end: () => safeInvoke('end_session'),
  skipBreak: () => safeInvoke('skip_break'),
  snooze: () => safeInvoke('snooze_break'),
  takeBreakNow: () => safeInvoke('take_break_now'),
  getState: () => safeInvoke<SessionState>('get_session_state'),
};

const store = {
  getAsync: <T = unknown>(key: string): Promise<T | null> => safeInvoke<T>('get_setting', { key }),

  set: (key: string, value: unknown): void => {
    // Fire and forget - persist to backend
    safeInvoke('set_setting', { key, value }).catch(() => {});
  },
};

const app = {
  resetSettings: () => safeInvoke('reset_settings'),
  getConfigPath: () => safeInvoke<string>('get_config_path'),
  openUrl: async (url: string): Promise<void> => {
    try {
      const { openUrl: tauriOpenUrl } = await import('@tauri-apps/plugin-opener');
      await tauriOpenUrl(url);
    } catch (e) {
      console.error('Failed to open URL with Tauri opener:', e);
      window.open(url, '_blank');
    }
  },
};

const stats = {
  getStats: () => safeInvoke<StatsResponse>('get_stats'),
  clearStats: () => safeInvoke('clear_stats'),
};

export const electron = { store, session, app, stats };

if (typeof window !== 'undefined') {
  window.electron = electron;
}

export default electron;
