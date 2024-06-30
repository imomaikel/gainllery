import { TSettingsSchema, SettingsDefaultSchema } from '@/lib/settings';
import { createContext, useRef } from 'react';

type TSet = <T extends keyof TSettingsSchema>(key: T, value: TSettingsSchema[T]) => void;
type TGet = <T extends keyof TSettingsSchema>(key: T) => TSettingsSchema[T];
type TReduceMotion = (delayInSeconds?: number) => number;

export const SettingsContextProvider = createContext<{
  set: TSet;
  get: TGet;
  reduceMotion: TReduceMotion;
}>({
  get: (key) => SettingsDefaultSchema[key],
  set: () => {},
  reduceMotion: () => 0,
});

export const SettingsContext = ({ children }: { children: React.ReactNode }) => {
  const settings = useRef<TSettingsSchema>({
    ...SettingsDefaultSchema,
    ...window.store.get('settings', SettingsDefaultSchema),
  });

  const set: TSet = (key, value) => {
    settings.current[key] = value;
    window.store.set('settings', settings.current);
  };

  const get: TGet = (key) => {
    return settings.current[key];
  };

  const reduceMotion: TReduceMotion = (delayInSeconds) => {
    return settings.current['noAnimations'] ? 0 : delayInSeconds || 0.5;
  };

  return (
    <SettingsContextProvider.Provider value={{ get, set, reduceMotion }}>{children}</SettingsContextProvider.Provider>
  );
};
