import { ContextMenuCheckboxItem, ContextMenuContent } from '@/components/ui/context-menu';

type TFileContextMenu = {
  isSideMenuOpen: boolean;
  setIsSideMenuOpen: (newState: boolean) => void;

  isTopBarOpen: boolean;
  setIsTopBarOpen: (newState: boolean) => void;
};
const FileContextMenu = ({ isSideMenuOpen, isTopBarOpen, setIsSideMenuOpen, setIsTopBarOpen }: TFileContextMenu) => {
  return (
    <ContextMenuContent className="w-52">
      <ContextMenuCheckboxItem checked={isSideMenuOpen} onClick={() => setIsSideMenuOpen(!isSideMenuOpen)}>
        Show Sidebar
      </ContextMenuCheckboxItem>
      <ContextMenuCheckboxItem checked={isTopBarOpen} onClick={() => setIsTopBarOpen(!isTopBarOpen)}>
        Show Topbar
      </ContextMenuCheckboxItem>
    </ContextMenuContent>
  );
};

export default FileContextMenu;
