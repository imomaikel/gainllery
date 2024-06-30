import { TSettingsSchema } from '@/lib/settings';

export type StoreSchema = {
  theme: 'dark' | 'light' | 'system';
  recentPaths: string[];
  favorites: string[];
  settings: TSettingsSchema;
};
export type StoreSchemaKey = keyof StoreSchema;
