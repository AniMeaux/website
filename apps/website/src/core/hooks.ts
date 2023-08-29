import { useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";

export function usePreviousValue<ValueType>(
  value: ValueType,
): ValueType | null {
  const previousValue = useRef<ValueType | null>(null);

  useEffect(() => {
    previousValue.current = value;
  }, [value]);

  return previousValue.current;
}

export function useWidth<TElement extends HTMLElement>() {
  const ref = useRef<TElement>(null);

  // Use a large number instead of 0 to make sure the line is not visible by
  // default.
  const [width, setWidth] = useState(Number.MAX_SAFE_INTEGER);

  useEffect(() => {
    invariant(ref.current != null, "ref must be set");
    const element = ref.current;

    const observer = new ResizeObserver(() => {
      setWidth(element.clientWidth);
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return { ref, width };
}
