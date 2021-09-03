import { useRef } from "react";

export function useLatestDefinedValue<ValueType>(
  value?: ValueType | null
): ValueType | null {
  const latestDefinedValue = useRef<ValueType | null>(null);

  if (value != null) {
    latestDefinedValue.current = value;
  }

  return latestDefinedValue.current;
}
