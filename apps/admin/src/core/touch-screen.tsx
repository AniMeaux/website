import { useEffect, useState } from "react";
import invariant from "tiny-invariant";

export function useIsTouchScreen() {
  // https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover
  const mediaQuery =
    typeof document === "undefined" ? null : window.matchMedia("(hover: none)");

  const [isTouchScreen, setIsTouchScreen] = useState(
    mediaQuery?.matches ?? true,
  );

  useEffect(() => {
    if (mediaQuery != null) {
      function handleChange() {
        invariant(mediaQuery != null, "mediaQuery should exits");
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
    }

    return undefined;
  });

  return { isTouchScreen };
}
