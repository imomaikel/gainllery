import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const cleanString = (text: string) => {
  return text.replace(/ /g, '').toLowerCase();
};
