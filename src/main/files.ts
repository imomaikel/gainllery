import path, { resolve } from 'path';
import { promisify } from 'util';
import { shell } from 'electron';
import fs from 'fs';

const renameFile = promisify(fs.rename);
const unlinkFile = promisify(fs.unlink);
const readdir = promisify(fs.readdir);

const VIDEO_TYPES = ['mp4', 'mov', 'webm', 'm4a', 'm4v'];
const IMAGE_TYPES = ['jpg', 'webp', 'jpeg', 'png', 'gif'];
export const FILE_TYPES = VIDEO_TYPES.concat(IMAGE_TYPES);

export const getAllFilesRecursively = async (dirPath: string): Promise<string[]> => {
  const getFiles = async (_path: string) => {
    const directories = await readdir(_path, { withFileTypes: true }).catch(() => []);
    const files = await Promise.all(
      directories
        .map((dirent) => {
          const filePath = resolve(_path, dirent.name);
          if (dirent.isDirectory()) return getFiles(filePath);
          const fileName = dirent.name.substring(dirent.name.lastIndexOf('.') + 1) as string;
          if (FILE_TYPES.includes(fileName.toLowerCase())) return filePath;
        })
        .filter((v) => v),
    );
    return files.flat();
  };

  const files = (await getFiles(dirPath)) as string[];

  files.sort((a, b) => a.localeCompare(b));

  return files;
};

export const getAllFilesInDirectory = async (dirPath: string) => {
  const files = await readdir(dirPath, { withFileTypes: true });

  const fileList = files
    .flatMap<{ type: 'file' | 'directory'; path: string; name: string }>((dirent) => {
      if (dirent.isDirectory()) {
        return [{ type: 'directory', path: dirent.path, name: path.basename(dirent.name) }];
      } else {
        const filePath = resolve(dirent.path, dirent.name);
        const fileName = dirent.name.substring(dirent.name.lastIndexOf('.') + 1) as string;
        if (FILE_TYPES.includes(fileName.toLowerCase())) {
          return [{ type: 'file', path: filePath, name: path.basename(filePath) }];
        }
        return [];
      }
    })
    .sort((a, b) => a!.type.localeCompare(b!.type) || a!.path.localeCompare(b!.path));

  return fileList;
};

export const moveFile = async (
  dirPath: string,
  filePath: string,
  customName: string | undefined,
): Promise<false | string> => {
  const moveResult = await new Promise<false | string>((res) => {
    try {
      const fileName = path.basename(filePath);
      const fileExt = path.extname(filePath);

      const newFileName = customName ? `${customName}${fileExt}` : fileName;

      let newPath = path.resolve(dirPath, newFileName);
      let idx = 0;

      do {
        const checkNewName = `${path.basename(newFileName, fileExt)} (${++idx})${fileExt}`;
        newPath = path.resolve(dirPath, checkNewName);
      } while (fs.existsSync(newPath));

      renameFile(filePath, newPath)
        .then(() => res(newPath))
        .catch(() => {
          const readStream = fs.createReadStream(filePath);
          const writeStream = fs.createWriteStream(newPath);
          readStream.pipe(writeStream);
          readStream
            .on('end', async () => {
              await unlinkFile(filePath);
              res(newPath);
            })
            .on('error', () => {
              res(false);
            });
        });
    } catch {
      res(false);
    }
  });

  return moveResult;
};

export const deleteFile = async (filePath: string, trashItem?: boolean): Promise<boolean> => {
  try {
    if (trashItem) {
      await shell.trashItem(filePath);
    } else {
      await unlinkFile(filePath);
    }
    return true;
  } catch {
    return false;
  }
};
