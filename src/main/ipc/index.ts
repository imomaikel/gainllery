import { IPCCallArguments, IPCCallCallbackReturn, IPCCallKey, IPCReceiveArguments, IPCReceiverKey } from './types';
import { BrowserWindow, ipcMain } from 'electron';

// Listen to an event from the renderer
const handleChannel = <T extends IPCCallKey>(
  channel: T,
  cb: (event: Electron.IpcMainEvent, ...args: IPCCallArguments<T>) => IPCCallCallbackReturn<T>,
) => {
  ipcMain.on(channel, (event, ...args: IPCCallArguments<T>): IPCCallCallbackReturn<T> => {
    return cb(event, ...args);
  });
};

export const registerIPCMainListeners = (window: BrowserWindow) => {
  const broadcastEvent = <T extends IPCReceiverKey>(channel: T, ...args: IPCReceiveArguments<T>) => {
    window.webContents.send(channel, ...args);
  };
};
