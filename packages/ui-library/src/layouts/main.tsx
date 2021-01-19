import cn from "classnames";
import * as React from "react";

export type MainProps = React.HTMLAttributes<HTMLElement> & {
  hasNavigation?: boolean;
};

export function Main({ hasNavigation = false, className, ...rest }: MainProps) {
  return (
    <main
      {...rest}
      className={cn(
        "pt-4 main-pb",
        { "main-pb-with-navigation": hasNavigation },
        className
      )}
    />
  );
}
