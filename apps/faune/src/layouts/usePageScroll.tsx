import { useRouter } from "core/router";
import * as React from "react";
import { watchResize } from "react-behave";

const PageScrollContext = React.createContext<React.MutableRefObject<HTMLElement> | null>(
  null
);

export function PageScrollProvider({
  containerRef,
  children,
}: React.PropsWithChildren<{
  containerRef: React.MutableRefObject<HTMLElement>;
}>) {
  return (
    <PageScrollContext.Provider value={containerRef} children={children} />
  );
}

export function usePageScrollContainer() {
  return React.useContext(PageScrollContext);
}

function getScrollState(
  scrollContainerRef?: React.MutableRefObject<HTMLElement> | null
) {
  const scrollContainer = scrollContainerRef?.current;

  return {
    scrollTop: scrollContainer?.scrollTop ?? window.scrollY,
    clientHeight: scrollContainer?.clientHeight ?? window.innerHeight,
    scrollHeight: scrollContainer?.scrollHeight ?? document.body.offsetHeight,
  };
}

const pageScrollScrollY: Record<string, number> = {};

export function usePageScrollRestoration({
  disabled = false,
}: { disabled?: boolean } = {}) {
  const { pathname } = useRouter();

  // Both effects must be layout effects to make sure to register/unregister as
  // soon as possible to avoid glitchs.

  React.useLayoutEffect(() => {
    if (!disabled) {
      const scrollY = pageScrollScrollY[pathname];
      if (scrollY != null) {
        window.scrollTo(0, scrollY);
      }
    }
  }, [disabled, pathname]);

  React.useLayoutEffect(() => {
    function handleScroll() {
      pageScrollScrollY[pathname] = window.scrollY;
    }

    window.addEventListener("scroll", handleScroll);
    const stopWatching = watchResize(document.body, handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      stopWatching();
    };
  }, [pathname]);
}

function usePageScroll(cb: () => void) {
  const scrollContainerRef = usePageScrollContainer();
  const cbRef = React.useRef(cb);

  React.useEffect(() => {
    cbRef.current = cb;
  });

  React.useEffect(() => {
    function handleScroll() {
      cbRef.current();
    }

    handleScroll();

    const scrollEventTarget = scrollContainerRef?.current ?? window;
    const resizeEventTarget = scrollContainerRef?.current ?? document.body;

    scrollEventTarget.addEventListener("scroll", handleScroll);
    const stopWatching = watchResize(resizeEventTarget, handleScroll);

    return () => {
      scrollEventTarget.removeEventListener("scroll", handleScroll);
      stopWatching();
    };
  }, [scrollContainerRef]);
}

export function useIsScrollAtTheBottom() {
  const scrollContainerRef = usePageScrollContainer();
  const [isAtTheBottom, setIsAtTheBottom] = React.useState(true);

  usePageScroll(() => {
    const { scrollTop, clientHeight, scrollHeight } = getScrollState(
      scrollContainerRef
    );

    setIsAtTheBottom(scrollTop + clientHeight >= scrollHeight);
  });

  return { isAtTheBottom };
}

export function useIsScrollAtTheTop() {
  const scrollContainerRef = usePageScrollContainer();
  const [isAtTheTop, setIsAtTheTop] = React.useState(true);

  usePageScroll(() => {
    const { scrollTop } = getScrollState(scrollContainerRef);
    setIsAtTheTop(scrollTop <= 0);
  });

  return { isAtTheTop };
}

// If this zone, at the bottom of the page, is visible, then we should fetch
// more.
const FETCH_ZONE_HEIGHT = 150;

export function useIsScrollAtFetchMore(cb: () => void) {
  const scrollContainerRef = usePageScrollContainer();
  const wasAtFetchMore = React.useRef(false);

  usePageScroll(() => {
    const { scrollTop, clientHeight, scrollHeight } = getScrollState(
      scrollContainerRef
    );

    const isAtFetchMore =
      // We suppose there is always scroll with pagination.
      scrollTop > 0 &&
      scrollTop + clientHeight + FETCH_ZONE_HEIGHT >= scrollHeight;

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
