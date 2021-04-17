import cn from "classnames";
import * as React from "react";
import { ChildrenProp, StyleProps } from "../core";

export function ApplicationLayout({
  className,
  ...rest
}: ChildrenProp & StyleProps) {
  return <div {...rest} className={cn("ApplicationLayout", className)} />;
}
