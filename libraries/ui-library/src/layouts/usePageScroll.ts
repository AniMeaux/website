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
