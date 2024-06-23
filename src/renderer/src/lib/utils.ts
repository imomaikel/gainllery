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

export const getHMS = (baseSeconds: number, baseDuration: number): string[] => {
  const longerThanHour = Math.floor(baseDuration / 3600) >= 1;
  const hours = Math.floor(baseSeconds / 3600);
  const minutes = Math.floor((baseSeconds - hours * 3600) / 60);
  const seconds = Math.floor(baseSeconds - hours * 3600 - minutes * 60);

  const textHours = hours >= 10 ? hours.toString() : `0${hours.toString()}`;
  const textMinutes = minutes >= 10 ? minutes.toString() : `0${minutes.toString()}`;
  const textSeconds = seconds >= 10 ? seconds.toString() : `0${seconds.toString()}`;

  if (longerThanHour) {
    return [textHours, textMinutes, textSeconds];
  }
  return [textMinutes, textSeconds];
};

export const formatPath = (path: string, showExtension?: boolean) => {
  let fileName = path.substring(path.lastIndexOf('/') + 1);
  if (fileName.length >= 15) {
    if (showExtension) {
      if (fileName.includes('.')) {
        const extension = fileName.substring(fileName.lastIndexOf('.') + 1);
        fileName = fileName.substring(0, 12) + `...${extension}`;
        return fileName;
      }
    }
    fileName = fileName.substring(0, 15) + '...';
  }

  return fileName;
};
