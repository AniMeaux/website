import cn from "classnames";
import * as React from "react";
import { useApplicationLayout } from "./applicationLayout";

export function Main({
  className,
  ...rest
}: React.HTMLAttributes<HTMLElement>) {
  const {
    hasBottomNavigation,
    hasLeftNavigation,
    isNavigationCollapsed,
  } = useApplicationLayout();

  return (
    <main
      {...rest}
      className={cn(
        "pt-4 main-pb",
        {
          "main-pb-with-navigation": hasBottomNavigation,
          "main-pb main-pb px-1/12": hasLeftNavigation,
          "ml-18": hasLeftNavigation && isNavigationCollapsed,
          "ml-64 ": hasLeftNavigation && !isNavigationCollapsed,
        },
        className
      )}
    />
  );
}
