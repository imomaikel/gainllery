import { createContext, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';

export const FileContextProvider = createContext<{
  files: string[];
  selectedFile: string;

  previousFile: () => void;
  isPrevious: boolean;

  nextFile: () => void;
  isNext: boolean;
}>({
  files: [],
  selectedFile: '',

  previousFile: () => {},
  isPrevious: false,

  nextFile: () => {},
  isNext: false,
});

type TFileContextProvider = {
  children: React.ReactNode;
};
export const FileContext = ({ children }: TFileContextProvider) => {
  const [files, setFiles] = useState<string[]>(() => window.store.get('recentPaths', []));
  const [isLoading, setIsLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  const isNext = index + 1 < files.length;
  const isPrevious = index - 1 >= 0;
  const selectedFile = files[index];

  const nextFile = () => setIndex(index + 1);
  const previousFile = () => setIndex(index - 1);

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
    <FileContextProvider.Provider value={{ files, isNext, isPrevious, selectedFile, nextFile, previousFile }}>
      {children}
      <AnimatePresence>{isLoading && <LoadingScreen key="loading-fade" />}</AnimatePresence>
    </FileContextProvider.Provider>
  );
};
