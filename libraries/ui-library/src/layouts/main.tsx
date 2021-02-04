import cn from "classnames";
import * as React from "react";

type MainProps = React.HTMLAttributes<HTMLElement> & {
  hasNavigation?: boolean;
};

export function Main({ hasNavigation = false, className, ...rest }: MainProps) {
  return (
    <main
      {...rest}
      className={cn(
        "pt-12 safe-area-px main-pb",
        { "main-pb-with-navigation": hasNavigation },
        className
      )}
    />
  );
}
