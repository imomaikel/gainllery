import React, { ElementRef, RefObject, useEffect, useState } from 'react';
import ControlsBox from './ControlsBox';
import { Slider } from './ui/slider';
import { getHMS } from '@/lib/utils';

const VideoControls = React.forwardRef<ElementRef<'video'>>((_, _ref) => {
  const ref = _ref as RefObject<ElementRef<'video'>>;
  const [totalTextDuration, setTotalTextDuration] = useState('00:00');
  const [currentSecond, setCurrentSecond] = useState(0);
  const [mounted, setIsMounted] = useState(false);
  const [duration, setDuration] = useState(0);

  const [pause, setPause] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    const updateDuration = () => {
      const videoDuration = ref.current?.duration ?? 0;
      setDuration(videoDuration);
      setTotalTextDuration(getHMS(Math.round(videoDuration), Math.round(videoDuration)).join(':'));
    };
    const onTimeUpdate = (event: Event) => {
      if (!event.target) return;
      const target = event.target as HTMLVideoElement;
      const currentTime = target.currentTime;
      setCurrentSecond(currentTime);
    };
    const onEnd = () => {
      setCurrentSecond(duration);
    };
    if (ref.current) {
      ref.current.addEventListener('loadedmetadata', updateDuration);
      ref.current.addEventListener('timeupdate', onTimeUpdate);
      ref.current.addEventListener('ended', onEnd);
    }
    return () => {
      ref.current?.removeEventListener('loadedmetadata', updateDuration);
      ref.current?.removeEventListener('timeupdate', onTimeUpdate);
      ref.current?.removeEventListener('ended', onEnd);
    };
  }, [duration]);

  const playPause = () => {
    if (pause) {
      ref.current?.play();
    } else {
      ref.current?.pause();
    }
    setPause(!pause);
  };

  const onSlide = (newSecond: number) => {
    if (!ref.current) return;
    ref.current.currentTime = newSecond;
    setCurrentSecond(newSecond);
  };

  if (!mounted || !ref.current) return null;

  return (
    <ControlsBox onShow={() => {}} visible={true} className="bottom-1 w-screen px-4">
      <button onClick={playPause} className="max-w-[100px] bg-primary p-2">
        Play/Pause
      </button>
      <div className="flex space-x-2">
        <div>{getHMS(Math.round(currentSecond), duration).join(':')}</div>
        <Slider
          max={duration}
          step={0.1}
          defaultValue={[0]}
          onValueChange={(e) => onSlide(e[0])}
          value={[currentSecond]}
        />
        <div>{totalTextDuration}</div>
      </div>
    </ControlsBox>
  );
});
export default VideoControls;
