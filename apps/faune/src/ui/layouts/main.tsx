import cn from "classnames";
import { ChildrenProp, StyleProps } from "core/types";
import * as React from "react";
import { useApplicationLayout } from "ui/layouts/applicationLayout";

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
