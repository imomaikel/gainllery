import { ContextMenuContent, ContextMenuItem } from './ui/context-menu';

type TContextMenuOptions = {
  currentPath: string;
};
const ContextMenuOptions = ({ currentPath }: TContextMenuOptions) => {
  const sendToIpcRenderer = (channel: string, ...args: string[]) => {
    window.electron.ipcRenderer.send(channel, ...args);
  };

  return (
    <ContextMenuContent>
      <ContextMenuItem
        onClick={() =>
          sendToIpcRenderer('selectCurrentDirectory', currentPath.substring(0, currentPath.lastIndexOf('/')))
        }
      >
        Select Directory
      </ContextMenuItem>
    </ContextMenuContent>
  );
};

export default ContextMenuOptions;
