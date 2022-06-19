import { useEffect, useState } from "react";

export function useIsTouchScreen() {
  // https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover
  const mediaQuery = window.matchMedia("(hover: none)");
  const [isTouchScreen, setIsTouchScreen] = useState(mediaQuery.matches);

  useEffect(() => {
    function handleChange() {
      setIsTouchScreen(mediaQuery.matches);
    }

    // Safari before version 14 don't have `addEventListener`.
    // See https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList#browser_compatibility
    if (typeof mediaQuery.addEventListener === "undefined") {
      mediaQuery.addListener(handleChange);
      return () => {
        mediaQuery.removeListener(handleChange);
      };
    }

    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  });

  return { isTouchScreen };
}
