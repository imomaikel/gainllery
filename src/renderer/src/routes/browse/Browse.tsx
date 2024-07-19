import { VirtuosoGrid, GridComponents } from 'react-virtuoso';
import { forwardRef, useMemo, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { isFileVideo } from '@/lib/utils';
import Item from './Item';

const Browse = () => {
  const [files, setFiles] = useState<string[]>(window.store.get('favoriteFiles', []));
  const [tileSize, setTileSize] = useState(256);

  const filesWithData = useMemo(() => {
    const withData = files.map((filePath) => ({
      filePath,
      isVideo: isFileVideo(filePath),
    }));
    return withData;
  }, [files.length]);

  const gridComponents = useMemo(
    () =>
      ({
        List: forwardRef(({ style, children }, ref) => (
          <div ref={ref} style={{ ...style }} className="mt-4 flex flex-wrap items-center justify-center gap-4">
            {children}
          </div>
        )),
        Item: ({ children }) => (
          <div
            style={{
              width: `${tileSize}px`,
              height: `${tileSize}px`,
            }}
          >
            {children}
          </div>
        ),
        Footer: () => <div className="pb-14" />,
      }) satisfies GridComponents,
    [tileSize],
  );

  const handleRemoveFromFav = (path: string) => {
    const filteredFiles = files.filter((filePath) => filePath !== path);
    setFiles(filteredFiles);
    window.store.set('favoriteFiles', filteredFiles);
  };

  return (
    <>
      <VirtuosoGrid
        className="h-screen w-screen"
        totalCount={files.length}
        components={gridComponents}
        itemContent={(idx) => (
          <Item data={filesWithData[idx]} removeFromFavorites={handleRemoveFromFav} tileSize={tileSize} />
        )}
      />
      <div className="fixed bottom-0 flex h-10 w-screen items-center border-t bg-background/50 px-4 backdrop-blur-sm">
        <div className="flex w-72 space-x-2">
          <Label className="shrink-0">Tile Size</Label>
          <Slider min={32} step={16} max={512} className="w-full" onValueChange={(value) => setTileSize(value[0])} />
          <span className="text-xs">({tileSize})</span>
        </div>
      </div>
    </>
  );
};

export default Browse;
