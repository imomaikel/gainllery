export type StoreSchema = {
  theme: 'dark' | 'light' | 'system';
  recentPaths: string[];
};
export type StoreSchemaKey = keyof StoreSchema;
