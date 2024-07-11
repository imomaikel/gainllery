import { FaPlus, FaTrash, FaHeart } from 'react-icons/fa6';
import { useFileContext } from '@/hooks/useFileContext';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cleanString } from '@/lib/utils';
import { toast } from 'sonner';

const FavoriteDirectories = () => {
  const [favoriteDirectories, setFavoriteDirectories] = useState<{ label: string; path: string }[]>([]);
  const { selectedFile, excludeSelectedFile } = useFileContext();
  const [directoryFilter, setDirectoryFilter] = useState('');

  useEffect(() => {
    setFavoriteDirectories(window.store.get('favoriteDirectories', []));
  }, []);

  const addDirectory = () => {
    const path = window.ipc.sendSync('getDirectoryPath');
    if (!path) return;
    setFavoriteDirectories((prev) => prev.concat(path));
  };
  const removeDirectory = (dirPath: string) => {
    const updatedDirectories = window.store.get('favoriteDirectories', []).filter((entry) => entry.path !== dirPath);
    window.store.set('favoriteDirectories', updatedDirectories);
    setFavoriteDirectories(updatedDirectories);
  };

  const moveToDirectory = (dirPath: string, asFavorite?: boolean) => {
    const isSuccess = window.ipc.sendSync('moveToDirectory', { dirPath, filePath: selectedFile, asFavorite });
    if (!isSuccess) {
      toast.error('Something went wrong!');
    } else {
      excludeSelectedFile();
    }
  };

  const directories = useMemo(() => {
    if (directoryFilter.length === 0) return favoriteDirectories;
    const toCheck = cleanString(directoryFilter);
    const filteredDirectories = favoriteDirectories.filter((dir) => cleanString(dir.label).includes(toCheck));
    return filteredDirectories;
  }, [favoriteDirectories, directoryFilter]);

  return (
    <div>
      <div className="flex flex-col">
        <div className="flex items-center justify-around">
          <Label className="whitespace-nowrap">Favorite Directories</Label>
          <Button size="smallIcon" onClick={addDirectory}>
            <FaPlus />
          </Button>
        </div>
        {favoriteDirectories.length > 5 ? (
          <div className="my-1">
            <Input
              placeholder="Search for a directory..."
              className="h-fit text-xs"
              value={directoryFilter}
              onChange={(event) => setDirectoryFilter(event.target.value)}
            />
          </div>
        ) : (
          <></>
        )}
        {directories.length >= 1 ? (
          <div className="mt-1 space-y-1">
            {directories.map((dir) => (
              <Button
                key={dir.path}
                size="sm"
                variant="outline"
                className="w-full rounded-br-none border-l-0 border-r-0 px-0"
                asChild
              >
                <div className="flex w-full justify-between">
                  <Button
                    onClick={() => moveToDirectory(dir.path, true)}
                    size="sm"
                    variant="outline"
                    className="rounded-b-none rounded-tr-none px-2 hover:bg-primary"
                  >
                    <FaHeart />
                  </Button>
                  <Button
                    className="line-clamp-1 flex flex-1 truncate rounded-none"
                    variant="ghost"
                    size="sm"
                    onClick={() => moveToDirectory(dir.path, false)}
                  >
                    {dir.label}
                  </Button>
                  <Button
                    size="sm"
                    onDoubleClick={() => removeDirectory(dir.path)}
                    variant="outline"
                    className="ml-[1px] rounded-b-none rounded-tl-none px-2 hover:bg-destructive"
                  >
                    <FaTrash />
                  </Button>
                </div>
              </Button>
            ))}
          </div>
        ) : (
          <span className="mt-1 text-center text-xs text-muted-foreground">No Directories</span>
        )}
      </div>
    </div>
  );
};

export default FavoriteDirectories;
