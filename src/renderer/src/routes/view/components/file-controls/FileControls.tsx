import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { useFileContext } from '@/hooks/useFileContext';
import { useSettings } from '@/hooks/useSettings';
import { Slider } from '@/components/ui/slider';
import { useAnimate } from 'framer-motion';
import { useHover } from 'usehooks-ts';
import PlayPause from './PlayPause';
import Previous from './Previous';
import { pad } from '@/lib/utils';
import Volume from './Volume';
import Next from './Next';

const FileControls = forwardRef<HTMLVideoElement | HTMLImageElement>((_, _ref) => {
  const { isPrevious, isNext, previousFile, nextFile, isVideo, selectedFile } = useFileContext();
  const debouncedAnimate = useRef<number | null>(null);
  const [scope, animate] = useAnimate();
  const isHovering = useHover(scope);
  const preventHide = useRef(false);
  const isInView = useRef(false);
  const settings = useSettings();

  const [videoProgress, setVideoProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoPaused, setVideoPaused] = useState(true);
  const [videoMuted, setVideoMuted] = useState(false);
  const [videoVolume, setVideoVolume] = useState(1);
  const videoSliderInUse = useRef(false);

  const { imgRef, videoRef } = {
    imgRef: !isVideo ? (_ref as React.MutableRefObject<HTMLImageElement>) : null,
    videoRef: isVideo ? (_ref as React.MutableRefObject<HTMLVideoElement>) : null,
  };

  const loopVideos = settings.all.loopVideos;
  const autoPlayVideos = settings.all.autoPlayVideos;

  useEffect(() => {
    if (!videoRef?.current) return;
    videoRef.current.loop = loopVideos;
    videoRef.current.autoplay = autoPlayVideos;
  }, [loopVideos, autoPlayVideos]);

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
    };

    const onPlay = () => setVideoPaused(false);
    const onPause = () => setVideoPaused(true);

    if (videoRef?.current) {
      videoRef.current.ontimeupdate = onVideoTimeUpdate;
      videoRef.current.onloadedmetadata = onVideoMetadataLoaded;
      videoRef.current.onpause = onPause;
      videoRef.current.onplay = onPlay;
      videoRef.current.muted = videoMuted;
      videoRef.current.volume = videoVolume;
      videoRef.current.loop = settings.get('loopVideos');
      videoRef.current.autoplay = settings.get('autoPlayVideos');
    }
  }, [selectedFile]);

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
  const handlePlayPause = () => {
    if (!videoRef?.current) return;
    if (videoPaused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    if (!videoRef?.current) return;
    videoRef.current.volume = newVolume;
    setVideoVolume(newVolume);
  };
  const handleMuteToggle = () => {
    if (!videoRef?.current) return;
    videoRef.current.muted = !videoMuted;
    setVideoMuted(!videoMuted);
  };

  const totalDurationText = useMemo(() => {
    const totalHours = Math.floor(videoDuration / 3600);
    const totalMinutes = Math.floor((videoDuration - totalHours * 3600) / 60);
    const totalSeconds = Math.floor(videoDuration - totalHours * 3600 - totalMinutes * 60);
    return `${totalHours ? `${pad(totalHours)}:` : ''}${pad(totalMinutes)}:${pad(totalSeconds)}`;
  }, [videoDuration]);

  const currentProgressText = useMemo(() => {
    const currentHours = Math.floor(videoProgress / 3600);
    const currentMinutes = Math.floor((videoProgress - currentHours * 3600) / 60);
    const currentSeconds = Math.floor(videoProgress - currentHours * 3600 - currentMinutes * 60);

    return `${currentHours ? `${pad(currentHours)}:` : ''}${pad(currentMinutes)}:${pad(currentSeconds)}`;
  }, [videoProgress]);

  return (
    <div ref={scope} className="fixed bottom-0 w-screen border-t-2 bg-background/65 px-1">
      <div className="flex items-center justify-between space-x-4 p-1">
        <div className="flex items-center space-x-2">
          <Previous disabled={!isPrevious} onClick={previousFile} />
          <Next disabled={!isNext} onClick={nextFile} />
          {isVideo && <PlayPause paused={videoPaused} onClick={handlePlayPause} />}
        </div>

        {isVideo && (
          <div className="flex w-full items-center space-x-2" onClick={() => (videoSliderInUse.current = false)}>
            <span>{currentProgressText}</span>
            <Slider min={0} max={videoDuration} onValueChange={handleVideoSeek} step={0.01} value={[videoProgress]} />
            <span>{totalDurationText}</span>
            <Volume
              onVolumeChange={handleVolumeChange}
              volume={videoVolume}
              muted={videoMuted}
              toggleMute={handleMuteToggle}
            />
          </div>
        )}
      </div>
    </div>
  );
});

export default FileControls;
