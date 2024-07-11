import { forwardRef, useEffect, useRef, useState } from 'react';
import { useFileContext } from '@/hooks/useFileContext';
import { useSettings } from '@/hooks/useSettings';
import { Slider } from '@/components/ui/slider';
import { useAnimate } from 'framer-motion';
import { useHover } from 'usehooks-ts';
import Previous from './Previous';
import Next from './Next';

const FileControls = forwardRef<HTMLVideoElement | HTMLImageElement>((_, _ref) => {
  const { isPrevious, isNext, previousFile, nextFile, isVideo } = useFileContext();
  const debouncedAnimate = useRef<number | null>(null);
  const [scope, animate] = useAnimate();
  const isHovering = useHover(scope);
  const preventHide = useRef(false);
  const isInView = useRef(false);
  const settings = useSettings();

  const [videoProgress, setVideoProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const videoSliderInUse = useRef(false);

  const { imgRef, videoRef } = {
    imgRef: !isVideo ? (_ref as React.MutableRefObject<HTMLImageElement>) : null,
    videoRef: isVideo ? (_ref as React.MutableRefObject<HTMLVideoElement>) : null,
  };

  const handleVideoSeek = (newDuration: number[]) => {
    if (!videoRef?.current) return;
    videoSliderInUse.current = true;
    setVideoProgress(newDuration[0]);
    videoRef.current.currentTime = newDuration[0];
  };

  useEffect(() => {
    const handleMouseMove = () => {
      if (!isInView.current) showBar();

      if (debouncedAnimate.current) window.clearTimeout(debouncedAnimate.current);

      debouncedAnimate.current = window.setTimeout(hideBar, 1_000);
    };

    if (settings.get('autoHideBottomControls')) {
      window.addEventListener('mousemove', handleMouseMove);
      showBar();
    }

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    preventHide.current = isHovering;
  }, [isHovering]);

  useEffect(() => {
    const onVideoTimeUpdate = (event: Event) => {
      if (videoSliderInUse.current) return;
      const target = event.target as HTMLVideoElement | undefined;
      if (!target) return;
      setVideoProgress(target.currentTime);
    };
    const onVideoMetadataLoaded = () => {
      if (!videoRef?.current) return;
      setVideoDuration(videoRef.current.duration);
      console.log(videoRef.current.duration);
    };

    if (videoRef?.current) {
      videoRef.current.ontimeupdate = onVideoTimeUpdate;
      videoRef.current.onloadedmetadata = onVideoMetadataLoaded;
    }
  }, [_ref]);

  const showBar = () => {
    if (preventHide.current || !scope.current) return;
    animate(scope.current, { y: 0 }, { type: 'tween', duration: settings.reduceMotion(0.25) });
    isInView.current = true;
  };
  const hideBar = () => {
    if (preventHide.current || !scope.current) return;
    animate(scope.current, { y: 200 }, { type: 'tween', duration: settings.reduceMotion(0.75) });
    isInView.current = false;
  };

  return (
    <div ref={scope} className="fixed bottom-0 w-screen border-t-2 bg-background/65">
      <div className="flex items-center justify-between p-1">
        <div className="flex items-center space-x-2">
          <Previous disabled={!isPrevious} onClick={previousFile} />
          <Next disabled={!isNext} onClick={nextFile} />
        </div>
        <div className="mx-4 w-full" onClick={() => (videoSliderInUse.current = false)}>
          <Slider min={0} max={videoDuration} onValueChange={handleVideoSeek} step={0.01} value={[videoProgress]} />
        </div>
      </div>
    </div>
  );
});

export default FileControls;
