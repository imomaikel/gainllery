import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

const View = () => {
  const fetchedImages = window.store.get('fetchedFiles') as string[];
  const transformComponentRef = useRef<ReactZoomPanPinchRef | null>(null);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const onResize = () => {
      transformComponentRef.current?.resetTransform();
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // TODO
  const url = `atom://${fetchedImages[index].replace(/ /gi, '%20').replace(/\?/gi, '%3F')}`;

  return (
    <div className="h-full w-full">
      <div className="flex h-full w-full flex-wrap items-center justify-center">
        <TransformWrapper ref={transformComponentRef} maxScale={10}>
          <TransformComponent>
            {url.endsWith('mp4') || url.endsWith('mp3') ? (
              <video src={url} controls autoPlay className="h-screen object-contain object-center" draggable={false} />
            ) : (
              <img src={url} alt="test" draggable={false} className="h-screen object-contain object-center" />
            )}
          </TransformComponent>
        </TransformWrapper>

        <div className="fixed top-0 space-x-4">
          {/* TODO */}
          <Button
            onClick={() => {
              setIndex(index - 1);
              transformComponentRef.current?.resetTransform();
            }}
          >
            PREV
          </Button>
          <Button
            onClick={() => {
              setIndex(index + 1);
              transformComponentRef.current?.resetTransform();
            }}
          >
            NEXT
          </Button>
        </div>
      </div>
    </div>
  );
};

export default View;
