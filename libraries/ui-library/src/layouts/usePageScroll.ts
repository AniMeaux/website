import * as React from "react";
import { watchResize } from "react-behave";

function usePageScroll(cb: () => void) {
  const cbRef = React.useRef(cb);

  React.useEffect(() => {
    cbRef.current = cb;
  });

  React.useEffect(() => {
    function handleScroll() {
      cbRef.current();
    }

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    const stopWatching = watchResize(document.body, handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      stopWatching();
    };
  }, []);
}

export function useIsScrollAtTheBottom() {
  const [isAtTheBottom, setIsAtTheBottom] = React.useState(true);

  usePageScroll(() => {
    setIsAtTheBottom(
      window.scrollY + window.innerHeight >= document.body.offsetHeight
    );
  });

  return { isAtTheBottom };
}

export function useIsScrollAtTheTop() {
  const [isAtTheTop, setIsAtTheTop] = React.useState(true);

  usePageScroll(() => {
    setIsAtTheTop(window.scrollY <= 0);
  });

  return { isAtTheTop };
}

// If this zone, at the bottom of the page, is visible, then we should fetch
// more.
const FETCH_ZONE_HEIGHT = 150;

export function useIsScrollAtFetchMore(cb: () => void) {
  const wasAtFetchMore = React.useRef(false);

  usePageScroll(() => {
    const isAtFetchMore =
      // We suppose there is always scroll with pagination.
      window.scrollY > 0 &&
      window.scrollY + window.innerHeight + FETCH_ZONE_HEIGHT >=
        document.body.offsetHeight;

    if (isAtFetchMore) {
      if (!wasAtFetchMore.current) {
        wasAtFetchMore.current = true;
        cb();
      }
    } else {
      if (wasAtFetchMore.current) {
        wasAtFetchMore.current = false;
      }
    }
  });
}
