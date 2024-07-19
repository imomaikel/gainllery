import { FaHeartBroken } from 'react-icons/fa';
import { cn } from '@/lib/utils';

type TItem = {
  data: {
    filePath: string;
    isVideo: boolean;
  };
  removeFromFavorites: (path: string) => void;
  tileSize: number;
};
const Item = ({ data, removeFromFavorites, tileSize }: TItem) => {
  const { filePath, isVideo } = data;

  return (
    <div className="relative h-full w-full rounded border">
      {isVideo ? (
        <video src={`atom://${filePath}`} className="h-full w-full rounded object-cover" muted />
      ) : (
        <img src={`atom://${filePath}`} className="h-full w-full rounded object-cover" />
      )}
      <div
        className={cn(
          'absolute right-2 top-2 cursor-pointer text-destructive opacity-50 hover:opacity-100',
          tileSize <= 128 && 'right-1 top-1',
        )}
        role="button"
        aria-label="remove from favorites"
        onDoubleClick={() => removeFromFavorites(filePath)}
      >
        <FaHeartBroken className={cn('h-6 w-6', tileSize <= 64 && 'h-4 w-4', tileSize <= 32 && 'h-2 w-2')} />
      </div>
    </div>
  );
};

export default Item;
