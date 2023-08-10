import { useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";

type ElementSize = {
  width: number;
  height: number;
};

export function useElementSize<TElement extends HTMLElement | SVGElement>() {
  const ref = useRef<TElement>(null);

  // Use a large number instead of 0 to make sure the line is not visible by
  // default.
  const [size, setSize] = useState<undefined | ElementSize>();

  useEffect(() => {
    invariant(ref.current != null, "ref must be set");
    const element = ref.current;

    const observer = new ResizeObserver(() => {
      setSize({
        width: element.clientWidth,
        height: element.clientHeight,
      });
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return { ref, size };
}
