// import { FaHeartBroken } from 'react-icons/fa';
import { FaFolder } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

type TItem = {
  data: {
    path: string;
    name: string;
    isVideo: boolean;
    fileType: 'file' | 'directory';
  };
  removeFromFavorites: (path: string) => void;
  tileSize: number;
};
const Item = ({ data, removeFromFavorites, tileSize }: TItem) => {
  const { name, path, isVideo, fileType } = data;

  return (
    <div className="relative h-full w-full rounded border">
      {fileType === 'file' ? (
        isVideo ? (
          <video src={`atom://${path}`} className="h-full w-full rounded object-cover" muted />
        ) : (
          <img src={`atom://${path}`} className="h-full w-full rounded object-cover" />
        )
      ) : (
        <div className="flex h-full flex-col items-center justify-between py-4">
          <FaFolder size={tileSize / 1.5} />
          <Link to={`/browse?path=${path}\\${name}`} className="text-sm">
            {name}
          </Link>
        </div>
      )}
      <div
        className={cn(
          'absolute right-2 top-2 cursor-pointer text-destructive opacity-50 hover:opacity-100',
          tileSize <= 128 && 'right-1 top-1',
        )}
        role="button"
        aria-label="remove from favorites"
        onDoubleClick={() => removeFromFavorites(path)}
      >
        {/* <FaHeartBroken className={cn('h-6 w-6', tileSize <= 64 && 'h-4 w-4', tileSize <= 32 && 'h-2 w-2')} /> */}
      </div>
    </div>
  );
};

export default Item;
