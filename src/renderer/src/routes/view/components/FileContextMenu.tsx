import { ContextMenuCheckboxItem, ContextMenuContent } from '@/components/ui/context-menu';
import { useFileContext } from '@/hooks/useFileContext';

type TFileContextMenu = {
  isSideMenuOpen: boolean;
  setIsSideMenuOpen: (newState: boolean) => void;

  isTopBarOpen: boolean;
  setIsTopBarOpen: (newState: boolean) => void;
};
const FileContextMenu = ({ isSideMenuOpen, isTopBarOpen, setIsSideMenuOpen, setIsTopBarOpen }: TFileContextMenu) => {
  const { favoriteSwitch, isFavorite } = useFileContext();

  return (
    <ContextMenuContent className="w-52">
      <ContextMenuCheckboxItem checked={isSideMenuOpen} onClick={() => setIsSideMenuOpen(!isSideMenuOpen)}>
        Show Sidebar
      </ContextMenuCheckboxItem>
      <ContextMenuCheckboxItem checked={isTopBarOpen} onClick={() => setIsTopBarOpen(!isTopBarOpen)}>
        Show Topbar
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
