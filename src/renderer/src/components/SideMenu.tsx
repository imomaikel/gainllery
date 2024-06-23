import { FaHeart, FaPlus, FaTrash } from 'react-icons/fa6';
import SideMenuButton from './SideMenuButton';
import { Separator } from './ui/separator';
import { useMemo, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

type TSideMenu = {
  onFavoriteSwitch: () => void;
  onClose: () => void;
  isFavorite: boolean;
  favoriteDirectories: { name: string; path: string }[];
  moveToDirectory: (path: string, addToFavorites?: boolean) => void;
  addFavoriteDirectory: () => void;
  removeFavoriteDirectory: (directoryPath: string) => void;
};
const SideMenu = ({
  onClose,
  onFavoriteSwitch,
  isFavorite,
  favoriteDirectories,
  moveToDirectory,
  addFavoriteDirectory,
  removeFavoriteDirectory,
}: TSideMenu) => {
  const [directoryFilter, setDirectoryFilter] = useState('');

  const filteredDirectories = useMemo(() => {
    if (directoryFilter.length === 0) return favoriteDirectories;

    const replaceSpecialChars = (input: string) => {
      return input.replace(/ /g, '').toLowerCase();
    };

    const fixedFilter = replaceSpecialChars(directoryFilter);

    const filtered = favoriteDirectories.filter(({ name }) => {
      if (replaceSpecialChars(name).includes(fixedFilter)) return true;
      return false;
    });

    return filtered;
  }, [directoryFilter, favoriteDirectories]);

  return (
    <div className="!mt-0 h-screen">
      <div className="relative flex h-[calc(100vh-40px)] w-full flex-col">
        {/* Menu Icon */}
        <SideMenuButton onClick={onClose} />

        {/* Menu content */}
        <div className="overflow-y-auto">
          <div className="space-y-3 p-4">
            <Separator />
            {/* Add to favorites */}
            <div className="flex items-center space-x-1">
              <span className="text-xs font-semibold">{isFavorite ? 'Remove from favorites' : 'Add to favorites'}</span>
              <Button size="smallIcon" onClick={onFavoriteSwitch} className="shrink-0">
                <FaHeart />
              </Button>
            </div>
            <Separator />
            {/* Add new directory */}
            <div className="flex items-center space-x-1">
              <span className="text-xs font-semibold">Add new directory</span>
              <Button size="smallIcon" onClick={addFavoriteDirectory} className="shrink-0">
                <FaPlus />
              </Button>
            </div>
            <Separator />
            <div>
              <span className="text-xs font-semibold">Move to a directory</span>
              <div>
                <span className="text-xs">Search...</span>
                <Input
                  className="h-6 px-1.5 text-xs"
                  value={directoryFilter}
                  spellCheck={false}
                  type="text"
                  onChange={(event) => setDirectoryFilter(event.target.value)}
                />
              </div>
              <div className="mt-1 space-y-1">
                {filteredDirectories.map((dir, idx) => (
                  <div key={`favorite-dir-${idx}`} className="relative">
                    <Button
                      onClick={() => moveToDirectory(dir.path, false)}
                      size="sm"
                      className="w-full"
                      variant="outline"
                    >
                      {dir.name}
                    </Button>
                    <Button
                      variant="outline"
                      className="group absolute -left-2 top-1/2 -translate-y-1/2"
                      size="smallIcon"
                      onDoubleClick={() => removeFavoriteDirectory(dir.path)}
                    >
                      <FaTrash className="transition-colors group-hover:text-destructive" />
                    </Button>
                    <Button
                      variant="outline"
                      className="group absolute -right-2 top-1/2 -translate-y-1/2"
                      size="smallIcon"
                      onClick={() => moveToDirectory(dir.path, true)}
                    >
                      <FaHeart className="transition-colors group-hover:text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
