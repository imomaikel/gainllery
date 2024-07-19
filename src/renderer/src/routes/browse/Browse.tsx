import { VirtuosoGrid, GridComponents } from 'react-virtuoso';
import { forwardRef, useMemo, useState } from 'react';
import { isFileVideo } from '@/lib/utils';
import Item from './Item';

const Browse = () => {
  const [files, setFiles] = useState<string[]>(window.store.get('favoriteFiles', []));

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
              width: '256px',
              height: '256px',
            }}
          >
            {children}
          </div>
        ),
      }) satisfies GridComponents,
    [],
  );

  return (
    <>
      <VirtuosoGrid
        className="h-screen w-screen"
        totalCount={files.length}
        components={gridComponents}
        itemContent={(idx) => <Item data={filesWithData[idx]} />}
      />
    </>
  );
};

export default Browse;
