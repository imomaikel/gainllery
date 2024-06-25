import { createContext, useEffect, useState } from 'react';

export const FileContextProvider = createContext<{
  files: string[];
}>({
  files: [],
});

type TFileContextProvider = {
  children: React.ReactNode;
};
export const FileContext = ({ children }: TFileContextProvider) => {
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    window.ipc.on('filesFetched', (_, { paths }) => {
      setFiles(paths);
      setIsLoading(false);
    });
    window.ipc.on('startFilesFetch', () => setIsLoading(true));
    return () => window.ipc.removeListener(['filesFetched', 'startFilesFetch']);
  }, []);

  return <FileContextProvider.Provider value={{ files }}>{children}</FileContextProvider.Provider>;
};
