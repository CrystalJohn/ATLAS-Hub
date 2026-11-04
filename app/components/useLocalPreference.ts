'use client';

import { useSyncExternalStore } from 'react';

const memoryPreferences = new Map<string, string>();
const preferenceEvent = 'atlas:local-preference';

export function useLocalPreference<T extends string>(
  key: string,
  fallback: T,
  isAllowed: (value: string) => value is T,
  readLegacy?: () => T | null,
): readonly [T, (value: T) => void] {
  const getSnapshot = () => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored && isAllowed(stored)) {
        memoryPreferences.set(key, stored);
        return stored;
      }
    } catch {
      // Use the in-memory copy below when browser storage is unavailable.
    }
    const remembered = memoryPreferences.get(key);
    if (remembered && isAllowed(remembered)) return remembered;
    const legacy = readLegacy?.();
    if (legacy && isAllowed(legacy)) {
      memoryPreferences.set(key, legacy);
      return legacy;
    }
    return fallback;
  };

  const subscribe = (listener: () => void) => {
    window.addEventListener('storage', listener);
    window.addEventListener(preferenceEvent, listener);
    return () => {
      window.removeEventListener('storage', listener);
      window.removeEventListener(preferenceEvent, listener);
    };
  };

  const value = useSyncExternalStore(subscribe, getSnapshot, () => fallback);
  const setValue = (next: T) => {
    memoryPreferences.set(key, next);
    try {
      window.localStorage.setItem(key, next);
    } catch {
      // Keep the preference for this tab if browser storage is unavailable.
    }
    window.dispatchEvent(new Event(preferenceEvent));
  };

  return [value, setValue] as const;
}
