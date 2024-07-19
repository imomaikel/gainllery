import { VirtuosoGrid, GridComponents } from 'react-virtuoso';
import { forwardRef, useMemo, useState } from 'react';
import { isFileVideo } from '@/lib/utils';
import Item from './Item';

const Browse = () => {
  const [files, setFiles] = useState<string[]>(window.store.get('favoriteFiles', []));
  const [size, setSize] = useState(256);

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
          <div ref={ref} style={{ ...style }} className="my-4 flex flex-wrap items-center justify-center gap-4">
            {children}
          </div>
        )),
        Item: ({ children }) => (
          <div
            style={{
              width: `${size}px`,
              height: `${size}px`,
            }}
          >
            {children}
          </div>
        ),
      }) satisfies GridComponents,
    [size],
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
        itemContent={(idx) => <Item data={filesWithData[idx]} removeFromFavorites={handleRemoveFromFav} />}
      />
    </>
  );
};

export default Browse;
