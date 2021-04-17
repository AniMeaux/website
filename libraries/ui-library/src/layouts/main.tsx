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
        "Main",
        { "Main--withNavigation": hasNavigation },
        className
      )}
    />
  );
}
