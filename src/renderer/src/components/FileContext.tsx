import { createContext, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';

export const FileContextProvider = createContext<{
  files: string[];
  selectedFile: string;
  isVideo: boolean;

  previousFile: () => void;
  isPrevious: boolean;

  nextFile: () => void;
  isNext: boolean;

  favoriteSwitch: () => void;
  isFavorite: boolean;
}>({
  files: [],
  selectedFile: '',
  isVideo: false,

  previousFile: () => {},
  isPrevious: false,

  nextFile: () => {},
  isNext: false,

  favoriteSwitch: () => {},
  isFavorite: false,
});

type TFileContextProvider = {
  children: React.ReactNode;
};
export const FileContext = ({ children }: TFileContextProvider) => {
  const [files, setFiles] = useState<string[]>(() => window.store.get('recentPaths', []));
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  const isNext = index + 1 < files.length;
  const isPrevious = index - 1 >= 0;
  const selectedFile = files[index];
  const isVideo = selectedFile
    ? ['mp4', 'mov', 'webm', 'm4a', 'm4v'].some((extension) => selectedFile.endsWith(extension))
    : false;

  const nextFile = () => setIndex(index + 1);
  const previousFile = () => setIndex(index - 1);
  const isFavorite = favorites.includes(selectedFile);

  const refetchFavorites = () => {
    setFavorites(() => window.store.get('favorites', []));
  };

  const favoriteSwitch = () => {
    if (isFavorite) {
      window.store.set(
        'favorites',
        favorites.filter((entry) => entry !== selectedFile),
      );
      setFavorites(favorites.filter((entry) => entry !== selectedFile));
    } else {
      window.store.set('favorites', favorites.concat(selectedFile));
      setFavorites(favorites.concat(selectedFile));
    }
  };

  useEffect(() => {
    window.ipc.on('filesFetched', (_, { paths, navigateTo }) => {
      setFiles(paths);
      setIsLoading(false);
      if (navigateTo) navigate(navigateTo);
    });
    window.ipc.on('startFilesFetch', () => {
      setIsLoading(true);
    });
    refetchFavorites();
    return () => window.ipc.removeListener(['filesFetched', 'startFilesFetch']);
  }, []);

  return (
    <FileContextProvider.Provider
      value={{ files, isNext, isPrevious, selectedFile, nextFile, previousFile, isVideo, favoriteSwitch, isFavorite }}
    >
      {children}
      <AnimatePresence>{isLoading && <LoadingScreen key="loading-fade" />}</AnimatePresence>
    </FileContextProvider.Provider>
  );
};
