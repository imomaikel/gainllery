import { TSettingsSchema, SettingsDefaultSchema } from '@/lib/settings';
import { createContext, useRef } from 'react';

type TSet = <T extends keyof TSettingsSchema>(key: T, value: TSettingsSchema[T]) => void;
type TGet = <T extends keyof TSettingsSchema>(key: T) => TSettingsSchema[T];

export const SettingsContextProvider = createContext<{
  set: TSet;
  get: TGet;
}>({
  get: (key) => SettingsDefaultSchema[key],
  set: () => {},
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

  return <SettingsContextProvider.Provider value={{ get, set }}>{children}</SettingsContextProvider.Provider>;
};
