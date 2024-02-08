export const getFetchedFiles = (): string[] => {
  const files = window.store.get('fetchedFiles') as string[];
  return files;
};
