import { createContext, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';
import { toast } from 'sonner';

export const FileContextProvider = createContext<{
  files: string[];
  selectedFile: string;
  isVideo: boolean;

  previousFile: () => void;
  isPrevious: boolean;
  index: number;

  nextFile: () => void;
  isNext: boolean;

  excludeSelectedFile: () => void;
  deleteSelectedFile: () => boolean;

  favoriteSwitch: () => void;
  isFavorite: boolean;
}>({
  files: [],
  selectedFile: '',
  isVideo: false,

  previousFile: () => {},
  isPrevious: false,
  index: 0,

  excludeSelectedFile: () => {},
  deleteSelectedFile: () => true,

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
    setFavorites(() => window.store.get('favoriteFiles', []));
  };

  const excludeSelectedFile = () => {
    const updateFiles = window.store.get('recentPaths', []).filter((entry) => entry !== selectedFile);
    window.store.set('recentPaths', updateFiles);
    setFiles(updateFiles);
  };

  const deleteSelectedFile = () => {
    const isSuccess = window.ipc.sendSync('deleteFile', { filePath: selectedFile, trashItem: true });

    if (isSuccess) {
      excludeSelectedFile();
    } else {
      toast.error('Something went wrong!');
    }

    return isSuccess;
  };

  const favoriteSwitch = () => {
    if (isFavorite) {
      window.store.set(
        'favoriteFiles',
        favorites.filter((entry) => entry !== selectedFile),
      );
      setFavorites(favorites.filter((entry) => entry !== selectedFile));
    } else {
      window.store.set('favoriteFiles', favorites.concat(selectedFile));
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
      value={{
        files,
        isNext,
        isPrevious,
        selectedFile,
        nextFile,
        previousFile,
        isVideo,
        favoriteSwitch,
        isFavorite,
        excludeSelectedFile,
        deleteSelectedFile,
        index,
      }}
    >
      {children}
      <AnimatePresence>{isLoading && <LoadingScreen key="loading-fade" />}</AnimatePresence>
    </FileContextProvider.Provider>
  );
};
