import { useEffect, useRef } from 'react';

/**
 * Calls callback with debounce on value change.
 */
export function useDebouncedEffect(
  callback: () => void,
  deps: unknown[],
  delay: number
): void {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(callback, delay);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, delay]);
}
