import * as React from "react";
import { watchResize } from "react-behave";

export function usePageScroll() {
  const [isAtTheTop, setIsAtTheTop] = React.useState(true);
  const [isAtTheBottom, setIsAtTheBottom] = React.useState(true);

  React.useEffect(() => {
    function handleScroll() {
      setIsAtTheTop(window.scrollY <= 0);
      setIsAtTheBottom(
        window.scrollY + window.innerHeight >= document.body.offsetHeight
      );
    }

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    const stopWatching = watchResize(document.body, handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      stopWatching();
    };
  }, []);

  return { isAtTheTop, isAtTheBottom };
}
