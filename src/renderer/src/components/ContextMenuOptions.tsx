import { ContextMenuContent, ContextMenuItem } from './ui/context-menu';
import { IoMdHeart } from 'react-icons/io';

type TContextMenuOptions = {
  currentPath: string;
  onFavoriteSwitch: () => void;
  isFavorite: boolean;
};
const ContextMenuOptions = ({ currentPath, isFavorite, onFavoriteSwitch }: TContextMenuOptions) => {
  const sendToIpcRenderer = (channel: string, ...args: string[]) => {
    window.electron.ipcRenderer.send(channel, ...args);
  };

  return (
    <ContextMenuContent className="w-[225px]">
      <ContextMenuItem
        inset
        onClick={() =>
          sendToIpcRenderer('selectCurrentDirectory', currentPath.substring(0, currentPath.lastIndexOf('/')))
        }
      >
        Select Directory
      </ContextMenuItem>
      <ContextMenuItem inset onClick={() => sendToIpcRenderer('openCurrentFile', currentPath)}>
        Select File
      </ContextMenuItem>
      <ContextMenuItem inset preventCloseOnClick onClick={onFavoriteSwitch}>
        {isFavorite && <IoMdHeart className="absolute left-1 h-5 w-5 text-red-500" />}
        <span>{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</span>
      </ContextMenuItem>
    </ContextMenuContent>
  );
};

export default ContextMenuOptions;
