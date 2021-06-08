import cn from "classnames";
import { ChildrenProp, StyleProps } from "core/types";
import { useApplicationLayout } from "layouts/applicationLayout";
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
