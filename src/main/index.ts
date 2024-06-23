import { BrowserWindow, app, dialog, ipcMain, protocol, shell } from 'electron';
import { electronApp, is, optimizer } from '@electron-toolkit/utils';
import { FILE_TYPES, getAllFilesRecursively } from './files';
import handleFiles from './drop-handler';
import Store from 'electron-store';
import { join } from 'path';

let mainWindow: BrowserWindow | undefined;
export const store = new Store();

// protocol.registerSchemesAsPrivileged([
//   {
//     scheme: 'atom',
//     privileges: {
//       bypassCSP: true,
//       stream: true,
//     },
//   },
// ]);

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 520,
    height: 520,
    minHeight: 520,
    minWidth: 520,
    show: false,
    // ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: true,
    },
  });

  mainWindow.removeMenu();

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  ipcMain.on('filesToFetch', async (event) => {
    event.returnValue = await handleFiles();
  });

  // Menu buttons
  ipcMain.on('openFile', async () => {
    const pick = await dialog.showOpenDialog({
      filters: [
        {
          name: 'Media',
          extensions: FILE_TYPES,
        },
      ],
      title: 'Select one or more files',
      properties: ['multiSelections', 'openFile'],
    });
    if (pick.canceled) {
      mainWindow?.webContents.send('fetchingCancelled');
      return;
    }

    mainWindow?.webContents.send('fetchingFile');

    const paths = pick.filePaths;

    const directories: string[] = [];
    let files: string[] = [];

    for (const path of paths) {
      const isFile = FILE_TYPES.includes(path.substring(path.lastIndexOf('.') + 1));
      if (!isFile) {
        directories.push(path);
      } else {
        files.push(path);
      }
    }

    const filesInDirectories = (await Promise.all(directories.map((path) => getAllFilesRecursively(path)))).flat();
    files = files.concat(filesInDirectories);

    store.set('fetchedFiles', files);

    mainWindow?.webContents.send('filesFetched');
  });

  ipcMain.on('openDirectory', async () => {
    const pick = await dialog.showOpenDialog({
      title: 'Select one or more directories',
      properties: ['openDirectory', 'multiSelections'],
    });
    if (pick.canceled) {
      mainWindow?.webContents.send('fetchingCancelled');
      return;
    }

    mainWindow?.webContents.send('fetchingFile');

    const paths = pick.filePaths;
    const filesInDirectories = (await Promise.all(paths.map((path) => getAllFilesRecursively(path)))).flat();

    store.set('fetchedFiles', filesInDirectories);

    mainWindow?.webContents.send('filesFetched');
  });
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron');

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // protocol.handle('atom', (request) => {
  //   const path = 'file:///' + request.url.slice('atom://'.length);
  //   return net.fetch(path);
  // });
  // https://github.com/electron/electron/issues/38749
  protocol.registerFileProtocol('atom', (req, cb) => {
    const url = req.url.slice('atom://'.length);
    cb({ path: decodeURIComponent(url) });
  });

  ipcMain.on('electron-store-get', async (event, key) => {
    event.returnValue = store.get(key);
  });
  ipcMain.on('electron-store-set', async (_, key, val) => {
    store.set(key, val);
  });

  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
