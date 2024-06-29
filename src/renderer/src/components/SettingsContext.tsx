import { createContext, useState } from 'react';

export const SettingsContextProvider = createContext<{
  moveToTrash: boolean;
}>({
  moveToTrash: true,
});

export const SettingsContext = ({ children }: { children: React.ReactNode }) => {
  const [moveToTrash, setMoveToTrash] = useState(true);

  return <SettingsContextProvider.Provider value={{ moveToTrash }}>{children}</SettingsContextProvider.Provider>;
};
