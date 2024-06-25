import { FileContextProvider } from '@/components/FileContext';
import { useContext } from 'react';

export const useFileContext = () => useContext(FileContextProvider);
