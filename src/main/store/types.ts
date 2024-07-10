import { TSettingsSchema } from '@/lib/settings';

export type StoreSchema = {
  theme: 'dark' | 'light' | 'system';
  recentPaths: string[];
  favoriteFiles: string[];
  settings: TSettingsSchema;
  favoriteDirectories: { label: string; path: string }[];
};
export type StoreSchemaKey = keyof StoreSchema;
