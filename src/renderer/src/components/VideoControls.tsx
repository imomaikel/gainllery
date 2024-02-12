import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import React, { ElementRef, RefObject, useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { FaPlay, FaPause } from 'react-icons/fa6';
import { AiFillSound } from 'react-icons/ai';
import { IoMdMore } from 'react-icons/io';
import { Checkbox } from './ui/checkbox';
import ControlsBox from './ControlsBox';
import { Slider } from './ui/slider';
import { getHMS } from '@/lib/utils';
import { Button } from './ui/button';
import { Label } from './ui/label';

type TVideoControls = {
  isPrevious: boolean;
  isNext: boolean;
  onNext: () => void;
  onPrevious: () => void;
  index: number;
};
const VideoControls = React.forwardRef<ElementRef<'video'>, TVideoControls>(
  ({ isNext, isPrevious, onNext, onPrevious, index }, _ref) => {
    const ref = _ref as RefObject<ElementRef<'video'>>;
    const [totalTextDuration, setTotalTextDuration] = useState('00:00');
    const [currentSecond, setCurrentSecond] = useState(0);
    const [mounted, setIsMounted] = useState(false);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);

    const [autoRepeat, setAutoRepeat] = useState(false);
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
      const onPlay = () => {
        setPause(false);
      };
      const onPause = () => {
        setPause(true);
      };
      if (ref.current) {
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
      }
    };
    const onRepeat = () => {
      if (ref.current) {
        ref.current.loop = !autoRepeat;
        setAutoRepeat(!autoRepeat);
      }
    };

    if (!mounted || !ref.current) return null;

    return (
      <ControlsBox onShow={() => {}} visible={true} className="bottom-1 w-screen select-none px-2">
        <div className="flex space-x-2">
          <div className="flex space-x-1">
            <Button size="icon" onClick={onPrevious} disabled={!isPrevious}>
              <FaChevronLeft />
            </Button>
            <Button onClick={playPause} size="icon">
              {pause ? <FaPlay /> : <FaPause />}
            </Button>
            <Button size="icon" onClick={onNext} disabled={!isNext}>
              <FaChevronRight />
            </Button>
          </div>
          <div className="flex flex-1 items-center space-x-2">
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
          <div className="flex space-x-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button size="icon">
                  <IoMdMore className="h-6 w-6" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="relative w-min" align="center">
                <div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="repeat">Repeat</Label>
                    <Checkbox id="repeat" onCheckedChange={() => onRepeat()} checked={autoRepeat} />
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button size="icon">
                  <AiFillSound className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="relative h-[50vh] w-min">
                <Slider
                  orientation="vertical"
                  value={[volume]}
                  step={0.01}
                  max={1}
                  onValueChange={(e) => onVolume(e[0])}
                />
                <div className="absolute -top-5 left-0 flex w-full items-center text-sm text-muted-foreground">
                  {Math.round(volume * 100)}%
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </ControlsBox>
    );
  },
);
export default VideoControls;
