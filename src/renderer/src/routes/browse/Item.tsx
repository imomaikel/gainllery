type TItem = {
  data: {
    filePath: string;
    isVideo: boolean;
  };
};
const Item = ({ data }: TItem) => {
  const { filePath, isVideo } = data;

  return (
    <div className="relative h-full w-full rounded border">
      {isVideo ? (
        <video src={`atom://${filePath}`} className="h-full w-full rounded object-cover" />
      ) : (
        <img src={`atom://${filePath}`} className="h-full w-full rounded object-cover" />
      )}
    </div>
  );
};

export default Item;
