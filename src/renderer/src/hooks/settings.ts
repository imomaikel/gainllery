import { SETTINGS } from '@/lib/types';

export const useSettings = () => {
  const get = <T extends keyof SETTINGS>(
    key: T,
    overwriteIfEmpty?: SETTINGS[T]['valueType'],
  ): SETTINGS[T]['valueType'] | null => {
    const value = window.store.get(key) as ReturnType<typeof get>;
    if (!value) {
      if (overwriteIfEmpty) {
        window.store.set(key, overwriteIfEmpty);
        return overwriteIfEmpty;
      }
      return null;
    }
    return value;
  };
  const set = <T extends keyof SETTINGS>(key: T, value: SETTINGS[T]['valueType']): boolean => {
    try {
      window.store.set(key, value);
      return true;
    } catch {
      return false;
    }
  };

  return {
    get,
    set,
  };
};
