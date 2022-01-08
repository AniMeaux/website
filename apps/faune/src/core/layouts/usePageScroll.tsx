import { useRouter } from "core/router";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { watchResize } from "react-behave";

const PAGE_SCROLL_SCROLL_Y: Record<string, number> = {};

export function usePageScrollRestoration({
  disabled = false,
}: { disabled?: boolean } = {}) {
  const { pathname } = useRouter();

  // Both effects must be layout effects to make sure to register/unregister as
  // soon as possible to avoid glitchs.

  useLayoutEffect(() => {
    if (!disabled) {
      const scrollY = PAGE_SCROLL_SCROLL_Y[pathname];
      if (scrollY != null) {
        window.scrollTo(0, scrollY);
      }
    }
  }, [disabled, pathname]);

  useLayoutEffect(() => {
    function handleScroll() {
      PAGE_SCROLL_SCROLL_Y[pathname] = window.scrollY;
    }

    window.addEventListener("scroll", handleScroll);
    const stopWatching = watchResize(document.body, handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      stopWatching();
    };
  }, [pathname]);
}

type ScrollState = {
  scrollTop: number;
  clientHeight: number;
  scrollHeight: number;
};

export function useIsScrollAtTheBottom() {
  const [isAtTheBottom, setIsAtTheBottom] = useState(true);

  usePageScroll(({ scrollTop, clientHeight, scrollHeight }) => {
    setIsAtTheBottom(scrollTop + clientHeight >= scrollHeight);
  });

  return { isAtTheBottom };
}

export function useIsScrollAtTheTop() {
  const [isAtTheTop, setIsAtTheTop] = useState(true);

  usePageScroll(({ scrollTop }) => {
    setIsAtTheTop(scrollTop <= 0);
  });

  return { isAtTheTop };
}

// If this zone, at the bottom of the page, is visible, then we should fetch
// more.
const FETCH_ZONE_HEIGHT = 150;

export function useIsScrollAtFetchMore(cb: () => void) {
  const wasAtFetchMore = useRef(false);

  usePageScroll(({ scrollTop, clientHeight, scrollHeight }) => {
    const isAtFetchMore =
      // We suppose there is always scroll with pagination.
      scrollTop > 0 &&
      scrollTop + clientHeight + FETCH_ZONE_HEIGHT >= scrollHeight;

    if (isAtFetchMore && !wasAtFetchMore.current) {
      cb();
    }

    wasAtFetchMore.current = isAtFetchMore;
  });
}

function usePageScroll(callback: (state: ScrollState) => void) {
  const cbRef = useRef(callback);
  useEffect(() => {
    cbRef.current = callback;
  });

  useEffect(() => {
    function handleScroll() {
      cbRef.current({
        scrollTop: window.scrollY,
        clientHeight: window.innerHeight,
        scrollHeight: document.body.offsetHeight,
      });
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
