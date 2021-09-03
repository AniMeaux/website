import cn from "classnames";
import { useApplicationLayout } from "core/layouts/applicationLayout";
import { ChildrenProp, StyleProps } from "core/types";
import * as React from "react";

export type MainProps = ChildrenProp & StyleProps;
export function Main({ className, ...rest }: MainProps) {
  const { hasNavigation } = useApplicationLayout();

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
