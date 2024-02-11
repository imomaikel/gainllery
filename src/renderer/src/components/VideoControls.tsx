import React, { ElementRef, RefObject, useEffect, useState } from 'react';
import ControlsBox from './ControlsBox';
import { Slider } from './ui/slider';

const getHMS = (baseSeconds: number, baseDuration: number): string[] => {
  const longerThanHour = Math.floor(baseDuration / 3600) >= 1;
  const hours = Math.floor(baseSeconds / 3600);
  const minutes = Math.floor((baseSeconds - hours * 3600) / 60);
  const seconds = Math.floor(baseSeconds - hours * 3600 - minutes * 60);

  const textHours = hours >= 10 ? hours.toString() : `0${hours.toString()}`;
  const textMinutes = minutes >= 10 ? minutes.toString() : `0${minutes.toString()}`;
  const textSeconds = seconds >= 10 ? seconds.toString() : `0${seconds.toString()}`;

  if (longerThanHour) {
    return [textHours, textMinutes, textSeconds];
  }
  return [textMinutes, textSeconds];
};

const VideoControls = React.forwardRef<ElementRef<'video'>>((_, _ref) => {
  const ref = _ref as RefObject<ElementRef<'video'>>;
  const [mounted, setIsMounted] = useState(false);
  const [duration, setDuration] = useState(0);

  const [currentSecond, setCurrentSecond] = useState(0);
  const [pause, setPause] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    const updateDuration = () => {
      const videoDuration = Math.round(ref.current?.duration ?? 0);
      setDuration(videoDuration);
    };
    const onTimeUpdate = (event: Event) => {
      if (!event.target) return;
      const target = event.target as HTMLVideoElement;
      const currentTime = Math.round(target.currentTime);
      setCurrentSecond(currentTime);
    };
    if (ref.current) {
      ref.current.addEventListener('loadedmetadata', updateDuration);
      ref.current.addEventListener('timeupdate', onTimeUpdate);
    }
    return () => {
      ref.current?.removeEventListener('loadedmetadata', updateDuration);
      ref.current?.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, []);

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
        <div>{getHMS(currentSecond, duration).join(':')}</div>
        <Slider
          max={duration}
          step={1}
          defaultValue={[0]}
          onValueChange={(e) => onSlide(e[0])}
          value={[currentSecond]}
        />
      </div>
    </ControlsBox>
  );
});
export default VideoControls;
