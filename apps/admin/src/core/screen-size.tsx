import type { ScreenSize } from "#i/generated/theme";
import { theme } from "#i/generated/theme";
import { useEffect, useState } from "react";

export const ScreenSizeValue = Object.fromEntries(
  Object.entries(theme.screens).map(([key, value]) => [
    key,
    Number(value.replace("px", "")),
  ]),
) as Record<ScreenSize, number>;

export function useScreenSizeCondition(
  conditionFunction: (screenSize: number) => boolean,
) {
  const [result, setResult] = useState(() =>
    conditionFunction(getScreenSize()),
  );

  useEffect(() => {
    function onResize() {
      setResult(conditionFunction(getScreenSize()));
    }

    onResize();

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  });

  return result;
}

function getScreenSize() {
  if (typeof document === "undefined") {
    return 0;
  }

  return window.innerWidth;
}
