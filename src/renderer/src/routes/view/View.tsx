import { useFileContext } from '@/hooks/useFileContext';
import { AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { useEventListener } from 'usehooks-ts';
import SideMenu from './components/SideMenu';

const View = () => {
  const { selectedFile, nextFile, isPrevious, isNext, previousFile } = useFileContext();
  const transformComponentRef = useRef<ReactZoomPanPinchRef>(null);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  useEventListener('resize', () => transformComponentRef.current?.centerView(1, 0));

  return (
    <div className="relative flex flex-col">
      <div className="relative flex h-full w-full">
        <AnimatePresence>{isSideMenuOpen && <SideMenu />}</AnimatePresence>
        <TransformWrapper
          ref={transformComponentRef}
          key={selectedFile}
          alignmentAnimation={{ sizeX: 0, sizeY: 0 }}
          wheel={{ step: 0.2, smoothStep: 0.003 }}
          centerOnInit
          maxScale={20}
          disablePadding
        >
          <TransformComponent wrapperClass="!w-full !h-screen">
            <img src={`atom://${selectedFile}`} className="max-h-screen" />
          </TransformComponent>
        </TransformWrapper>
      </div>
    </div>
  );
};

export default View;
