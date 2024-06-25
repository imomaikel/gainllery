import { ContextMenu, ContextMenuTrigger } from '@/components/ui/context-menu';
import { useFileContext } from '@/hooks/useFileContext';
import { cn } from '@/lib/utils';
import { AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { useEventListener } from 'usehooks-ts';
import FileContextMenu from './components/FileContextMenu';
import SideMenu from './components/SideMenu';
import TopBar from './components/TopBar';

const View = () => {
  const { selectedFile, nextFile, isPrevious, isNext, previousFile, isVideo } = useFileContext();
  const transformComponentRef = useRef<ReactZoomPanPinchRef>(null);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isTopBarOpen, setIsTopBarOpen] = useState(false);

  const fixViewerSize = (timeout: number = 0) =>
    setTimeout(() => transformComponentRef.current?.centerView(1, timeout), timeout);

  useEventListener('resize', () => fixViewerSize());

  return (
    <div className="relative flex flex-col">
      <AnimatePresence>{isTopBarOpen && <TopBar />}</AnimatePresence>
      <div className="relative flex h-full w-full">
        <AnimatePresence>{isSideMenuOpen && <SideMenu />}</AnimatePresence>
        <ContextMenu>
          <ContextMenuTrigger className="h-full w-full">
            <TransformWrapper
              ref={transformComponentRef}
              key={selectedFile}
              alignmentAnimation={{ sizeX: 0, sizeY: 0 }}
              wheel={{ step: 0.2, smoothStep: 0.003 }}
              centerOnInit
              maxScale={20}
              disablePadding
            >
              <TransformComponent
                wrapperClass={cn('!w-full !h-screen transition-transform', isTopBarOpen && '!h-[calc(100vh-25px)]')}
              >
                {isVideo ? (
                  <video
                    src={`atom://${selectedFile}`}
                    controls
                    className={cn('max-h-screen', isTopBarOpen && 'max-h-[calc(100vh-25px)]')}
                    onLoadedData={() => fixViewerSize()}
                  />
                ) : (
                  <img
                    src={`atom://${selectedFile}`}
                    className={cn('max-h-screen', isTopBarOpen && 'max-h-[calc(100vh-25px)]')}
                  />
                )}
              </TransformComponent>
            </TransformWrapper>
          </ContextMenuTrigger>
          <FileContextMenu
            isSideMenuOpen={isSideMenuOpen}
            isTopBarOpen={isTopBarOpen}
            setIsSideMenuOpen={(newState) => {
              setIsSideMenuOpen(newState);
              fixViewerSize(200);
            }}
            setIsTopBarOpen={(newState) => {
              setIsTopBarOpen(newState);
              fixViewerSize(200);
            }}
          />
        </ContextMenu>
      </div>
    </div>
  );
};

export default View;
