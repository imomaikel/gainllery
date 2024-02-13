import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { ElementRef, RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { ValueAnimationTransition, useAnimate } from 'framer-motion';
import VideoControls from '@/components/VideoControls';
import ImageControls from '@/components/ImageControls';
import { getFetchedFiles } from '@/lib/storage';

const View = () => {
  const fetchedImages = useMemo(() => getFetchedFiles(), []);
  const rotate = useRef('0');
  const transformComponentRef = useRef<ReactZoomPanPinchRef>(null);
  const [scope, animate] = useAnimate<ElementRef<'div'>>();
  const videoRef = useRef<ElementRef<'video'>>(null);
  const imageRef = useRef<ElementRef<'img'>>(null);
  const [index, setIndex] = useState(34);
  const whileChange = useRef(false);

  // State
  const isNext = index + 1 !== fetchedImages.length;
  const isPrevious = index !== 0;

  // Switch files
  // TODO Settings
  const animation: ValueAnimationTransition = { type: 'keyframes', duration: 0.25 };
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
      rotateOnResize();
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const onLoad = () => {
    onRotate('0');
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
  const url = `atom://${fetchedImages[index]}`;
  const isVideo = url.endsWith('mp4') || url.endsWith('mp3') || url.endsWith('m4v') || url.endsWith('mov');
  const isImage = !isVideo;

  const onRotate = async (deg: string) => {
    const mediaRef: RefObject<ElementRef<'video'>> | RefObject<ElementRef<'img'>> | null = imageRef.current
      ? imageRef
      : videoRef.current
        ? videoRef
        : null;
    if (!mediaRef || !mediaRef.current) return;

    const invert = deg === '90' || deg === '270';
    const maxHeightVp = invert ? '100vw' : '100vh';
    const maxWidthVp = invert ? '100vh' : '100vw';

    mediaRef.current.style.rotate = `${deg}deg`;
    mediaRef.current.style.maxHeight = maxHeightVp;
    mediaRef.current.style.maxWidth = maxWidthVp;

    const newHeight = mediaRef.current.height || mediaRef.current.clientHeight;
    const newWidth = mediaRef.current.width || mediaRef.current.clientWidth;

    animate(mediaRef.current, { opacity: [0, 1] }, { duration: 0.25 });
    await animate(
      scope.current,
      { width: invert ? newHeight : newWidth, height: invert ? newWidth : newHeight },
      { duration: 0 },
    );

    rotate.current = deg;
    transformComponentRef.current?.centerView(1, 1);
  };
  const rotateOnResize = async () => {
    await onRotate(rotate.current);
    transformComponentRef.current?.centerView(1, 1);
  };
  const rotateMedia = (direction: 'RIGHT' | 'LEFT') => {
    let newDeg: string = (parseInt(rotate.current) + (direction === 'RIGHT' ? 90 : -90)).toString();
    if (newDeg === '-90') newDeg = '270';
    if (newDeg === '360') newDeg = '0';
    onRotate(newDeg);
  };

  console.log(url, isVideo);

  return (
    <div className="relative flex h-screen w-screen items-center">
      <TransformWrapper
        alignmentAnimation={{ sizeX: 0, sizeY: 0 }}
        wheel={{ step: 0.2, smoothStep: 0.003 }}
        ref={transformComponentRef}
        centerOnInit
        maxScale={20}
        disablePadding
        onPanning={onPanning}
        onPanningStart={onPanningStart}
        onPanningStop={onPanningStop}
      >
        <TransformComponent wrapperClass="!w-screen !h-screen">
          <div ref={scope} className="flex max-w-[100vw] items-center justify-center">
            {isVideo ? (
              <video
                ref={videoRef}
                className="max-h-screen object-contain"
                onLoadedData={onLoad}
                preload="auto"
                controls
              >
                <source src={url} type="video/mp4" />
              </video>
            ) : (
              <img src={url} ref={imageRef} className="max-h-screen object-contain" onLoad={onLoad} />
            )}
          </div>
        </TransformComponent>
      </TransformWrapper>

      {isImage && (
        <ImageControls
          isNext={isNext}
          isPrevious={isPrevious}
          onNext={() => nextFile()}
          onPrevious={() => previousFile()}
          rotateMedia={(direction: 'LEFT' | 'RIGHT') => rotateMedia(direction)}
          ref={transformComponentRef}
        />
      )}
      {isVideo && (
        <VideoControls
          ref={videoRef}
          isNext={isNext}
          isPrevious={isPrevious}
          rotateMedia={(direction: 'LEFT' | 'RIGHT') => rotateMedia(direction)}
          onNext={() => nextFile()}
          onPrevious={() => previousFile()}
          index={index}
        />
      )}
    </div>
  );
};

export default View;
