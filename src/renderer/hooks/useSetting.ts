import { useState, useEffect, useCallback } from 'react';

/**
 * Default values for all settings
 * These match the Rust backend defaults
 */
export const SETTING_DEFAULTS: Record<string, unknown> = {
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
  // Chime settings (OFF by default)
  chime_enabled: false,
  chime_on_session_start: true,
  chime_on_break_start: true,
  chime_on_break_end: true,
  chime_on_reminder: false,
};

/**
 * Hook to manage a single setting with proper async loading from backend
 * 
 * @param key - The setting key
 * @param defaultValue - Optional default value (falls back to SETTING_DEFAULTS)
 * @returns [value, setValue, isLoading]
 */
export function useSetting<T>(
  key: string,
  defaultValue?: T
): [T, (value: T) => void, boolean] {
  const fallback = (defaultValue ?? SETTING_DEFAULTS[key]) as T;
  const [value, setValue] = useState<T>(fallback);
  const [isLoading, setIsLoading] = useState(true);

  // Load value from backend on mount
  useEffect(() => {
    let mounted = true;

    const loadValue = async () => {
      try {
        const storedValue = await window.electron.store.getAsync<T>(key);
        if (mounted) {
          setValue(storedValue ?? fallback);
          setIsLoading(false);
        }
      } catch (error) {
        console.warn(`Failed to load setting ${key}:`, error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadValue();

    return () => {
      mounted = false;
    };
  }, [key, fallback]);

  // Update both local state and backend
  const updateValue = useCallback(
    (newValue: T) => {
      setValue(newValue);
      window.electron.store.set(key, newValue);
    },
    [key]
  );

  return [value, updateValue, isLoading];
}

/**
 * Hook to load multiple settings at once
 * More efficient than multiple useSetting calls
 * 
 * @param keys - Array of setting keys to load
 * @returns { values, setValue, isLoading }
 */
export function useSettings(keys: string[]): {
  values: Record<string, unknown>;
  setValue: (key: string, value: unknown) => void;
  isLoading: boolean;
} {
  const [values, setValues] = useState<Record<string, unknown>>(() => {
    const initial: Record<string, unknown> = {};
    for (const key of keys) {
      initial[key] = SETTING_DEFAULTS[key];
    }
    return initial;
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load all values from backend on mount
  useEffect(() => {
    let mounted = true;

    const loadValues = async () => {
      const loaded: Record<string, unknown> = {};
      
      for (const key of keys) {
        try {
          const value = await window.electron.store.getAsync(key);
          loaded[key] = value ?? SETTING_DEFAULTS[key];
        } catch {
          loaded[key] = SETTING_DEFAULTS[key];
        }
      }
      
      if (mounted) {
        setValues(loaded);
        setIsLoading(false);
      }
    };

    loadValues();

    return () => {
      mounted = false;
    };
  }, [keys.join(',')]);

  // Update a single value
  const setValue = useCallback((key: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    window.electron.store.set(key, value);
  }, []);

  return { values, setValue, isLoading };
}

export default useSetting;

