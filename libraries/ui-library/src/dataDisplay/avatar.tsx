import cn from "classnames";
import * as React from "react";
import { ChildrenProp, StyleProps } from "../core";

export type AvatarProps = ChildrenProp & StyleProps;
export function Avatar({ className, ...rest }: AvatarProps) {
  return <span {...rest} className={cn("Avatar", className)} />;
}
