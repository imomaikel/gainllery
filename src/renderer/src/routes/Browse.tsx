import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import BreadcrumbPath from '@/components/BreadcrumbPath';
import LoadingScreen from '@/components/LoadingScreen';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/hooks/settings';
import { Input } from '@/components/ui/input';
import { FaFolder } from 'react-icons/fa6';
import { IoMdHeart } from 'react-icons/io';
import { formatPath } from '@/lib/utils';
import { toast } from 'sonner';

const Browse = () => {
  const [files, setFiles] = useState<
    {
      type: 'file' | 'directory';
      path: string;
      isFavorite: boolean;
    }[]
  >([]);
  const viewFavorites = () => navigate('/view?type=favorites');
  const [searchParams, setSearchParams] = useSearchParams();
  const intervalId = useRef<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showExtra, setShowExtra] = useState(false);
  const [filter, setFilter] = useState('');
  const settings = useSettings();
  const navigate = useNavigate();

  const showFavorites = searchParams.get('type') === 'favorites';
  const path = searchParams.get('path');

  useEffect(() => {
    const favoriteList = settings.get('favorites', []);
    if (showFavorites) {
      setFiles(favoriteList.map((filePath) => ({ path: filePath, type: 'file', isFavorite: true })));
      return;
    }

    const getPath = searchParams.get('path');
    if (!getPath || getPath.length === 0) {
      navigate('/');
      return;
    }

    const getFiles = window.electron.ipcRenderer.sendSync('browseDirectory', path) as Omit<typeof files, 'isFavorite'>;
    setFiles(getFiles.map((entry) => ({ ...entry, isFavorite: favoriteList.includes(entry.path) })));
    setFilter('');

    window.electron.ipcRenderer.on('filesFetched', () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
      setIsLoading(false);
    });

    window.electron.ipcRenderer.on('fetchingFile', () => {
      setShowExtra(false);
      setIsLoading(true);
      const showExtraMessageId = setInterval(() => setShowExtra(true), 6_000);
      intervalId.current = showExtraMessageId;
    });
  }, [path, showFavorites]);

  const removeFromFavorites = (filePath: string) => {
    if (showFavorites) {
      setFiles((prev) => prev.filter((entryUrl) => entryUrl.path !== filePath));
    } else {
      setFiles((prev) =>
        prev.map((entry) => {
          if (entry.path !== filePath) return entry;
          return { ...entry, isFavorite: false };
        }),
      );
    }

    settings.set(
      'favorites',
      settings.get('favorites', []).filter((entryUrl) => entryUrl !== filePath),
    );
    toast.success('Removed from favorites!');
  };

  const addToFavorites = (filePath: string) => {
    settings.set('favorites', settings.get('favorites', []).concat(filePath));
    setFiles((files) =>
      files.map((entry) => {
        if (entry.path !== filePath) return entry;
        return { ...entry, isFavorite: true };
      }),
    );
    toast.success('Added to favorites!');
  };

  const setNewPath = (newPath: string) => {
    setSearchParams(() => {
      searchParams.set('path', newPath);
      return searchParams;
    });
  };

  const filteredFiles = useMemo(() => {
    if (filter.length === 0) return files;
    const replaceSpecialChars = (input: string) => {
      return input.replace(/ /g, '').toLowerCase();
    };

    const fixedFilter = replaceSpecialChars(filter);

    const filtered = files.filter((entry) => {
      if (replaceSpecialChars(entry.path).includes(fixedFilter)) return true;
      return false;
    });

    return filtered;
  }, [files, filter]);

  if (!path && !showFavorites) return null;

  return (
    <>
      {isLoading && (
        <div className="fixed z-[100] flex h-screen w-screen items-center justify-center bg-background">
          <LoadingScreen showExtraText={showExtra} />
        </div>
      )}
      <div className="relative flex h-screen w-screen pt-10">
        {path && (
          <BreadcrumbPath
            props={{
              allowRename: false,
              currentPath: path,
              selectDirectory: setNewPath,
            }}
          />
        )}
        <div className="relative flex h-full w-full flex-col">
          <div className="customGrid select-none overflow-y-auto p-2">
            {filteredFiles.length >= 1 ? (
              filteredFiles.map((file, idx) => {
                const url = `atom://${file.path}`;

                if (file.type === 'directory') {
                  return (
                    <div
                      key={idx}
                      className="group flex h-fit flex-col items-center space-y-1 rounded-md bg-secondary/25 py-2"
                      role="button"
                      aria-label="open"
                      onClick={() => setNewPath(`${path}/${file.path}`)}
                    >
                      <FaFolder className="h-16 w-16" />
                      <div className="max-w-[90%] truncate">
                        <span className="text-xs text-muted-foreground transition-colors group-hover:text-primary">
                          {file.path}
                        </span>
                      </div>
                    </div>
                  );
                } else {
                  const isVideo =
                    url.endsWith('mp4') || url.endsWith('mp3') || url.endsWith('m4v') || url.endsWith('mov');
                  const isImage = !isVideo;
                  return (
                    <div
                      key={idx}
                      className="group relative flex flex-col items-center space-y-1 rounded-md bg-secondary/25 py-2"
                      role="button"
                      aria-label="open"
                    >
                      {isImage ? (
                        <img
                          src={url}
                          width={32}
                          height={32}
                          className="h-32 w-32 rounded-md object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <video
                          src={url}
                          width={32}
                          height={32}
                          className="h-32 w-32 rounded-md object-cover transition-transform group-hover:scale-105"
                        />
                      )}
                      <div className="line-clamp-1">
                        <span className="ma-w-[90%] text-xs text-muted-foreground transition-colors group-hover:text-primary">
                          {formatPath(url, true)}
                        </span>
                      </div>
                      <div
                        className="bg- absolute inset-0 h-full w-full"
                        onClick={() => window.electron.ipcRenderer.send('openSelectedFile', file.path)}
                      />
                      {file.type === 'file' &&
                        (file.isFavorite ? (
                          <div
                            onDoubleClick={() => removeFromFavorites(file.path)}
                            className="group/heart absolute -right-4 -top-2 rotate-12 rounded-full"
                          >
                            <IoMdHeart className="h-8 w-8 text-red-500 transition-colors group-hover/heart:text-destructive" />
                          </div>
                        ) : (
                          <div
                            onClick={() => addToFavorites(file.path)}
                            className="group/heart absolute -right-4 -top-2 rotate-12 rounded-full"
                          >
                            <IoMdHeart className="h-8 w-8 transition-colors group-hover/heart:text-destructive" />
                          </div>
                        ))}
                    </div>
                  );
                }
              })
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl font-bold">No media files here.</p>
                {filter.length >= 1 && <p className="text-muted-foreground">Check your filters</p>}
              </div>
            )}
          </div>
          <div className="absolute bottom-0 flex w-full items-center justify-center gap-4 bg-background/50 p-2 backdrop-blur-sm">
            <Input
              type="text"
              spellCheck={false}
              placeholder="Search in this directory..."
              className="max-w-[200px]"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            />
            <Button onClick={() => navigate('/')}>Home</Button>
            <Button
              onClick={() => {
                if (showFavorites) {
                  viewFavorites();
                } else {
                  window.electron.ipcRenderer.send('openSelectedDirectory', path);
                }
              }}
            >
              Open in Viewer
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Browse;
