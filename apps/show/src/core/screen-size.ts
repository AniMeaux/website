import { useEffect, useState } from "react";

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
