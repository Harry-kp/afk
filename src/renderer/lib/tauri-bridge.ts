/**
 * Tauri Bridge - Compatibility layer for Electron-style API
 * Provides window.electron interface for existing code
 */

// Local cache for settings (synchronous access)
const localCache: Record<string, unknown> = {
  // Default values
  session_duration: 1500,
  break_duration: 30,
  pre_break_reminder_enabled: true,
  pre_break_reminder_at: 60,
  reset_timer_enabled: true,
  toolbar_timer_style: 'remaining',
  long_break_enabled: true,
  long_break_duration: 120,
  long_break_after: 2,
  launch_at_login: true,
  start_timer: false,
  session: {},
};

// Session state response type
interface SessionState {
  is_active: boolean;
  is_paused: boolean;
  end_time: string | null;
  remaining_secs: number;
  short_break_count: number;
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
 * Get the Tauri invoke function
 */
function getInvoke(): ((cmd: string, args?: Record<string, unknown>) => Promise<unknown>) | null {
  if (typeof window !== 'undefined' && window.__TAURI__?.core?.invoke) {
    return window.__TAURI__.core.invoke;
  }
  return null;
}

/**
 * Safe invoke wrapper that handles cases where Tauri isn't ready
 */
async function safeInvoke<T>(cmd: string, args?: Record<string, unknown>): Promise<T | null> {
  const invoke = getInvoke();
  if (!invoke) {
    console.debug(`Tauri not available for command: ${cmd}`);
    return null;
  }
  
  try {
    return await invoke(cmd, args) as T;
  } catch (error) {
    console.warn(`Tauri invoke failed for ${cmd}:`, error);
    return null;
  }
}

/**
 * Session control interface
 */
const session = {
  start: async () => {
    await safeInvoke('start_session', {});
  },
  pause: async () => {
    await safeInvoke('pause_session');
  },
  resume: async () => {
    // Use dedicated resume command (no chime)
    await safeInvoke('resume_session');
  },
  end: async () => {
    await safeInvoke('end_session');
  },
  skipBreak: async () => {
    // Skip handles closing windows internally
    await safeInvoke('skip_break');
  },
  snooze: async () => {
    // Snooze for 5 minutes
    await safeInvoke('snooze_break');
  },
  takeBreakNow: async () => {
    await safeInvoke('take_break_now');
  },
  endBreak: async () => {
    // End break and start new session
    await safeInvoke('end_break');
  },
  getState: async (): Promise<SessionState | null> => {
    return await safeInvoke<SessionState>('get_session_state');
  },
};

/**
 * Store interface - provides both sync (cached) and async access
 */
const store = {
  /**
   * Get a value - returns cached value synchronously
   */
  get: <T = unknown>(key: string): T | null => {
    return (localCache[key] as T) ?? null;
  },

  /**
   * Get a value asynchronously from backend
   */
  getAsync: async <T = unknown>(key: string): Promise<T | null> => {
    const result = await safeInvoke<T>('get_setting', { key });
    if (result !== null) {
      localCache[key] = result;
    }
    return result ?? (localCache[key] as T) ?? null;
  },

  /**
   * Set a value - updates cache and persists to backend
   */
  set: (key: string, value: unknown): void => {
    localCache[key] = value;
    // Fire and forget - persist to backend
    safeInvoke('set_setting', { key, value }).catch(() => {});
  },

  /**
   * Get the current cache (for debugging)
   */
  getCache: () => ({ ...localCache }),
};

/**
 * Autostart interface
 */
const autostart = {
  isEnabled: async (): Promise<boolean> => {
    const result = await safeInvoke<boolean>('is_autostart_enabled');
    return result ?? false;
  },
  enable: async (): Promise<void> => {
    await safeInvoke('enable_autostart');
  },
  disable: async (): Promise<void> => {
    await safeInvoke('disable_autostart');
  },
};

/**
 * App control interface
 */
const app = {
  openDashboard: async () => {
    await safeInvoke('open_dashboard');
  },
  openSettings: async () => {
    await safeInvoke('open_settings');
  },
  quit: async () => {
    await safeInvoke('quit_app');
  },
  relaunch: async () => {
    await safeInvoke('relaunch_app');
  },
  getVersion: async (): Promise<string> => {
    const result = await safeInvoke<string>('get_app_version');
    return result ?? '1.0.0';
  },
  resetSettings: async (): Promise<void> => {
    await safeInvoke('reset_settings');
  },
  getConfigPath: async (): Promise<string | null> => {
    return await safeInvoke<string>('get_config_path');
  },
};

/**
 * IPC renderer compatibility (for legacy code)
 */
const ipcRenderer = {
  sendMessage: async (channel: string, ..._args: unknown[]): Promise<void> => {
    const command = channel.replace(/-/g, '_');
    
    switch (command) {
      case 'start_session':
        await session.start();
        break;
      case 'pause_session':
        await session.pause();
        break;
      case 'resume_session':
        await session.resume();
        break;
      case 'end_session':
        await session.end();
        break;
      case 'skip_break':
        await session.skipBreak();
        break;
      case 'snooze_break':
        await session.snooze();
        break;
      case 'take_break_now':
        await session.takeBreakNow();
        break;
      case 'end_break':
        await session.endBreak();
        break;
      default:
        console.warn('Unknown IPC command:', command);
    }
  },
  on: (_channel: string, _callback: (...args: unknown[]) => void): (() => void) => {
    return () => {};
  },
  once: (_channel: string, _callback: (...args: unknown[]) => void): void => {},
};

/**
 * Event listener compatibility
 */
const on = (_channel: string, _callback: (...args: unknown[]) => void): void => {};
const removeAllListeners = (_channel: string): void => {};

/**
 * Combined electron-compatible interface
 */
export const electron = {
  store,
  session,
  autostart,
  app,
  ipcRenderer,
  on,
  removeAllListeners,
};

/**
 * Initialize cache from backend (called when Tauri is ready)
 */
async function initCache(): Promise<void> {
  // Wait a bit for Tauri to initialize
  await new Promise(resolve => setTimeout(resolve, 100));
  
  if (!getInvoke()) {
    console.debug('Tauri not available, using default cache values');
    return;
  }

  const keys = Object.keys(localCache);
  
  for (const key of keys) {
    try {
      const value = await safeInvoke('get_setting', { key });
      if (value !== null) {
        localCache[key] = value;
      }
    } catch {
      // Keep default value
    }
  }
}

// Set up global window.electron for compatibility
if (typeof window !== 'undefined') {
  window.electron = electron;
  
  // Initialize cache when DOM is ready
  if (document.readyState === 'complete') {
    initCache().catch(console.debug);
  } else {
    window.addEventListener('DOMContentLoaded', () => {
      initCache().catch(console.debug);
    });
  }
}

export default electron;
