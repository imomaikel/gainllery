import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { ValueAnimationTransition, useAnimate } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { getFetchedFiles } from '@/lib/storage';

const View = () => {
  const fetchedImages = useMemo(() => getFetchedFiles(), []);
  const transformComponentRef = useRef<ReactZoomPanPinchRef>(null);
  const [index, setIndex] = useState(0);
  const [scope, animate] = useAnimate();
  const whileChange = useRef(false);

  // State
  const isNext = index + 1 !== fetchedImages.length;
  const isPrevious = index !== 0;

  // Switch files
  // TODO Settings
  const animation: ValueAnimationTransition = { type: 'keyframes', duration: 0.15 };
  const nextFile = () => {
    if (!isNext) return;
    whileChange.current = true;
    setIndex(index + 1);
    animate(scope.current, { x: ['100%', '0%'] }, { ...animation });
  };
  const previousFile = () => {
    if (!isPrevious) return;
    whileChange.current = true;
    setIndex(index - 1);
    animate(scope.current, { x: ['-100%', '0%'] }, { ...animation });
  };

  // Auto resize
  useEffect(() => {
    const onResize = () => {
      // TODO Settings
      transformComponentRef.current?.centerView(1, 1);
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const onLoad = () => {
    transformComponentRef.current?.centerView(1, 1);
  };

  const onPanning = () => {
    if (!whileChange.current) return;
    transformComponentRef.current?.instance.setCenter();
  };
  const onPanningStop = () => {
    whileChange.current = false;
  };
  const onPanningStart = () => {
    whileChange.current = false;
  };

  // Key binds
  useEffect(() => {
    const handleKeypress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        nextFile();
      } else if (event.key === 'ArrowLeft') {
        previousFile();
      }
    };

    window.addEventListener('keydown', handleKeypress);
    return () => window.removeEventListener('keydown', handleKeypress);
  }, [nextFile, previousFile]);

  // TODO
  const url = `atom://${fetchedImages[index].replace(/ /gi, '%20').replace(/\?/gi, '%3F')}`;

  return (
    <div className="relative flex h-screen w-screen items-center">
      <TransformWrapper
        alignmentAnimation={{ sizeX: 0, sizeY: 0 }}
        wheel={{ step: 0.2, smoothStep: 0.003 }}
        ref={transformComponentRef}
        centerOnInit
        disablePadding
        onPanning={onPanning}
        onPanningStart={onPanningStart}
        onPanningStop={onPanningStop}
      >
        <TransformComponent wrapperClass="!w-screen !h-screen">
          <div ref={scope}>
            {url.endsWith('mp4') || url.endsWith('mp3') || url.endsWith('m4v') ? (
              <video
                src={url}
                controls
                className="max-h-screen object-contain"
                draggable={false}
                onLoadedData={onLoad}
              />
            ) : (
              <img src={url} className="max-h-screen object-contain" onLoad={onLoad} />
            )}
          </div>
        </TransformComponent>
      </TransformWrapper>

      <div className="fixed top-0 flex w-full justify-center space-x-2">
        <Button onClick={previousFile}>PREV</Button>
        <Button onClick={nextFile}>NEXT</Button>
      </div>
    </div>
  );
};

export default View;
