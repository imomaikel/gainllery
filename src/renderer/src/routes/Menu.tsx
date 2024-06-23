import galleryIcon from '../../../../resources/gallery.png?asset';
import LoadingScreen from '@/components/LoadingScreen';
import { Separator } from '@/components/ui/separator';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/hooks/settings';

const Menu = () => {
  const settings = useSettings();
  const hasPrevious = settings.get('fetchedFiles', []).length >= 1;
  const [isLoading, setIsLoading] = useState(false);
  const [showExtra, setShowExtra] = useState(false);
  const navigate = useNavigate();

  const intervalId = useRef<NodeJS.Timeout | null>(null);

  const openFiles = () => window.electron.ipcRenderer.send('openFile');
  const openDirectories = () => window.electron.ipcRenderer.send('openDirectory');
  const openFavorites = () => navigate('/view?type=favorites');

  useEffect(() => {
    window.electron.ipcRenderer.on('filesFetched', () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
      setIsLoading(false);
      navigate('/view');
    });

    window.electron.ipcRenderer.on('fetchingFile', () => {
      setShowExtra(false);
      setIsLoading(true);
      const showExtraMessageId = setInterval(() => setShowExtra(true), 6_000);
      intervalId.current = showExtraMessageId;
    });
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
            <Button onClick={openFavorites}>Open Favorites</Button>
            <Button onClick={openFiles}>Select File</Button>
            <Button onClick={openDirectories}>Select Directory</Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Menu;
