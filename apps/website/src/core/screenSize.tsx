import invariant from "invariant";
import * as React from "react";
import { ChildrenProp } from "~/core/types";

export enum ScreenSize {
  UNKNOWN = -1,
  SMALL = 0,
  MEDIUM = 1,
  LARGE = 2,
}

type ScreenSizeContextValue = {
  screenSize: ScreenSize;
};

const ScreenSizeContext = React.createContext<ScreenSizeContextValue | null>(
  null
);

function getScreenSize() {
  if (typeof window === "undefined") {
    return ScreenSize.UNKNOWN;
  }

  if (window.innerWidth >= 1024) {
    return ScreenSize.LARGE;
  }

  if (window.innerWidth >= 800) {
    return ScreenSize.MEDIUM;
  }

  return ScreenSize.SMALL;
}

export function ScreenSizeContextProvider({ children }: ChildrenProp) {
  const [screenSize, setScreenSize] = React.useState(ScreenSize.UNKNOWN);

  React.useEffect(() => {
    function onResize() {
      setScreenSize(getScreenSize());
    }

    onResize();

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  });

  const value = React.useMemo<ScreenSizeContextValue>(() => ({ screenSize }), [
    screenSize,
  ]);

  return (
    <ScreenSizeContext.Provider value={value}>
      {children}
    </ScreenSizeContext.Provider>
  );
}

export function useScreenSize() {
  const context = React.useContext(ScreenSizeContext);

  invariant(
    context != null,
    "useScreenSize should not be used outside of a ScreenSizeContextProvider."
  );

  return context;
}
