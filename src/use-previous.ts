import * as React from "react";

export function usePrevious<T>(value: T) {
  const ref = React.useRef<T | null>(null);
  React.useEffect(() => {
    if (value !== ref.current) {
      ref.current = value;
    }
  }, [value]);
  return ref.current;
}
