import { ContextMenuCheckboxItem, ContextMenuContent } from '@/components/ui/context-menu';
import { useFileContext } from '@/hooks/useFileContext';
import { useSettings } from '@/hooks/useSettings';
import { useState } from 'react';

type TFileContextMenu = {
  isSideMenuOpen: boolean;
  setIsSideMenuOpen: (newState: boolean) => void;

  isTopBarOpen: boolean;
  setIsTopBarOpen: (newState: boolean) => void;
};
const FileContextMenu = ({ isSideMenuOpen, isTopBarOpen, setIsSideMenuOpen, setIsTopBarOpen }: TFileContextMenu) => {
  const { favoriteSwitch, isFavorite } = useFileContext();
  const settings = useSettings();

  const [autoPlayVideos, setAutoPlayVideos] = useState(settings.get('autoPlayVideos'));
  const [loopVideos, setLoopVideos] = useState(settings.get('loopVideos'));

  return (
    <ContextMenuContent className="w-52">
      <ContextMenuCheckboxItem checked={isSideMenuOpen} onClick={() => setIsSideMenuOpen(!isSideMenuOpen)}>
        Show Sidebar
      </ContextMenuCheckboxItem>
      <ContextMenuCheckboxItem checked={isTopBarOpen} onClick={() => setIsTopBarOpen(!isTopBarOpen)}>
        Show Topbar
      </ContextMenuCheckboxItem>
      <ContextMenuCheckboxItem
        checked={autoPlayVideos}
        onClick={(event) => {
          event?.preventDefault();
          setAutoPlayVideos(!autoPlayVideos);
          settings.set('autoPlayVideos', !autoPlayVideos);
        }}
      >
        Auto Play Videos
      </ContextMenuCheckboxItem>
      <ContextMenuCheckboxItem
        checked={loopVideos}
        onClick={(event) => {
          event?.preventDefault();
          setLoopVideos(!loopVideos);
          settings.set('loopVideos', !loopVideos);
        }}
      >
        Loop Videos
      </ContextMenuCheckboxItem>
      <ContextMenuCheckboxItem
        checked={isFavorite}
        onClick={(e) => {
          e.preventDefault();
          favoriteSwitch();
        }}
      >
        {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
      </ContextMenuCheckboxItem>
    </ContextMenuContent>
  );
};

export default FileContextMenu;
