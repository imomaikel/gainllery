import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { ContextMenu, ContextMenuTrigger } from '@/components/ui/context-menu';
import FileContextMenu from './components/FileContextMenu';
import { useFileContext } from '@/hooks/useFileContext';
import { AnimatePresence } from 'framer-motion';
import { useEventListener } from 'usehooks-ts';
import SideMenu from './components/SideMenu';
import { useRef, useState } from 'react';
import TopBar from './components/TopBar';
import { cn } from '@/lib/utils';

const View = () => {
  const { selectedFile, nextFile, isPrevious, isNext, previousFile } = useFileContext();
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
                <img
                  src={`atom://${selectedFile}`}
                  className={cn('max-h-screen transition-all', isTopBarOpen && 'max-h-[calc(100vh-25px)]')}
                />
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
