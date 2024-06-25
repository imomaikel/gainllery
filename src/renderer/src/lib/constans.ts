import { FaFolderOpen, FaHeart, FaGear } from 'react-icons/fa6';
import { MdPermMedia } from 'react-icons/md';
import type { IconType } from 'react-icons';
import { TbRestore } from 'react-icons/tb';
import { FaSearch } from 'react-icons/fa';

export const MENU_TABS: {
  label: string;
  Icon: IconType;
  path?: `/${string}`;
  onClick?: () => void;
}[] = [
  {
    label: 'Open recent',
    Icon: TbRestore,
    path: '/view',
  },
  {
    label: 'Open file',
    Icon: MdPermMedia,
  },
  {
    label: 'Open directory',
    Icon: FaFolderOpen,
  },
  {
    label: 'Browse directory',
    Icon: FaSearch,
  },
  {
    label: 'Favorites',
    Icon: FaHeart,
  },
  {
    label: 'Settings',
    Icon: FaGear,
    path: '/settings',
  },
] as const;
