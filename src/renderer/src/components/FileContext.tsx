import { createContext, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';

export const FileContextProvider = createContext<{
  files: string[];
}>({
  files: [],
});

type TFileContextProvider = {
  children: React.ReactNode;
};
export const FileContext = ({ children }: TFileContextProvider) => {
  const [files, setFiles] = useState<string[]>(window.store.get('recentPaths', []));
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.ipc.on('filesFetched', (_, { paths, navigateTo }) => {
      setFiles(paths);
      setIsLoading(false);
      if (navigateTo) navigate(navigateTo);
    });
    window.ipc.on('startFilesFetch', () => {
      setIsLoading(true);
    });
    return () => window.ipc.removeListener(['filesFetched', 'startFilesFetch']);
  }, []);

  return (
    <FileContextProvider.Provider value={{ files }}>
      {children}
      <AnimatePresence>{isLoading && <LoadingScreen key="loading-fade" />}</AnimatePresence>
    </FileContextProvider.Provider>
  );
};
