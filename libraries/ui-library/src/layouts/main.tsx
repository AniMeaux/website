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
        "md:px-1/12 pt-4 main-pb",
        {
          "main-pb-with-navigation": hasBottomNavigation,
          "ml-18": hasLeftNavigation && isNavigationCollapsed,
          "ml-64 ": hasLeftNavigation && !isNavigationCollapsed,
        },
        className
      )}
    />
  );
}
