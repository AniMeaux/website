import { ChildrenProp } from "core/types";
import invariant from "invariant";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

/**
 * The enum values are the screen widths in px of the range start of each size.
 * We use numbers to support comparators: `ScreenSize.S < ScreenSize.L`
 */
export enum ScreenSize {
  UNKNOWN = -1,
  SMALL = 0,
  MEDIUM = 500,
  LARGE = 800,
}

type ScreenSizeContextValue = {
  screenSize: ScreenSize;
};

const ScreenSizeContext = createContext<ScreenSizeContextValue | null>(null);

function getScreenSize() {
  if (typeof window === "undefined") {
    return ScreenSize.UNKNOWN;
  }

  if (window.innerWidth >= ScreenSize.LARGE) {
    return ScreenSize.LARGE;
  }

  if (window.innerWidth >= ScreenSize.MEDIUM) {
    return ScreenSize.MEDIUM;
  }

  return ScreenSize.SMALL;
}

export function ScreenSizeContextProvider({ children }: ChildrenProp) {
  const [screenSize, setScreenSize] = useState(ScreenSize.UNKNOWN);

  useEffect(() => {
    function onResize() {
      setScreenSize(getScreenSize());
    }

    onResize();

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  });

  const value = useMemo<ScreenSizeContextValue>(
    () => ({ screenSize }),
    [screenSize]
  );

  return (
    <ScreenSizeContext.Provider value={value}>
      {children}
    </ScreenSizeContext.Provider>
  );
}

export function useScreenSize() {
  const context = useContext(ScreenSizeContext);

  invariant(
    context != null,
    "useScreenSize should not be used outside of a ScreenSizeContextProvider."
  );

  return context;
}
