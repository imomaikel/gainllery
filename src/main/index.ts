import { BrowserWindow, app, dialog, ipcMain, protocol, shell } from 'electron';
import { electronApp, is, optimizer } from '@electron-toolkit/utils';
import { FILE_TYPES, getAllFilesRecursively } from './files';
import handleFiles from './drop-handler';
import Store from 'electron-store';
import path, { join } from 'path';
import { promisify } from 'util';
import fs from 'fs';

const renameFile = promisify(fs.rename);
const unlinkFile = promisify(fs.unlink);

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
    minHeight: 560,
    minWidth: 400,
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

  ipcMain.on('selectCurrentDirectory', (_, ...args) => {
    shell.openPath(args[0]);
  });

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

    for (const filePath of paths) {
      const isFile = FILE_TYPES.includes(filePath.substring(filePath.lastIndexOf('.') + 1));
      if (!isFile) {
        directories.push(filePath);
      } else {
        files.push(filePath);
      }
    }

    const filesInDirectories = (
      await Promise.all(directories.map((filePath) => getAllFilesRecursively(filePath)))
    ).flat();
    files = files.concat(filesInDirectories);

    store.set('fetchedFiles', files);

    mainWindow?.webContents.send('filesFetched');
  });

  ipcMain.on('trashFile', async (event, ...args) => {
    try {
      await shell.trashItem(args[0]);
      event.returnValue = 'success';
    } catch {
      event.returnValue = 'error';
    }
  });

  ipcMain.on('moveFileToDirectory', async (event, ...args) => {
    try {
      const moveToPath = args[0] as string;
      const fileToMovePath = args[1] as string;

      const fileSplit = fileToMovePath.split('/');
      const fileName = fileSplit[fileSplit.length - 1];

      const newFilePath = path.resolve(moveToPath, fileName);

      if (newFilePath === fileToMovePath) {
        event.returnValue = false;
        return;
      }

      try {
        await renameFile(fileToMovePath, newFilePath);
        event.returnValue = newFilePath;
        return;
      } catch {
        const readStream = fs.createReadStream(fileToMovePath);
        const writeStream = fs.createWriteStream(newFilePath);
        readStream.pipe(writeStream);
        readStream
          .on('end', async () => {
            await unlinkFile(fileToMovePath);
            event.returnValue = newFilePath;
          })
          .on('error', () => {
            event.returnValue = false;
          });
      }
    } catch {
      event.returnValue = false;
    }
  });

  ipcMain.on('renameFile', async (event, ...args) => {
    try {
      const oldPath = args[0];
      const newName = args[1];

      const newPath = path.resolve(oldPath, '..', newName);

      try {
        await renameFile(oldPath, newPath);
        event.returnValue = newPath;
      } catch {
        const readStream = fs.createReadStream(oldPath);
        const writeStream = fs.createWriteStream(newPath);
        readStream.pipe(writeStream);
        readStream
          .on('end', async () => {
            await unlinkFile(oldPath);
            event.returnValue = newPath;
          })
          .on('error', () => {
            event.returnValue = false;
          });
      }
    } catch {
      event.returnValue = false;
    }
  });

  ipcMain.on('addFavoriteDirectory', async (event) => {
    const pick = await dialog.showOpenDialog({
      title: 'Select one or more directories',
      properties: ['openDirectory', 'multiSelections'],
    });
    if (pick.canceled) {
      event.returnValue = [];
      return;
    }
    event.returnValue = pick.filePaths;
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
    const filesInDirectories = (await Promise.all(paths.map((filePath) => getAllFilesRecursively(filePath)))).flat();

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
