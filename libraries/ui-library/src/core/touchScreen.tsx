import * as React from "react";

export function useIsTouchScreen() {
  // https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover
  const mediaQuery = window.matchMedia("(hover: none)");
  const [isTouchScreen, setIsTouchScreen] = React.useState(mediaQuery.matches);

  React.useEffect(() => {
    function handleChange() {
      setIsTouchScreen(mediaQuery.matches);
    }

    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  });

  return { isTouchScreen };
}
