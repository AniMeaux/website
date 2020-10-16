const cache: { [key: string]: any } = {};

export const RessourceCache = {
  setItem(key: string, value: any) {
    cache[key] = value;
  },

  removeItem(key: string) {
    delete cache[key];
  },

  getItem<DataType>(key: string): DataType | null {
    return cache[key] ?? null;
  },
};
