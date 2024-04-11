import { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import React, { RefObject, useState } from 'react';
import FileControls from './FileControls';

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
      <FileControls
        isNext={isNext}
        isPrev={isPrevious}
        nextSlide={onNext}
        onRotate={(side) => rotateMedia(side)}
        prevSlide={onPrevious}
        hideMenu={() => setMenuVisible(false)}
        isMenuVisible={menuVisible}
        props={{
          fileType: 'image',
          onCenter: center,
          zoomIn,
          zoomOut,
        }}
      />
    );
  },
);
export default ImageControls;
