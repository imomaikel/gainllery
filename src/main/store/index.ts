import { StoreSchema, StoreSchemaKey } from './types';
import Store from 'electron-store';

const store = new Store();

export const storageGet = <T extends StoreSchemaKey>(key: T, overwriteIfEmpty: StoreSchema[T]): StoreSchema[T] => {
  try {
    const value = store.get(key) as StoreSchema[T] | undefined;
    if (value !== undefined) return value;

    store.set(key, overwriteIfEmpty);
  } catch {}
  return overwriteIfEmpty;
};

export const storageSet = <T extends StoreSchemaKey>(key: T, value: StoreSchema[T]): void => {
  store.set(key, value);
};
