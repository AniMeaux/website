import invariant from "invariant";
import * as React from "react";

export enum ScreenSize {
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE",
}

type ScreenSizeContextValue = {
  screenSize: ScreenSize;
};

const ScreenSizeContext = React.createContext<ScreenSizeContextValue>(null!);

function getScreenSize() {
  if (typeof window === "undefined") {
    return ScreenSize.SMALL;
  }

  if (window.innerWidth >= 1024) {
    return ScreenSize.LARGE;
  }

  if (window.innerWidth >= 800) {
    return ScreenSize.MEDIUM;
  }

  return ScreenSize.SMALL;
}

export function ScreenSizeContextProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [screenSize, setScreenSize] = React.useState(getScreenSize);

  React.useEffect(() => {
    function onResize() {
      setScreenSize(getScreenSize());
    }

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  });

  const value = React.useMemo<ScreenSizeContextValue>(() => ({ screenSize }), [
    screenSize,
  ]);

  return <ScreenSizeContext.Provider value={value} children={children} />;
}

export function useScreenSize() {
  const context = React.useContext(ScreenSizeContext);

  invariant(
    context != null,
    "useScreenSize should not be used outside of a ScreenSizeContextProvider."
  );

  return context;
}
