export type StoreSchema = {
  theme: 'dark' | 'light' | 'system';
  recentPaths: string[];
  favorites: string[];
};
export type StoreSchemaKey = keyof StoreSchema;
