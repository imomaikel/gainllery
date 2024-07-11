import { TSettingsSchema, SettingsDefaultSchema } from '@/lib/settings';
import { createContext, useState } from 'react';

type TSet = <T extends keyof TSettingsSchema>(key: T, value: TSettingsSchema[T]) => void;
type TGet = <T extends keyof TSettingsSchema>(key: T) => TSettingsSchema[T];
type TReduceMotion = (delayInSeconds?: number) => number;

export const SettingsContextProvider = createContext<{
  set: TSet;
  get: TGet;
  reduceMotion: TReduceMotion;
  all: TSettingsSchema;
}>({
  all: SettingsDefaultSchema,
  get: (key) => SettingsDefaultSchema[key],
  set: () => {},
  reduceMotion: () => 0,
});

export const SettingsContext = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<TSettingsSchema>({
    ...SettingsDefaultSchema,
    ...window.store.get('settings', SettingsDefaultSchema),
  });

  const set: TSet = (key, value) => {
    const updatedSettings = { ...settings, [key]: value };
    setSettings(updatedSettings);
    window.store.set('settings', updatedSettings);
  };

  const get: TGet = (key) => {
    return settings[key];
  };

  const reduceMotion: TReduceMotion = (delayInSeconds) => {
    return settings['noAnimations'] ? 0 : delayInSeconds || 0.5;
  };

  return (
    <SettingsContextProvider.Provider value={{ get, set, reduceMotion, all: settings }}>
      {children}
    </SettingsContextProvider.Provider>
  );
};
