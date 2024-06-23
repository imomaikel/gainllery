import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { ElementRef, RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { ContextMenu, ContextMenuTrigger } from '@/components/ui/context-menu';
import { ValueAnimationTransition, useAnimate } from 'framer-motion';
import ContextMenuOptions from '@/components/ContextMenuOptions';
import SideMenuButton from '@/components/SideMenuButton';
import BreadcrumbPath from '@/components/BreadcrumbPath';
import VideoControls from '@/components/VideoControls';
import ImageControls from '@/components/ImageControls';
import { useSearchParams } from 'react-router-dom';
import { useSettings } from '@/hooks/settings';
import { useEventListener } from 'usehooks-ts';
import SideMenu from '@/components/SideMenu';
import { debounce } from 'lodash';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const View = () => {
  const settings = useSettings();

  const centerView = useCallback(
    debounce(() => {
      transformComponentRef.current?.centerView(1, 1);
    }, 10),
    [],
  );

  const [searchParams] = useSearchParams();

  const [fetchedFiles, setFetchedFiles] = useState<string[]>(
    searchParams.get('type') === 'favorites' ? settings.get('favorites', []) : settings.get('fetchedFiles', []),
  );
  const [favoriteDirectories, setFavoriteDirectories] = useState(settings.get('favoriteDirectories', []));
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(settings.get('sideMenuOpen', false));
  const [favorites, setFavorites] = useState<string[]>(settings.get('favorites', []));
  const transformComponentRef = useRef<ReactZoomPanPinchRef>(null);
  const videoRef = useRef<ElementRef<'video'>>(null);
  const imageRef = useRef<ElementRef<'img'>>(null);
  const whileChange = useRef(false);
  const rotate = useRef('0');
  const [whileRenaming, setWhileRenaming] = useState(false);

  const [scope, animate] = useAnimate<ElementRef<'div'>>();

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const selectFileOnStart = searchParams.get('select');
    if (!selectFileOnStart) return;
    const findIndex = fetchedFiles.findIndex((path) => path === selectFileOnStart);
    if (findIndex) setIndex(findIndex);
  }, []);

  const handleItemTrash = async () => {
    const itemToTrash = fetchedFiles[index];
    const action = await window.electron.ipcRenderer.sendSync('trashFile', itemToTrash);
    if (action === 'success') {
      const copy = [...fetchedFiles];
      copy.splice(index, 1);
      setFetchedFiles(copy);
    }
  };

  // State
  const isNext = index + 1 !== fetchedFiles.length;
  const isPrevious = index !== 0;

  // Switch files
  // TODO Settings
  const animation: ValueAnimationTransition = { type: 'keyframes', duration: 0.25 };
  const nextFile = () => {
    if (!isNext) return;
    whileChange.current = true;
    setIndex(index + 1);
    animate(scope.current, { x: ['100%', '0%'] }, { ...animation });
  };
  const previousFile = () => {
    if (!isPrevious) return;
    whileChange.current = true;
    setIndex(index - 1);
    animate(scope.current, { x: ['-100%', '0%'] }, { ...animation });
  };

  // Auto resize
  useEffect(() => {
    const onResize = () => {
      // TODO Settings
      centerView();
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const onLoad = async () => {
    if (rotate.current !== '0') {
      onRotate('0');
    } else {
      await animate(scope.current, { width: 'auto', height: 'auto' }, { duration: 0 });
      centerView();
    }
  };

  const onPanning = () => {
    if (!whileChange.current) return;
    transformComponentRef.current?.instance.setCenter();
  };
  const onPanningStop = () => {
    whileChange.current = false;
  };
  const onPanningStart = () => {
    whileChange.current = false;
  };

  // Key binds
  useEventListener('keydown', (event) => {
    if (whileRenaming) return;
    if (event.key === 'ArrowRight') {
      nextFile();
    } else if (event.key === 'ArrowLeft') {
      previousFile();
    }
  });

  // TODO
  const currentFilePath = fetchedFiles[index];
  const url = `atom://${currentFilePath}`;
  const isVideo = url.endsWith('mp4') || url.endsWith('mp3') || url.endsWith('m4v') || url.endsWith('mov');
  const isImage = !isVideo;

  const onRotate = async (deg: string) => {
    const mediaRef: RefObject<ElementRef<'video'>> | RefObject<ElementRef<'img'>> | null = imageRef.current
      ? imageRef
      : videoRef.current
        ? videoRef
        : null;
    if (!mediaRef || !mediaRef.current) return;

    const invert = deg === '90' || deg === '270';
    const maxHeightVp = invert ? '100vw' : '100vh';
    const maxWidthVp = invert ? '100vh' : '100vw';

    mediaRef.current.style.rotate = `${deg}deg`;
    mediaRef.current.style.maxHeight = maxHeightVp;
    mediaRef.current.style.maxWidth = maxWidthVp;

    const newHeight = mediaRef.current.height || mediaRef.current.clientHeight;
    const newWidth = mediaRef.current.width || mediaRef.current.clientWidth;

    animate(mediaRef.current, { opacity: [0, 1] }, { duration: 0.25 });
    await animate(
      scope.current,
      { width: invert ? newHeight : newWidth, height: invert ? newWidth : newHeight },
      { duration: 0 },
    );

    rotate.current = deg;
    centerView();
  };
  // const rotateOnResize = async () => {
  //   await onRotate(rotate.current);
  //   centerView();
  // };
  const rotateMedia = (direction: 'RIGHT' | 'LEFT') => {
    let newDeg: string = (parseInt(rotate.current) + (direction === 'RIGHT' ? 90 : -90)).toString();
    if (newDeg === '-90') newDeg = '270';
    if (newDeg === '360') newDeg = '0';
    onRotate(newDeg);
  };

  useEffect(() => {
    centerView();
  }, [isSideMenuOpen]);

  const removeCurrentFileFromFetchedStorage = () => {
    const copy = [...fetchedFiles];
    const toFilterOut = copy.splice(index, 1);
    if (searchParams.get('type') !== 'favorites' && toFilterOut.length === 1) {
      settings.set(
        'fetchedFiles',
        settings.get('fetchedFiles', []).filter((filePath) => filePath !== toFilterOut[0]),
      );
    }
    setFetchedFiles(copy);
  };

  const addToFavorites = (customPath?: string) => {
    const itemUrl = customPath ? customPath : currentFilePath;
    setFavorites((prev) => prev.concat(itemUrl));
    settings.set('favorites', settings.get('favorites', []).concat(itemUrl));
  };
  const removeFromFavorites = () => {
    const itemUrl = currentFilePath;
    setFavorites((prev) => prev.filter((entryUrl) => entryUrl !== itemUrl));
    settings.set(
      'favorites',
      settings.get('favorites', []).filter((entryUrl) => entryUrl !== itemUrl),
    );

    if (searchParams.get('type') === 'favorites') {
      removeCurrentFileFromFetchedStorage();
    }
  };

  const isInFavorites = () => {
    return favorites.includes(currentFilePath);
  };

  const handleFileRename = async (path: string, newName: string) => {
    const newPath = await window.electron.ipcRenderer.sendSync('renameFile', path, newName);

    if (newPath) {
      setFetchedFiles((files) =>
        files.map((file) => {
          if (file !== path) return file;
          return newPath;
        }),
      );
      settings.set(
        'fetchedFiles',
        settings.get('fetchedFiles', []).map((file) => {
          if (file !== path) return file;
          return newPath;
        }),
      );

      toast.success('Renamed!');
    } else {
      toast.error('Failed to rename!');
    }
  };

  return (
    <div className="relative flex h-screen w-screen items-center">
      {isSideMenuOpen ? (
        <div className="w-[150px]">
          <SideMenu
            onClose={() => {
              setIsSideMenuOpen(false);
              settings.set('sideMenuOpen', false);
            }}
            favoriteDirectories={favoriteDirectories}
            moveToDirectory={async (path, addItemToFavorites) => {
              const returnPath = (await window.electron.ipcRenderer.sendSync(
                'moveFileToDirectory',
                path,
                currentFilePath,
              )) as string | false;

              if (returnPath) {
                removeCurrentFileFromFetchedStorage();
                if (addItemToFavorites) {
                  addToFavorites(returnPath);
                }
              }
            }}
            addFavoriteDirectory={async () => {
              const action = (await window.electron.ipcRenderer.sendSync('addFavoriteDirectory')) as string[];

              const currentPaths = favoriteDirectories.flatMap((dir) => dir.path);
              const dirsToAdd: { name: string; path: string }[] = [];
              for (const newDir of action) {
                if (currentPaths.includes(newDir)) continue;
                const splitPath = newDir.split('/');
                const dirName = splitPath[splitPath.length - 1];
                dirsToAdd.push({ name: dirName, path: newDir });
              }

              setFavoriteDirectories((prev) => prev.concat(dirsToAdd));
              settings.set('favoriteDirectories', settings.get('favoriteDirectories', []).concat(dirsToAdd));
            }}
            removeFavoriteDirectory={(dirPath) => {
              setFavoriteDirectories((prev) => prev.filter(({ path }) => path !== dirPath));
              settings.set(
                'favoriteDirectories',
                settings.get('favoriteDirectories', []).filter(({ path }) => path !== dirPath),
              );
            }}
          />
        </div>
      ) : (
        <div className="fixed left-0 top-0 z-50">
          <SideMenuButton
            onClick={() => {
              setIsSideMenuOpen(true);
              settings.set('sideMenuOpen', true);
            }}
          />
        </div>
      )}
      <ContextMenu>
        <ContextMenuTrigger>
          <TransformWrapper
            alignmentAnimation={{ sizeX: 0, sizeY: 0 }}
            wheel={{ step: 0.2, smoothStep: 0.003 }}
            ref={transformComponentRef}
            centerOnInit
            maxScale={20}
            disablePadding
            onPanning={onPanning}
            onPanningStart={onPanningStart}
            onPanningStop={onPanningStop}
          >
            <TransformComponent wrapperClass={cn('!w-screen !h-screen', isSideMenuOpen && '!w-[calc(100vw-150px)]')}>
              <div
                ref={scope}
                className={cn(
                  'max-w-screen flex items-center justify-center',
                  isSideMenuOpen && 'max-w-[calc(100vw-150px)]',
                )}
              >
                {isVideo ? (
                  <video ref={videoRef} className="max-h-screen object-contain" onLoadedData={onLoad} src={url} />
                ) : (
                  <img src={url} ref={imageRef} className="max-h-screen object-contain" onLoad={onLoad} />
                )}
              </div>
            </TransformComponent>
          </TransformWrapper>
        </ContextMenuTrigger>
        <ContextMenuOptions
          currentPath={currentFilePath}
          isFavorite={favorites.includes(currentFilePath)}
          onFavoriteSwitch={() => {
            if (isInFavorites()) {
              removeFromFavorites();
            } else {
              addToFavorites();
            }
          }}
        />
      </ContextMenu>

      {isImage && (
        <ImageControls
          isNext={isNext}
          isPrevious={isPrevious}
          onNext={() => nextFile()}
          onPrevious={() => previousFile()}
          rotateMedia={(direction: 'LEFT' | 'RIGHT') => rotateMedia(direction)}
          ref={transformComponentRef}
          onItemTrash={handleItemTrash}
        />
      )}
      {isVideo && (
        <VideoControls
          ref={videoRef}
          isNext={isNext}
          isPrevious={isPrevious}
          rotateMedia={(direction: 'LEFT' | 'RIGHT') => rotateMedia(direction)}
          onNext={() => nextFile()}
          onPrevious={() => previousFile()}
          index={index}
          onItemTrash={handleItemTrash}
        />
      )}
      <BreadcrumbPath
        currentPath={currentFilePath}
        selectDirectory={(path) => {
          console.log('view', path);
        }}
        onRename={handleFileRename}
        setWhileRenaming={setWhileRenaming}
        whileRenaming={whileRenaming}
      />
    </div>
  );
};

export default View;
