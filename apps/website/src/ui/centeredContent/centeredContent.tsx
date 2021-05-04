import cn from "classnames";
import * as React from "react";
import { StyleProps } from "../../core/types";

type CenteredContentProps = StyleProps & {
  children: React.ReactElement;
};

export function CenteredContent({ children, className }: CenteredContentProps) {
  return React.cloneElement(children, {
    className: cn("CenteredContent", className, children.props.className),
  });
}
