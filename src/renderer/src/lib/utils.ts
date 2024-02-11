import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

// TODO
export const filePathToUrl = (path: string): string => {
  const url = `atom://${path.replace(/ /gi, '%20').replace(/\?/gi, '%3F')}`;
  return url;
};
