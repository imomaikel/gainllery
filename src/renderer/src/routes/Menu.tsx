import galleryIcon from '../../../../resources/gallery.png?asset';
import LoadingScreen from '@/components/LoadingScreen';
import { Separator } from '@/components/ui/separator';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/hooks/settings';
import { toast } from 'sonner';

const Menu = () => {
  const settings = useSettings();
  const hasPrevious = settings.get('fetchedFiles', []).length >= 1;
  const [isLoading, setIsLoading] = useState(false);
  const [showExtra, setShowExtra] = useState(false);
  const navigate = useNavigate();

  const intervalId = useRef<NodeJS.Timeout | null>(null);

  const openFiles = () => window.electron.ipcRenderer.send('openFile');
  const openDirectories = () => window.electron.ipcRenderer.send('openDirectory');
  const browseFavorites = () => navigate('/browse?type=favorites');
  const selectDirectory = () => window.electron.ipcRenderer.send('selectDirectory');

  useEffect(() => {
    window.electron.ipcRenderer.on('filesFetched', (_, ...args) => {
      setIsLoading(false);
      if (args[0] >= 1) {
        navigate('/view');
      } else {
        toast.error('The directory is empty!');
      }
    });

    window.electron.ipcRenderer.on('fetchingFile', () => {
      setShowExtra(false);
      setIsLoading(true);
      const showExtraMessageId = setInterval(() => setShowExtra(true), 6_000);
      intervalId.current = showExtraMessageId;
    });

    window.electron.ipcRenderer.on('directoryReadyToBrowse', (_, ...args) => {
      navigate(`/browse?path=${args[0]}`);
    });

    return () => {
      if (intervalId.current) clearInterval(intervalId.current);
      window.electron.ipcRenderer.removeAllListeners('filesFetched');
      window.electron.ipcRenderer.removeAllListeners('fetchingFile');
      window.electron.ipcRenderer.removeAllListeners('directoryReadyToBrowse');
    };
  }, []);

  return (
    <div className="mx-auto flex h-full max-w-screen-xl flex-col items-center justify-center space-y-2">
      <h1 className="text-6xl font-extrabold tracking-wide">Gainllery</h1>
      <div className="pointer-events-none h-64 w-64 select-none">
        <img
          src={galleryIcon}
          className="h-full w-full object-contain object-center opacity-50 invert"
          alt="image placeholder"
        />
      </div>
      <p className="mt-4 text-xs text-muted-foreground">Drag and drop an image or use the buttons below</p>
      <Separator className="w-3/5" />
      <div className="flex w-1/2 flex-col space-y-2">
        {isLoading ? (
          <LoadingScreen showExtraText={showExtra} />
        ) : (
          <>
            {hasPrevious && (
              <Button asChild>
                <Link to="/view">Open Previous</Link>
              </Button>
            )}
            <Button onClick={openDirectories}>Open Directory</Button>
            <Button onClick={openFiles}>Open File</Button>
            <Button onClick={browseFavorites}>Browse Favorites</Button>
            <Button onClick={selectDirectory}>Browse Directory</Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Menu;
