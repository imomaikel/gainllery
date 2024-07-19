import { FaHeartBroken } from 'react-icons/fa';

type TItem = {
  data: {
    filePath: string;
    isVideo: boolean;
  };
  removeFromFavorites: (path: string) => void;
};
const Item = ({ data, removeFromFavorites }: TItem) => {
  const { filePath, isVideo } = data;

  return (
    <div className="relative h-full w-full rounded border">
      {isVideo ? (
        <video src={`atom://${filePath}`} className="h-full w-full rounded object-cover" />
      ) : (
        <img src={`atom://${filePath}`} className="h-full w-full rounded object-cover" />
      )}
      <div
        className="absolute right-2 top-2 cursor-pointer text-destructive opacity-50 hover:opacity-100"
        role="button"
        aria-label="remove from favorites"
        onDoubleClick={() => removeFromFavorites(filePath)}
      >
        <FaHeartBroken className="h-6 w-6" />
      </div>
    </div>
  );
};

export default Item;
