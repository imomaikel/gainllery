import { promisify } from 'util';
import { resolve } from 'path';
import fs from 'fs';

const readdir = promisify(fs.readdir);

const VIDEO_TYPES = ['mp4', 'mov', 'webm', 'mkv', 'm4a', 'm4v'];
const IMAGE_TYPES = ['jpg', 'webp', 'jpeg', 'png', 'gif'];
export const FILE_TYPES = VIDEO_TYPES.concat(IMAGE_TYPES);

export const getAllFilesRecursively = async (path: string): Promise<string[]> => {
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

  const files = await getFiles(path);

  return files;
};
