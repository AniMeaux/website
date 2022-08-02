import { useEffect, useRef } from "react";

export function usePreviousValue<ValueType>(
  value: ValueType
): ValueType | null {
  const previousValue = useRef<ValueType | null>(null);

  useEffect(() => {
    previousValue.current = value;
  }, [value]);

  return previousValue.current;
}
