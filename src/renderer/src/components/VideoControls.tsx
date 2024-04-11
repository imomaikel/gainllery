import React, { ElementRef, RefObject, useEffect, useState } from 'react';
import { useSettings } from '@/hooks/settings';
import FileControls from './FileControls';
import { getHMS } from '@/lib/utils';

type TVideoControls = {
  isPrevious: boolean;
  isNext: boolean;
  onNext: () => void;
  onPrevious: () => void;
  index: number;
  rotateMedia: (direction: 'LEFT' | 'RIGHT') => void;
};
const VideoControls = React.forwardRef<ElementRef<'video'>, TVideoControls>(
  ({ isNext, isPrevious, onNext, onPrevious, index, rotateMedia }, _ref) => {
    const ref = _ref as RefObject<ElementRef<'video'>>;

    const settings = useSettings();

    const [autoPlay, setAutoPlay] = useState(settings.get('autoPlay', false));
    const [totalTextDuration, setTotalTextDuration] = useState('00:00');
    const [currentSecond, setCurrentSecond] = useState(0);
    const [menuVisible, setMenuVisible] = useState(true);
    const [autoRepeat, setAutoRepeat] = useState(false);
    const [mounted, setIsMounted] = useState(false);
    const [duration, setDuration] = useState(0);
    const [pause, setPause] = useState(true);
    const [volume, setVolume] = useState(0);

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
      const onPlay = () => {
        setPause(false);
      };
      const onPause = () => {
        setPause(true);
      };

      if (ref.current) {
        onVolume(settings.get('videoVolume', 1));
        onRepeat(settings.get('videoLoop', false));
        if (settings.get('autoPlay', false)) {
          ref.current.play().catch(() => {});
        }

        ref.current.addEventListener('loadedmetadata', updateDuration);
        ref.current.addEventListener('timeupdate', onTimeUpdate);
        ref.current.addEventListener('ended', onEnd);
        ref.current.addEventListener('play', onPlay);
        ref.current.addEventListener('pause', onPause);
      }
      return () => {
        ref.current?.removeEventListener('loadedmetadata', updateDuration);
        ref.current?.removeEventListener('timeupdate', onTimeUpdate);
        ref.current?.removeEventListener('ended', onEnd);
        ref.current?.removeEventListener('play', onPlay);
        ref.current?.removeEventListener('pause', onPause);
      };
    }, [duration]);

    useEffect(() => {
      // TODO
      setPause(true);
    }, [index]);

    const playPause = () => {
      if (pause) {
        ref.current?.play();
      } else {
        ref.current?.pause();
      }
    };

    const onSlide = (newSecond: number) => {
      if (!ref.current) return;
      ref.current.currentTime = newSecond;
      setCurrentSecond(newSecond);
    };

    const onVolume = (newVolume: number) => {
      if (ref.current) {
        ref.current.volume = newVolume;
        setVolume(newVolume);
        settings.set('videoVolume', newVolume);
      }
    };
    const onRepeat = (forceState?: boolean) => {
      if (ref.current) {
        const newState = forceState !== undefined ? forceState : !autoRepeat;
        ref.current.loop = newState;
        setAutoRepeat(newState);
        settings.set('videoLoop', newState);
      }
    };
    const onAutoPlay = () => {
      settings.set('autoPlay', !autoPlay);
      setAutoPlay(!autoPlay);
    };

    if (!mounted || !ref.current) return null;

    return (
      <FileControls
        isNext={isNext}
        isPrev={isPrevious}
        onRotate={(side) => rotateMedia(side)}
        nextSlide={onNext}
        prevSlide={onPrevious}
        hideMenu={() => setMenuVisible(false)}
        isMenuVisible={menuVisible}
        props={{
          fileType: 'video',
          onAutoPlay: onAutoPlay,
          onRepeat: onRepeat,
          onVolume: (newVolume) => onVolume(newVolume),
          playPause: playPause,
          volume,
          pause,
          autoPlay,
          autoRepeat,
          currentSecond,
          duration,
          totalTextDuration,
          onSeek: (timestamp) => onSlide(timestamp),
        }}
      />
    );
  },
);
export default VideoControls;
