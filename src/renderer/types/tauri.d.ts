/**
 * Type definitions for Tauri IPC bridge
 */

export interface SessionState {
  isActive: boolean;
  isPaused: boolean;
  isOnBreak: boolean;
  startTime: string | null;
  endTime: string | null;
  breakEndTime: string | null;
  pausedAt: string | null;
  totalPausedMs: number;
  completedSessions: number;
  currentBreakType: 'short' | 'long' | null;
  skippedSinceLastLong: number;
}

export interface Settings {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
  preBreakNotificationDuration: number;
  launchAtLogin: boolean;
  showTimerInTray: boolean;
  playSound: boolean;
  allowSkip: boolean;
  idleResetEnabled: boolean;
  idleResetMinutes: number;
}

export interface TrayState {
  timerText: string;
  isActive: boolean;
  isPaused: boolean;
  isOnBreak: boolean;
}

export interface ElectronBridge {
  store: {
    get: <T>(key: string) => Promise<T | undefined>;
    set: <T>(key: string, value: T) => Promise<void>;
  };
  session: {
    getState: () => Promise<SessionState>;
    start: () => Promise<void>;
    pause: () => Promise<void>;
    resume: () => Promise<void>;
    end: () => Promise<void>;
    skipBreak: () => Promise<void>;
    takeBreakNow: () => Promise<void>;
    endBreak: () => Promise<void>;
  };
  app: {
    openDashboard: () => Promise<void>;
    openSettings: () => Promise<void>;
    quit: () => Promise<void>;
    relaunch: () => Promise<void>;
    getVersion: () => Promise<string>;
  };
  autostart: {
    isEnabled: () => Promise<boolean>;
    enable: () => Promise<void>;
    disable: () => Promise<void>;
  };
  on: (channel: string, callback: (...args: unknown[]) => void) => void;
  removeAllListeners: (channel: string) => void;
}

declare global {
  interface Window {
    electron: ElectronBridge;
  }
}

export {};

