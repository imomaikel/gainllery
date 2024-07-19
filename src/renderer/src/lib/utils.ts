import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const cleanString = (text: string) => {
  return text.replace(/ /g, '').toLowerCase();
};

export const pad = (num: number) => {
  const s = '0' + num;
  return s.substring(s.length - 2);
};

export const isFileVideo = (filePath: string) => {
  return ['.mp4', '.mov', '.webm', '.m4a', '.m4v'].some((extension) => filePath.endsWith(extension));
};
