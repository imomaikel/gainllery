import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { ContextMenu, ContextMenuTrigger } from '@/components/ui/context-menu';
import FileControls from './components/file-controls/FileControls';
import FileContextMenu from './components/FileContextMenu';
import { useFileContext } from '@/hooks/useFileContext';
import { ElementRef, useRef, useState } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { AnimatePresence } from 'framer-motion';
import { useEventListener } from 'usehooks-ts';
import { useNavigate } from 'react-router-dom';
import SideMenu from './components/SideMenu';
import TopBar from './components/TopBar';
import { cn } from '@/lib/utils';

const View = () => {
  const { selectedFile, nextFile, isPrevious, isNext, previousFile, isVideo, deleteSelectedFile } = useFileContext();
  const transformComponentRef = useRef<ReactZoomPanPinchRef>(null);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isTopBarOpen, setIsTopBarOpen] = useState(false);
  const videoRef = useRef<ElementRef<'video'>>(null);
  const imgRef = useRef<ElementRef<'img'>>(null);
  const navigate = useNavigate();
  const settings = useSettings();

  const fixViewerSize = (timeout: number = 0) => {
    setTimeout(
      () => transformComponentRef.current?.centerView(1, settings.reduceMotion(timeout)),
      settings.reduceMotion(timeout),
    );
  };

  useEventListener('resize', () => fixViewerSize());

  useEventListener('keydown', ({ key }) => {
    if (key === 'ArrowRight' && isNext) return nextFile();
    if (key === 'ArrowLeft' && isPrevious) return previousFile();
    if (key === 'Escape') return navigate('/');
    if (key === 'Delete') {
      if (videoRef.current) {
        videoRef.current.removeAttribute('src');
      }
      const isSuccess = deleteSelectedFile();
      if (!isSuccess && videoRef.current) {
        videoRef.current.load();
      }
      return;
    }
  });

  return (
    <div className="relative flex flex-col">
      <AnimatePresence>{isTopBarOpen && <TopBar animationDuration={settings.reduceMotion(0.2)} />}</AnimatePresence>
      <div className="relative flex h-full w-full">
        <AnimatePresence>
          {isSideMenuOpen && <SideMenu animationDuration={settings.reduceMotion(0.2)} />}
        </AnimatePresence>
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
                    ref={videoRef}
                    controls
                    className={cn('max-h-screen', isTopBarOpen && 'max-h-[calc(100vh-25px)]')}
                    onLoadedData={() => fixViewerSize()}
                  />
                ) : (
                  <img
                    src={`atom://${selectedFile}`}
                    ref={imgRef}
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
      <FileControls />
    </div>
  );
};

export default View;
