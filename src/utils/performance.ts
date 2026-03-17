type DebouncedFunction<TArgs extends any[]> = ((...args: TArgs) => void) & {
  cancel: () => void;
};

export function debounce<TArgs extends any[]>(
  fn: (...args: TArgs) => void,
  delay: number,
): DebouncedFunction<TArgs> {
  let timer: ReturnType<typeof setTimeout> | null = null;

  const debounced = ((...args: TArgs) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn(...args);
    }, delay);
  }) as DebouncedFunction<TArgs>;

  debounced.cancel = () => {
    if (timer) clearTimeout(timer);
    timer = null;
  };

  return debounced;
}

export function throttle<TArgs extends any[]>(
  fn: (...args: TArgs) => void,
  interval: number,
): (...args: TArgs) => void {
  let lastExec = 0;

  return (...args: TArgs) => {
    const now = Date.now();
    if (now - lastExec >= interval) {
      lastExec = now;
      fn(...args);
    }
  };
}

export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  if (!Array.isArray(array) || array.length === 0) return [];
  if (chunkSize <= 0) return [array.slice()];

  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

