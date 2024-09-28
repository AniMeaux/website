import { Primitive } from "@animeaux/react-primitives";
import { useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";

export function LazyElement(
  props: React.ComponentPropsWithoutRef<typeof Primitive.div>,
) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isInViewport, setIsInViewport] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsInViewport(true);

          // The observer is no longer neeed.
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    invariant(elementRef.current != null, "elementRef should be set");
    observer.observe(elementRef.current);
    return () => {
      observer.disconnect();
    };
  }, [elementRef]);

  return (
    <Primitive.div
      {...props}
      ref={elementRef}
      data-visible={String(isInViewport)}
    />
  );
}
