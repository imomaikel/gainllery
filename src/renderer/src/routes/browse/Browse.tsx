import { forwardRef, useEffect, useMemo, useState } from 'react';
import { VirtuosoGrid, GridComponents } from 'react-virtuoso';
import { Link, useSearchParams } from 'react-router-dom';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { isFileVideo } from '@/lib/utils';
import Item from './Item';

const Browse = () => {
  const [searchParams] = useSearchParams();
  const pathToView = searchParams.get('path');

  const [files, setFiles] = useState<
    {
      type: 'file' | 'directory';
      path: string;
      name: string;
    }[]
  >([]);
  const [tileSize, setTileSize] = useState(256);

  useEffect(() => {
    if (!pathToView || pathToView.length <= 2) return;
    setFiles(window.ipc.sendSync('getAllFilesInDirectory', { path: pathToView }).files);
  }, [pathToView]);

  const filesWithData = useMemo(() => {
    const withData = files.map((file) => ({
      path: file.path,
      fileType: file.type,
      isVideo: isFileVideo(file.path),
      name: file.name,
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
    const filteredFiles = files.filter((file) => file.path !== path);
    setFiles(filteredFiles);
    window.store.set(
      'favoriteFiles',
      filteredFiles.map((entry) => entry.path),
    );
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
      <div className="fixed bottom-0 flex h-10 w-screen items-center justify-between border-t bg-background/50 px-4 backdrop-blur-sm">
        <div className="flex w-72 space-x-2">
          <Label className="shrink-0">Tile Size</Label>
          <Slider min={32} step={16} max={512} className="w-full" onValueChange={(value) => setTileSize(value[0])} />
          <span className="text-xs">({tileSize})</span>
        </div>
        <Button size="sm" asChild>
          <Link to="/">Home</Link>
        </Button>
      </div>
    </>
  );
};

export default Browse;
