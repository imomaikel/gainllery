import { getAllFilesRecursively } from './files';
import { store } from '.';

type TFileToFetch = {
  name: string;
  path: string;
  size: number;
  type: string;
};
const handleFiles = async () => {
  const filesToFetch = store.get('filesToFetch') as TFileToFetch[];
  let files: string[] = [];

  for await (const fileToFetch of filesToFetch) {
    if (fileToFetch.type === 'directory') {
      const fetchFiles = await getAllFilesRecursively(fileToFetch.path);
      files = files.concat(fetchFiles);
    } else if (fileToFetch.type.startsWith('image/') || fileToFetch.type.startsWith('video/')) {
      files.push(fileToFetch.path);
    }
  }

  store.set('fetchedFiles', files);
  return true;
};

export default handleFiles;
