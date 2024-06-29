import { SettingsContextProvider } from '@/components/SettingsContext';
import { useContext } from 'react';

export const useSettings = () => useContext(SettingsContextProvider);
