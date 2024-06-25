import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { useFileContext } from '@/hooks/useFileContext';
import { useEventListener } from 'usehooks-ts';
import { useRef } from 'react';

const View = () => {
  const { selectedFile, nextFile, isPrevious, isNext, previousFile } = useFileContext();
  const transformComponentRef = useRef<ReactZoomPanPinchRef>(null);

  useEventListener('resize', () => transformComponentRef.current?.centerView(1, 0));

  return (
    <div>
      <TransformWrapper
        ref={transformComponentRef}
        key={selectedFile}
        alignmentAnimation={{ sizeX: 0, sizeY: 0 }}
        wheel={{ step: 0.2, smoothStep: 0.003 }}
        centerOnInit
        maxScale={20}
        disablePadding
      >
        <TransformComponent wrapperClass="!w-screen !h-screen">
          <img src={`atom://${selectedFile}`} className="max-h-screen" />
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export default View;
