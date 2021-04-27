import cn from "classnames";
import * as React from "react";
import { ChildrenProp, StyleProps } from "../core";
import { useApplicationLayout } from "./applicationLayout";

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
