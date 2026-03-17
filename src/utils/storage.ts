export const StorageUtils = {
  getItem<T>(key: string, defaultValue: T): T {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return defaultValue;

      const firstChar = raw.trim().charAt(0);
      if (firstChar === "{" || firstChar === "[" || firstChar === "\"") {
        try {
          return JSON.parse(raw) as T;
        } catch {
          return raw as unknown as T;
        }
      }

      return raw as unknown as T;
    } catch {
      return defaultValue;
    }
  },

  setItem(key: string, value: any): void {
    try {
      if (value === undefined || value === null) {
        localStorage.removeItem(key);
        return;
      }
      if (typeof value === "string") {
        localStorage.setItem(key, value);
        return;
      }
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      return;
    }
  },

  setItems(items: Record<string, any>): void {
    Object.entries(items).forEach(([key, value]) => {
      StorageUtils.setItem(key, value);
    });
  },

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      return;
    }
  },

  removeItems(keys: string[]): void {
    keys.forEach((key) => {
      StorageUtils.removeItem(key);
    });
  },

  clear(): void {
    try {
      localStorage.clear();
    } catch {
      return;
    }
  },

  getAllKeys(): string[] {
    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.warn("Failed to get all keys from localStorage:", error);
      return [];
    }
  }
};