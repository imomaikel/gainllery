import { promisify } from 'util';
import { resolve } from 'path';
import fs from 'fs';

const readdir = promisify(fs.readdir);

const FILE_TYPES = [
  '.mp4',
  '.jpg',
  '.webp',
  '.jpeg',
  '.MP4',
  '.png',
  '.heic',
  '.mov',
  '.webm',
  '.gif',
  '.mkv',
  '.m4a',
  '.mp3',
  '.exe',
  '.m4v',
  '.MOV',
  '.PNG',
  '.JPG',
  '.JPEG',
];

export const getAllFilesRecursively = async (path: string): Promise<string[]> => {
  const getFiles = async (_path: string) => {
    const directories = await readdir(_path, { withFileTypes: true }).catch(() => []);
    const files = await Promise.all(
      directories
        .map((dirent) => {
          const filePath = resolve(_path, dirent.name);
          if (dirent.isDirectory()) return getFiles(filePath);
          const fileName = dirent.name.substring(dirent.name.lastIndexOf('.'));
          if (FILE_TYPES.includes(fileName)) return filePath;
        })
        .filter((v) => v),
    );
    return files.flat();
  };

  const files = await getFiles(path);

  return files;
};
