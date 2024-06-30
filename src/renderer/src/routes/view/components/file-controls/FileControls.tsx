import { useEventListener, useHover } from 'usehooks-ts';
import { useFileContext } from '@/hooks/useFileContext';
import { useAnimate } from 'framer-motion';
import { useEffect, useRef } from 'react';
import Previous from './Previous';
import Next from './Next';

const FileControls = () => {
  const { isPrevious, isNext, previousFile, nextFile } = useFileContext();
  const debouncedAnimate = useRef<number | null>(null);
  const [scope, animate] = useAnimate();
  const isHovering = useHover(scope);
  const preventHide = useRef(false);
  const isInView = useRef(false);

  useEventListener('mousemove', () => {
    if (!isInView.current) showBar();

    if (debouncedAnimate.current) window.clearTimeout(debouncedAnimate.current);

    debouncedAnimate.current = window.setTimeout(hideBar, 1_000);
  });

  useEffect(() => {
    preventHide.current = isHovering;
  }, [isHovering]);

  const showBar = () => {
    if (preventHide.current) return;
    animate(scope.current, { y: 0 }, { type: 'tween', duration: 0.25 });
    isInView.current = true;
  };
  const hideBar = () => {
    if (preventHide.current) return;
    animate(scope.current, { y: 200 }, { type: 'tween', duration: 0.75 });
    isInView.current = false;
  };

  return (
    <div ref={scope} className="fixed bottom-0 w-screen border-t-2 bg-background/65">
      <div className="flex items-center justify-between p-1">
        <div className="flex items-center space-x-2">
          <Previous disabled={!isPrevious} onClick={previousFile} />
          <Next disabled={!isNext} onClick={nextFile} />
        </div>
      </div>
    </div>
  );
};

export default FileControls;
