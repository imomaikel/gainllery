import {
  AllSidesIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from '@radix-ui/react-icons';
import { FaRotateLeft, FaRotateRight } from 'react-icons/fa6';
import { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import React, { RefObject, useState } from 'react';
import { Link } from 'react-router-dom';
import ControlsBox from './ControlsBox';
import { cn } from '@/lib/utils';

type TImageControls = {
  isPrevious: boolean;
  isNext: boolean;
  onNext: () => void;
  onPrevious: () => void;
  rotateMedia: (direction: 'LEFT' | 'RIGHT') => void;
};

const ImageControls = React.forwardRef<ReactZoomPanPinchRef, TImageControls>(
  ({ isNext, isPrevious, onNext, onPrevious, rotateMedia }, _ref) => {
    const ref = _ref as RefObject<ReactZoomPanPinchRef>;
    const [menuVisible, setMenuVisible] = useState(true);

    const zoomIn = () => ref.current?.zoomIn();
    const zoomOut = () => ref.current?.zoomOut();
    const center = () => ref.current?.centerView(1, 250);

    return (
      <ControlsBox visible={menuVisible} onShow={() => setMenuVisible(true)}>
        <div className="relative rounded-tl-lg rounded-tr-lg bg-white/10 px-6 py-2">
          <div className="flex h-full w-full items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div role="button" onClick={onPrevious} className={cn(!isPrevious && 'invisible')}>
                <ChevronLeftIcon className="h-8 w-8 rounded-full bg-primary" />
              </div>
              <div role="button" onClick={onNext} className={cn(!isNext && 'invisible')}>
                <ChevronRightIcon className="h-8 w-8 rounded-full bg-primary" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div role="button" onClick={zoomIn}>
                <ZoomInIcon className="h-8 w-8 rounded-full bg-primary" />
              </div>
              <div role="button" onClick={zoomOut}>
                <ZoomOutIcon className="h-8 w-8 rounded-full bg-primary" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div role="button" onClick={() => rotateMedia('LEFT')}>
                <FaRotateLeft className="h-8 w-8 rounded-full bg-primary" />
              </div>
              <div role="button" onClick={() => rotateMedia('RIGHT')}>
                <FaRotateRight className="h-8 w-8 rounded-full bg-primary" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div role="button" onClick={center}>
                <AllSidesIcon className="h-8 w-8 rounded-full bg-primary" />
              </div>
              <div role="button" onClick={zoomOut}>
                <Link to="/">
                  <HomeIcon className="h-8 w-8 rounded-full bg-primary" />
                </Link>
              </div>
              <div role="button" onClick={() => setMenuVisible(!menuVisible)}>
                <ChevronDownIcon className="h-8 w-8 rounded-full bg-primary" />
              </div>
            </div>
          </div>
          <div className="absolute -z-10 h-full w-full backdrop-blur-sm" />
        </div>
      </ControlsBox>
    );
  },
);
export default ImageControls;
